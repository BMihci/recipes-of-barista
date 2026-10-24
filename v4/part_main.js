        /* =====================================================
           EKRANLAR / MODALLAR
           ===================================================== */
        const $ = id => document.getElementById(id);
        const ALL_SCREENS = ['screen-menu', 'screen-story', 'screen-game', 'screen-highscores'];
        const ALL_MODALS = ['modal-gameover', 'modal-cashout', 'modal-bonus-intro', 'modal-info', 'modal-name', 'modal-chapter-intro', 'modal-chapter-done', 'modal-shop', 'modal-chapters', 'modal-confirm', 'modal-drink'];

        function switchScreen(screenId) {
            playSynthNote(650, 0.05);
            ALL_SCREENS.forEach(id => { const el = $(id); if (el) el.classList.remove('active'); });
            const target = $(screenId);
            if (target) target.classList.add('active');

            const isGame = screenId === 'screen-game';
            document.body.dataset.screen = screenId;
            document.body.dataset.mode = isGame ? 'game' : 'menu';
            $('bg-menu').classList.toggle('on', !isGame);
            $('bg-game').classList.toggle('on', isGame);
            if (screenId !== 'screen-story' && typeof StoryPlayer !== 'undefined') StoryPlayer.stop();

            if (isGame) {
                startCasinoMusic();
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    const go = () => initThreeJS();
                    if (assetsReady) go(); else preloadPromise.then(go);
                }));
            } else {
                stopRender();
                $('dialog-toast').classList.remove('show');
            }
            if (!isGame) $('fx-layer').innerHTML = '';
            updateWalletUI();
            const stage = $('stage');
            if (stage) stage.scrollTop = 0;
        }

        function openModal(id) { $(id).classList.add('open'); }
        function closeModal(id) { $(id).classList.remove('open'); }
        function anyModalOpen() { return !!document.querySelector('.modal.open'); }
        /* Açık pencere yoksa çalıştır; varsa kapanmasını bekle */
        function whenNoModal(fn) {
            const go = () => { if (anyModalOpen()) { setTimeout(go, 350); return; } fn(); };
            go();
        }

        /* ---------- ONAY PENCERESİ ---------- */
        function confirmBox(opts) {
            $('cf-title').textContent = opts.title;
            $('cf-text').innerHTML = opts.text;
            const art = $('cf-art'); art.innerHTML = '';
            (opts.art || []).forEach(k => { const im = document.createElement('img'); im.src = ASSETS.sym[k]; im.alt = ''; art.appendChild(im); });
            const ok = $('cf-ok');
            ok.textContent = opts.ok;
            ok.onclick = () => { closeModal('modal-confirm'); opts.onOk(); };
            playSynthNote(420, 0.08, 'triangle', 0.05);
            openModal('modal-confirm');
        }

        function showNameModal() {
            playSynthNote(500, 0.05);
            $('player-name-input').value = gameState.playerName;
            openModal('modal-name');
        }
        function closeNameModal() { closeModal('modal-name'); }

        /* ---------- ÖDEME TABLOSU (etkin çarpanlarla) ---------- */
        function buildPayTable() {
            const grid = $('pay-grid');
            grid.innerHTML = '';
            const ch = CHAPTERS[gameState.chapter] || CHAPTERS[1];
            const E = RUN_EFF;
            SYMBOLS.forEach(sym => {
                const card = document.createElement('div');
                card.className = 'pay-card';
                const im = document.createElement('img');
                im.src = ASSETS.sym[sym.img];
                im.alt = sym.name;
                const nm = document.createElement('div');
                nm.className = 'nm';
                nm.textContent = sym.name + (sym.isScatter ? ' (Wild)' : '');
                const vals = document.createElement('div');
                vals.className = 'vals';
                const mult = E.symMult[sym.id] * ch.payScale * (ch.boost[sym.id] || 1) * (E.payBonus || 1);
                const counts = (E.reels === 6 ? [6, 5, 4, 3, 2] : [5, 4, 3, 2]);
                vals.innerHTML = counts.map(n => {
                    const v = n === 6 ? (sym.values[5] || 0) * 2.5 : sym.values[n];
                    return v ? `${n}x: ${fmtX(v * mult)}` : '';
                }).filter(Boolean).join('<br>');
                if (E.symMult[sym.id] > 1) vals.innerHTML += `<br><span class="up">⬆ ×${fmtX(E.symMult[sym.id])}</span>`;
                card.append(im, nm, vals);
                grid.appendChild(card);
            });
            const rate = Math.round(((ch.beanRate || 0.02) * 1000)) / 10;
            $('info-rules').innerHTML =
                `Soldan sağa aktif hatlar üzerinde eşleşen semboller kazanç sağlar. Değerler <b>çizgi bahsi (bahis ÷ 10)</b> ile çarpılır. ` +
                `<b>Reçete Kitabı</b> hem Wild hem Scatter: 3 Reçete Kitabı = <b>${E.freeSpins} Free Spin</b>. Free spin sırasında yeniden 3+ Kitap gelirse <b>gelen kitap sayısı kadar</b> free spin eklenir.<br>` +
                `<b>Genişleyen sembol:</b> Not defterinin seçtiği sembol free spin'de ekranda en az <b>2</b> (yüksek semboller) ya da <b>3</b> (diğerleri) kez görünürse, bulunduğu makaraları tamamen kaplar ve <b>hat aramadan, tüm makarada varmış gibi</b> ödeme yapar.<br>` +
                `<b>Bahis kademesi:</b> bahsini yükselttikçe (her 3 basamakta bir, en fazla ${Engine.MAX_TIER} kademe) kazançlar +%${Engine.TIER_PAY * 100}, Kitap şansı +%${Engine.TIER_SCATTER * 100} ve Atölye çekirdeği +%${Engine.TIER_BEAN * 100} artar.<br>` +
                `<b>Atölye:</b> bu bölümde her spinde bahsin ve kazancın %${rate}'i kalıcı Atölye çekirdeğine (${beanIc()}) dönüşür. Atölyede harcadığın çekirdek oyun bakiyeni etkilemez.` +
                (E.reels === 6 ? `<br><b>6. Makara açık:</b> 6'lı eşleşme, 5'li ödemenin 2,5 katını öder.` : '');
            const inGame = document.body.dataset.mode === 'game';
            $('pay-special').classList.toggle('hidden', !(gameState.chapter >= 2 && inGame));
            $('pay-loyalty').classList.toggle('hidden', !(gameState.chapter === 3 && inGame));
            $('ps-foam').textContent = '+%' + Math.round(E.foam * 100);
            $('ps-latte').textContent = '×' + E.latteMult;
        }

        function openInfoModal() {
            playSynthNote(500, 0.05);
            buildPayTable();
            openModal('modal-info');
        }
        function closeInfoModal() { closeModal('modal-info'); }

        function startGameWithPlayer() {
            const nameInput = $('player-name-input').value.trim();
            if (nameInput) gameState.playerName = nameInput;
            Save.data.name = gameState.playerName;
            Save.save();
            $('hud-player-name').textContent = gameState.playerName;
            closeNameModal();
            if (Save.data.seen[1]) openChapterSelect();
            else playStory(1);
        }

        /* ---------- BÖLÜM SEÇİMİ ---------- */
        const CH_TEXT = {
            1: { icon: '☕', title: 'Huzurlu Dem', sub: 'Temel yükseltmelerle başla.' },
            2: { icon: '🍵', title: 'Matcha Savaşı', sub: 'Pitcher joker, Matcha köpük kombosu.' },
            3: { icon: '🏰', title: 'Büyük Final', sub: "SyruppoLab'ın Şurup Kalesi + sadakat kartı." }
        };
        function openChapterSelect() {
            playSynthNote(500, 0.05);
            const list = $('chapter-list');
            list.innerHTML = '';
            [1, 2, 3].forEach(n => {
                const ch = CHAPTERS[n], t = CH_TEXT[n];
                const unlocked = chapterUnlocked(n);
                const card = document.createElement('div');
                card.className = 'ch-card' + (unlocked ? '' : ' locked') + (Save.data.done[n] ? ' done' : '');
                card.innerHTML = `<div class="ci">${unlocked ? t.icon : '🔒'}</div>` +
                    `<div class="cb"><b>${ch.name}: ${t.title}</b><small>${t.sub}<br>Sermaye ${fmt(startBalance(n))} → Hedef ${fmt(ch.goal)}</small></div>`;
                const b = document.createElement('button');
                b.className = 'btn btn-sm' + (unlocked ? '' : ' btn-soft');
                b.textContent = !unlocked ? 'KİLİTLİ' : Save.data.done[n] ? '✔ TEKRAR' : 'BAŞLA';
                b.disabled = !unlocked;
                b.onclick = () => { closeModal('modal-chapters'); startChapter(n); };
                card.appendChild(b);
                list.appendChild(card);
            });
            if (Save.data.done[3]) {
                const fin = document.createElement('button');
                fin.className = 'btn btn-sm btn-soft';
                fin.textContent = '📖 FİNAL HİKÂYESİNİ İZLE';
                fin.onclick = () => { closeModal('modal-chapters'); playStory(4); };
                list.appendChild(fin);
            }
            $('chapters-wallet').textContent = fmt(Save.data.wallet);
            openModal('modal-chapters');
        }
        function startChapter(n) {
            if (!Save.data.seen[n]) playStory(n);
            else launchSlotGame(n);
        }
        function leaveRun() {
            ['modal-chapter-done', 'modal-gameover'].forEach(closeModal);
            gameState.autoSpinActive = false;
            gameState.freeSpinsRemaining = 0;
            gameState.expandingSymbolId = null;
            updateAutoSpinButtonUI();
            $('bonus-banner').classList.remove('show');
            stopCasinoMusic();
            stopBonusMusic();
        }
        function goToChapterComic(n) { leaveRun(); playStory(n); }
        function goToFinale() { leaveRun(); playStory(4); }

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
            opts.forEach(o => { if (o <= balance * 0.05) b = o; });
            return b;
        }
        function adjustBet(direction) {
            if (gameState.freeSpinsRemaining > 0 || gameState.autoSpinActive) {
                setMessage("Oto Spin veya Free Spin sırasında bahis değiştirilemez!");
                return;
            }
            playSynthNote(480, 0.05);
            const opts = Engine.betOptions(gameState.chapter, gameState.balance);
            if (!opts.length) return;
            let idx = 0;
            opts.forEach((o, i) => { if (o <= gameState.bet) idx = i; });
            idx = Math.max(0, Math.min(opts.length - 1, idx + direction));
            gameState.bet = opts[idx];
            updateHUD();
        }

        /* ---------- GENEL OYUN AKIŞI ---------- */
        function startBalance(n) { return CHAPTERS[n].start; }
        const CH_INTRO = {
            1: { title: 'BÖLÜM 1: HUZURLU DEM', art: ['barista', 'cozybear'],
                 html: (c) => `Dükkânı ayakta tutmak için çarkları çevir. <b>Sermaye: ${fmt(c.start)} → Hedef: ${fmt(c.goal)} çekirdek.</b><br><br>💡 Bahsin bakiyenin yaklaşık <b>%5'i</b> olsun: yüksek bahis daha hızlı ama daha riskli; bahis kademesi yükseldikçe bonuslar artar.<br>🛠 Kazandıkça <b>Atölye çekirdeği</b> ${beanIc()} birikir. Atölyede sembollerini kalıcı olarak güçlendirebilirsin!` },
            2: { title: 'BÖLÜM 2: MATCHA SAVAŞI', art: ['matcha', 'pitcher'],
                 html: (c) => `SyruppoLab matchayla geri döndü! <b>Yeni şube sermayesi: ${fmt(c.start)} → Hedef: ${fmt(c.goal)} çekirdek.</b><br><br>🥛 <b>Pitcher</b> bir <b>jokerdir</b>: hatlarda diğer sembollerin yerine geçer. Ekranda 3 Pitcher = <b>Latte Art Bonusu</b> (bahsin ×${RUN_EFF.latteMult} katı)!<br>🍵 <b>Matcha</b> köpüktür: Pitcher ile birlikte gelirse <b>Matcha Latte</b> olur ve hat kazancını katlar (çift başına +%${Math.round(RUN_EFF.foam * 100)}). Tek başına zararsızdır, kayıp yok!<br>Her ikisi de yalnızca 1., 3. ve 5. makarada düşer.` },
            3: { title: 'BÖLÜM 3: BÜYÜK FİNAL', art: ['barista', 'stamp', 'cozybear'],
                 html: (c) => `SyruppoLab'ın Şurup Kalesi karşında! <b>Sermaye: ${fmt(c.start)} → Hedef: ${fmt(c.goal)} çekirdek.</b><br><br>Bu bölüm zorlu: ödemeler seyrek ama büyük. <b>Reçete Kitabı</b> ve <b>Bearista</b> +%50, <b>MaviKuş</b> +%25 daha değerli. Surlar çatladıkça (%25 · %50 · %75) Atölye ödülleri kazanırsın.<br>☕ <b>Sadakat kartı:</b> makarada çıkan <b>damgaları</b> topla. Her 10 damgada ücretsiz içeceğini seç: <b>Filtre Kahve</b> (sonraki free spin 20 tur), <b>Americano</b> (sonraki 10 spin ×2) ya da <b>Latte</b> (Wild ihtimali bu bölüm boyunca +%10).<br>💰 Cash Out yalnızca bu bölümde açık.` }
        };

        function launchSlotGame(ch, restart) {
            ch = ch || 1;
            playSynthNote(750, 0.1);
            const c = CHAPTERS[ch];
            gameState.chapter = ch;
            gameState.balance = startBalance(ch);
            gameState.chapterStartBalance = gameState.balance;
            gameState.loy = newLoyalty();
            refreshEff();
            gameState.bet = recommendedBet(ch, gameState.balance);
            document.body.dataset.chapter = ch;
            gameState.freeSpinsRemaining = 0;
            gameState.freeSpinsTotal = 0;
            gameState.autoSpinActive = false;
            gameState.expandingSymbolId = null;
            gameState.chapterDone = false;
            gameState.isSpinning = false;
            gameState.phasesShown = {};
            gameState.reelsPending = false;
            Save.data.seen[ch] = true;
            Save.save();
            $('bonus-banner').classList.remove('show');
            updateFsBadge();
            buildGoalTicks();
            updateLoyaltyUI();
            updateCashoutBtn();
            setMessage(`Önerilen bahis: ${fmt(gameState.bet)}. Çarkları çevir, nitelikli kahveni demle!`);
            updateAutoSpinButtonUI();
            updateHUD();
            switchScreen('screen-game');
            if (!restart) showChapterIntro(ch);
        }

        function showChapterIntro(ch) {
            const art = $('ci-art');
            art.innerHTML = '';
            CH_INTRO[ch].art.forEach(k => { const im = document.createElement('img'); im.src = ASSETS.sym[k]; im.alt = ''; art.appendChild(im); });
            $('ci-title').textContent = CH_INTRO[ch].title;
            const c = Object.assign({}, CHAPTERS[ch], { start: startBalance(ch) });
            $('ci-text').innerHTML = CH_INTRO[ch].html(c);
            openModal('modal-chapter-intro');
        }

        function returnToMenu() {
            nbClear();
            stopCasinoMusic();
            stopBonusMusic();
            gameState.autoSpinActive = false;
            gameState.freeSpinsRemaining = 0;
            gameState.isSpinning = false;
            clearTease();
            updateAutoSpinButtonUI();
            ALL_MODALS.forEach(closeModal);
            switchScreen('screen-menu');
        }
        /* Üst bardaki MENÜ: oyun sürerken ilerleme kaybolacağı için onay ister */
        function askMenu() {
            if (document.body.dataset.mode !== 'game') { returnToMenu(); return; }
            const wasAuto = gameState.autoSpinActive;
            gameState.autoSpinActive = false;
            updateAutoSpinButtonUI();
            confirmBox({
                title: 'MENÜYE DÖNÜLSÜN MÜ?',
                text: `Ana menüye dönülecek ve bu bölümdeki <b>ilerlemen (${fmt(gameState.balance)} çekirdek) kaybolacak</b>.<br>Atölye çekirdeklerin ${beanIc()} ve yükseltmelerin kalıcıdır, onlar korunur.`,
                art: ['cozybear'],
                ok: 'EVET, MENÜYE DÖN',
                onOk: () => returnToMenu()
            });
            if (wasAuto) setMessage('Oto Spin durduruldu.');
        }

        function setMessage(text, isWin) {
            const el = $('game-message');
            el.textContent = text;
            el.classList.toggle('win', isWin === true);
            el.classList.toggle('lose', isWin === 'lose');
        }

        /* ---------- HEDEF ÇUBUĞU (doğrusal: gerçek yüzde) ---------- */
        const GOAL_ICON = { 1: '🎯', 2: '🍵', 3: '🏰' };
        function goalProgress() {
            if (gameState.chapterDone) return 1;
            const c = CHAPTERS[gameState.chapter];
            return Math.max(0, Math.min(1, gameState.balance / c.goal));
        }
        function buildGoalTicks() {
            const marks = $('goal-marks');
            marks.innerHTML = '';
            const c = CHAPTERS[gameState.chapter];
            c.phases.forEach((p, i) => {
                const t = document.createElement('button');
                t.className = 'gm' + (Save.data.phases[c.id + ':' + i] ? ' got' : '');
                t.style.left = (p * 100) + '%';
                const r = PHASE_REWARD[c.id][i];
                const tip = `Ara durak: ${fmt(c.goal * p)} çekirdek (%${Math.round(p * 100)}). Buraya ulaşınca hikâye konuşması` +
                    (Save.data.phases[c.id + ':' + i] ? ' (ödülü zaten aldın).' : ` ve +${fmt(r)} Atölye çekirdeği ödülü!`);
                t.title = tip;
                t.textContent = Save.data.phases[c.id + ':' + i] ? '✓' : '🎁';
                t.setAttribute('aria-label', tip);
                t.onclick = () => showDialog('cozybear', 'MaviKuş', tip);
                marks.appendChild(t);
            });
        }
        function updateGoalBar() {
            const bar = $('goal-bar');
            if (!bar) return;
            const c = CHAPTERS[gameState.chapter] || CHAPTERS[1];
            const p = goalProgress();
            $('goal-fill').style.width = (p * 100) + '%';
            bar.classList.toggle('done', gameState.chapterDone);
            $('goal-title').textContent = (gameState.chapterDone ? '✅ ' : GOAL_ICON[c.id] + ' ') + c.name;
            const pct = p * 100;
            $('goal-num').textContent = gameState.chapterDone ? 'TAMAMLANDI' : fmt(gameState.balance) + ' / ' + fmt(c.goal);
            $('goal-pct').textContent = '%' + (pct < 10 ? pct.toFixed(1).replace('.', ',') : Math.floor(pct));
        }

        function updateWalletUI() {
            const v = fmt(Save.data.wallet);
            ['hud-wallet-val', 'menu-wallet', 'shop-wallet', 'chapters-wallet', 'go-wallet'].forEach(id => { const el = $(id); if (el) el.textContent = v; });
        }
        function flashWallet() {
            const el = $('hud-wallet');
            el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
        }

        function updateFsBadge() {
            const b = $('fs-badge');
            const active = gameState.freeSpinsTotal > 0 && gameState.expandingSymbolId;
            b.classList.toggle('show', !!active);
            if (!active) return;
            const done = gameState.freeSpinsTotal - gameState.freeSpinsRemaining;
            $('fs-left').textContent = gameState.freeSpinsRemaining;
            $('fs-of').textContent = `${Math.min(done, gameState.freeSpinsTotal)} / ${gameState.freeSpinsTotal}`;
            b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
            const bn = $('free-spins-count'); if (bn) bn.textContent = gameState.freeSpinsRemaining;
        }

        function updateCashoutBtn() {
            const b = $('cashout-btn');
            const on = gameState.chapter === 3;
            b.classList.toggle('locked', !on);
            b.title = on ? 'Oyunu bitir ve skorunu kaydet' : 'Cash Out yalnızca Bölüm 3’te açılır';
        }

        function updateHUD() {
            $('hud-balance').textContent = fmt(gameState.balance);
            updateGoalBar();
            $('hud-bet').textContent = fmt(gameState.bet);
            const tier = Engine.tierOf(gameState.bet);
            const tb = $('tier-badge');
            tb.textContent = tier > 0 ? `⭐ KADEME ${tier} · +%${Math.round(tier * Engine.TIER_PAY * 100)} KAZANÇ` : '⭐ KADEME 0';
            tb.classList.toggle('hi', tier > 0);
            updateWalletUI();

            const isLocked = (gameState.freeSpinsRemaining > 0 || gameState.autoSpinActive);
            $('bet-minus-btn').disabled = isLocked;
            $('bet-plus-btn').disabled = isLocked;
        }

        function toggleAutoSpin() {
            if (gameState.freeSpinsRemaining > 0) {
                setMessage("Free Spin sırasında Oto Spin durumu değiştirilemez!");
                return;
            }
            gameState.autoSpinActive = !gameState.autoSpinActive;
            playSynthNote(520, 0.08);
            updateAutoSpinButtonUI();
            updateHUD();
            if (gameState.autoSpinActive) {
                setMessage("Oto Spin aktif edildi.");
                if (!gameState.isSpinning) spinReels();
            } else {
                setMessage("Oto Spin durduruldu.");
            }
        }
        function updateAutoSpinButtonUI() { $('auto-spin-btn').classList.toggle('on', gameState.autoSpinActive); }

        /* ---------- DİYALOG (akışı bozmayan mini konuşma balonu) ---------- */
        let dialogTimer = null;
        function showDialog(imgKey, name, text) {
            const t = $('dialog-toast');
            if (imgKey && ASSETS.sym[imgKey]) { $('dt-img').src = ASSETS.sym[imgKey]; $('dt-img').style.display = ''; }
            else $('dt-img').style.display = 'none';
            $('dt-name').textContent = name;
            $('dt-text').textContent = text;
            t.classList.add('show');
            clearTimeout(dialogTimer);
            dialogTimer = setTimeout(() => t.classList.remove('show'), 5200);
        }

        const PHASE_TALK = {
            1: [{ img: 'cozybear', who: 'MaviKuş', text: 'Müşteri kuyruğu uzuyor Bearista! Yolun yarısındayız, atölyeye de uğra!' }],
            2: [{ img: 'pitcher', who: 'Bearista', text: 'Pitcher ve Matcha köpüğü kombosu tutuyor! Matcha ordusu geri çekiliyor...' }],
            3: [
                { img: 'barista', who: 'Bearista', text: 'Şurup Kalesi’nin dış surları çatladı! Devam!' },
                { img: 'cozybear', who: 'MaviKuş', text: 'Kapılar sallanıyor... İçeriden şurup kokusu geliyor!' },
                { img: 'book', who: 'SyruppoLab Patronu', text: 'İmkânsız! Bir avuç ayı kalemi yıkıyor mu?!' }
            ]
        };
        const PHASE_REWARD = { 1: [2500], 2: [25000], 3: [50000, 100000, 200000] };

        function checkPhases() {
            const c = CHAPTERS[gameState.chapter];
            const p = goalProgress();
            let changed = false;
            c.phases.forEach((ph, i) => {
                if (p < ph || gameState.phasesShown[i]) return;
                gameState.phasesShown[i] = true;
                const key = c.id + ':' + i;
                const talk = PHASE_TALK[c.id][i];
                let extra = '';
                if (!Save.data.phases[key]) {
                    Save.data.phases[key] = true;
                    const r = PHASE_REWARD[c.id][i];
                    Save.data.wallet += r;
                    Save.save();
                    flashWallet();
                    changed = true;
                    extra = `  🎁 +${fmt(r)} Atölye çekirdeği!`;
                }
                showDialog(talk.img, talk.who, talk.text + extra);
                [659, 784, 988].forEach((f, k) => setTimeout(() => playSynthNote(f, 0.18, 'sine', 0.06), k * 110));
            });
            if (changed) buildGoalTicks();
        }

        /* =====================================================
           SADAKAT KARTI (Bölüm 3)
           ===================================================== */
        function updateLoyaltyUI(popIdx) {
            const L = gameState.loy, per = Engine.STAMPS_PER_CARD;
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
                s.classList.toggle('on', i < L.stamps);
                if (popIdx !== undefined && i >= popIdx && i < L.stamps) { s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
            });
            $('lc-count').textContent = `${Math.min(L.stamps, per)}/${per}`;
            const buffs = [];
            if (L.filtre) buffs.push(`<span class="buff" title="Sonraki free spin 20 tur">☕ Filtre: sonraki FS 20</span>`);
            if (L.americano > 0) buffs.push(`<span class="buff hot" title="Kazançlar ×2">☕ Americano ×2 · ${L.americano} spin</span>`);
            if (L.latte > 0) buffs.push(`<span class="buff" title="Wild (Reçete Kitabı) ihtimali">🥛 Latte: Wild +%${L.latte * 10}</span>`);
            $('lc-buffs').innerHTML = buffs.join('') || '<span class="buff off">Kart dolunca içecek seç</span>';
        }

        function addStamps(n) {
            if (!n || gameState.chapter !== 3) return false;
            const before = gameState.loy.stamps;
            gameState.loy.stamps += n;
            [0, 1].forEach(k => setTimeout(() => { playSynthNote(180 - k * 30, 0.1, 'square', 0.05); }, k * 90));
            updateLoyaltyUI(before);
            return gameState.loy.stamps >= Engine.STAMPS_PER_CARD;
        }

        const DRINKS = [
            { id: 'filtre', img: 'v60', name: 'Filtre Kahve', desc: 'Sonraki free spin\'lerin <b>20</b> tane olur.' },
            { id: 'americano', img: 'portafilter', name: 'Americano', desc: 'Sonraki <b>10 çevirimde ×2</b> çarpan.' },
            { id: 'latte', img: 'espresso', name: 'Latte', desc: 'Wild (Reçete Kitabı) gelme ihtimali bu bölüm boyunca <b>+%10</b> artar.' }
        ];
        function openDrinkChoice() {
            const list = $('drink-list');
            list.innerHTML = '';
            DRINKS.forEach(d => {
                const maxed = d.id === 'latte' && gameState.loy.latte >= Engine.LATTE_MAX;
                const b = document.createElement('button');
                b.className = 'drink' + (maxed ? ' maxed' : '');
                b.disabled = maxed;
                b.innerHTML = `<img src="${ASSETS.sym[d.img]}" alt=""><b>${d.name}</b><small>${maxed ? 'En fazla ' + Engine.LATTE_MAX + ' kez seçilebilir' : d.desc}</small>`;
                b.onclick = () => chooseDrink(d.id);
                list.appendChild(b);
            });
            [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 100));
            openModal('modal-drink');
        }
        function chooseDrink(id) {
            const L = gameState.loy;
            L.stamps = Math.max(0, L.stamps - Engine.STAMPS_PER_CARD);
            if (id === 'filtre') L.filtre = true;
            else if (id === 'americano') L.americano += 10;
            else if (id === 'latte') { L.latte = Math.min(Engine.LATTE_MAX, L.latte + 1); refreshEff(); }
            closeModal('modal-drink');
            [784, 988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.06), i * 80));
            const d = DRINKS.find(x => x.id === id);
            showDialog(d.img, d.name + ' hazır!', id === 'filtre' ? 'Sonraki free spin bonusun 20 tur olacak.' : id === 'americano' ? 'Sonraki 10 çevirimde kazançların ×2!' : 'Reçete Kitabı artık daha sık geliyor (+%10).');
            updateLoyaltyUI();
            celebrate(gameState.bet * 10);
            if (gameState.loy.stamps >= Engine.STAMPS_PER_CARD) setTimeout(openDrinkChoice, 600);
        }

        /* =====================================================
           SPIN MANTIĞI (matematik: Engine)
           ===================================================== */
        let teaseTimer = null;
        function teaseMusic(on) {
            clearInterval(teaseTimer); teaseTimer = null;
            if (!on) return;
            let k = 0;
            teaseTimer = setInterval(() => { playSynthNote(330 + (k % 12) * 40, 0.09, 'triangle', 0.05); if (k % 2) playSynthNote(110, 0.12, 'sine', 0.06); k++; }, 120);
        }

        /* Atölyede 6. makara alındıysa sahneyi boştayken yeniden kur */
        function syncReels() {
            if (builtReels && builtReels !== reelCount()) {
                if (gameState.isSpinning || gameState.freeSpinsRemaining > 0) { gameState.reelsPending = true; return; }
                gameState.reelsPending = false;
                initThreeJS();
            }
        }

        function spinReels() {
            if (gameState.isSpinning || !threeReady) return;
            if (anyModalOpen()) return;
            const c = CHAPTERS[gameState.chapter];
            const free = gameState.freeSpinsRemaining > 0;
            if (!free && gameState.reelsPending) syncReels();
            if (!free) {
                clampBet();
                if (gameState.balance < c.minBet) {
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    showGameOver();
                    return;
                }
            }

            winningMeshRefs = [];
            reelColumns.forEach(col => {
                col.group.children.forEach(mesh => {
                    mesh.scale.set(1, 1, 1);
                    mesh.rotation.z = 0;
                });
            });

            gameState.spinFree = free;
            if (free) gameState.freeSpinsRemaining--;
            else gameState.balance -= gameState.bet;

            // Americano: sonraki 10 çevirim ×2
            let mult = 1;
            if (gameState.loy.americano > 0) { mult = 2; gameState.loy.americano--; updateLoyaltyUI(); }

            const ctx = { chapter: gameState.chapter, bet: gameState.bet, tier: Engine.tierOf(gameState.bet), eff: RUN_EFF, expandingSymbolId: gameState.expandingSymbolId, mult };
            const pending = { g: Engine.genGrid(ctx, Math.random), ctx };
            const N = pending.g.length;

            updateFsBadge();
            updateHUD();
            gameState.isSpinning = true;
            $('spin-btn').disabled = true;
            setMessage(free ? "Free Spin döndürülüyor..." : (mult > 1 ? "☕ Americano ×2 aktif! Çarklar dönüyor..." : "Çarklar hızla dönüyor..."));
            playSpinSound();

            const stopAt = [];
            for (let r = 0; r < N; r++) stopAt.push(600 + r * 180);
            const stopped = new Array(N).fill(false);
            let elapsed = 0, teasing = false;

            const spinInterval = setInterval(() => {
                elapsed += 55;
                let allStopped = true;
                for (let r = 0; r < N; r++) {
                    const col = reelColumns[r];
                    if (!col) continue;
                    if (!stopped[r] && elapsed >= stopAt[r]) {
                        stopped[r] = true;
                        setTease(r, false);
                        for (let row = 0; row < 3; row++) {
                            gameState.grid[r][row] = pending.g[r][row];
                            updateSymbolMesh(col.group.children[row], pending.g[r][row], false);
                        }
                        col.bounceStart = Date.now();
                        const hasBook = pending.g[r].some(s => s.id === 'book');
                        playSynthNote(360 + r * 70, 0.05, 'triangle', 0.05);
                        if (hasBook) playSynthNote(teasing ? 1175 : 880, 0.18, 'sine', 0.07);

                        // 2 Wild düştüyse kalan makaralar yavaşlar: parıltı + gerilim müziği
                        if (!teasing) {
                            let books = 0;
                            for (let k = 0; k <= r; k++) books += pending.g[k].filter(s => s.id === 'book').length;
                            if (books >= 2 && r < N - 1) {
                                teasing = true;
                                let extra = 0;
                                for (let k = r + 1; k < N; k++) { extra += 750; stopAt[k] = Math.max(stopAt[k], elapsed) + extra; setTease(k, true); }
                                $('reel-wrap').classList.add('tease');
                                setMessage('📖📖 İki Reçete Kitabı! Üçüncüsü gelecek mi...?');
                                teaseMusic(true);
                            }
                        }
                    }
                    if (!stopped[r]) {
                        allStopped = false;
                        // yavaşlayan makarada semboller daha seyrek değişir
                        if (!teasing || (elapsed / 55) % 2 === 0)
                            for (let row = 0; row < 3; row++) updateSymbolMesh(col.group.children[row], visualSymbol(r), false);
                    }
                }
                if (allStopped) {
                    clearInterval(spinInterval);
                    if (teasing) { teaseMusic(false); clearTease(); }
                    finalizeSpin(pending);
                }
            }, 55);
        }

        function scheduleNextSpin(extraDelay) {
            if (!(gameState.freeSpinsRemaining > 0 || gameState.autoSpinActive)) return;
            const tryGo = () => {
                if (document.body.dataset.mode !== 'game') return;
                if (!(gameState.freeSpinsRemaining > 0 || gameState.autoSpinActive)) return;
                if (gameState.isSpinning) return;
                if (anyModalOpen()) { setTimeout(tryGo, 500); return; }   // Atölye / popup açıkken bekle
                spinReels();
            };
            setTimeout(tryGo, 850 + (extraDelay || 0));
        }

        function finalizeSpin(pending) {
            const res = evaluateWins(pending);
            Save.save();
            // genişleme animasyonu sürerken makaralar kilitli kalır
            if (res.animMs) setTimeout(() => afterSpin(res), res.animMs);
            else afterSpin(res);
        }

        function afterSpin(res) {
            gameState.isSpinning = false;
            $('spin-btn').disabled = false;

            // Sadakat kartı (Bölüm 3)
            if (addStamps(res.stamps)) setTimeout(() => { if (!$('modal-drink').classList.contains('open')) openDrinkChoice(); }, 450);

            // 3+ Reçete Kitabı (normal spin): önce bu spinin kazancı gösterilir, sonra not defteri açılır
            if (res.scatter >= 3 && !gameState.expandingSymbolId) {
                playSynthNote(950, 0.35);
                $('spin-btn').disabled = true;
                setTimeout(() => whenNoModal(() => {
                    $('spin-btn').disabled = false;
                    triggerBonusGameIntro();
                }), res.total > 0 ? 1400 : 700);
                return;
            }
            // Free spin sırasında 3+ Kitap: gelen kitap sayısı kadar free spin eklenir
            let extra = 0;
            if (res.scatter >= 3 && gameState.expandingSymbolId) {
                gameState.freeSpinsRemaining += res.scatter;
                gameState.freeSpinsTotal += res.scatter;
                updateFsBadge();
                [988, 1175, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.07), i * 110));
                setMessage(`📖 ${res.scatter} REÇETE KİTABI! +${res.scatter} FREE SPIN EKLENDİ!`, true);
                celebrate(gameState.bet * 20);
                extra = 900;
            }

            if (gameState.freeSpinsRemaining === 0 && gameState.expandingSymbolId) {
                gameState.expandingSymbolId = null;
                gameState.freeSpinsTotal = 0;
                $('bonus-banner').classList.remove('show');
                updateFsBadge();
                stopBonusMusic();
                updateHUD();
            }

            checkPhases();

            if (gameState.freeSpinsRemaining === 0) {
                if (gameState.balance < CHAPTERS[gameState.chapter].minBet) {
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    whenNoModal(showGameOver);
                    return;
                }
                if (!gameState.chapterDone && gameState.balance >= CHAPTERS[gameState.chapter].goal) {
                    gameState.chapterDone = true;
                    gameState.autoSpinActive = false;
                    updateAutoSpinButtonUI();
                    setTimeout(() => whenNoModal(completeChapter), 300);
                    return;
                }
            }
            scheduleNextSpin(extra);
        }

        function evaluateWins(p) {
            const res = Engine.evaluate(p.g, p.ctx);
            const gain = res.total + res.cashback;
            gameState.balance += gain;

            // Atölye çekirdeği
            const earn = Engine.workshopEarn(p.ctx.bet, res.total, p.ctx.tier, RUN_EFF, gameState.spinFree, gameState.chapter);
            Save.data.wallet += earn;
            Save.data.earned += earn;

            // kazanan kartları vurgula (genişleyen makaralar hariç; onlar ayrıca canlandırılır)
            winningMeshRefs = [];
            const seen = new Set();
            const expanded = res.expanded || [];
            const markCell = (r, row, sym) => {
                const key = r + ',' + row;
                if (seen.has(key)) return;
                seen.add(key);
                const mesh = reelColumns[r] && reelColumns[r].group.children[row];
                if (!mesh) return;
                updateSymbolMesh(mesh, sym, true);
                winningMeshRefs.push(mesh);
            };
            res.marks.forEach(m => { if (expanded.indexOf(m.r) === -1) markCell(m.r, m.row, p.g[m.r][m.row]); });
            for (let r = 0; r < p.g.length; r++) for (let row = 0; row < 3; row++) if (p.g[r][row].id === 'stamp') markCell(r, row, p.g[r][row]);

            // Genişleyen sembol: makarayı kaplama animasyonu
            res.animMs = 0;
            if (expanded.length) {
                const sym = SYMBOLS.find(s => s.id === p.ctx.expandingSymbolId);
                expanded.forEach((r, i) => {
                    setTimeout(() => {
                        for (let row = 0; row < 3; row++) {
                            gameState.grid[r][row] = sym;
                            const mesh = reelColumns[r] && reelColumns[r].group.children[row];
                            if (!mesh) continue;
                            updateSymbolMesh(mesh, sym, true);
                            mesh.userData = mesh.userData || {};
                            mesh.userData.popStart = Date.now() + row * 60;
                            if (winningMeshRefs.indexOf(mesh) === -1) winningMeshRefs.push(mesh);
                        }
                        playSynthNote(523 + i * 110, 0.2, 'triangle', 0.06);
                        playSynthNote(1046 + i * 220, 0.12, 'sine', 0.035);
                    }, 350 + i * 380);
                });
                res.animMs = 350 + expanded.length * 380 + 300;
                setMessage(`📖 GENİŞLEYEN SEMBOL: ${sym.name}!`, true);
            }

            updateHUD();
            flashWallet();

            const parts = [];
            if (res.mult > 1 && res.total > 0) parts.push('☕ AMERICANO ×2');
            if (res.lineTotal > 0) parts.push(`🏆 +${fmt(res.lineTotal)}`);
            if (res.expandPay > 0) parts.push(`📖 ${expanded.length} MAKARA +${fmt(res.expandPay)}`);
            if (res.foamMult > 1) parts.push(`🍵🥛 MATCHA LATTE ×${fmtX(res.foamMult)}`);
            if (res.latte > 0) parts.push(`🥛 LATTE ART +${fmt(res.latte)}`);
            const extras = [];
            if (res.cashback > 0) extras.push(`☕ Sadık müşteriler +${fmt(res.cashback)}`);
            if (res.stamps > 0) extras.push(`🎟 +${res.stamps} DAMGA`);

            const show = () => {
                if (res.total > 0) {
                    playSynthNote(850, 0.35);
                    if (res.foamMult > 1 || res.latte > 0 || res.expandPay > 0) [988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), 120 + i * 120));
                    let msg = parts.join('  ·  ').replace('🏆 +', '🏆 KAZANÇ: +') + ' ÇEKİRDEK!';
                    if (extras.length) msg += '  ·  ' + extras.join('  ·  ');
                    if (res.matcha > 0 && res.pitcher === 0 && res.foamMult === 1) msg += '  💡 Matcha köpüğü için Pitcher lazım!';
                    setMessage(msg, true);
                    celebrate(res.total);
                } else if (extras.length) {
                    setMessage(extras.join('  ·  '));
                } else if (res.matcha > 0 && res.pitcher === 0) {
                    setMessage('Matcha köpüğü hazır, ama Pitcher yok… Nitelikli kahve demlendi.');
                } else {
                    setMessage("Nitelikli kahve demlendi.");
                }
            };
            if (res.animMs) setTimeout(show, res.animMs - 200); else show();
            return res;
        }

        /* ---------- BÖLÜM TAMAMLAMA ---------- */
        function completeChapter() {
            gameState.chapterDone = true;
            gameState.autoSpinActive = false;
            updateAutoSpinButtonUI();
            const n = gameState.chapter, c = CHAPTERS[n];
            const first = !Save.data.done[n];
            const bonus = first ? c.bonus : Math.round(c.bonus * 0.25);
            Save.data.done[n] = true;
            Save.data.wallet += bonus;
            Save.save();
            updateHUD();

            const name = gameState.playerName;
            const T = {
                1: { t: 'BÖLÜM 1 TAMAMLANDI!', p: `Tebrikler ${name}! 100.000 çekirdeğe ulaştın ve ilk bölümü tamamladın.`, next: '2. SAHNEYE GEÇİŞ ➜', go: () => goToChapterComic(2), cont: false },
                2: { t: '1.000.000 ÇEKİRDEK!', p: 'Tebrikler, zincir kahveciye müşteri kaptırmadınız gerçek kahve kazandı', next: '3. SAHNEYE GEÇİŞ ➜', go: () => goToChapterComic(3), cont: true },
                3: { t: 'SYRUPPOLAB ÇÖKTÜ!', p: `Şurup Kalesi yerle bir oldu! Tebrikler ${name}, kasabanın kahvesini sen kurtardın!`, next: 'FİNAL HİKÂYESİ ➜', go: () => goToFinale(), cont: false }
            }[n];
            $('cd-title').textContent = T.t;
            $('chapter-done-text').textContent = T.p;
            $('cd-bonus').innerHTML = `🎁 Bölüm ödülü: +${fmt(bonus)} Atölye çekirdeği ${beanIc()}` + (first ? '' : ' (tekrar oynama ödülü)') +
                (n === 2 && first ? '<br><small>✨ Atölyede yeni “Usta” yükseltmeleri açıldı!</small>' : '');
            $('cd-next').textContent = T.next;
            $('cd-next').onclick = T.go;
            $('cd-continue').classList.toggle('hidden', !T.cont);
            openModal('modal-chapter-done');
            [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.3, 'sine', 0.07), i * 130));
            celebrate(gameState.bet * 100);
            setTimeout(() => celebrate(gameState.bet * 100), 900);
        }

        function continueAfterPopup(modalId) {
            closeModal(modalId);
            scheduleNextSpin();
        }

        /* Kazanınca ekrana tatlılar yağar */
        function celebrate(amount) {
            if (document.body.dataset.mode !== 'game') return;
            const layer = $('fx-layer');
            const ratio = amount / Math.max(1, gameState.bet);
            const count = ratio >= 20 ? 34 : ratio >= 5 ? 20 : 9;
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
           BONUS / CASH OUT / GAME OVER
           ===================================================== */
        let nbTimers = [];
        function nbLater(fn, ms) { const t = setTimeout(fn, ms); nbTimers.push(t); return t; }
        function nbClear() { nbTimers.forEach(clearTimeout); nbTimers = []; }

        function triggerBonusGameIntro() {
            const eligibleSymbols = SYMBOLS.filter(s => s.id !== 'book');
            const randomSym = eligibleSymbols[Math.floor(Math.random() * eligibleSymbols.length)];
            gameState.expandingSymbolId = randomSym.id;
            openModal('modal-bonus-intro');
            runNotebookReveal(randomSym, eligibleSymbols);
        }

        function runNotebookReveal(finalSym, pool) {
            nbClear();
            const book = $('nb-book');
            const card = $('nb-card');
            const icon = $('notebook-symbol-icon');
            const name = $('notebook-symbol-name');
            const text = $('notebook-text');
            const btn = $('bonus-start-btn');

            book.classList.remove('open');
            card.classList.remove('landed', 'shuffling', 'tick');
            card.querySelectorAll('.nb-spark').forEach(n => n.remove());
            icon.src = ASSETS.sym.book;
            name.textContent = '?';
            text.textContent = '3 Reçete Kitabı bulundu! Not defteri açılıyor...';
            btn.disabled = true;

            nbLater(() => {
                playSynthNote(330, 0.12, 'triangle', 0.05);
                book.classList.add('open');
            }, 650);

            nbLater(() => {
                text.textContent = 'Not defteri bugünün sembolünü seçiyor...';
                card.classList.add('shuffling');
                let delay = 60, step = 0, last = null;
                const total = 20;
                const tick = () => {
                    step++;
                    let sym;
                    if (step >= total) {
                        sym = finalSym;
                    } else {
                        do { sym = pool[Math.floor(Math.random() * pool.length)]; } while (sym === last || (step === total - 1 && sym === finalSym));
                    }
                    last = sym;
                    icon.src = ASSETS.sym[sym.img];
                    name.textContent = step >= total ? finalSym.name : '...';
                    card.classList.remove('tick'); void card.offsetWidth; card.classList.add('tick');
                    playSynthNote(480 + step * 22, 0.05, 'triangle', 0.045);
                    if (step >= total) { landed(); return; }
                    delay = step > 12 ? delay * 1.28 : delay * 1.06;
                    nbLater(tick, delay);
                };
                tick();
            }, 650 + 1750);

            function landed() {
                card.classList.remove('shuffling');
                card.classList.add('landed');
                [784, 988, 1175, 1568].forEach((f, i) => nbLater(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 110));
                const stars = ['✨', '⭐', '🤎', '✨', '⭐', '✨', '🤎', '✨', '⭐', '✨'];
                stars.forEach((st, i) => {
                    const sp = document.createElement('span');
                    sp.className = 'nb-spark';
                    sp.textContent = st;
                    const ang = (i / stars.length) * Math.PI * 2 + Math.random() * 0.4;
                    const dist = 70 + Math.random() * 40;
                    sp.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
                    sp.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
                    card.appendChild(sp);
                    setTimeout(() => sp.remove(), 1100);
                });
                celebrate(gameState.bet * 25);
                const n = nextFreeSpins();
                const min = Engine.expandMin(finalSym);
                text.innerHTML = `Genişleyen sembol: <b>${finalSym.name}</b>! ${n} Free Spin başlıyor${gameState.loy.filtre ? ' (☕ Filtre Kahve)' : ''}.<br><small>Ekranda ${min}+ ${finalSym.name} gelirse makarayı kaplar.</small>`;
                nbLater(() => { btn.disabled = false; }, 500);
            }
        }

        function startFreeSpinSequence() {
            nbClear();
            closeModal('modal-bonus-intro');
            const n = nextFreeSpins();
            if (gameState.loy.filtre) { gameState.loy.filtre = false; updateLoyaltyUI(); }
            gameState.freeSpinsRemaining = n;
            gameState.freeSpinsTotal = n;

            $('bonus-banner').classList.add('show');
            $('expanding-symbol-name').textContent = getSymbolName(gameState.expandingSymbolId);
            updateFsBadge();
            updateHUD();
            startBonusMusic();
            setTimeout(() => { spinReels(); }, 300);
        }

        function getSymbolName(id) {
            const sym = SYMBOLS.find(s => s.id === id);
            return sym ? sym.name : '';
        }

        /* Cash Out: yalnızca Bölüm 3'te, onaylı */
        function askCashOut() {
            if (gameState.chapter !== 3) {
                setMessage('💰 Cash Out yalnızca Bölüm 3’te açılır.');
                showDialog('barista', 'Bearista', 'Kasayı ancak final bölümünde kapatabiliriz! Önce SyruppoLab’ın kalesine ulaşalım.');
                return;
            }
            const wasAuto = gameState.autoSpinActive;
            gameState.autoSpinActive = false;
            updateAutoSpinButtonUI();
            confirmBox({
                title: 'UYARI',
                text: `Bu işlem <b>oyunu sonlandırıp</b> ${fmt(gameState.balance)} çekirdek ile <b>en yüksek skoru kaydedecek</b>. Emin misin?`,
                art: ['goldenbean'],
                ok: 'YENİDEN ONAYLIYORUM',
                onOk: () => cashOut()
            });
            if (wasAuto) setMessage('Oto Spin durduruldu.');
        }
        function cashOut() {
            gameState.autoSpinActive = false;
            gameState.freeSpinsRemaining = 0;
            updateAutoSpinButtonUI();
            saveHighScore();
            $('cashout-summary-text').textContent = `Barista ${gameState.playerName}, ${fmt(gameState.balance)} Çekirdek ile kasadan ayrıldı! Skorun kaydedildi.`;
            openModal('modal-cashout');
            celebrate(gameState.bet * 25);
        }

        function showGameOver() {
            gameState.autoSpinActive = false;
            updateAutoSpinButtonUI();
            $('gameover-restart-btn').textContent = `YENİDEN BAŞLA (${fmt(gameState.chapterStartBalance)} ÇEKİRDEK)`;
            updateWalletUI();
            Save.save();
            openModal('modal-gameover');
        }

        function restartGame() {
            closeModal('modal-gameover');
            launchSlotGame(gameState.chapter, true);
        }

        /* =====================================================
           BARİSTA ATÖLYESİ (kalıcı yükseltmeler)
           ===================================================== */
        let shopTab = 'symbol';
        const SHOP_TABS = [
            { id: 'symbol', label: '🍪 Semboller' },
            { id: 'skill', label: '⚡ Yetenekler' },
            { id: 'special', label: '🍵 Özel' },
            { id: 'late', label: '✨ Usta' }
        ];
        function openShop() {
            playSynthNote(560, 0.08);
            buildShop();
            openModal('modal-shop');
        }
        function closeShop() {
            closeModal('modal-shop');
            if ($('modal-info').classList.contains('open')) buildPayTable();
            if (document.body.dataset.mode === 'game') syncReels();
            updateHUD();
        }
        function setShopTab(id) { shopTab = id; playSynthNote(520, 0.04); buildShop(); }

        function buildShop() {
            updateWalletUI();
            const tabs = $('shop-tabs');
            tabs.innerHTML = '';
            SHOP_TABS.forEach(t => {
                const b = document.createElement('button');
                b.className = 'tab' + (t.id === shopTab ? ' on' : '');
                b.textContent = t.label;
                b.onclick = () => setShopTab(t.id);
                tabs.appendChild(b);
            });

            const list = $('shop-list');
            list.innerHTML = '';
            const ups = Engine.UPGRADES.filter(u => u.group === shopTab).sort((a, b) => a.group === 'symbol' ? a.baseCost - b.baseCost : 0);
            if (shopTab === 'special' && !chapterUnlocked(2)) {
                const p = document.createElement('p');
                p.className = 'shop-lock';
                p.textContent = "🔒 Matcha & Pitcher yükseltmeleri, Bölüm 1'i tamamlayınca açılır.";
                list.appendChild(p);
            }
            if (shopTab === 'late') {
                const p = document.createElement('p');
                p.className = 'shop-lock';
                p.textContent = chapterUnlocked(3) ? '✨ Usta yükseltmeleri: büyük hedefler ve oyun sonu için pahalı ama güçlü geliştirmeler.' : "🔒 Usta yükseltmeleri, Bölüm 2'yi tamamlayınca açılır.";
                list.appendChild(p);
            }
            ups.forEach(u => {
                const lvl = Save.level(u.id);
                const locked = u.unlock && !chapterUnlocked(u.unlock);
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
                body.innerHTML = `<b>${u.name}</b><span class="pips">${pips}</span>` +
                    `<small class="cur">${u.desc(lvl)}</small>` +
                    (maxed ? '<small class="nxt">★ MAKSİMUM</small>' : `<small class="nxt">➜ ${u.desc(lvl + 1)}</small>`);
                const btn = document.createElement('button');
                btn.className = 'btn btn-sm' + (maxed ? ' btn-green' : '');
                if (locked) { btn.textContent = '🔒'; btn.disabled = true; }
                else if (maxed) { btn.textContent = 'MAKS'; btn.disabled = true; }
                else {
                    btn.innerHTML = `${fmt(cost)} ${beanIc()}`;
                    btn.disabled = Save.data.wallet < cost;
                    btn.onclick = () => buyUpgrade(u.id);
                }
                card.append(im, body, btn);
                list.appendChild(card);
            });

            let total = 0, have = 0;
            Engine.UPGRADES.forEach(u => { total += u.max; have += Save.level(u.id); });
            $('shop-progress').textContent = `Atölye gücü: ${have} / ${total} seviye`;
        }

        function buyUpgrade(id) {
            const u = Engine.UPGRADES.find(x => x.id === id);
            const lvl = Save.level(id);
            if (!u || lvl >= u.max) return;
            const cost = Engine.upgradeCost(u, lvl);
            if (Save.data.wallet < cost) return;
            Save.data.wallet -= cost;
            Save.data.ups[id] = lvl + 1;
            refreshEff();
            Save.save();
            [784, 988, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.06), i * 80));
            if (id === 'lx_reel6') showDialog('barista', 'Bearista', '6. makara kuruldu! Artık 6’lı eşleşmeler süper ödül veriyor.');
            buildShop();
            updateWalletUI();
        }

        /* =====================================================
           YÜKSEK SKORLAR
           ===================================================== */
        function readScores() {
            try { return JSON.parse(localStorage.getItem('barista_3d_deluxe_scores') || '[]'); }
            catch (e) { return []; }
        }

        function saveHighScore() {
            if (gameState.balance <= 0) return;
            let scores = readScores();
            scores.push({
                name: gameState.playerName,
                beans: Math.floor(gameState.balance),
                chapter: gameState.chapter,
                date: new Date().toLocaleDateString('tr-TR')
            });
            scores.sort((a, b) => b.beans - a.beans);
            scores = scores.slice(0, 10);
            try { localStorage.setItem('barista_3d_deluxe_scores', JSON.stringify(scores)); } catch (e) {}
        }

        function openHighScores() {
            playSynthNote(500, 0.05);
            const scores = readScores();
            const listEl = $('highscores-list');
            listEl.innerHTML = '';
            if (scores.length === 0) {
                const p = document.createElement('p');
                p.className = 'hs-empty';
                p.textContent = 'Henüz skor yok.';
                listEl.appendChild(p);
            } else {
                scores.forEach((s, idx) => {
                    const row = document.createElement('div');
                    row.className = 'hs-row';
                    const rk = document.createElement('span'); rk.className = 'rk'; rk.textContent = '#' + (idx + 1);
                    const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = s.name;
                    const sc = document.createElement('span'); sc.className = 'sc';
                    sc.textContent = fmt(s.beans) + ' Çekirdek';
                    const dt = document.createElement('small'); dt.textContent = (s.chapter ? 'Bölüm ' + s.chapter + ' · ' : '') + s.date;
                    sc.appendChild(dt);
                    row.append(rk, nm, sc);
                    listEl.appendChild(row);
                });
            }
            switchScreen('screen-highscores');
        }
