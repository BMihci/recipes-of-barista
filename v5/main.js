        /* =====================================================
           EKRANLAR / MODALLAR
           ===================================================== */
        const $ = id => document.getElementById(id);
        const ALL_SCREENS = ['screen-menu', 'screen-story', 'screen-map', 'screen-game'];
        const ALL_MODALS = ['modal-bonus-intro', 'modal-info', 'modal-name', 'modal-chapter-intro', 'modal-shop', 'modal-slots', 'modal-confirm', 'modal-drink', 'modal-bust', 'modal-bigwin', 'modal-fsdone', 'modal-hub', 'modal-cheat', 'modal-news', 'modal-store', 'modal-diff', 'modal-profile', 'modal-settings', 'modal-backup'];

        function switchScreen(screenId) {
            playSynthNote(650, 0.05);
            ALL_SCREENS.forEach(id => { const el = $(id); if (el) el.classList.remove('active'); });
            const target = $(screenId);
            if (target) target.classList.add('active');

            const isGame = screenId === 'screen-game';
            document.body.dataset.screen = screenId;
            // bellek: harita (~3000 SVG düğümü) her açılışta yeniden çizilir; ayrılınca boşalt
            if (screenId !== 'screen-map') { const mh = $('map-holder'); if (mh && mh.firstChild) mh.innerHTML = ''; }
            document.body.dataset.mode = isGame ? 'game' : 'menu';
            $('bg-menu').classList.toggle('on', !isGame);
            $('bg-game').classList.toggle('on', isGame);

            if (isGame) {
                startCasinoMusic();
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    const go = () => initThreeJS();
                    if (assetsReady) go(); else preloadPromise.then(go);
                }));
            } else {
                stopCasinoMusic(); stopBonusMusic();
                stopRender();
                $('dialog-toast').classList.remove('show');
                hideTutorial();
            }
            if (!isGame) $('fx-layer').innerHTML = '';
            const stage = $('stage');
            if (stage) stage.scrollTop = 0;
        }

        /* gerçek görünür yükseklik (iOS Safari adres çubuğu / klavye) → pencereler buna göre sığar */
        function setAppH() { const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight; document.documentElement.style.setProperty('--app-h', Math.round(h) + 'px'); }
        setAppH();
        window.addEventListener('resize', setAppH); window.addEventListener('orientationchange', () => setTimeout(setAppH, 250));
        if (window.visualViewport) window.visualViewport.addEventListener('resize', setAppH);
        /* ✕ düğmesi olan pencereler arka plana dokununca da kapanır */
        const BACKDROP_CLOSE = { 'modal-store': () => closeModal('modal-store'), 'modal-info': () => closeInfoModal(), 'modal-hub': () => closeHub(), 'modal-shop': () => closeShop() };
        document.addEventListener('click', e => { const m = e.target; if (m && m.classList && m.classList.contains('modal') && m.classList.contains('open') && BACKDROP_CLOSE[m.id]) BACKDROP_CLOSE[m.id](); });
        /* body.modal-open: eski iOS Safari ':has()' desteklemediği için pencere açıkken ses düğmesi vb. buna göre gizlenir */
        function syncModalClass() { document.body.classList.toggle('modal-open', !!document.querySelector('.modal.open')); }
        /* Pencere yığını: en son açılan pencere her zaman en üstte (ör. Mağaza'nın üstündeki satın alma onayı) */
        let modalZ = 60;
        function openModal(id) { setAppH(); const m = $(id); m.style.zIndex = String(++modalZ); m.classList.add('open'); const p = m.querySelector('.panel'); if (p) p.scrollTop = 0; m.scrollTop = 0; syncModalClass(); }
        function closeModal(id) { const m = $(id); m.classList.remove('open'); m.style.zIndex = ''; if (!document.querySelector('.modal.open')) modalZ = 60; syncModalClass(); }
        function anyModalOpen() { return !!document.querySelector('.modal.open'); }
        function whenNoModal(fn) {
            const go = () => { if (anyModalOpen()) { setTimeout(go, 350); return; } fn(); };
            go();
        }

        function confirmBox(opts) {
            $('cf-title').textContent = opts.title;
            $('cf-text').innerHTML = opts.text;
            $('cf-title').className = opts.good ? 'good-title' : 'bad-title';
            const art = $('cf-art'); art.innerHTML = '';
            (opts.art || []).forEach(k => { const im = document.createElement('img'); im.src = ASSETS.sym[k]; im.alt = ''; art.appendChild(im); });
            const ok = $('cf-ok');
            ok.textContent = opts.ok;
            ok.onclick = () => { closeModal('modal-confirm'); opts.onOk(); };
            $('cf-cancel').textContent = UX('cancel');
            playSynthNote(420, 0.08, 'triangle', 0.05);
            openModal('modal-confirm');
        }

        /* =====================================================
           ANA MENÜ · KAYITLAR · DİL
           ===================================================== */
        function slotSummary(sv) {
            return diffLabel(sv) + ' · ' + tf(L().slots.info, { stage: stageLabel(sv.stage), bal: fmt(sv.balance) });
        }
        function stageLabel(n) { return `${n >= 6 ? ST().chWord : L().stageWord} ${n} · ${stageName(n)}`; }

        function renderMenu() {
            applyStaticI18n();
            const last = Settings.last !== null && SLOTS[Settings.last] ? Settings.last : SLOTS.findIndex(s => s);
            const btn = $('menu-continue');
            if (last !== null && last >= 0 && SLOTS[last]) {
                const sv = SLOTS[last];
                btn.classList.remove('hidden');
                btn.onclick = () => continueSlot(last);
                $('menu-cont-info').textContent = tf(L().menu.contInfo, { name: slotLabel(last), stage: stageName(sv.stage), bal: fmt(sv.balance) });
                $('menu-cont-info').classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
                $('menu-cont-info').classList.add('hidden');
            }
            $('menu-saves').classList.toggle('hidden', !SLOTS.some(s => s));
            renderProfileChip();
        }

        function toggleLang() { setLang(_lang === 'tr' ? 'en' : 'tr'); }

        let slotMode = 'load';
        function openSlots(mode) {
            slotMode = mode;
            playSynthNote(500, 0.05);
            $('slots-title').textContent = mode === 'new' ? L().slots.newTitle : L().slots.title;
            const list = $('slot-list');
            list.innerHTML = '';
            SLOTS.forEach((sv, i) => {
                const card = document.createElement('div');
                card.className = 'slot-card' + (sv ? '' : ' empty');
                const icon = sv ? (sv.finished ? `<img src="${ASSETS.sym.goldenbean}" alt="">` : sv.stage <= 5 ? `<img src="${ASSETS.sym[['espresso', 'matcha', 'cupcake', 'coffeebag', 'book'][sv.stage - 1]]}" alt="">` : eraIcon(eraKey(sv.stage), 30)) : '➕';
                const date = sv ? new Date(sv.updated).toLocaleDateString(LOC()) : '';
                card.innerHTML = `<div class="si">${icon}</div><div class="sb"><b>${sv ? slotLabel(i) : L().slots.empty}</b><small>${sv ? (sv.finished ? L().slots.fin + ' · ' : '') + slotSummary(sv) + ' · ' + date : ''}</small></div>`;
                const acts = document.createElement('div');
                acts.className = 'sa';
                if (mode === 'new') {
                    const b = document.createElement('button');
                    b.className = 'btn btn-sm';
                    b.textContent = L().slots.start;
                    b.onclick = () => {
                        if (sv) confirmBox({ title: L().slots.overwriteT, text: tf(L().slots.overwrite, { name: slotLabel(i) }), art: ['book'], ok: L().slots.yesNew, onOk: () => askName(i) });
                        else askName(i);
                    };
                    acts.appendChild(b);
                } else if (sv) {
                    const b = document.createElement('button');
                    b.className = 'btn btn-sm';
                    b.textContent = L().slots.load;
                    b.onclick = () => { closeModal('modal-slots'); continueSlot(i); };
                    const d = document.createElement('button');
                    d.className = 'btn btn-sm btn-soft';
                    d.textContent = L().slots.del;
                    d.onclick = () => confirmBox({ title: L().slots.delT, text: tf(L().slots.delTxt, { name: slotLabel(i) }), art: ['cozybear'], ok: L().slots.yesDel, onOk: () => { SLOTS[i] = null; writeSlots(); if (Settings.last === i) { Settings.last = null; saveSettings(); } openSlots(slotMode); renderMenu(); } });
                    acts.append(b, d);
                }
                card.appendChild(acts);
                list.appendChild(card);
            });
            $('slots-close').textContent = L().slots.close;
            openModal('modal-slots');
        }
        function newGame() {
            const free = SLOTS.findIndex(s => !s);
            if (free >= 0 && !SLOTS.some(s => s)) askName(free);
            else openSlots('new');
        }
        function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

        let pendingSlot = 0;
        function slotLabel(i) { return tf(L().slots.slotN, { n: i + 1 }); }
        function guestName() { return (CUR_LANG() === 'en' ? 'Barista' : 'Barista') + String(Math.floor(1000 + Math.random() * 9000)); }
        /* Oyuncu adı profilde tutulur: yalnızca ilk kez (profil adı yoksa) sorulur */
        function askName(slot) {
            pendingSlot = slot;
            closeModal('modal-slots');
            playSynthNote(500, 0.05);
            if (Profile.nick) { beginNewSave(Profile.nick); return; }
            $('player-name-input').value = guestName();
            openModal('modal-name');
            setTimeout(() => { try { $('player-name-input').select(); } catch (e) {} }, 50);
        }
        function closeNameModal() { closeModal('modal-name'); }
        function startGameWithPlayer() {
            const name = ($('player-name-input').value.trim() || guestName()).slice(0, 16);
            closeNameModal();
            Profile.nick = name; saveProfile();
            renderProfileChip();
            beginNewSave(name);
        }
        /* v6: zorluk seçimi kaldırıldı — her kayıt Hikâye matematiğiyle oynanır */
        const DIFF_ICON = { story: '📖', std: '📖', gambler: '📖' };
        let pendingName = '';
        function openDiff(name) {
            pendingName = name;
            const D = L().diff;
            $('df-title').textContent = D.title;
            $('df-sub').textContent = D.sub;
            const list = $('df-list'); list.innerHTML = '';
            ['story', 'std', 'gambler'].forEach(k => {
                const b = document.createElement('button');
                b.className = 'df-card df-' + k + (k === 'std' ? ' rec' : '');
                b.innerHTML = `<span class="di">${DIFF_ICON[k]}</span><span class="db"><b>${D[k][0]}</b><small>${D[k][1]}</small><em>${D[k][2]}</em></span>`;
                b.onclick = () => { playSynthNote(k === 'gambler' ? 330 : 660, 0.12, 'triangle', 0.05); closeModal('modal-diff'); beginNewSave(pendingName, k); };
                list.appendChild(b);
            });
            $('df-note').textContent = D.note;
            $('df-cancel').textContent = L().name.cancel;
            openModal('modal-diff');
        }
        function diffLabel(sv) { const k = sv && eraKey(sv.stage); return k ? eraName(k) : '☕ ' + UX('coffeeTown'); }
        function beginNewSave(name) {
            Game.slot = pendingSlot;
            Game.save = newSave(name);
            loadIntoState(Game.save);
            persist();
            $('hud-player-name').textContent = nickOf();
            playStory(1);
        }
        function continueSlot(i) {
            const sv = SLOTS[i];
            if (!sv) return;
            Game.slot = i;
            Game.save = sv;
            sv.phases = sv.phases || {}; sv.seen = sv.seen || {}; sv.ups = sv.ups || {};
            migrateSaga(sv);
            if (sv.stage >= Engine.SAGA_FIRST && !(sv.ups.lx_reel6 > 0)) sv.ups.lx_reel6 = 1;   // v6.2: Saga'da 6. makara herkese
            loadIntoState(sv);
            Settings.last = i; saveSettings();
            $('hud-player-name').textContent = nickOf();
            openMap();
        }

        /* =====================================================
           KASABA HARİTASI
           ===================================================== */
        /* Saga haritası: 100 bölüm + (bitince) Usta Kafesi. Aşağıdan yukarı kıvrılan yol; dönemler renkli bantlar.
           Hafif tutulur: düğümlerde resim yok (emoji/rakam), yalnızca oyuncu jetonu resimli. */
        const MAP_W = 1000, MAP_STEP = 150, MAP_PAD = 210;
        const TOWN_META = { ic: 'town', col: '#F2B84B', col2: '#C0782A', ground: '#CDEBB4' };
        const MAP_GAP = 130;   // dönem geçişlerinde başlık için boşluk
        const MAP_H = MAP_PAD * 2 + 100 * MAP_STEP + 10 * MAP_GAP;
        function mapBand(n) { if (n <= 5) return 0; if (n > 100) return 10; return Engine.eraIndex(n) + 1; }
        function mapNodeXY(n) {   // n: 1..101
            return { x: MAP_W / 2 + Math.sin(n * 0.85) * 250 + Math.sin(n * 0.31) * 40, y: MAP_H - MAP_PAD - (n - 1) * MAP_STEP - mapBand(n) * MAP_GAP };
        }
        function mapSVG() {
            const sv = Game.save, cur = sv.stage, fin = sv.finished, H = MAP_H;
            const bandY = n => mapNodeXY(n).y + MAP_STEP / 2 + (n > 1 && mapBand(n) !== mapBand(n - 1) ? MAP_GAP : 0);   // n bölümünün alt sınırı (dönem başında başlık boşluğu dahil)
            let h = `<svg viewBox="0 0 ${MAP_W} ${H}" class="map-svg saga" role="img" aria-label="${L().map.title}">
              <defs><filter id="mp-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#3a2410" flood-opacity=".35"/></filter>
              ${artSymbols(Object.keys(ERA_DECO_ART).concat(...Object.values(ERA_DECO_ART)).filter((v, i, a) => a.indexOf(v) === i))}</defs>`;
            // bantlar: kasaba (1–5) + dönemler
            const bands = [{ from: 1, to: 5, M: TOWN_META, name: UX('coffeeTown'), years: '' }]
                .concat(Engine.ERAS.map(e => ({ from: e.from, to: e.from + e.n - 1, M: ERA_META[e.key], key: e.key, name: eraName(e.key), years: ERA_META[e.key].years[CUR_LANG()] })));
            bands.forEach((B, bi) => {
                const y0 = B.to === 100 ? 0 : bandY(B.to + 1), y1 = B.from === 1 ? H : bandY(B.from), ground = B.M.ground || '#E9D4AE';
                h += `<rect x="0" y="${y0}" width="${MAP_W}" height="${y1 - y0}" fill="${ground}"/>
                      <rect x="0" y="${y0}" width="${MAP_W}" height="${y1 - y0}" fill="${B.M.col}" opacity=".18"/>`;
                // süs emojileri
                const deco = ERA_DECO_ART[B.key || 'town'], rr = seeded(hashStr('deco' + bi));
                const count = Math.round((y1 - y0) / 90);
                for (let i = 0; i < count; i++) {
                    const y = y0 + 70 + rr() * (y1 - y0 - 160), side = i % 2 ? 1 : -1, x = MAP_W / 2 + side * (410 + rr() * 50);
                    const sz = 62 + rr() * 30;
                    h += `<use href="#art-${deco[i % deco.length]}" x="${(x - sz / 2).toFixed(0)}" y="${(y - sz / 2).toFixed(0)}" width="${sz.toFixed(0)}" height="${sz.toFixed(0)}" opacity=".85"/>`;
                }
                // dönem başlığı
                const ty = y1 - MAP_GAP / 2 - 6;
                h += `<g transform="translate(${MAP_W / 2},${ty})"><rect x="-430" y="-40" width="860" height="72" rx="36" fill="${B.M.col}" stroke="${B.M.col2}" stroke-width="6"/>
                      <use href="#art-${B.key || 'town'}" x="-410" y="-34" width="60" height="60"/>
                      <text y="10" text-anchor="middle" font-size="36" font-weight="800" fill="#2A1A0C" font-family="Baloo 2, Nunito, sans-serif">${escapeHtml(B.name)}${B.years ? ' · ' + B.years : ''}</text></g>`;
            });
            // yol
            let d = '';
            for (let n = 1; n <= (fin ? 101 : 100); n++) { const p = mapNodeXY(n); d += (n === 1 ? 'M' : 'L') + p.x.toFixed(0) + ' ' + p.y.toFixed(0) + ' '; }
            h += `<path d="${d}" fill="none" stroke="#7A4B2A" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>
                  <path d="${d}" fill="none" stroke="#FFF6EA" stroke-width="6" stroke-dasharray="14 16" stroke-linecap="round"/>`;
            // düğümler
            for (let n = 1; n <= 101; n++) {
                if (n === 101 && !fin) break;
                const p = mapNodeXY(n), usta = n === 101;
                const done = !usta && (n < cur || (n === 100 && fin)), here = usta ? fin : (n === cur && !fin), locked = !usta && n > cur;
                const k = !usta && eraKey(n), M = usta ? { col: '#F2C25A', col2: '#8A5A10' } : k ? ERA_META[k] : TOWN_META;
                const artIc = !usta && k && Engine.eraOf(n).from === n ? k : null;
                const icon = usta ? '∞' : n;
                const r = here ? 64 : (k && Engine.eraOf(n).from === n) || n <= 5 || usta ? 56 : 46;
                h += `<g class="map-node ${done ? 'done' : ''} ${here ? 'here' : ''} ${locked ? 'locked' : ''}" data-stage="${n}" tabindex="0" filter="url(#mp-sh)">`;
                if (here) h += `<circle cx="${p.x}" cy="${p.y}" r="${r + 14}" class="map-glow" fill="none" stroke="#FFD27A" stroke-width="9"/>`;
                h += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${locked ? '#D8CBB8' : M.col}" stroke="#FFF6EA" stroke-width="6"/>
                      <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="none" stroke="${locked ? '#9C8B74' : M.col2}" stroke-width="3"/>
                      ${artIc ? `<use href="#art-${artIc}" x="${p.x - r * 0.72}" y="${p.y - r * 0.72}" width="${r * 1.44}" height="${r * 1.44}" ${locked ? 'opacity=".55"' : ''}/>`
                        : `<text x="${p.x}" y="${p.y + 15}" text-anchor="middle" font-size="${usta ? 52 : 42}" font-weight="800" fill="${locked ? '#8A7A64' : '#2A1A0C'}" font-family="Baloo 2, Nunito, sans-serif" ${locked ? 'opacity=".7"' : ''}>${icon}</text>`}`;
                if (done) h += `<circle cx="${p.x + r * 0.75}" cy="${p.y - r * 0.75}" r="20" fill="#5E8C61" stroke="#fff" stroke-width="4"/><text x="${p.x + r * 0.75}" y="${p.y - r * 0.75 + 8}" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">✓</text>`;
                if (here || usta || n <= 5 || (k && Engine.eraOf(n).from === n)) {
                    const lbl = usta ? L().usta.place : stageName(n), side = p.x > MAP_W / 2 ? -1 : 1, lx = p.x + side * (r + 16);
                    const lw = 380;
                    h += `<g transform="translate(${lx},${p.y})"><rect x="${side > 0 ? 0 : -lw}" y="-28" width="${lw}" height="56" rx="28" fill="#FFF6EA" stroke="#C99A66" stroke-width="4"/>
                          <text x="${side > 0 ? lw / 2 : -lw / 2}" y="10" text-anchor="middle" font-size="30" font-weight="800" fill="#6B4226" font-family="Baloo 2, Nunito, sans-serif">${escapeHtml(((usta ? '' : n + ' · ') + lbl).slice(0, 22))}</text></g>`;
                }
                h += `</g>`;
            }
            // oyuncu jetonu
            const cn = mapNodeXY(fin ? 101 : cur);
            h += `<g class="map-token"><image href="${ASSETS.sym.barista}" x="${cn.x - 55}" y="${cn.y - 190}" width="110" height="110"/><polygon points="${cn.x - 14},${cn.y - 84} ${cn.x + 14},${cn.y - 84} ${cn.x},${cn.y - 68}" fill="#E63946"/></g>`;
            h += `</svg>`;
            return h;
        }
        function openMap() {
            if (!Game.save) { switchScreen('screen-menu'); renderMenu(); return; }
            if (gameState.isSpinning && document.body.dataset.mode === 'game') { setMessage(UX('waitReels')); return; }
            persist();
            applyStaticI18n();
            $('map-name').textContent = nickOf();
            checkDailyGift();
            $('map-bank').innerHTML = `${beanIc()} ${fmt(gameState.balance)}`;
            const holder = $('map-holder');
            holder.classList.add('saga');
            holder.innerHTML = mapSVG();
            holder.querySelectorAll('.map-node').forEach(g => {
                const st = +g.dataset.stage;
                const go = () => mapClick(st);
                g.addEventListener('click', go);
                g.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
            });
            const sv = Game.save, cur = sv.stage;
            $('map-info').innerHTML = sv.finished ? `<b>${L().usta.place}</b> · ${L().map.here}` : `<b>${stageLabel(cur)}</b>${eraKey(cur) ? ' · ' + eraIcon(eraKey(cur), 18) + ' ' + eraName(eraKey(cur)) : ''} · ${L().map.here}`;
            $('map-play').textContent = L().map.play;
            switchScreen('screen-map');
            // bulunduğun bölüme kaydır
            requestAnimationFrame(() => {
                const svg = holder.querySelector('svg'); if (!svg) return;
                const p = mapNodeXY(sv.finished ? 101 : cur), H = MAP_H, scale = svg.getBoundingClientRect().height / H;
                holder.scrollTop = Math.max(0, p.y * scale - holder.clientHeight * 0.6);
            });
            if (sv.pendingTM) {   // v5'te oyunu bitirmiş kayıt: zaman makinesi hikâyesini bir kez göster
                sv.pendingTM = false; persist();
                setTimeout(() => Comic.play('tm', () => Comic.play('era:' + Engine.ERAS[0].key, () => openMap())), 500);
                return;
            }
            maybeAutoDaily();
        }
        function mapClick(st) {
            const sv = Game.save;
            playSynthNote(600, 0.05);
            if (st === 101) {   // Usta Kafesi: 100. bölümden sonra sonsuz rekor modu
                if (sv.finished) { enterStage(100); return; }
                return;
            }
            if (st === sv.stage && !sv.finished) { enterStage(st); return; }
            if (st < sv.stage || (st === 100 && sv.finished)) {
                const replay = CHAPTERS[st].saga ? `replayChapterStory(${st})` : `playStory(${st})`;
                $('map-info').innerHTML = `<b>${stageLabel(st)}</b> · ${L().map.done} <button class="btn btn-sm btn-soft" onclick="${replay}">${L().map.story}</button>`;
                return;
            }
            const prev = CHAPTERS[st - 1];
            $('map-info').innerHTML = `<b>${stageLabel(st)}</b> · ${L().map.locked} — ${tf(L().map.needs, { at: fmt(prev.unlockAt) })}`;
        }

        /* =====================================================
           AŞAMAYA GİRİŞ
           ===================================================== */
        function enterStage(n) {
            const sv = Game.save;
            if (!sv) return;
            n = sv.stage;
            const c = CHAPTERS[n];
            gameState.chapter = n;
            gameState.phasesShown = {};
            if (!sv.seen['stage' + n]) {
                // yeni aşama: sadakat/fırın sıfırlanır
                gameState.loy = newLoyalty();
                gameState.oven = 0;
                gameState.mwar = 0;
            }
            refreshEff();
            if (!gameState.bet || gameState.bet < c.minBet || gameState.bet > c.maxBet) gameState.bet = recommendedBet(n, gameState.balance);
            clampBet();
            document.body.dataset.chapter = n;
            document.body.dataset.era = eraKey(n) || '';
            setTimeout(() => applyEraBackdrop(n), 30);   // bölüme özel 3D dönem arka planı
            renderOrder();
            gameState.autoSpinActive = false;
            gameState.isSpinning = false;
            gameState.reelsPending = false;
            gameState.bonusLock = false;
            gameState.goalAnnounced = false;
            gameState.rainMode = gameState.rainRemaining > 0;
            $('bonus-banner').classList.toggle('show', gameState.freeSpinsRemaining > 0 || gameState.rainRemaining > 0);
            updateBanner();
            updateFsBadge();
            buildGoalTicks();
            updateLoyaltyUI();
            updateOvenUI();
            updateMatchaUI();
            updateTurboUI();
            Dede.mount();
            setMessage(L().msg.welcome);
            updateAutoSpinButtonUI();
            updateHUD();
            applyStaticI18n();
            switchScreen('screen-game');
            if (!sv.seen['stage' + n]) {
                sv.seen['stage' + n] = true;
                persist();
                showChapterIntro(n);
            } else if (n === 1 && !sv.tut) {
                setTimeout(showTutorial, 600);
            }
            // kayıttan devam: yarım kalan free spin / pasta yağmuru
            if (gameState.rainPending || freeActive()) {
                if (gameState.expandingSymbolId && gameState.freeSpinsRemaining > 0) startBonusMusic();
                setTimeout(() => whenNoModal(() => {
                    if (document.body.dataset.mode !== 'game') return;
                    if (gameState.rainPending && !freeActive()) startCakeRain(); else scheduleNextSpin();
                }), 1600);
            }
        }

        function showChapterIntro(n) {
            const art = $('ci-art');
            art.innerHTML = '';
            if (CHAPTERS[n].saga) { showSagaIntro(n); return; }
            const arts = { 1: ['barista', 'cozybear'], 2: ['matcha', 'pitcher'], 3: ['bakingbear', 'cupcake'], 4: ['coffeebag', 'cozybear'], 5: ['barista', 'stamp', 'cozybear'] }[n];
            arts.forEach(k => { const im = document.createElement('img'); im.src = ASSETS.sym[k]; im.alt = ''; art.appendChild(im); });
            const c = CHAPTERS[n];
            $('ci-title').textContent = `${L().stageWord} ${n}: ${stageName(n).toLocaleUpperCase(LOC())}`;
            $('ci-text').innerHTML = tf(L().intro[n], { bal: fmt(gameState.balance), at: fmt(c.unlockAt), price: fmt(c.price), full: RUN_EFF.ovenFull, spins: RUN_EFF.ovenSpins });
            $('ci-ok').textContent = L().intro.btn;
            openModal('modal-chapter-intro');
        }
        function closeChapterIntro() {
            closeModal('modal-chapter-intro');
            const n = gameState.chapter;
            if (n === 1 && Game.save && !Game.save.tut) setTimeout(showTutorial, 350);
            const ns = L().newStage[n] || (CHAPTERS[n].saga && sagaLine(n));
            if (ns) setTimeout(() => showDialog(ns[0], ns[1], ns[2]), 600);
        }

        /* ---------- İLK SEVİYE REHBERİ ---------- */
        function showTutorial() {
            if (document.body.dataset.mode !== 'game' || anyModalOpen()) return;
            const t = $('tutorial');
            $('tut-spin').innerHTML = L().tut.spin;
            $('tut-book').innerHTML = L().tut.book;
            $('tut-ok').textContent = L().tut.ok;
            t.classList.add('show');
            positionTutorial();
        }
        function positionTutorial() {
            const t = $('tutorial');
            if (!t.classList.contains('show')) return;
            const sr = $('spin-btn').getBoundingClientRect(), ir = $('info-btn').getBoundingClientRect();
            const bs = $('tut-spin'), bb = $('tut-book');
            const W = window.innerWidth;
            const sw = bs.offsetWidth, sh = bs.offsetHeight, bw = bb.offsetWidth, bh = bb.offsetHeight;
            // SPİN balonu: düğmenin hemen üstünde
            let sx = Math.max(8, Math.min(W - sw - 8, sr.left + sr.width / 2 - sw / 2));
            let sy = Math.max(8, sr.top - sh - 16);
            // KİTAP balonu: SPİN balonunun da üstünde (çakışmasın)
            let bx = Math.max(8, Math.min(W - bw - 8, ir.left + ir.width / 2 - bw / 2));
            let by = Math.max(8, sy - bh - 14);
            bs.style.left = sx + 'px'; bs.style.top = sy + 'px';
            bs.style.setProperty('--ax', (sr.left + sr.width / 2 - sx) + 'px');
            bb.style.left = bx + 'px'; bb.style.top = by + 'px';
            bb.style.setProperty('--ax', Math.max(14, Math.min(bw - 14, ir.left + ir.width / 2 - bx)) + 'px');
            $('tut-ring-spin').style.cssText = `left:${sr.left - 8}px;top:${sr.top - 8}px;width:${sr.width + 16}px;height:${sr.height + 16}px`;
            $('tut-ring-book').style.cssText = `left:${ir.left - 8}px;top:${ir.top - 8}px;width:${ir.width + 16}px;height:${ir.height + 16}px`;
            const ok = $('tut-ok');
            ok.style.top = Math.max(8, by - 56) + 'px';
        }
        function hideTutorial(done) {
            const t = $('tutorial');
            if (!t) return;
            const wasOpen = t.classList.contains('show');
            t.classList.remove('show');
            if (wasOpen && done !== false && Game.save && !Game.save.tut) { Game.save.tut = true; persist(); }
        }
        window.addEventListener('resize', () => positionTutorial());

        function returnToMenu() {
            if (gameState.isSpinning && document.body.dataset.mode === 'game') { setMessage(UX('waitReels')); return; }
            nbClear();
            if (Game.save) persist();
            stopCasinoMusic();
            stopBonusMusic();
            gameState.autoSpinActive = false;
            gameState.isSpinning = false;
            clearTease();
            updateAutoSpinButtonUI();
            ALL_MODALS.forEach(closeModal);
            switchScreen('screen-menu');
            renderMenu();
        }
        function goMap() {
            if (gameState.isSpinning) return;
            gameState.autoSpinActive = false;
            updateAutoSpinButtonUI();
            nbClear();
            openMap();
        }

        function setMessage(text, isWin) {
            const el = $('game-message');
            el.textContent = text;
            el.classList.toggle('win', isWin === true);
            el.classList.toggle('lose', isWin === 'lose');
        }

        /* ---------- ÖDEME TABLOSU + KİTAP ---------- */
        /* =====================================================
           REÇETE KİTABI (bilgi): gerçek slot ödeme tabloları gibi sayfalı — ◀ ▶ ile gezilir
           ===================================================== */
        let infoIdx = 0, infoPages = [];
        function symPayRows(sym, E, ch) {
            const mult = E.symMult[sym.id] * ch.payScale * (ch.boost[sym.id] || 1) * (E.payBonus || 1);
            const lineBet = gameState.bet / Engine.LINES;
            const counts = E.reels === 6 ? [6, 5, 4, 3, 2] : [5, 4, 3, 2];
            return counts.map(n => {
                const v = n === 6 ? (sym.values[5] || 0) * 2.5 : sym.values[n];
                if (!v) return '';
                const beans = v * mult * lineBet;
                return `<div class="ip-pr"><b>${n}×</b><span>${fmt(beans >= 10 ? Math.round(beans) : Math.round(beans * 10) / 10)} ${beanIc()}</span></div>`;
            }).join('');
        }
        function symCard(sym, E, ch, big) {
            const up = E.symMult[sym.id] > 1 ? `<span class="up">⬆ ×${fmtX(E.symMult[sym.id])}</span>` : '';
            return `<div class="ip-sym ${big ? 'big' : ''}"><div class="ip-si"><img src="${ASSETS.sym[sym.img]}" alt=""></div>
                    <div class="ip-sb"><b class="nm">${symName(sym.id)}</b>${symPayRows(sym, E, ch)}${up}</div></div>`;
        }
        function linesSVG() {
            const R = Engine.ROWS, cols = ['#E0262E', '#2F7FD8', '#3FA34D', '#E8A33A', '#8E5BD8', '#D8486E', '#1BA6A6', '#9A6A2A'];
            return Engine.PAYLINES.map((ln, i) => {
                const c = cols[i % cols.length];
                const cells = [];
                for (let x = 0; x < 5; x++) for (let y = 0; y < R; y++) cells.push(`<rect x="${x * 12 + 1}" y="${y * 12 + 1}" width="10" height="10" rx="2" fill="${ln[x] === y ? c : '#F3E2C3'}" opacity="${ln[x] === y ? .9 : 1}"/>`);
                const path = ln.map((y, x) => `${x ? 'L' : 'M'}${x * 12 + 6} ${y * 12 + 6}`).join(' ');
                return `<div class="ip-line"><svg viewBox="0 0 60 ${R * 12}">${cells.join('')}<path d="${path}" stroke="#4A2A0E" stroke-width="1.6" fill="none" stroke-linejoin="round"/></svg><small>${i + 1}</small></div>`;
            }).join('');
        }
        function buildPayTable() {
            const view = $('ip-view');
            if (!view) return;
            const ch = CHAPTERS[gameState.chapter] || CHAPTERS[1];
            const E = RUN_EFF, I = L().info, P = I.pages, st = gameState.chapter;
            const book = SYMBOLS.find(s => s.isScatter), normals = SYMBOLS.filter(s => !s.isScatter);
            const high = normals.slice(0, 4), low = normals.slice(4);
            infoPages = [];
            infoPages.push(['🎯', P.rules, `<div class="ip-txt">${I.rules(E, st)}</div>`]);
            infoPages.push(['📖', P.book, `<div class="ip-hero">${symCard(book, E, ch, true)}</div><div class="ip-txt">${tf(I.bookTxt, { n: E.freeSpins })}</div>`]);
            infoPages.push(['💎', P.high, `<div class="ip-grid">${high.map(s => symCard(s, E, ch, true)).join('')}</div>`]);
            infoPages.push(['☕', P.low, `<div class="ip-grid">${low.map(s => symCard(s, E, ch, false)).join('')}</div>`]);
            if (st === 2) infoPages.push(['🍵', P.special, `<div class="ip-grid">
                    <div class="ip-sym big"><div class="ip-si"><img src="${ASSETS.sym.pitcher}" alt=""></div><div class="ip-sb"><b class="nm">${symName('pitcher')} · ${L().badge.wild}</b><small>${I.pitcher(E)}</small></div></div>
                    <div class="ip-sym big"><div class="ip-si"><img src="${ASSETS.sym.matcha}" alt=""></div><div class="ip-sb"><b class="nm">${symName('matcha')} · ${L().badge.foam}</b><small>${I.matcha(E)}</small></div></div></div>
                    <p class="ip-txt sp-note">${I.specialNote}</p>`]);
            if (st === 3) infoPages.push(['🧁', P.special, `<div class="ip-hero"><img class="ip-hi" src="${ASSETS.sym.cupcake}" alt=""></div><h4 class="ip-h">${I.ovenT}</h4><div class="ip-txt">${I.oven(E)}</div>`]);
            if (st === 4) infoPages.push(['🌾', P.special, `<div class="ip-hero"><img class="ip-hi" src="${ASSETS.sym.coffeebag}" alt=""></div><h4 class="ip-h">${I.bagT}</h4><div class="ip-txt">${I.bag(E)}</div>`]);
            if (CHAPTERS[st].saga) { const ek = eraKey(st), EM = ERA_META[ek], T2 = ST().era[ek];
                infoPages.push([eraIcon(ek, 20), P.era, `<div class="ip-hero"><div class="era-badge big" style="--c:${EM.col};--c2:${EM.col2}">${eraIcon(ek, 72)}</div></div><h4 class="ip-h">${eraName(ek)} · ${EM.years[CUR_LANG()]}</h4><div class="ip-txt"><b>${ST().buffWord}: ${T2.buff}</b><br>${T2.buffD}.<br>${I.eraNote}</div>`]); }
            if (st === 5 || CHAPTERS[st].saga) infoPages.push(['☕', CHAPTERS[st].saga ? I.loyT.replace(/\s*\(.*\)/, '').replace(/^\S+\s/, '') : P.special, `<div class="ip-hero"><img class="ip-hi" src="${ASSETS.sym.stamp}" alt=""></div><h4 class="ip-h">${I.loyT}</h4><div class="ip-txt">${I.loy}</div>`]);
            infoPages.push(['〰️', P.lines, `<p class="ip-txt">${tf(I.linesTxt, { n: Engine.LINES })}</p><div class="ip-lines">${linesSVG()}</div>`]);
            infoPages.push(['🎮', P.keys, `<div class="keys">${I.keys.map(k => `<div class="key-row"><span class="kk">${k[0]}</span><span>${k[1]}</span></div>`).join('')}</div>`]);
            infoIdx = Math.min(infoIdx, infoPages.length - 1);
            $('info-title').textContent = I.title;
            $('info-ok').textContent = I.ok;
            renderInfoPage(0);
        }
        function renderInfoPage(dir) {
            const pg = infoPages[infoIdx], view = $('ip-view');
            $('ip-tabs').innerHTML = infoPages.map((p, i) => `<button class="ip-tab ${i === infoIdx ? 'on' : ''}" onclick="infoGo(${i})" title="${escapeHtml(p[1])}">${p[0]}</button>`).join('');
            view.innerHTML = `<div class="ip-page ${dir > 0 ? 'in-r' : dir < 0 ? 'in-l' : ''}"><h4 class="ip-title">${pg[0]} ${pg[1]}</h4>${pg[2]}</div>`;
            $('ip-count').textContent = `${infoIdx + 1} / ${infoPages.length}`;
            $('ip-prev').disabled = infoIdx === 0;
            $('ip-next').disabled = infoIdx === infoPages.length - 1;
            view.scrollTop = 0;
        }
        function infoPage(d) {
            const n = Math.max(0, Math.min(infoPages.length - 1, infoIdx + d));
            if (n === infoIdx) return;
            infoIdx = n; playPageFlip(); renderInfoPage(d);
        }
        function infoGo(i) { const d = i - infoIdx; if (!d) return; infoIdx = i; playPageFlip(); renderInfoPage(d); }
        function openInfoModal() {
            playSynthNote(500, 0.05);
            hideTutorial();
            infoIdx = 0;
            buildPayTable();
            openModal('modal-info');
        }
        function closeInfoModal() { closeModal('modal-info'); }

        /* ---------- BAHİS ---------- */
        function clampBet() {
            const ch = CHAPTERS[gameState.chapter];
            const opts = Engine.betOptions(gameState.chapter, gameState.balance);
            if (!opts.length) { gameState.bet = ch.minBet; return; }
            let b = opts[0];
            opts.forEach(o => { if (o <= gameState.bet) b = o; });
            gameState.bet = b;
        }
        function recommendedBet(chapter, balance) {
            const opts = Engine.betOptions(chapter, balance);
            if (!opts.length) return CHAPTERS[chapter].minBet;
            let b = opts[0];
            opts.forEach(o => { if (o <= balance * 0.03) b = o; });
            return b;
        }
        function freeActive() { return gameState.freeSpinsRemaining > 0 || gameState.rainRemaining > 0; }
        function adjustBet(direction) {
            if (freeActive() || gameState.autoSpinActive) { setMessage(L().msg.betLock); return; }
            playSynthNote(480, 0.05);
            const opts = Engine.betOptions(gameState.chapter, gameState.balance);
            if (!opts.length) return;
            let idx = 0;
            opts.forEach((o, i) => { if (o <= gameState.bet) idx = i; });
            idx = Math.max(0, Math.min(opts.length - 1, idx + direction));
            gameState.bet = opts[idx];
            updateHUD();
        }

        /* ---------- HEDEF ÇUBUĞU + ŞUBE SATIN ALMA ---------- */
        const GOAL_ICON = { 1: '☕', 2: '🍵', 3: '🧁', 4: '🌾', 5: '🏰' };
        function goalProgress() {
            const c = CHAPTERS[gameState.chapter];
            if (Game.save && Game.save.finished) return 1;
            return Math.max(0, Math.min(1, gameState.balance / c.unlockAt));
        }
        function phaseReward(stage) { return Math.round(CHAPTERS[stage].unlockAt * 0.025 * (RUN_EFF.diff ? RUN_EFF.diff.phase : 1)); }
        function buildGoalTicks() {
            const marks = $('goal-marks');
            marks.innerHTML = '';
            const c = CHAPTERS[gameState.chapter];
            if (Game.save && Game.save.finished) return;
            c.phases.forEach((p, i) => {
                const got = Game.save && Game.save.phases[c.id + ':' + i];
                const t = document.createElement('button');
                t.className = 'gm' + (got ? ' got' : '');
                t.style.left = (p * 100) + '%';
                const tip = got ? L().goal.phaseGot : tf(L().goal.phaseTip, { at: fmt(c.unlockAt * p), pct: pctS(Math.round(p * 100)), r: fmt(phaseReward(c.id)) });
                t.title = tip;
                t.textContent = got ? '✓' : '🎁';
                t.setAttribute('aria-label', tip);
                t.onclick = () => showDialog('cozybear', castName('cozybear'), tip);
                marks.appendChild(t);
            });
        }
        function updateGoalBar() {
            const bar = $('goal-bar');
            if (!bar || !Game.save) return;
            const n = gameState.chapter, c = CHAPTERS[n], sv = Game.save;
            const p = goalProgress();
            $('goal-fill').style.width = (p * 100) + '%';
            bar.classList.toggle('done', !!sv.finished);
            if (GOAL_ICON[n]) $('goal-title').textContent = GOAL_ICON[n] + ' ' + stageName(n);
            else $('goal-title').innerHTML = eraIcon(eraKey(n), 18) + ' ' + escapeHtml(stageName(n));
            const pct = p * 100;
            $('goal-num').textContent = sv.finished ? '' : fmt(gameState.balance) + ' / ' + fmt(c.unlockAt);
            $('goal-pct').textContent = sv.finished ? '🏆' : pctS(pct < 10 ? fx(Math.floor(pct * 10) / 10) : Math.floor(pct));
            const btn = $('buy-btn'), wrap = $('buy-wrap');
            if (sv.finished) {
                $('goal-title').textContent = L().usta.title;
                wrap.title = L().quests.title;
                wrap.dataset.tip = L().quests.title;
                updateUstaUI();
                return;
            }
            const ready = gameState.balance >= c.unlockAt && !freeActive();
            const last = n >= Engine.STAGE_COUNT, shortN = !last ? L().stage[n + 1].short : '';
            btn.textContent = n === 5 ? tf(L().goal.buyTM, { price: fmt(c.price) }) : !last ? tf(L().goal.buyNext, { short: shortN, price: fmt(c.price) }) : tf(L().goal.buyFinal, { price: fmt(c.price) });
            btn.classList.toggle('locked', !ready);
            btn.classList.toggle('ready', ready);
            const place = !last ? L().stage[n + 1].place : 'SyruppoLab';
            const tip = (n === 5 || last) && !ready ? tf(L().goal.lockedTipFinal, { at: fmt(c.unlockAt), price: fmt(c.price) })
                : ready ? tf(L().goal.readyTip, { place, price: fmt(c.price) })
                : tf(L().goal.lockedTip, { at: fmt(c.unlockAt), place, price: fmt(c.price) });
            wrap.title = tip;
            btn.setAttribute('aria-label', tip);
            wrap.dataset.tip = tip;
        }
        function buyClick() {
            const n = gameState.chapter, c = CHAPTERS[n];
            if (Game.save.finished) { openHub('quests'); return; }
            if (gameState.isSpinning || freeActive() || gameState.balance < c.unlockAt) {
                showDialog('barista', 'Bearista', $('buy-wrap').dataset.tip || '');
                return;
            }
            gameState.autoSpinActive = false; updateAutoSpinButtonUI();
            const left = fmt(gameState.balance - c.price);
            if (n === 5) {
                confirmBox({ title: L().buy.tF, text: tf(L().buy.txtTM, { price: fmt(c.price), left }), art: ['barista', 'book', 'dede'], ok: L().buy.okTM, good: true, onOk: () => doBuy() });
            } else if (n < Engine.STAGE_COUNT) {
                const nx = L().stage[n + 1];
                confirmBox({ title: tf(L().buy.t, { short: nx.short.toLocaleUpperCase(LOC()) }), text: tf(L().buy.txt, { place: nx.place, price: fmt(c.price), left }), art: ['barista', 'coffeebag', 'cozybear'], ok: L().buy.ok, good: true, onOk: () => doBuy() });
            } else {
                confirmBox({ title: L().buy.tF, text: tf(L().buy.txtF, { price: fmt(c.price), left }), art: ['barista', 'book', 'cozybear'], ok: L().buy.okF, good: true, onOk: () => doBuy() });
            }
        }
        function doBuy() {
            const n = gameState.chapter, c = CHAPTERS[n], sv = Game.save;
            gameState.bonusLock = true;   // yeni bölüme girilene kadar spin yok (hikâye açılırken çift spin olmasın)
            gameState.balance -= c.price;
            [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.3, 'sine', 0.07), i * 130));
            celebrate(gameState.bet * 100);
            if (n < Engine.STAGE_COUNT) {
                const nx = CHAPTERS[n + 1];
                gameState.chapter = n + 1;
                sv.stage = n + 1;
                // zaman makinesi makineye 6. makarayı takar (Saga'nın matematiği 6 makaraya göre ayarlı)
                if (n + 1 === Engine.SAGA_FIRST && !(sv.ups.lx_reel6 > 0)) { sv.ups.lx_reel6 = 1; setTimeout(() => achToast('espresso', L().up.lx_reel6.n, '⏳ ' + UX('tmGift')), 3400); }
                // zaman makinesi: kasa yeni bölüme en az `start`, en çok `carryMax` taşınır; fazlası Zaman Hazinesi'ne
                // kasaya taşınan miktar sınırlı: şanslı bir seri sonraki bölümü (hikâyesi ve mekaniğiyle) atlatmasın; fazlası Zaman Hazinesi'ne
                const cap = nx.saga ? nx.carryMax : Math.round(nx.unlockAt * 0.6);
                const extra = Math.max(0, gameState.balance - cap);
                if (extra > 0) { addTreasure(extra); setTimeout(() => achToast('goldenbean', ST().treasure, '+' + fmt(extra)), 2600); }
                gameState.balance = Math.min(cap, nx.saga ? Math.max(gameState.balance, nx.start) : gameState.balance);
                gameState.loy = newLoyalty();
                gameState.oven = 0;
                gameState.bet = 0;
                refreshEff();
                persist();
                metaEvent('stage', n + 1);
                if (typeof sagaScoreUpdate === 'function') sagaScoreUpdate();
                setTimeout(() => playChapterStory(n + 1), 900);
            } else {
                sv.finished = true;
                sv.peak = Math.floor(gameState.balance);
                persist();
                metaEvent('finish');
                if (typeof sagaScoreUpdate === 'function') sagaScoreUpdate();
                setTimeout(() => Comic.play('finale', () => openMap()), 900);
            }
        }

        function updateFsBadge() {
            const b = $('fs-badge');
            const fs = gameState.freeSpinsTotal > 0 && gameState.expandingSymbolId;
            const rain = gameState.rainTotal > 0 && gameState.rainRemaining >= 0 && gameState.rainMode;
            b.classList.toggle('show', !!(fs || rain));
            b.classList.toggle('rain', !!rain && !fs);
            if (!(fs || rain)) return;
            const rem = fs ? gameState.freeSpinsRemaining : gameState.rainRemaining;
            const tot = fs ? gameState.freeSpinsTotal : gameState.rainTotal;
            $('fs-t').textContent = fs ? L().banner.badgeFs : L().banner.badgeRain;
            $('fs-left').textContent = rem;
            $('fs-of').textContent = `${Math.min(tot - rem, tot)} / ${tot}`;
            b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
            updateBanner();
        }
        function updateBanner() {
            const fs = gameState.freeSpinsRemaining > 0 || (gameState.expandingSymbolId && gameState.freeSpinsTotal > 0);
            const B = L().banner;
            if (fs) {
                $('bn-a').textContent = B.fs;
                $('free-spins-count').textContent = gameState.freeSpinsRemaining;
                $('bn-tot').textContent = '/' + gameState.freeSpinsTotal;
                $('bn-b').textContent = B.exp;
                $('expanding-symbol-name').textContent = symName(gameState.expandingSymbolId);
                $('bn-img').src = ASSETS.sym.book;
                const fm = gameState.fsMult || 0;
                $('bn-mult').textContent = fm > 0 ? tf(B.mult, { v: fm }) : '';
                $('bn-mult').classList.toggle('hidden', !(fm > 0));
            } else {
                $('bn-mult').classList.add('hidden');
                $('bn-a').textContent = B.rain;
                $('free-spins-count').textContent = gameState.rainRemaining;
                $('bn-tot').textContent = '/' + gameState.rainTotal;
                $('bn-b').textContent = '';
                $('expanding-symbol-name').textContent = B.rainInfo;
                $('bn-img').src = ASSETS.sym.cupcake;
            }
        }

        function updateHUD() {
            $('hud-balance').textContent = fmt(gameState.balance);
            updateGoalBar();
            $('hud-bet').textContent = fmt(gameState.bet);
            ['hud-bet', 'hud-balance'].forEach(id => { const e = $(id); e.style.fontSize = e.textContent.length > 12 ? '.74em' : e.textContent.length > 9 ? '.86em' : ''; });
            const tier = Engine.tierOf(gameState.bet, gameState.chapter);
            const tb = $('tier-badge');
            tb.textContent = L().tier(tier);
            tb.classList.toggle('hi', tier > 0);
            renderOrder();
            const isLocked = (freeActive() || gameState.autoSpinActive);
            $('bet-minus-btn').disabled = isLocked;
            $('bet-plus-btn').disabled = isLocked;
            const ek = eraKey(gameState.chapter);
            $('hud-stage').innerHTML = `${Game.save && Game.save.cheat ? '🧪 ' : ''}${ek ? eraIcon(ek, 16) : '☕'} ${ek ? ST().chWord : L().stageWord} ${gameState.chapter}`;
            updateEraChip();
        }

        function toggleAutoSpin() {
            if (freeActive() || gameState.bonusLock || (gameState.isSpinning && gameState.spinFree)) {
                gameState.autoSpinActive = false; updateAutoSpinButtonUI();
                setMessage(L().msg.autoLock); return;
            }
            gameState.autoSpinActive = !gameState.autoSpinActive;
            playSynthNote(520, 0.08);
            hideTutorial();
            updateAutoSpinButtonUI();
            updateHUD();
            if (gameState.autoSpinActive) {
                setMessage(L().msg.autoOn);
                if (!gameState.isSpinning) spinReels();
            } else {
                setMessage(L().msg.autoOff);
            }
        }
        function updateAutoSpinButtonUI() { $('auto-spin-btn').classList.toggle('on', gameState.autoSpinActive); }

        /* ---------- DİYALOG ---------- */
        let dialogTimer = null;
        function showDialog(imgKey, name, text) {
            const t = $('dialog-toast');
            if (imgKey && ASSETS.sym[imgKey]) { $('dt-img').src = ASSETS.sym[imgKey]; $('dt-img').style.display = ''; }
            else $('dt-img').style.display = 'none';
            $('dt-name').textContent = name;
            $('dt-text').textContent = text;
            t.classList.add('show');
            clearTimeout(dialogTimer);
            dialogTimer = setTimeout(() => t.classList.remove('show'), 5600);
        }

        function checkPhases() {
            const sv = Game.save;
            if (!sv || sv.finished) return;
            const c = CHAPTERS[gameState.chapter];
            const p = goalProgress();
            let changed = false;
            c.phases.forEach((ph, i) => {
                if (p < ph || gameState.phasesShown[i]) return;
                gameState.phasesShown[i] = true;
                const key = c.id + ':' + i;
                const sl = !(L().phase[c.id] && L().phase[c.id][i]) && sagaLine(c.id);
                const talk = (L().phase[c.id] && L().phase[c.id][i]) || (sl ? [sl[0], sl[1], UX('halfway') + sl[2]] : ['barista', 'Bearista', '']);
                let extra = '';
                if (!sv.phases[key]) {
                    sv.phases[key] = true;
                    const r = phaseReward(c.id);
                    gameState.balance += r;
                    changed = true;
                    extra = tf(L().phaseReward, { v: fmt(r) });
                }
                showDialog(talk[0], talk[1], talk[2] + extra);
                [659, 784, 988].forEach((f, k) => setTimeout(() => playSynthNote(f, 0.18, 'sine', 0.06), k * 110));
            });
            if (changed) { buildGoalTicks(); updateHUD(); }
        }

        /* =====================================================
           SADAKAT KARTI (Final) · FIRIN (Aşama 3)
           ===================================================== */
        function updateLoyaltyUI(popIdx) {
            const Lo = gameState.loy, per = Engine.STAMPS_PER_CARD, T = L().loy;
            const slots = $('lc-slots');
            if (slots.children.length !== per) {
                slots.innerHTML = '';
                for (let i = 0; i < per; i++) {
                    const s = document.createElement('span');
                    s.className = 'slot';
                    s.innerHTML = `<img src="${ASSETS.sym.stamp}" alt="">`;
                    slots.appendChild(s);
                }
            }
            [...slots.children].forEach((s, i) => {
                s.classList.toggle('on', i < Lo.stamps);
                if (popIdx !== undefined && i >= popIdx && i < Lo.stamps) { s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
            });
            $('lc-title').textContent = T.title;
            $('loyalty').title = T.tip;
            $('lc-count').textContent = `${Math.min(Lo.stamps, per)}/${per}`;
            const buffs = [];
            if (Lo.filtre) buffs.push(`<span class="buff">${T.filtreB}</span>`);
            if (Lo.americano > 0) buffs.push(`<span class="buff hot">${tf(T.americanoB, { n: Lo.americano })}</span>`);
            if (Lo.latte > 0) buffs.push(`<span class="buff">${tf(T.latteB, { n: Lo.latte * 10 })}</span>`);
            $('lc-buffs').innerHTML = buffs.join('') || `<span class="buff off">${T.empty}</span>`;
        }
        function addStamps(n) {
            if (!n || !CHAPTERS[gameState.chapter].loyalty) return false;
            const before = gameState.loy.stamps;
            gameState.loy.stamps += n;
            [0, 1].forEach(k => setTimeout(() => { playSynthNote(180 - k * 30, 0.1, 'square', 0.05); }, k * 90));
            updateLoyaltyUI(before);
            return gameState.loy.stamps >= Engine.STAMPS_PER_CARD;
        }
        const DRINKS = [{ id: 'filtre', img: 'v60' }, { id: 'americano', img: 'portafilter' }, { id: 'latte', img: 'espresso' }];
        function openDrinkChoice() {
            metaEvent('loy');
            const list = $('drink-list'), T = L().loy;
            $('dr-title').textContent = T.full;
            $('dr-pick').textContent = T.pick;
            list.innerHTML = '';
            DRINKS.forEach(d => {
                const maxed = d.id === 'latte' && gameState.loy.latte >= Engine.LATTE_MAX;
                const b = document.createElement('button');
                b.className = 'drink' + (maxed ? ' maxed' : '');
                b.disabled = maxed;
                const tx = T.drinks[d.id];
                b.innerHTML = `<img src="${ASSETS.sym[d.img]}" alt=""><b>${tx[0]}</b><small>${maxed ? tf(T.maxed, { n: Engine.LATTE_MAX }) : tx[1]}</small>`;
                b.onclick = () => chooseDrink(d.id);
                list.appendChild(b);
            });
            [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 100));
            openModal('modal-drink');
        }
        function chooseDrink(id) {
            const Lo = gameState.loy, T = L().loy;
            Lo.stamps = Math.max(0, Lo.stamps - Engine.STAMPS_PER_CARD);
            if (id === 'filtre') Lo.filtre = true;
            else if (id === 'americano') Lo.americano += 10;
            else if (id === 'latte') { Lo.latte = Math.min(Engine.LATTE_MAX, Lo.latte + 1); refreshEff(); }
            closeModal('modal-drink');
            [784, 988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.06), i * 80));
            const d = DRINKS.find(x => x.id === id);
            showDialog(d.img, tf(T.ready, { d: T.drinks[id][0] }), T.said[id]);
            updateLoyaltyUI();
            persist();
            celebrate(gameState.bet * 10);
            if (gameState.loy.stamps >= Engine.STAMPS_PER_CARD) setTimeout(openDrinkChoice, 600);
        }

        /* ---------- MATCHA → KAHVE dönüşümü + Matcha Savaşı sayacı (Aşama 2) ---------- */
        function animateConvert(pending) {
            const cv = pending.conv, layer = $('orb-layer');
            setMessage(tf(L().msg.convert, { n: cv.cells.length, s: symName(cv.sym.id) }), true);
            cv.cells.forEach(([r, row], i) => {
                setTimeout(() => {
                    const pos = cellScreenPos(r, row);
                    const sp = document.createElement('div');
                    sp.className = 'splash';
                    sp.style.left = pos.x + '%'; sp.style.top = pos.y + '%';
                    sp.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
                    layer.appendChild(sp);
                    setTimeout(() => sp.remove(), 900);
                    const m = meshAt(r, row);
                    if (m) { setFace(m, cv.sym, false, false); m.userData.popStart = Date.now(); if (winningMeshRefs.indexOf(m) === -1) winningMeshRefs.push(m); }
                    gameState.grid[r][row] = cv.sym;
                    playSynthNote(523 + i * 90, 0.12, 'triangle', 0.06);
                    playSynthNote(180, 0.08, 'sine', 0.05);
                }, 120 + i * 140);
            });
            return 120 + cv.cells.length * 140 + 450;
        }
        function updateMatchaUI(pop) {
            const W = Engine.MATCHA_WAR, n = Math.min(gameState.mwar || 0, W);
            $('mw-title').textContent = L().mwar.title;
            $('mwar').title = L().mwar.tip;
            $('mw-count').textContent = `${n}/${W}`;
            $('mw-fill').style.width = (n / W * 100) + '%';
            if (pop) { const o = $('mwar'); o.classList.remove('pop'); void o.offsetWidth; o.classList.add('pop'); }
        }
        function addMatchaWar(n) {
            if (!n || gameState.chapter !== 2) return;
            gameState.mwar = (gameState.mwar || 0) + n;
            updateMatchaUI(true);
            while (gameState.mwar >= Engine.MATCHA_WAR) {
                gameState.mwar -= Engine.MATCHA_WAR;
                const bonus = gameState.bet * Engine.ZAFER_MULT;
                gameState.balance += bonus;
                metaEvent('zafer');
                if (gameState.spinFree && gameState.freeSpinsRemaining >= 0 && gameState.expandingSymbolId) gameState.fsWin = (gameState.fsWin || 0) + bonus;
                setTimeout(() => {
                    showDialog('barista', 'Bearista', tf(L().mwar.win, { v: fmt(bonus) }));
                    [659, 784, 988, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.07), i * 110));
                    celebrate(bonus * 2);
                    flashLights();
                    updateHUD();
                    updateMatchaUI(true);
                }, 300);
            }
            updateHUD();
        }

        function updateOvenUI(pop) {
            const full = RUN_EFF.ovenFull;
            $('ov-title').textContent = L().oven.title;
            $('oven').title = L().oven.tip;
            $('ov-count').textContent = `${Math.min(gameState.oven, full)}/${full}`;
            $('ov-fill').style.width = Math.min(100, gameState.oven / full * 100) + '%';
            if (pop) { const o = $('oven'); o.classList.remove('pop'); void o.offsetWidth; o.classList.add('pop'); }
        }
        function addCupcakes(n) {
            if (!n || gameState.chapter !== 3 || gameState.rainRemaining > 0) return false;
            gameState.oven += n;
            playSynthNote(988, 0.1, 'triangle', 0.05);
            updateOvenUI(true);
            if (gameState.oven >= RUN_EFF.ovenFull) { gameState.oven = 0; gameState.rainPending = true; return true; }
            return false;
        }
        function startCakeRain() {
            gameState.rainPending = false;
            gameState.rainRemaining = RUN_EFF.ovenSpins;
            gameState.rainTotal = RUN_EFF.ovenSpins;
            gameState.rainMode = true;
            metaEvent('rain');
            updateOvenUI();
            $('bonus-banner').classList.add('show');
            updateFsBadge();
            setMessage(tf(L().msg.rainStart, { n: gameState.rainTotal }), true);
            [784, 988, 1175, 1568, 1976].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.25, 'sine', 0.07), i * 120));
            celebrate(gameState.bet * 30);
            startBonusMusic();
            persist();
            scheduleNextSpin(900);
        }

        /* =====================================================
           SPIN MANTIĞI (matematik: Engine)
           ===================================================== */
        let teaseTimer = null;
        function teaseMusic(on) {
            clearInterval(teaseTimer); teaseTimer = null;
            if (!on) return;
            let k = 0;
            const up = [57, 60, 64, 69, 72, 76, 81, 84].map(n => 440 * Math.pow(2, (n - 69) / 12));
            teaseTimer = setInterval(() => { playSynthNote(up[k % up.length], 0.16, 'sine', 0.035); if (k % 4 === 0) { playSynthNote(65, 0.18, 'sine', 0.09); setTimeout(() => playSynthNote(62, 0.16, 'sine', 0.07), 140); } k++; }, 150);
        }
        function syncReels() {
            if (builtReels && builtReels !== reelCount()) {
                if (gameState.isSpinning || freeActive()) { gameState.reelsPending = true; return; }
                gameState.reelsPending = false;
                initThreeJS();
            }
        }

        let curSpin = null;
        let spinToken = 0;
        function spinReels() {
            if (gameState.isSpinning) { if (curSpin && curSpin.slam) curSpin.slam(); return; }
            if (gameState.bonusLock) return;          // 3 kitap → not defteri / free spin bitişi arasında spin yok
            if (!threeReady) return;
            if (anyModalOpen()) return;
            hideTutorial();
            const c = CHAPTERS[gameState.chapter];
            const fsSpin = gameState.freeSpinsRemaining > 0;
            const rainSpin = !fsSpin && gameState.rainRemaining > 0;
            const free = fsSpin || rainSpin;
            if (!free && gameState.reelsPending) syncReels();
            if (!free) {
                clampBet();
                if (gameState.balance < c.minBet) {
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    showBust();
                    return;
                }
            }

            winningMeshRefs = [];

            gameState.spinFree = free;
            if (fsSpin) gameState.freeSpinsRemaining--;
            else if (rainSpin) gameState.rainRemaining--;
            else if (!(Game.save && Game.save.cheat)) gameState.balance -= gameState.bet;   // test modu: bahis kasadan düşmez

            let mult = 1;
            if (gameState.loy.americano > 0) { mult = 2; gameState.loy.americano--; updateLoyaltyUI(); }

            const ctx = { chapter: gameState.chapter, bet: gameState.bet, tier: Engine.tierOf(gameState.bet, gameState.chapter), eff: RUN_EFF, expandingSymbolId: fsSpin ? gameState.expandingSymbolId : null, ovenRain: rainSpin, mult,
                          inFS: fsSpin, fsMult: fsSpin ? (gameState.fsMult || 0) : 0, orbs: Engine.rollOrbs(fsSpin, Math.random, RUN_EFF.orbMul * (fsSpin ? RUN_EFF.fsOrbMul || 1 : 1)),
                          luck: free ? 0 : Engine.luckFor(gameState.streak || 0, RUN_EFF.diff) };
            clearOrbs();
            const pending = { g: Engine.genGrid(ctx, Math.random), ctx };
            pending.conv = Engine.convertMatcha(pending.g, ctx, Math.random);   // matcha → kahve (gizemli sembol)
            const N = pending.g.length;
            // 7. gün hediyesi: Dede'nin ×5'i ilk KAZANAN spine
            if (!free && Game.save && Game.save.dedeGift) {
                const testG = pending.conv.cells.length ? pending.conv.grid : pending.g;
                if (Engine.evaluate(testG, Object.assign({}, ctx, { orbs: [] })).total > 0) { ctx.orbs.push(5); Game.save.dedeGift = false; pending.gift = true; }
            }
            const fast = turboOn();

            updateFsBadge();
            updateHUD();
            gameState.isSpinning = true;
            $('spin-btn').classList.add('spinning');
            $('spin-lbl').textContent = L().ctl.stop;
            setMessage(fsSpin ? L().msg.freeSpinning : rainSpin ? L().msg.rainSpinning : (mult > 1 ? L().msg.americanoSpin : L().msg.spinning));
            playSpinSound();

            Reels.startAll(fast);

            // durma zamanları; 2 Kitap düşecekse kalan makaralar geç ve yavaş durur (heyecan — turboda da)
            /* Değişken dönüş süresi (turbo kapalıyken): gerçek makinelerdeki gibi her spin aynı sürede bitmez.
               Sonuçtan bağımsızdır; sadece ritmi canlandırır. */
            const stopAt = [];
            let spinProfile = 'n';
            if (!fast) { const q = Math.random(); spinProfile = q < 0.58 ? 'n' : q < 0.86 ? 'l' : 'x'; }
            const P = { n: [520, 200, 0], l: [760, 255, 0], x: [980, 300, 520] }[spinProfile];
            for (let r = 0; r < N; r++) stopAt.push(fast ? 90 + r * 40 : P[0] + r * P[1] + Math.round((Math.random() - 0.5) * 70) + (r === N - 1 ? P[2] : 0));
            for (let r = 1; r < N; r++) if (stopAt[r] < stopAt[r - 1] + 90) stopAt[r] = stopAt[r - 1] + 90;
            let teaseFrom = -1;
            if (!rainSpin) {
                let books = 0;
                for (let r = 0; r < N - 1; r++) {
                    books += pending.g[r].filter(s => s.id === 'book').length;
                    if (books >= 2) { teaseFrom = r; break; }
                }
            }
            if (teaseFrom >= 0) for (let k = teaseFrom + 1; k < N; k++) stopAt[k] = stopAt[teaseFrom] + (fast ? 500 : 650) + (k - teaseFrom) * (fast ? 700 : 850);
            const requested = new Array(N).fill(false);
            let landed = 0, teasing = false, elapsed = 0;
            Lever.pull(teaseFrom >= 0 ? stopAt[teaseFrom] : stopAt[N - 1], fast);   // kol: hızla in, makaralarla birlikte yavaşça kalk
            orbsDropped = false;

            const token = ++spinToken, landedR = new Array(N).fill(false);
            const onLand = (r) => {
                if (token !== spinToken || landedR[r]) return;   // eski / çift geri çağrı: yok say
                landedR[r] = true;
                setTease(r, false);
                for (let row = 0; row < Engine.ROWS; row++) gameState.grid[r][row] = pending.g[r][row];
                const hasBook = pending.g[r].some(s => s.id === 'book');
                playSynthNote(300 + r * 60, 0.07, 'triangle', 0.06);
                playSynthNote(120, 0.08, 'sine', 0.05);
                if (hasBook) {
                    playSynthNote(teasing ? 1175 : 880, 0.18, 'sine', 0.07);
                    for (let row = 0; row < Engine.ROWS; row++) if (pending.g[r][row].id === 'book') { const m = meshAt(r, row); if (m) { setFace(m, pending.g[r][row], true, false); m.userData.popStart = Date.now(); winningMeshRefs.push(m); } }
                }
                if (r === teaseFrom) {
                    teasing = true;
                    for (let k = r + 1; k < N; k++) { setTease(k, true); Reels.setSpeed(k, 0.55); }
                    $('reel-wrap').classList.add('tease');
                    setMessage(L().msg.tease);
                    teaseMusic(true);
                }
                landed++;
                if (landed === N && !orbsDropped && pending.ctx.orbs.length) dropOrbs(pending);
                if (landed === N) {
                    clearInterval(spinInterval);
                    curSpin = null;
                    $('spin-lbl').textContent = L().ctl.spin;
                    if (teasing) { teaseMusic(false); clearTease(); }
                    setTimeout(() => finalizeSpin(pending), fast ? 40 : 120);
                }
            };
            if (spinProfile === 'x' && teaseFrom < 0) {   // en uzun dönüşte son makara ağırlaşır, hafif bir uğultu yükselir
                setTimeout(() => { if (!requested[N - 1]) { Reels.setSpeed(N - 1, 0.72); playSynthNote(196, 0.5, 'sine', 0.03); playSynthNote(294, 0.5, 'sine', 0.025); } }, stopAt[N - 2]);
            }
            curSpin = { slam: () => {   // dönerken SPİN'e tekrar basınca: makaraları hemen durdur (heyecan makaraları hariç)
                for (let r = 0; r < N; r++) if (!requested[r] && (teaseFrom < 0 || r <= teaseFrom)) stopAt[r] = Math.min(stopAt[r], elapsed);
                Reels.fast = true;
                Lever.release();
            } };
            const spinInterval = setInterval(() => {
                if (token !== spinToken) { clearInterval(spinInterval); return; }
                elapsed += 40;
                // emniyet: bir makara beklenenden çok geç kalırsa (ör. sekme arka plandaydı) sonucu doğrudan yerleştir
                if (elapsed > stopAt[N - 1] + 9000) {
                    for (let r = 0; r < N; r++) if (!landedR[r]) {
                        requested[r] = true;
                        if (drums[r]) { drums[r].onLand = null; drums[r].pending = false; drums[r].mode = 'idle'; }
                        for (let row = 0; row < Engine.ROWS; row++) { const m = meshAt(r, row); if (m) setFace(m, pending.g[r][row], false); }
                        onLand(r);
                    }
                    return;
                }
                for (let r = 0; r < N; r++) {
                    if (!requested[r] && elapsed >= stopAt[r]) {
                        requested[r] = true;
                        Reels.requestStop(r, pending.g[r], () => onLand(r));
                    }
                }
            }, 40);
        }

        function scheduleNextSpin(extraDelay) {
            if (!(freeActive() || gameState.autoSpinActive || gameState.rainPending)) return;
            const tryGo = () => {
                if (document.body.dataset.mode !== 'game') return;
                if (gameState.isSpinning) return;
                if (anyModalOpen()) { setTimeout(tryGo, 500); return; }
                if (gameState.rainPending && gameState.freeSpinsRemaining === 0 && !gameState.expandingSymbolId) { startCakeRain(); return; }
                if (!(freeActive() || gameState.autoSpinActive)) return;
                spinReels();
            };
            setTimeout(tryGo, (turboOn() ? 260 : 850) + (extraDelay || 0));
        }

        function finalizeSpin(pending) {
            if (pending.conv && pending.conv.cells.length && !pending.converted) {
                pending.converted = true;
                const ms = animateConvert(pending);
                setTimeout(() => finalizeSpin(pending), ms);
                return;
            }
            if (pending.conv && pending.conv.cells.length) pending.g = pending.conv.grid;
            const res = evaluateWins(pending);
            res.p = pending;
            if (pending.conv) res.matchaConv = pending.conv.cells.length;
            if (res.animMs) setTimeout(() => afterSpin(res), res.animMs);
            else afterSpin(res);
        }

        function afterSpin(res) {
            gameState.isSpinning = false;
            $('spin-btn').disabled = false;
            $('spin-btn').classList.remove('spinning');
            $('spin-lbl').textContent = L().ctl.spin;
            if (res.p) metaOnSpin(res, res.p);
            if (res.p && !res.p.ctx.inFS && !res.p.ctx.ovenRain) {
                orderTick(res);
                const sv = Game.save;   // Zaman İksiri: normal spinlerde azalır
                if (sv && sv.potion > 0) { sv.potion--; if (!sv.potion) refreshEff(); renderOrder(); }
            }

            if (addStamps(res.stamps)) setTimeout(() => { if (!$('modal-drink').classList.contains('open')) openDrinkChoice(); }, 450);
            addCupcakes(res.cupcakes);
            addMatchaWar(res.matchaConv || 0);

            // 3+ Reçete Kitabı (normal ya da pasta yağmuru spini): not defteri
            if (res.scatter >= 3 && !gameState.expandingSymbolId) {
                gameState.bonusBooks = res.scatter;          // 3'ten fazla her kitap: +1 free spin
                playSynthNote(950, 0.35);
                gameState.bonusLock = true;
                gameState.autoSpinActive = false; updateAutoSpinButtonUI();
                $('spin-btn').disabled = true;
                persist();
                setTimeout(() => whenNoModal(() => {
                    $('spin-btn').disabled = false;
                    triggerBonusGameIntro();
                }), res.total > 0 ? 1400 : 700);
                return;
            }
            let extra = 0;
            if (res.scatter >= 3 && gameState.expandingSymbolId) {
                gameState.freeSpinsRemaining += res.scatter;
                gameState.freeSpinsTotal += res.scatter;
                updateFsBadge();
                [988, 1175, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.07), i * 110));
                setMessage(tf(L().msg.retrig, { n: res.scatter }), true);
                celebrate(gameState.bet * 20);
                extra = 900;
            }

            if (gameState.freeSpinsRemaining === 0 && (gameState.expandingSymbolId || gameState.freeSpinsTotal > 0)) {
                const fsWin = gameState.fsWin || 0, fsMult = gameState.fsMult || 0, fsSym = gameState.expandingSymbolId || 'espresso';
                gameState.bonusLock = true;
                gameState.autoSpinActive = false; updateAutoSpinButtonUI();
                setTimeout(() => whenNoModal(() => { gameState.bonusLock = false; showFsDone(fsWin, fsMult, fsSym); }), 300);
                gameState.fsMult = 0; gameState.fsWin = 0;
                gameState.expandingSymbolId = null;
                gameState.freeSpinsTotal = 0;
                if (gameState.rainRemaining <= 0) { $('bonus-banner').classList.remove('show'); stopBonusMusic(); }
                updateFsBadge();
                updateHUD();
            }
            if (gameState.rainMode && gameState.rainRemaining === 0 && gameState.freeSpinsRemaining === 0) {
                gameState.rainMode = false;
                gameState.rainTotal = 0;
                $('bonus-banner').classList.remove('show');
                stopBonusMusic();
                updateFsBadge();
            }

            checkPhases();
            persist();
            updateHUD();

            if (!freeActive() && !gameState.rainPending) {
                if (gameState.balance < CHAPTERS[gameState.chapter].minBet) {
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    whenNoModal(showBust);
                    return;
                }
                if (!Game.save.finished && gameState.balance >= CHAPTERS[gameState.chapter].unlockAt && !gameState.goalAnnounced) {
                    gameState.goalAnnounced = true;
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    const b = $('buy-btn');
                    b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
                    showDialog('cozybear', castName('cozybear'), $('buy-wrap').dataset.tip || '');
                    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.25, 'sine', 0.07), i * 120));
                    return;
                }
                if (gameState.balance < CHAPTERS[gameState.chapter].unlockAt) gameState.goalAnnounced = false;
            }
            scheduleNextSpin(extra);
        }

        function evaluateWins(p) {
            const res = Engine.evaluate(p.g, p.ctx);
            const gain = res.total + res.cashback;
            gameState.balance += gain;
            if (p.ctx.inFS) { gameState.fsMult = res.fsMult; gameState.fsWin = (gameState.fsWin || 0) + gain; }
            if (!gameState.spinFree) gameState.streak = res.total > 0 ? 0 : (gameState.streak || 0) + 1;   // şans desteği serisi

            winningMeshRefs = [];
            const seen = new Set();
            const expanded = res.expanded || [];
            const markCell = (r, row, sym) => {
                const key = r + ',' + row;
                if (seen.has(key)) return;
                seen.add(key);
                const mesh = meshAt(r, row);
                if (!mesh) return;
                setFace(mesh, sym, true, false);
                winningMeshRefs.push(mesh);
            };
            res.marks.forEach(m => { if (expanded.indexOf(m.r) === -1) markCell(m.r, m.row, p.g[m.r][m.row]); });
            for (let r = 0; r < p.g.length; r++) for (let row = 0; row < Engine.ROWS; row++) {
                const id = p.g[r][row].id;
                if (id === 'stamp' || (id === 'cupcake' && gameState.chapter === 3)) markCell(r, row, p.g[r][row]);
            }

            res.animMs = 0;
            if (expanded.length) {
                const sym = SYMBOLS.find(s => s.id === p.ctx.expandingSymbolId);
                expanded.forEach((r, i) => {
                    setTimeout(() => {
                        for (let row = 0; row < Engine.ROWS; row++) {
                            gameState.grid[r][row] = sym;
                            const mesh = meshAt(r, row);
                            if (!mesh) continue;
                            setFace(mesh, sym, true, false);
                            mesh.userData = mesh.userData || {};
                            mesh.userData.popStart = Date.now() + row * 60;
                            if (winningMeshRefs.indexOf(mesh) === -1) winningMeshRefs.push(mesh);
                        }
                        playSynthNote(523 + i * 110, 0.2, 'triangle', 0.06);
                        playSynthNote(1046 + i * 220, 0.12, 'sine', 0.035);
                        setTease(r, true); flashLights();
                        setTimeout(() => setTease(r, false), 900);
                    }, (350 + i * 380) * (turboOn() ? 0.6 : 1));
                });
                res.animMs = (350 + expanded.length * 380 + 300) * (turboOn() ? 0.6 : 1);
                setMessage(tf(L().msg.expandTitle, { s: symName(sym.id) }), true);
            }

            updateHUD();
            const M = L().msg;
            const parts = [];
            if (res.mult > 1 && res.total > 0) parts.push(M.americano);
            if (res.lineTotal > 0) parts.push(tf(M.win, { v: fmt(res.lineTotal) }));
            if (res.expandPay > 0) parts.push(tf(M.expand, { n: expanded.length, v: fmt(res.expandPay) }));
            if (res.foamMult > 1) parts.push(tf(M.foam, { v: fmtX(res.foamMult) }));
            if (res.latte > 0) parts.push(tf(M.latte, { v: fmt(res.latte) }));
            if (res.harvest > 0) parts.push(tf(M.harvest, { n: res.bags, v: fmt(res.harvest) }));
            const extras = [];
            if (res.cashback > 0) extras.push(tf(M.cash, { v: fmt(res.cashback) }));
            if (res.stamps > 0 && CHAPTERS[gameState.chapter].loyalty) extras.push(tf(M.stamps, { n: res.stamps }));
            if (res.cupcakes > 0 && gameState.chapter === 3 && !p.ctx.ovenRain) extras.push(tf(M.cupcakes, { n: res.cupcakes }));

            const show = () => {
                if (res.total > 0) {
                    playSynthNote(850, 0.35);
                    if (res.foamMult > 1 || res.latte > 0 || res.expandPay > 0 || res.harvest > 0) [988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), 120 + i * 120));
                    let msg = parts.join('  ·  ') + ' ' + M.beans;
                    if (extras.length) msg += '  ·  ' + extras.join('  ·  ');
                    if (res.matcha > 0 && res.pitcher === 0 && res.foamMult === 1) msg += '  ' + M.matchaHint;
                    setMessage(msg, true);
                    celebrate(res.total);
                } else if (extras.length) {
                    setMessage(extras.join('  ·  '));
                } else if (res.matcha > 0 && res.pitcher === 0) {
                    setMessage(M.matchaAlone);
                } else {
                    setMessage(M.brewed);
                }
            };
            if (res.animMs) setTimeout(show, res.animMs - 200); else show();
            // kazanç sayacı + çarpan çekirdekleri + büyük kazanç
            res.animMs = presentWin(res, p, res.animMs);
            return res;
        }

        /* ---------- HEDİYE EKONOMİSİ: 6 saatte bir ücretsiz hediye · istediğin an reklam izle ---------- */
        const GIFT_MS = 6 * 3600 * 1000, VIDEO_CD = 60 * 1000;   // v7: gerçek ödüllü reklam — dakikada en fazla bir video
        // 1.000 çekirdek; Final'de en düşük bahis 2.000 olduğu için hediye en az bir spin'e yetecek kadardır
        /* video ve 6 saatlik hediye: bulunduğun bölümün BAŞLANGIÇ tutarı kadar
           (ör. 100.000'e ulaşıp 80.000'e yeni bölümü açınca başlangıç 20.000'dir) */
        function chapterStart(n) {
            const C = CHAPTERS[n];
            if (!C) return 1000;
            if (n === 1) return C.seed;
            if (C.saga) return C.start;
            const P = CHAPTERS[n - 1];
            return Math.max(C.minBet, P.unlockAt - P.price);
        }
        function giftAmt() { return Math.max(1000, chapterStart(gameState.chapter || (Game.save && Game.save.stage) || 1)); }
        let bustTimer = null;
        function giftLeft() { const sv = Game.save; if (!sv) return GIFT_MS; return Math.max(0, (sv.lastGift || sv.created || Date.now()) + GIFT_MS - Date.now()); }
        function videoLeft() { return Math.max(0, ((Game.save && Game.save.lastVideo) || 0) + VIDEO_CD - Date.now()); }
        function fmtTime(ms) { const t = Math.ceil(ms / 1000), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), sec = t % 60; return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':'); }
        function refreshBank() {
            if (document.body.dataset.mode === 'game') updateHUD();
            if (document.body.dataset.screen === 'screen-map') $('map-bank').innerHTML = `${beanIc()} ${fmt(gameState.balance)}`;
            if ($('modal-store').classList.contains('open')) buildStore();
        }
        function checkDailyGift() {
            const sv = Game.save;
            if (!sv || gameState.isSpinning) return;
            if (giftLeft() > 0) return;
            const v = giftAmt();
            gameState.balance += v;
            sv.lastGift = Date.now();
            persist();
            refreshBank();
            showDialog('cozybear', castName('cozybear'), tf(L().gift.got, { v: fmt(v) }));
            if (typeof Notify !== 'undefined') Notify.plan();
            if ($('modal-bust').classList.contains('open') && gameState.balance >= CHAPTERS[gameState.chapter].minBet) closeBust();
        }
        /* Kasa boşalırsa: her bölümde bir kez Kahve Dede yedek depodan çekirdek verir (oyuncu 6 saat beklemek zorunda kalmasın;
           Saga'nın büyük bölümlerinde en düşük bahisle yeniden tırmanmak imkânsızlaşıyordu). İkinci iflasta hediye/video ekranı. */
        function sagaRescue() {
            const sv = Game.save, n = gameState.chapter, C = CHAPTERS[n];
            if (!sv || sv.finished) return false;
            sv.rescued = sv.rescued || {};
            if (sv.rescued[n]) return false;
            sv.rescued[n] = 1;
            const v = Math.round((C.saga ? C.start : C.seed) * 0.5);
            gameState.balance += v;
            gameState.bet = recommendedBet(n, gameState.balance);
            persist(); refreshBank();
            showDialog('dede', castName('dede'), tf(L().bust.rescue, { v: fmt(v) }));
            return true;
        }
        function showBust() {
            if (sagaRescue()) return;
            const B = L().bust;
            $('bust-title').textContent = B.t;
            $('bust-text').innerHTML = tf(B.txt, { v: fmt(giftAmt()) });
            $('bust-wait').textContent = B.wait;
            $('bust-store').textContent = L().store.open;
            const tick = () => {
                $('bust-timer').textContent = fmtTime(giftLeft());
                if (giftLeft() === 0) checkDailyGift();
                const vl = videoLeft(), vb = $('bust-video');
                vb.disabled = vl > 0;
                vb.textContent = vl > 0 ? tf(L().store.wait, { t: Math.ceil(vl / 1000) }) : tf(B.video, { v: fmt(giftAmt()) });
            };
            tick();
            clearInterval(bustTimer); bustTimer = setInterval(tick, 1000);
            openModal('modal-bust');
            [330, 262, 196].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.25, 'triangle', 0.05), i * 140));
        }
        function closeBust() { clearInterval(bustTimer); bustTimer = null; closeModal('modal-bust'); }
        /* Şimdilik gerçek reklam yok: her basışta anında ödül (30 sn bekleme ile). Reklam SDK'sı gelince burası onu çağıracak. */
        let videoBusy = false;
        function watchVideo() {
            if (!Game.save || videoLeft() > 0 || videoBusy) return;
            videoBusy = true;
            Ads.rewarded().then(ok => { videoBusy = false; if (ok) grantVideo(); if (document.body.dataset.mode === 'game' && !isMuted) startCasinoMusic(); }).catch(() => { videoBusy = false; });
        }
        function grantVideo() {
            if (!Game.save) return;
            const v = giftAmt();
            gameState.balance += v;
            Game.save.videos = (Game.save.videos || 0) + 1;
            Game.save.lastVideo = Date.now();
            if (gameState.balance >= CHAPTERS[gameState.chapter].minBet && $('modal-bust').classList.contains('open')) {
                gameState.bet = recommendedBet(gameState.chapter, gameState.balance);
                closeBust();
            }
            persist();
            refreshBank();
            [523, 659, 784].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), i * 100));
            if (document.body.dataset.mode === 'game') { setMessage(tf(L().gift.video, { v: fmt(v) }), true); celebrate(Math.max(gameState.bet, 1) * 10); }
            else achToast('goldenbean', tf(L().gift.video, { v: fmt(v) }), '');
        }
        /* ---------- MAĞAZA ---------- */
        let storeTimer = null;
        function openStore() {
            if (!Game.save) { showDialog('barista', 'Bearista', L().hub.needSave); return; }
            closeModal('modal-bust');
            playSynthNote(560, 0.06);
            buildStore();
            clearInterval(storeTimer); storeTimer = setInterval(() => { if ($('modal-store').classList.contains('open')) buildStore(); else clearInterval(storeTimer); }, 1000);
            openModal('modal-store');
        }
        function buildStore() {
            const S = L().store, vl = videoLeft(), gl = giftLeft();
            $('sto-title').textContent = S.title;
            $('sto-bank').innerHTML = `${beanIc()} ${fmt(gameState.balance)}`;
            const soon = S.soon.slice(3).map(([ic, n, d]) => `<div class="st-card soon"><span class="si">${ic}</span><div class="sb"><b>${n}</b><small>${d}</small></div><span class="st-tag">${S.soonTag}</span></div>`).join('');
            $('sto-list').innerHTML = `
                <div class="st-card hot"><span class="si">🎬</span><div class="sb"><b>${S.video}</b><small>${tf(S.videoTxt, { v: fmt(giftAmt()) })}</small></div>
                  <button class="btn btn-sm btn-green" ${vl > 0 ? 'disabled' : ''} onclick="watchVideo()">${vl > 0 ? tf(S.wait, { t: Math.ceil(vl / 1000) }) : '+' + fmt(giftAmt())}</button></div>
                <div class="st-card"><span class="si">⏰</span><div class="sb"><b>${S.free}</b><small>${tf(S.freeTxt, { v: fmt(giftAmt()) })}</small></div>
                  <span class="st-tag t2">${gl > 0 ? fmtTime(gl) : S.ready}</span></div>
                <div class="st-card hot inv-card"><span class="si">🤝</span><div class="sb"><b>${PX().invT}</b><small>${PX().invCard}</small></div><button class="btn btn-sm btn-green" onclick="openInvite()">${PX().invShare}</button></div>
                ${storePremium()}
                ${storeTreasure()}
                ${storeEra()}
                ${storeLevers()}
                ${storeLooks()}
                <h4 class="st-h">${S.soonT}</h4>${soon}`;
        }
        function bustWait() {
            closeBust();
            setMessage(tf(L().bust.waitMsg, { t: fmtTime(giftLeft()) }));
        }

        /* ---------- ÇARPAN ÇEKİRDEKLERİ (Gates of Olympus tarzı) ---------- */
        let orbsDropped = false;
        function orbTier(v) { return v >= 50 ? 'o4' : v >= 25 ? 'o3' : v >= 5 ? 'o2' : 'o1'; }
        function clearOrbs() { const l = $('orb-layer'); if (l) l.innerHTML = ''; }
        let orbsReadyAt = 0;
        function dropOrbs(pending) {
            if (orbsDropped) return;
            orbsDropped = true;
            const layer = $('orb-layer');
            const N = pending.g.length, used = new Set();
            const fast = turboOn();
            Dede.mount();
            Dede.intro();
            let last = 0;
            pending.ctx.orbs.forEach((v, i) => {
                let r, row, k = 0;
                do { r = Math.floor(Math.random() * N); row = Math.floor(Math.random() * Engine.ROWS); k++; } while (used.has(r + ',' + row) && k < 20);
                used.add(r + ',' + row);
                const pos = cellScreenPos(r, row);
                const el = document.createElement('div');
                el.className = 'orb ' + orbTier(v);
                el.style.left = pos.x + '%'; el.style.top = pos.y + '%';
                el.innerHTML = cupSVG(orbTier(v)) + `<span>×${v}</span>`;
                el.dataset.v = v;
                last = Dede.cast(i, v, pos, el, fast);   // Kahve Dede cezvesinden fırlatır
                layer.appendChild(el);
            });
            if (pending.gift) setTimeout(() => Dede.say(L().dede.gift, 1800), 200);
            orbsReadyAt = performance.now() + last + 450;
        }
        /* Kazanç sunumu: sayaç → (varsa) çarpanlar sayaca uçar → büyük kazanç penceresi. Toplam süreyi döndürür. */
        function presentWin(res, p, startMs) {
            const pop = $('win-pop'), orbsEls = [...$('orb-layer').querySelectorAll('.orb')];
            const bet = p.ctx.bet, fast = turboOn(), k = fast ? 0.45 : 1;
            const orbWait = () => Math.max(0, orbsReadyAt - performance.now());
            if (res.total <= 0) {
                if (orbsEls.length) setTimeout(() => orbsEls.forEach(o => o.classList.add('fade')), Math.max(startMs + 500 * k, orbWait() + 300));
                return startMs;
            }
            let t = startMs;
            const count = (from, to, ms, el) => {
                const t0 = performance.now();
                const step = () => {
                    const u = Math.min(1, (performance.now() - t0) / ms);
                    el.textContent = '+' + fmt(from + (to - from) * (1 - Math.pow(1 - u, 2)));
                    if (u < 1) requestAnimationFrame(step);
                };
                step();
            };
            const showMul = res.orbX > 1;
            const ratio = res.total / Math.max(1, bet);
            setTimeout(() => {
                pop.classList.remove('show', 'mul'); void pop.offsetWidth;
                pop.classList.add('show');
                $('wp-x').textContent = '';
                count(0, showMul ? res.baseWin : res.total, 650 * k, $('wp-v'));
                playSynthNote(784, 0.12, 'sine', 0.05);
            }, t);
            t += 750 * k;
            if (showMul) {
                t = Math.max(t, orbWait() + 150);
                setTimeout(() => {
                    orbsEls.forEach(o => { o.classList.add('fly'); });
                    playSynthNote(1319, 0.15, 'sine', 0.06);
                    Dede.give(res.orbX, res.orbX >= 10 || ratio >= 15);
                }, t);
                t += 650 * Math.max(k, 0.6);
                setTimeout(() => {
                    pop.classList.add('mul');
                    $('wp-x').textContent = '×' + res.orbX;
                    const z = $('zap'); z.classList.remove('on'); void z.offsetWidth; z.classList.add('on');
                    [988, 1319, 1760].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.18, 'sine', 0.07), i * 90));
                    count(res.baseWin, res.total, 900 * k, $('wp-v'));
                    clearOrbs();
                    if (p.ctx.inFS) updateBanner();
                }, t);
                t += 1100 * k;
            } else if (orbsEls.length) setTimeout(() => orbsEls.forEach(o => o.classList.add('fade')), Math.max(t, orbWait() + 300));
            setTimeout(() => pop.classList.remove('show'), t + 1300 * k);
            if (ratio >= 15) setTimeout(() => showBigWin(res.total, ratio), t + 200 * k);
            return t + 300 * k;
        }
        function showBigWin(amount, ratio) {
            const tiers = L().bigwin;
            const tier = ratio >= 100 ? 2 : ratio >= 40 ? 1 : 0;
            $('bw-title').textContent = tiers[tier];
            $('bigwin-box').className = 'bigwin t' + tier;
            const el = $('bw-amount');
            el.textContent = '0';
            $('bw-tap').textContent = L().bigwinTap;
            openModal('modal-bigwin');
            const dur = (1800 + tier * 900) * (turboOn() ? 0.5 : 1), t0 = performance.now();
            jackpotShow(tier, 3.2 + tier * 0.9);
            let lastTick = 0, done = false;
            const step = () => {
                if (!$('modal-bigwin').classList.contains('open')) return;
                const u = Math.min(1, (performance.now() - t0) / dur);
                el.textContent = fmt(amount * (1 - Math.pow(1 - u, 3)));
                if (performance.now() - lastTick > 90 && u < 1) { lastTick = performance.now(); playSynthNote(700 + u * 900, 0.05, 'triangle', 0.04); }
                if (u < 1) requestAnimationFrame(step);
                else if (!done) { done = true; bigWinTimer = setTimeout(closeBigWin, turboOn() ? 1400 : 2200); }
            };
            step();
            celebrate(amount * 3);
            setTimeout(() => celebrate(amount * 3), 700);
            bigWinAmount = amount;
        }
        let bigWinTimer = null, bigWinAmount = 0;
        /* büyük kutlama: fanfar + vuruşlarla senkron ekran parlaması + gökkuşağı ampuller */
        let jpTimers = [];
        function jackpotShow(tier, sec) {
            jackpotStop(true);
            sec = sec || (3.2 + tier * 0.9);
            const beats = playJackpot(tier, sec);
            let fl = $('jp-flash');
            if (!fl) { fl = document.createElement('div'); fl.id = 'jp-flash'; fl.setAttribute('aria-hidden', 'true'); document.body.appendChild(fl); }
            const soft = !!Settings.motion || lowFx();
            document.body.classList.add('jackpot');
            beats.forEach((ms, i) => jpTimers.push(setTimeout(() => {
                fl.style.setProperty('--h', (i * 47) % 360);
                fl.classList.remove('on', 'soft'); void fl.offsetWidth; fl.classList.add('on'); if (soft) fl.classList.add('soft');
                if (i % 3 === 0 && typeof flashLights === 'function') flashLights();
            }, ms)));
            if (typeof celebrateLights === 'function') celebrateLights(sec * 1000 + 600);
            jpTimers.push(setTimeout(() => jackpotStop(false), sec * 1000 + 900));
        }
        function jackpotStop(silent) {
            jpTimers.forEach(clearTimeout); jpTimers = [];
            document.body.classList.remove('jackpot');
            const fl = $('jp-flash'); if (fl) fl.classList.remove('on');
            if (silent) return;
        }
        function closeBigWin() {
            const el = $('bw-amount');
            if ($('modal-bigwin').classList.contains('open') && el.textContent !== fmt(bigWinAmount)) { el.textContent = fmt(bigWinAmount); return; }
            clearTimeout(bigWinTimer);
            closeModal('modal-bigwin');
            stopJackpot(); jackpotStop();
        }
        function showFsDone(win, mult, sym) {
            const F = L().fsdone;
            $('fd-title').textContent = F.t;
            $('fd-sub').textContent = F.txt;
            $('fd-mult').textContent = mult > 0 ? tf(F.mult, { v: mult }) : '';
            $('fd-ok').textContent = F.ok;
            $('fd-img').src = ASSETS.sym[(SYMBOLS.find(s => s.id === sym) || SYMBOLS[0]).img];
            const el = $('fd-amount'); el.textContent = '0';
            openModal('modal-fsdone');
            const t0 = performance.now();
            const step = () => { const u = Math.min(1, (performance.now() - t0) / 1500); el.textContent = fmt(win * (1 - Math.pow(1 - u, 3))); if (u < 1) requestAnimationFrame(step); };
            step();
            const ratio = win / Math.max(1, gameState.bet);
            jackpotShow(ratio >= 100 ? 2 : ratio >= 40 ? 1 : 0);
            if (win > 0) celebrate(win);
        }

        function celebrate(amount) {
            if (document.body.dataset.mode !== 'game') return;
            if (typeof flashLights === 'function') flashLights();
            const layer = $('fx-layer');
            const ratio = amount / Math.max(1, gameState.bet);
            let count = ratio >= 20 ? 34 : ratio >= 5 ? 20 : 9;
            if (lowFx()) count = Math.ceil(count / 3);
            const pool = ['cupcake', 'croissant', 'cake', 'goldenbean', 'bloom', 'leaf', 'coffeebag', 'espresso'];
            while (layer.children.length > 70) layer.removeChild(layer.firstChild);
            for (let i = 0; i < count; i++) {
                const im = document.createElement('img');
                im.className = 'fall';
                im.src = ASSETS.sym[pool[Math.floor(Math.random() * pool.length)]];
                const size = 34 + Math.random() * 38;
                im.style.width = size + 'px';
                im.style.left = (Math.random() * 96) + '%';
                const dur = 1.8 + Math.random() * 1.6;
                im.style.animationDuration = dur + 's';
                im.style.animationDelay = (Math.random() * 0.7) + 's';
                layer.appendChild(im);
                setTimeout(() => im.remove(), (dur + 0.9) * 1000);
            }
        }

        /* =====================================================
           BONUS (not defteri)
           ===================================================== */
        let nbTimers = [];
        function nbLater(fn, ms) { const t = setTimeout(fn, ms); nbTimers.push(t); return t; }
        function nbClear() { nbTimers.forEach(clearTimeout); nbTimers = []; }

        function extraBooks() { return Math.max(0, (gameState.bonusBooks || 0) - 3); }
        function fsTotalNext() { return nextFreeSpins() + extraBooks(); }
        function triggerBonusGameIntro() {
            metaEvent('fs');
            const eligibleSymbols = SYMBOLS.filter(s => s.id !== 'book');
            const randomSym = eligibleSymbols[Math.floor(Math.random() * eligibleSymbols.length)];
            gameState.expandingSymbolId = randomSym.id;
            $('nb-title').textContent = L().nb.title;
            $('nb-cover').innerHTML = L().nb.cover;
            $('nb-back').textContent = L().nb.back; $('nb-back-a').textContent = L().nb.backTop;
            $('bonus-start-btn').textContent = L().nb.start;
            openModal('modal-bonus-intro');
            runNotebookReveal(randomSym, eligibleSymbols);
        }

        function runNotebookReveal(finalSym, pool) {
            nbClear();
            const book = $('nb-book'), card = $('nb-card'), icon = $('notebook-symbol-icon'), name = $('notebook-symbol-name'), text = $('notebook-text'), btn = $('bonus-start-btn');
            const leaf = $('rb-leaf'), leftImg = $('rb-left-img'), lf = $('rb-leaf-f'), lb = $('rb-leaf-b');
            book.classList.remove('open', 'flipping');
            leaf.classList.remove('go');
            card.classList.remove('landed'); $('bk-scene').classList.remove('landed');
            card.querySelectorAll('.nb-spark').forEach(n => n.remove());
            icon.removeAttribute('src'); leftImg.removeAttribute('src');
            name.textContent = '?';
            text.textContent = L().nb.found;
            btn.disabled = true;
            nbLater(() => { playPageFlip(); book.classList.add('open'); }, 500);
            nbLater(() => playBell(1568, 0, 0.03, 1.6), 1300);
            /* Book of Ra tarzı: sayfalar hızla çevrilir, her sayfada bir sembol; giderek yavaşlar ve seçilen sembolde durur */
            let cur = null;
            const flipTo = (sym, d) => {
                const prev = cur; cur = sym;
                if (prev) { lf.src = ASSETS.sym[prev.img]; lb.src = ASSETS.sym[prev.img]; }
                else { lf.removeAttribute('src'); lb.removeAttribute('src'); }
                icon.src = ASSETS.sym[sym.img];   // alttaki yeni sayfa
                leaf.style.setProperty('--d', Math.round(d) + 'ms');
                leaf.classList.remove('go'); void leaf.offsetWidth; leaf.classList.add('go');
                nbLater(() => { if (prev) leftImg.src = ASSETS.sym[prev.img]; else leftImg.removeAttribute('src'); }, d * 0.85);
            };
            nbLater(() => {
                text.textContent = L().nb.picking;
                book.classList.add('flipping');
                let delay = 70, step = 0, last = null;
                const total = 24;
                const tick = () => {
                    step++;
                    let sym;
                    if (step >= total) sym = finalSym;
                    else { do { sym = pool[Math.floor(Math.random() * pool.length)]; } while (sym === last || (step === total - 1 && sym === finalSym)); }
                    last = sym;
                    const d = Math.max(90, Math.min(520, delay * 0.95));
                    flipTo(sym, d);
                    name.textContent = '...';
                    if (delay > 140 || step % 2) playPageFlip(); else playHoloTick(step);
                    if (step >= total) { nbLater(() => { name.textContent = symName(finalSym.id); landed(); }, d); return; }
                    delay = step > 15 ? delay * 1.24 : delay * 1.04;
                    nbLater(tick, delay);
                };
                tick();
            }, 500 + 2300);
            function landed() {
                card.classList.remove('shuffling');
                card.classList.add('landed'); $('bk-scene').classList.add('landed');
                playBellCelebration();
                flashLights();
                ['✨', '⭐', '🤎', '✨', '⭐', '✨', '🤎', '✨', '⭐', '✨'].forEach((st, i, arr) => {
                    const sp = document.createElement('span');
                    sp.className = 'nb-spark';
                    sp.textContent = st;
                    const ang = (i / arr.length) * Math.PI * 2 + Math.random() * 0.4;
                    const dist = 70 + Math.random() * 40;
                    sp.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
                    sp.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
                    card.appendChild(sp);
                    setTimeout(() => sp.remove(), 1100);
                });
                celebrate(gameState.bet * 25);
                text.innerHTML = tf(L().nb.result, { s: symName(finalSym.id), n: fsTotalNext() + (extraBooks() ? ' ' + tf(L().nb.extra, { k: extraBooks() }) : ''), f: gameState.loy.filtre ? L().nb.filtre : '', min: Engine.expandMin(finalSym) });
                nbLater(() => { btn.disabled = false; }, 500);
            }
        }

        function startFreeSpinSequence() {
            if (gameState.freeSpinsRemaining > 0 && gameState.freeSpinsTotal > 0 && gameState.expandingSymbolId) return;   // çift tıklama
            nbClear();
            closeModal('modal-bonus-intro');
            gameState.bonusLock = false;
            if (!gameState.expandingSymbolId) gameState.expandingSymbolId = SYMBOLS.filter(s => s.id !== 'book')[0].id;
            const n = fsTotalNext();
            gameState.bonusBooks = 0;
            if (gameState.loy.filtre) { gameState.loy.filtre = false; updateLoyaltyUI(); }
            gameState.freeSpinsRemaining = n;
            gameState.freeSpinsTotal = n;
            gameState.fsMult = 0;
            gameState.fsWin = 0;
            $('bonus-banner').classList.add('show');
            updateFsBadge();
            updateHUD();
            startBonusMusic();
            persist();
            setTimeout(() => { spinReels(); }, 300);
        }

        /* =====================================================
           BARİSTA ATÖLYESİ (kasadaki çekirdekle)
           ===================================================== */
        let shopTab = 'symbol';
        function openShop() {
            if (!Game.save) return;
            playSynthNote(560, 0.08);
            hideTutorial();
            buildShop();
            openModal('modal-shop');
        }
        function closeShop() {
            closeModal('modal-shop');
            if ($('modal-info').classList.contains('open')) buildPayTable();
            if (document.body.dataset.mode === 'game') syncReels();
            if (document.body.dataset.screen === 'screen-map') $('map-bank').innerHTML = `${beanIc()} ${fmt(gameState.balance)}`;
            if (Game.save) updateHUD();
        }
        function setShopTab(id) { shopTab = id; playSynthNote(520, 0.04); buildShop(); }

        function buildShop() {
            const S = L().shop;
            $('shop-title').textContent = S.title;
            $('shop-bank').innerHTML = `${S.bank}: ${beanIc()} ${fmt(gameState.balance)}`;
            const tabs = $('shop-tabs');
            tabs.innerHTML = '';
            ['symbol', 'skill', 'special', 'late', 'era', 'lever'].forEach(id => {
                const b = document.createElement('button');
                b.className = 'tab' + (id === shopTab ? ' on' : '');
                if (id === 'era') b.innerHTML = ICON.hourglass(16) + ' ' + S.tabs[id]; else b.textContent = S.tabs[id];
                b.onclick = () => setShopTab(id);
                tabs.appendChild(b);
            });
            const list = $('shop-list');
            list.innerHTML = '';
            if (shopTab === 'lever') { buildLeverShop(list); return; }
            const ups = Engine.UPGRADES.filter(u => u.group === shopTab).sort((a, b) => (a.unlock || 0) - (b.unlock || 0) || (a.group === 'symbol' ? a.baseCost - b.baseCost : 0));
            const note = (txt) => { const p = document.createElement('p'); p.className = 'shop-lock'; p.textContent = txt; list.appendChild(p); };
            if (gameState.isSpinning) note(S.spinWait);
            if (shopTab === 'special' && ups.some(u => !stageUnlocked(u.unlock || 1))) note(S.lockSpecial);
            if (shopTab === 'late') note(stageUnlocked(4) ? S.lateInfo : S.lockLate);
            if (shopTab === 'era') note(stageUnlocked(Engine.SAGA_FIRST) ? ST().upInfo : ST().upLock);
            ups.forEach(u => {
                const lvl = upLevel(u.id);
                const locked = u.unlock && !stageUnlocked(u.unlock);
                const maxed = lvl >= u.max;
                const cost = maxed ? 0 : Engine.upgradeCost(u, lvl);
                const card = document.createElement('div');
                card.className = 'up-card' + (locked ? ' locked' : '') + (maxed ? ' maxed' : '') + (u.id === 'lx_reel6' ? ' big' : '');
                const im = document.createElement('img');
                im.src = ASSETS.sym[u.icon]; im.alt = '';
                const body = document.createElement('div');
                body.className = 'ub';
                let pips = '';
                for (let i = 0; i < u.max; i++) pips += `<i class="${i < lvl ? 'on' : ''}"></i>`;
                const only = { sp_pitcher: 2, sp_latte: 2, sp_foam: 2, sp_matcha: 2, sp_oven: 3, sp_rain: 3, sp_bag: 4, sp_bagrate: 4 }[u.id];
                body.innerHTML = `<b>${upName(u)}</b><span class="pips">${pips}</span>` + (only ? `<small class="only">📍 ${tf(L().shop.onlyAt, { place: L().stage[only].place })}</small>` : '') +
                    `<small class="cur">${upDesc(u, lvl)}</small>` +
                    (maxed ? `<small class="nxt">${S.maxed}</small>` : `<small class="nxt">➜ ${upDesc(u, lvl + 1)}</small>`);
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm' + (maxed ? ' btn-green' : '');
                if (locked) { btn.textContent = `🔒 ${u.unlock >= Engine.SAGA_FIRST ? ST().chWord : L().stageWord} ${u.unlock}`; btn.disabled = true; }
                else if (maxed) { btn.textContent = S.max; btn.disabled = true; }
                else {
                    btn.innerHTML = `${fmt(cost)} ${beanIc()}`;
                    btn.disabled = gameState.balance < cost || gameState.isSpinning;
                    btn.onclick = () => buyUpgrade(u.id);
                }
                card.append(im, body, btn);
                list.appendChild(card);
            });
            let total = 0, have = 0;
            Engine.UPGRADES.forEach(u => { total += u.max; have += upLevel(u.id); });
            $('shop-progress').textContent = tf(S.power, { have, total });
            $('shop-foot').textContent = S.foot;
        }

        /* Atölye › Kol: slot makinesi kolu tasarımları */
        function buildLeverShop(list) {
            const S = L().shop, V = L().lever, C = L().cosm;
            let h = `<p class="shop-lock lv-note">${V.note}</p>`;
            COSM.lever.forEach(it => {
                const own = cosmUnlocked('lever', it.id), on = cosmEquipped('lever') === it.id, p = it.buy ? cosmPrice('lever', it.id) : 0;
                const act = on ? `<button class="btn btn-sm btn-green" disabled>${C.worn}</button>`
                    : own ? `<button class="btn btn-sm" onclick="equipCosm('lever','${it.id}');buildShop()">${it.id === 'yok' ? V.remove : C.wear}</button>`
                    : `<button class="btn btn-sm" ${!cosmAfford('lever', it.id) || gameState.isSpinning ? 'disabled' : ''} onclick="buyCosm('lever','${it.id}')">${fmt(p)} ${beanIc()}</button>`;
                h += `<div class="up-card lv ${on ? 'maxed' : ''}">${it.id === 'yok' ? '<span class="lv-none">🚫</span>' : leverSVG(it.id)}<div class="ub"><b>${V.names[it.id]}</b><small class="cur">${V.desc[it.id]}</small></div>${act}</div>`;
            });
            list.innerHTML = h;
            $('shop-progress').textContent = '';
            $('shop-foot').textContent = V.foot;
        }

        function buyUpgrade(id) {
            const u = Engine.UPGRADES.find(x => x.id === id);
            const lvl = upLevel(id);
            if (!u || lvl >= u.max || gameState.isSpinning) return;
            const cost = Engine.upgradeCost(u, lvl);
            if (gameState.balance < cost) return;
            gameState.balance -= cost;
            Game.save.ups[id] = lvl + 1;
            refreshEff();
            persist();
            [784, 988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.06), i * 80));
            if (id === 'lx_reel6') showDialog('barista', 'Bearista', L().reel6Said);
            checkBadges();
            buildShop();
            if (document.body.dataset.mode === 'game') { updateHUD(); updateOvenUI(); }
        }
