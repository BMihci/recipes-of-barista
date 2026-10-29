        /* =====================================================
           PROFİL · GÜNLÜK ÖDÜL · ROZETLER · ALBÜM · GÖREVLER · SKOR
           (hepsi cihazda saklanır; giriş yapılırsa buluta eşitlenir)
           ===================================================== */
        const PROF_KEY = 'rob_v5_profile';
        function newProfile() {
            return { v: 1, nick: '', avatar: 'sym:barista', created: Date.now(), updated: Date.now(),
                     daily: { streak: 0, last: '' }, badges: {}, album: {}, stars: {}, best: 0, bestName: '', bestBy: { story: 0, std: 0, gambler: 0 }, seenDede: false,
                     stats: { spins: 0, wins: 0, fs: 0, maxX: 0, orbs: 0, maxOrb: 0, zafer: 0, rain: 0, harvest: 0, loy: 0, maxStage: 1, finished: 0, maxBal: 0, turbo: 0, quests: 0 } };
        }
        function normProfile(p) {
            const d = newProfile();
            p = Object.assign(d, p || {});
            p.daily = Object.assign(newProfile().daily, p.daily || {});
            p.stats = Object.assign(newProfile().stats, p.stats || {});
            p.badges = p.badges || {}; p.album = p.album || {}; p.stars = p.stars || {};
            p.bestBy = Object.assign({ story: 0, std: p.best || 0, gambler: 0 }, p.bestBy || {});
            return p;
        }
        let Profile = normProfile(lsGet(PROF_KEY, null));
        function saveProfile(touch) {
            if (touch !== false) Profile.updated = Date.now();
            lsSet(PROF_KEY, Profile);
            if (typeof Cloud !== 'undefined') Cloud.dirty();
        }
        function avatarSrc(a) {
            a = a || Profile.avatar || 'sym:barista';
            if (a.startsWith('data:')) return a;
            const k = a.replace('sym:', '');
            return ASSETS.sym[k] || ASSETS.sym.barista;
        }
        function nickOf() { return Profile.nick || L().menu2.guest; }

        /* ---------- tarih yardımcıları (yerel gün) ---------- */
        function dayStr(offset) {
            const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + (offset || 0));
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
        function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
        function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

        /* ---------- başarım bildirimi (sıralı) ---------- */
        const achQueue = [];
        let achBusy = false;
        function achToast(icon, title, sub) {
            achQueue.push({ icon, title, sub });
            if (!achBusy) achNext();
        }
        function achNext() {
            const it = achQueue.shift();
            const el = $('ach-toast');
            if (!it || !el) { achBusy = false; return; }
            achBusy = true;
            $('ach-img').src = it.icon && ASSETS.sym[it.icon] ? ASSETS.sym[it.icon] : ASSETS.sym.goldenbean;
            $('ach-t').textContent = it.title;
            $('ach-s').textContent = it.sub || '';
            el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
            [988, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.16, 'sine', 0.05), i * 90));
            setTimeout(() => { el.classList.remove('show'); setTimeout(achNext, 350); }, 2800);
        }
        /* ödülü aktif kayda yatır */
        function grant(v) {
            if (!Game.save || !(v > 0)) return 0;
            v = Math.round(v);
            gameState.balance += v;
            if (document.body.dataset.mode === 'game') updateHUD();
            if (document.body.dataset.screen === 'screen-map') $('map-bank').innerHTML = `${beanIc()} ${fmt(gameState.balance)}`;
            return v;
        }
        function rewardUnit() { const st = (Game.save && Game.save.stage) || 1; return CHAPTERS[st].minBet; }

        /* =====================================================
           ROZETLER
           ===================================================== */
        const BADGES = [
            { id: 'first_win', ic: 'espresso', r: 30, t: s => s.wins >= 1 },
            { id: 'spins100', ic: 'aeropress', r: 60, t: s => s.spins >= 100 },
            { id: 'spins1000', ic: 'portafilter', r: 150, t: s => s.spins >= 1000 },
            { id: 'spins5000', ic: 'portafilter', r: 400, t: s => s.spins >= 5000 },
            { id: 'fs1', ic: 'book', r: 60, t: s => s.fs >= 1 },
            { id: 'fs25', ic: 'book', r: 250, t: s => s.fs >= 25 },
            { id: 'big', ic: 'goldenbean', r: 60, t: s => s.maxX >= 15 },
            { id: 'mega', ic: 'goldenbean', r: 120, t: s => s.maxX >= 40 },
            { id: 'epic', ic: 'goldenbean', r: 300, t: s => s.maxX >= 100 },
            { id: 'dede1', ic: 'dede', r: 40, t: s => s.orbs >= 1 },
            { id: 'dede25', ic: 'dede', r: 200, t: s => s.maxOrb >= 25 },
            { id: 'dede100', ic: 'dede', r: 250, t: s => s.orbs >= 100 },
            { id: 'zafer', ic: 'matcha', r: 80, t: s => s.zafer >= 1 },
            { id: 'rain', ic: 'cupcake', r: 80, t: s => s.rain >= 1 },
            { id: 'harvest', ic: 'coffeebag', r: 80, t: s => s.harvest >= 1 },
            { id: 'loy', ic: 'stamp', r: 80, t: s => s.loy >= 1 },
            { id: 'st2', ic: 'matcha', r: 50, t: s => s.maxStage >= 2 },
            { id: 'st3', ic: 'cupcake', r: 50, t: s => s.maxStage >= 3 },
            { id: 'st4', ic: 'coffeebag', r: 50, t: s => s.maxStage >= 4 },
            { id: 'st5', ic: 'stamp', r: 50, t: s => s.maxStage >= 5 },
            { id: 'hero', ic: 'barista', r: 500, t: s => s.finished >= 1 },
            { id: 'reel6', ic: 'espresso', r: 300, t: () => !!(Game.save && Game.save.ups && Game.save.ups.lx_reel6) },
            { id: 'fullpower', ic: 'bakingbear', r: 1000, t: () => !!Game.save && Engine.UPGRADES.every(u => (Game.save.ups[u.id] || 0) >= u.max) },
            { id: 'rich1m', ic: 'goldenbean', r: 100, t: s => s.maxBal >= 1e6 },
            { id: 'rich100m', ic: 'goldenbean', r: 500, t: s => s.maxBal >= 1e8 },
            { id: 'daily7', ic: 'cake', r: 200, t: () => Profile.daily.streak >= 7 },
            { id: 'album1', ic: 'cozybear', r: 300, t: () => albumCards().every(c => (Profile.stars[c.id] || 0) >= 1) },
            { id: 'album3', ic: 'cozybear', r: 1500, t: () => albumCards().every(c => (Profile.stars[c.id] || 0) >= 3) },
            { id: 'turbo', ic: 'v60', r: 100, t: s => s.turbo >= 500 },
            { id: 'quest10', ic: 'book', r: 300, t: s => s.quests >= 10 }
        ];
        function checkBadges() {
            const s = Profile.stats;
            let any = false;
            BADGES.forEach(b => {
                if (Profile.badges[b.id]) return;
                let ok = false;
                try { ok = b.t(s); } catch (e) {}
                if (!ok) return;
                Profile.badges[b.id] = Date.now();
                any = true;
                const v = grant(b.r * rewardUnit());
                const nm = L().badges.list[b.id][0];
                achToast(b.ic, tf(L().badges.got, { n: nm }), v ? tf(L().badges.reward, { v: fmt(v) }) : '');
            });
            if (any) { saveProfile(); if (Game.save) persist(); }
        }

        /* =====================================================
           ALBÜM
           ===================================================== */
        const ALBUM_TH = { rare: [1, 15, 75], mid: [3, 40, 200], com: [5, 75, 400] };
        function albumCards() {
            return [
                { id: 'barista', img: 'barista', th: ALBUM_TH.rare }, { id: 'girlfriend', img: 'cozybear', th: ALBUM_TH.rare },
                { id: 'baking_bear', img: 'bakingbear', th: ALBUM_TH.rare }, { id: 'book', img: 'book', th: ALBUM_TH.rare },
                { id: 'dede', img: 'dede', th: ALBUM_TH.rare, nm: () => L().dede.name },
                { id: 'portafilter', img: 'portafilter', th: ALBUM_TH.mid }, { id: 'v60', img: 'v60', th: ALBUM_TH.mid }, { id: 'espresso', img: 'espresso', th: ALBUM_TH.mid },
                { id: 'aeropress', img: 'aeropress', th: ALBUM_TH.com }, { id: 'golden_bean', img: 'goldenbean', th: ALBUM_TH.com }, { id: 'croissant', img: 'croissant', th: ALBUM_TH.com },
                { id: 'pitcher', img: 'pitcher', th: ALBUM_TH.mid }, { id: 'matcha', img: 'matcha', th: ALBUM_TH.mid }, { id: 'cupcake', img: 'cupcake', th: ALBUM_TH.mid },
                { id: 'coffeebag', img: 'coffeebag', th: ALBUM_TH.mid }, { id: 'stamp', img: 'stamp', th: ALBUM_TH.mid }
            ];
        }
        function albumName(c) { return c.nm ? c.nm() : symName(c.id); }
        function albumAdd(id, n) {
            if (!n) return;
            Profile.album[id] = (Profile.album[id] || 0) + n;
            const c = albumCards().find(x => x.id === id);
            if (!c) return;
            const have = Profile.stars[id] || 0;
            let st = 0; c.th.forEach((t, i) => { if (Profile.album[id] >= t) st = i + 1; });
            if (st > have) {
                Profile.stars[id] = st;
                const v = grant([20, 60, 200][st - 1] * rewardUnit());
                achToast(c.img, tf(L().album.starGot, { n: albumName(c), s: '★'.repeat(st), v: fmt(v) }), '');
            }
        }

        /* =====================================================
           SPİN SONRASI İSTATİSTİK (main.js afterSpin çağırır)
           ===================================================== */
        function metaOnSpin(res, p) {
            const s = Profile.stats, bet = Math.max(1, p.ctx.bet);
            s.spins++;
            if (turboOn()) s.turbo++;
            const ratio = (res.total || 0) / bet;
            if (res.total > 0) { s.wins++; s.maxX = Math.max(s.maxX, ratio); }
            const nOrb = (res.orbs || []).length;
            if (nOrb) { s.orbs += nOrb; albumAdd('dede', nOrb); }
            if (res.total > 0 && res.orbX > 1) s.maxOrb = Math.max(s.maxOrb, res.orbX);
            // albüm: kazandıran kombinasyondaki semboller
            const seen = {};
            (res.marks || []).forEach(m => { const sym = p.g[m.r] && p.g[m.r][m.row]; if (sym && !sym.special) seen[sym.id] = 1; });
            Object.keys(seen).forEach(id => { if (id !== 'book') albumAdd(id, 1); });
            if (res.scatter >= 3) albumAdd('book', 1);
            if (res.pitcher > 0 && res.total > 0) albumAdd('pitcher', 1);
            if (res.matchaConv) albumAdd('matcha', res.matchaConv);
            if (res.cupcakes > 0 && gameState.chapter === 3) albumAdd('cupcake', res.cupcakes);
            if (res.harvest > 0) { albumAdd('coffeebag', res.bags || 1); s.harvest++; }
            if (res.stamps > 0 && gameState.chapter === 5) albumAdd('stamp', res.stamps);
            s.maxBal = Math.max(s.maxBal, Math.floor(gameState.balance));
            // görevler
            questProgress('spins', 1);
            if (ratio > 0) { questMax('winx', ratio); questProgress('winsum', ratio); }
            if (ratio >= 15) questProgress('big', 1);
            if (nOrb) questProgress('orbs', nOrb);
            ustaRecord();
            checkBadges();
            saveProfile();
        }
        function metaEvent(kind, n) {
            const s = Profile.stats;
            if (kind === 'fs') { s.fs++; questProgress('fs', 1); }
            else if (kind === 'zafer') s.zafer++;
            else if (kind === 'rain') s.rain++;
            else if (kind === 'loy') { s.loy++; questProgress('loy', 1); }
            else if (kind === 'stage') s.maxStage = Math.max(s.maxStage, n);
            else if (kind === 'finish') { s.finished++; s.maxStage = 5; }
            s.maxBal = Math.max(s.maxBal, Math.floor(gameState.balance));
            checkBadges();
            saveProfile();
        }

        /* =====================================================
           USTA MODU (final sonrası): rekor + günlük görevler
           ===================================================== */
        function ustaActive() { return !!(Game.save && Game.save.finished); }
        function ustaRecord() {
            const sv = Game.save;
            if (!sv || !sv.finished) return;
            const bal = Math.floor(gameState.balance);
            if (bal > (sv.peak || 0)) {
                const mode = sv.diff || 'std';
                const prevBest = Profile.bestBy[mode] || 0;
                sv.peak = bal;
                if (bal > prevBest) {
                    Profile.bestBy[mode] = bal;
                    if (mode === 'std') { Profile.best = bal; Profile.bestName = sv.name; }
                    if (prevBest > 0 && (!gameState.recToastAt || Date.now() - gameState.recToastAt > 60000)) {
                        gameState.recToastAt = Date.now();
                        achToast('goldenbean', tf(L().usta.newRec, { v: fmt(bal) }), '');
                    }
                    if (typeof Cloud !== 'undefined') Cloud.scoreDirty = true;
                }
            }
        }
        const QUEST_POOL = [
            { id: 'spins', goals: [60, 100, 150] }, { id: 'winx', goals: [20, 30, 50], max: true }, { id: 'fs', goals: [1, 2] },
            { id: 'orbs', goals: [5, 10, 15] }, { id: 'loy', goals: [1, 2] }, { id: 'winsum', goals: [150, 250, 400] }, { id: 'big', goals: [1, 2, 3] }
        ];
        const QUEST_REWARD = 1500000, QUEST_CHEST = 6000000;
        function ensureQuests() {
            const sv = Game.save;
            if (!sv || !sv.finished) return null;
            const day = dayStr(0);
            if (sv.quests && sv.quests.day === day) return sv.quests;
            const rng = seeded(hashStr(day + ':' + (sv.created || 0)));
            const pool = QUEST_POOL.slice();
            const list = [];
            for (let i = 0; i < 3; i++) {
                const k = Math.floor(rng() * pool.length);
                const q = pool.splice(k, 1)[0];
                list.push({ id: q.id, goal: q.goals[Math.floor(rng() * q.goals.length)], prog: 0, claimed: false, max: !!q.max });
            }
            sv.quests = { day, list, chest: false };
            return sv.quests;
        }
        function questProgress(id, n) {
            const Q = ensureQuests(); if (!Q) return;
            Q.list.forEach(q => { if (q.id === id && !q.max && q.prog < q.goal) q.prog = Math.min(q.goal, q.prog + n); });
            updateUstaUI();
        }
        function questMax(id, v) {
            const Q = ensureQuests(); if (!Q) return;
            Q.list.forEach(q => { if (q.id === id && q.max) q.prog = Math.min(q.goal, Math.max(q.prog, v)); });
            updateUstaUI();
        }
        function questsDone() { const Q = ensureQuests(); if (!Q) return [0, 3]; return [Q.list.filter(q => q.prog >= q.goal).length, Q.list.length]; }
        function claimQuest(i) {
            const Q = ensureQuests(); if (!Q) return;
            const q = Q.list[i];
            if (!q || q.claimed || q.prog < q.goal) return;
            q.claimed = true;
            const v = grant(QUEST_REWARD);
            Profile.stats.quests++;
            achToast('book', tf(L().quests.got, { v: fmt(v) }), '');
            persist(); checkBadges(); saveProfile();
            renderHub();
        }
        function claimChest() {
            const Q = ensureQuests(); if (!Q || Q.chest || !Q.list.every(q => q.claimed)) return;
            Q.chest = true;
            const v = grant(QUEST_CHEST);
            achToast('cake', L().quests.chest, '+' + fmt(v));
            if (document.body.dataset.mode === 'game') celebrate(gameState.bet * 40);
            persist();
            renderHub();
        }
        function updateUstaUI() {
            if (!ustaActive()) return;
            const [a, b] = questsDone();
            const btn = $('buy-btn');
            if (!btn) return;
            btn.textContent = tf(L().quests.btn, { a, b });
            btn.classList.remove('locked');
            btn.classList.toggle('ready', a > 0 && ensureQuests().list.some(q => q.prog >= q.goal && !q.claimed));
            $('goal-num').textContent = tf(L().usta.rec, { v: fmt(Game.save.peak || gameState.balance) });
        }

        /* =====================================================
           GÜNLÜK GİRİŞ ÖDÜLÜ (7 günlük seri)
           ===================================================== */
        const DAILY_X = [50, 75, 100, 150, 200, 300, 500];
        function dailyState() {
            const d = Profile.daily, t = dayStr(0);
            if (d.last === t) return { claimed: true, streak: d.streak };
            return { claimed: false, streak: d.last === dayStr(-1) ? d.streak + 1 : 1 };
        }
        function dailyAmount(dayIdx) { return DAILY_X[dayIdx] * rewardUnit(); }
        function claimDaily() {
            if (!Game.save) return;
            const st = dailyState();
            if (st.claimed) return;
            const idx = (st.streak - 1) % 7;
            const v = grant(dailyAmount(idx));
            Profile.daily = { streak: st.streak, last: dayStr(0) };
            if (idx === 6) { Game.save.dedeGift = true; }
            [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 110));
            setTimeout(() => showDialog(idx === 6 ? 'dede' : 'cozybear', idx === 6 ? L().dede.name : (CUR_LANG() === 'en' ? 'BlueBird' : 'MaviKuş'), tf(idx === 6 ? L().daily.got7 : L().daily.got, { v: fmt(v) })), 300);
            persist(); saveProfile(); checkBadges();
            renderHub();
        }
        function maybeAutoDaily() {
            if (!Game.save) return;
            if (dailyState().claimed) return;
            setTimeout(() => { if (!anyModalOpen() && Game.save) openHub('daily'); }, 700);
        }

        /* =====================================================
           KUPA ODASI (sekmeli pencere)
           ===================================================== */
        let hubTab = 'daily';
        function openHub(tab) {
            hubTab = tab || hubTab;
            if (hubTab === 'quests' && !ustaActive()) hubTab = hubTab;
            playSynthNote(560, 0.06);
            renderHub();
            openModal('modal-hub');
            if (hubTab === 'top') loadWorldTop();
        }
        function closeHub() { closeModal('modal-hub'); if (document.body.dataset.mode === 'game') { updateHUD(); updateUstaUI(); } }
        function renderHub() {
            const H = L().hub;
            if (!$('modal-hub')) return;
            $('hub-title').textContent = H.title;
            const tabs = $('hub-tabs'); tabs.innerHTML = '';
            ['daily', 'badges', 'album', 'quests', 'top'].forEach(id => {
                const b = document.createElement('button');
                b.className = 'tab' + (id === hubTab ? ' on' : '');
                b.textContent = H.tabs[id];
                if (id === 'daily' && Game.save && !dailyState().claimed) b.classList.add('dot');
                if (id === 'quests' && ustaActive()) { const Q = ensureQuests(); if (Q && Q.list.some(q => q.prog >= q.goal && !q.claimed)) b.classList.add('dot'); }
                b.onclick = () => { hubTab = id; playSynthNote(520, 0.04); renderHub(); if (id === 'top') loadWorldTop(); };
                tabs.appendChild(b);
            });
            const body = $('hub-body');
            body.innerHTML = ({ daily: hubDaily, badges: hubBadges, album: hubAlbum, quests: hubQuests, top: hubTop })[hubTab]();
            body.scrollTop = 0;
        }
        function hubDaily() {
            const D = L().daily;
            if (!Game.save) return `<p class="hub-note">${L().hub.needSave}</p>`;
            const st = dailyState();
            const cur = (st.streak - 1) % 7;
            let h = `<p class="hub-info">${D.info}</p><div class="daily-grid">`;
            for (let i = 0; i < 7; i++) {
                const got = st.claimed ? i <= cur : i < cur;
                const today = !st.claimed && i === cur;
                h += `<div class="dd-day ${got ? 'got' : ''} ${today ? 'today' : ''} ${i === 6 ? 'big' : ''}">
                        <small>${tf(D.day, { n: i + 1 })}</small>
                        <img src="${ASSETS.sym[i === 6 ? 'dede' : (i >= 4 ? 'coffeebag' : 'goldenbean')]}" alt="">
                        <b>${fmt(dailyAmount(i))}</b>${got ? '<span class="tick">✓</span>' : ''}</div>`;
            }
            h += `</div><p class="hub-mid">${tf(D.streak, { n: st.claimed ? st.streak : Math.max(0, st.streak - 1) })}</p>`;
            h += st.claimed ? `<p class="hub-ok">${D.claimed}</p>` : `<button class="btn btn-block btn-green pulse" onclick="claimDaily()">${D.claim} · +${fmt(dailyAmount(cur))}</button>`;
            return h;
        }
        function hubBadges() {
            const B = L().badges;
            const have = BADGES.filter(b => Profile.badges[b.id]).length;
            let h = `<p class="hub-mid">${tf(B.count, { a: have, b: BADGES.length })}</p><div class="badge-grid">`;
            BADGES.forEach(b => {
                const got = Profile.badges[b.id];
                const [nm, ds] = B.list[b.id];
                const date = got ? new Date(got).toLocaleDateString(CUR_LANG() === 'en' ? 'en-US' : 'tr-TR') : '';
                h += `<div class="bdg ${got ? 'got' : ''}" title="${escapeHtml(ds)}"><div class="bi"><img src="${ASSETS.sym[b.ic]}" alt=""></div><b>${escapeHtml(nm)}</b><small>${escapeHtml(ds)}</small>${got ? `<em>${tf(B.when, { d: date })}</em>` : `<em class="r">🔒 ${B.locked}</em>`}</div>`;
            });
            return h + '</div>';
        }
        function hubAlbum() {
            const A = L().album, cards = albumCards();
            const open = cards.filter(c => (Profile.stars[c.id] || 0) >= 1).length;
            const stars = cards.reduce((a, c) => a + (Profile.stars[c.id] || 0), 0);
            let h = `<p class="hub-info">${A.info}</p><p class="hub-mid">${tf(A.count, { a: open, b: cards.length, s: stars })}</p><div class="album-grid">`;
            cards.forEach(c => {
                const st = Profile.stars[c.id] || 0, n = Profile.album[c.id] || 0;
                const next = c.th[Math.min(st, 2)];
                const pct = st >= 3 ? 100 : Math.min(100, n / next * 100);
                h += `<div class="acard s${st} ${st ? '' : 'locked'}">
                        <div class="ac-img"><img src="${ASSETS.sym[c.img]}" alt=""></div>
                        <b>${st ? escapeHtml(albumName(c)) : A.lockedName}</b>
                        <div class="ac-stars">${'★'.repeat(st)}<span>${'☆'.repeat(3 - st)}</span></div>
                        <div class="ac-bar"><i style="width:${pct}%"></i></div>
                        <small class="ac-n">${st >= 3 ? A.max : tf(A.prog, { a: fmt(n), b: fmt(next) })}</small>
                        ${st ? `<p class="ac-bio">${escapeHtml(A.bios[c.id] || '')}</p>` : ''}
                      </div>`;
            });
            return h + '</div>';
        }
        function hubQuests() {
            const Q = L().quests;
            if (!ustaActive()) return `<div class="hub-lock"><img src="${ASSETS.sym.dede}" alt=""><p>${Q.locked}</p></div>`;
            const D = ensureQuests();
            let h = `<p class="hub-info">${Q.info}</p><div class="quest-list">`;
            D.list.forEach((q, i) => {
                const done = q.prog >= q.goal;
                const txt = tf(Q.list[q.id], { n: fmt(q.goal) });
                h += `<div class="quest ${done ? 'done' : ''} ${q.claimed ? 'claimed' : ''}">
                        <div class="qb"><b>${txt}</b><div class="ac-bar"><i style="width:${Math.min(100, q.prog / q.goal * 100)}%"></i></div><small>${fmt(Math.floor(q.prog))} / ${fmt(q.goal)} · +${fmt(QUEST_REWARD)}</small></div>
                        <button class="btn btn-sm ${q.claimed ? 'btn-soft' : 'btn-green'}" ${!done || q.claimed ? 'disabled' : ''} onclick="claimQuest(${i})">${q.claimed ? Q.done : Q.claim}</button>
                      </div>`;
            });
            const all = D.list.every(q => q.claimed);
            h += `</div><div class="quest chest ${D.chest ? 'claimed' : ''}"><div class="qb"><b>${Q.chest}</b><small>${tf(Q.chestTxt, { v: fmt(QUEST_CHEST) })}</small></div>
                  <button class="btn btn-sm btn-green" ${!all || D.chest ? 'disabled' : ''} onclick="claimChest()">${D.chest ? Q.chestGot : Q.claim}</button></div>`;
            return h;
        }
        let worldTop = null, worldErr = false, worldLoading = false, lbMode = 'std';
        const LB_FIELD = { story: 'bestStory', std: 'best', gambler: 'bestGambler' };
        function setLbMode(m) { lbMode = m; worldTop = null; playSynthNote(520, 0.04); renderHub(); loadWorldTop(); }
        function hubTop() {
            const T = L().lb, F = LB_FIELD[lbMode];
            SLOTS.forEach(s => { if (s && s.finished) { const k = s.diff || 'std'; if ((s.peak || 0) > (Profile.bestBy[k] || 0)) Profile.bestBy[k] = s.peak; } });
            Profile.best = Math.max(Profile.best || 0, Profile.bestBy.std || 0);
            let h = `<p class="hub-info">${T.info}</p>`;
            h += `<div class="seg lb-seg">${['story', 'std', 'gambler'].map(k => `<button class="${k === lbMode ? 'on' : ''}" onclick="setLbMode('${k}')">${DIFF_ICON[k]} ${L().diff[k][0]}</button>`).join('')}</div>`;
            const mine = Profile.bestBy[lbMode] || 0;
            h += `<div class="lb-me"><img src="${avatarSrc()}" alt=""><div><small>${T.me}</small><b>${escapeHtml(nickOf())}</b></div><span>${mine ? fmt(mine) : '—'}</span></div>`;
            h += `<h4 class="lb-h">${T.world}</h4>`;
            if (!Cloud.user) h += `<p class="hub-note">${Cloud.available() ? T.login : L().prof.nocfg} <button class="btn btn-sm" onclick="closeHub();openProfile()">👤</button></p>`;
            else if (worldLoading) h += `<p class="hub-note">${T.loading}</p>`;
            else if (worldErr) h += `<p class="hub-note">${T.err}</p>`;
            else if (worldTop && worldTop.length) {
                const myIdx = worldTop.findIndex(r => r.uid === Cloud.user.uid);
                if (myIdx >= 0) h += `<p class="hub-mid">${tf(T.rank, { n: myIdx + 1 })}</p>`;
                h += '<ol class="lb-list">' + worldTop.map((r, i) => `<li class="${r.uid === Cloud.user.uid ? 'me' : ''}"><span class="rk">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span><img src="${avatarSrc(r.avatar)}" alt=""><b>${escapeHtml(r.nick || '?')}</b><span>${fmt(r[F] || 0)}</span></li>`).join('') + '</ol>';
            } else h += `<p class="hub-note">${T.none}</p>`;
            const local = SLOTS.map((s, i) => s && s.finished && (s.diff || 'std') === lbMode ? { name: nickOf() + ' · ' + slotLabel(i), peak: s.peak || s.balance, i } : null).filter(Boolean).sort((a, b) => b.peak - a.peak);
            h += `<h4 class="lb-h">${T.local}</h4>`;
            h += local.length ? '<ol class="lb-list">' + local.map((r, i) => `<li><span class="rk">${i + 1}</span><img src="${ASSETS.sym.barista}" alt=""><b>${escapeHtml(r.name)}</b><span>${fmt(r.peak)}</span></li>`).join('') + '</ol>' : `<p class="hub-note">${T.none}</p>`;
            return h;
        }
        function loadWorldTop() {
            if (!Cloud.user || worldLoading) return;
            worldLoading = true; worldErr = false;
            if (hubTab === 'top') renderHub();
            Cloud.top(LB_FIELD[lbMode]).then(list => { worldTop = list; }).catch(() => { worldErr = true; }).then(() => { worldLoading = false; if (hubTab === 'top' && $('modal-hub').classList.contains('open')) renderHub(); });
        }

        /* =====================================================
           PROFİL PENCERESİ
           ===================================================== */
        const AVATARS = ['barista', 'cozybear', 'bakingbear', 'dede', 'espresso', 'v60', 'cupcake', 'goldenbean', 'croissant', 'matcha'];
        let profDraft = null;
        function openProfile() {
            profDraft = { nick: Profile.nick || (Game.save && Game.save.name) || '', avatar: Profile.avatar };
            playSynthNote(560, 0.06);
            renderProfile();
            openModal('modal-profile');
        }
        function renderProfile(msg) {
            const P = L().prof;
            $('pf-title').textContent = P.title;
            $('pf-nick-l').textContent = P.nick;
            const inp = $('pf-nick'); if (document.activeElement !== inp) inp.value = profDraft.nick; inp.placeholder = P.nickPh;
            $('pf-av-l').textContent = P.avatar;
            $('pf-preview').src = avatarSrc(profDraft.avatar);
            const g = $('pf-avs'); g.innerHTML = '';
            const custom = profDraft.avatar.startsWith('data:') ? [profDraft.avatar] : (Profile.avatar.startsWith('data:') ? [Profile.avatar] : []);
            [...custom, ...AVATARS.map(k => 'sym:' + k)].forEach(a => {
                const b = document.createElement('button');
                b.className = 'av' + (a === profDraft.avatar ? ' on' : '');
                b.innerHTML = `<img src="${avatarSrc(a)}" alt="">`;
                b.onclick = () => { profDraft.avatar = a; playSynthNote(600, 0.04); renderProfile(); };
                g.appendChild(b);
            });
            $('pf-upload').textContent = P.upload;
            $('pf-save').textContent = P.save;
            $('pf-close').textContent = P.close;
            $('pf-acc-t').textContent = P.acc;
            renderAccount(msg);
        }
        function renderAccount(msg) {
            const P = L().prof, box = $('pf-acc');
            let h = '';
            if (!Cloud.available()) h = `<p class="hub-note">${P.nocfg}</p>`;
            else if (Cloud.user) {
                const e = Cloud.user.email || Cloud.user.displayName || 'Google';
                h = `<p class="pf-ok">${tf(P.signedAs, { e: escapeHtml(e) })}</p><p class="hub-note">${tf(P.lastSync, { t: Cloud.lastSync ? new Date(Cloud.lastSync).toLocaleString(CUR_LANG() === 'en' ? 'en-US' : 'tr-TR') : P.never })}</p>
                     <div class="row"><button class="btn btn-sm" onclick="Cloud.syncNow()">${P.syncNow}</button><button class="btn btn-sm btn-soft" onclick="Cloud.logout()">${P.out}</button></div>
                     <button class="linkbtn" onclick="Cloud.askDelete()">${P.del}</button>`;
            } else if (!navigator.onLine) h = `<p class="hub-note">${P.offline}</p>`;
            else {
                h = `<p class="hub-info">${P.accInfo}</p>
                     <button class="btn btn-block btn-google" onclick="Cloud.google()"><span class="g">G</span> ${P.google}</button>
                     <div class="pf-or">— ${CUR_LANG() === 'en' ? 'or' : 'ya da'} —</div>
                     <input id="pf-mail" type="email" autocomplete="email" placeholder="${P.email}">
                     <input id="pf-pass" type="password" autocomplete="current-password" placeholder="${P.pass}">
                     <div class="row"><button class="btn btn-sm" onclick="Cloud.emailLogin(false)">${P.login}</button><button class="btn btn-sm btn-soft" onclick="Cloud.emailLogin(true)">${P.register}</button></div>
                     <button class="linkbtn" onclick="Cloud.resetPass()">${P.forgot}</button>`;
            }
            h += `<a class="linkbtn pf-priv" href="${PRIVACY_URL}" target="_blank" rel="noopener">${P.privacy}</a>`;
            if (Cloud.busy) h = `<p class="hub-note">${P.loading}</p>` + h;
            if (msg) h = `<p class="pf-msg">${msg}</p>` + h;
            box.innerHTML = h;
        }
        function saveProfileForm() {
            profDraft.nick = ($('pf-nick').value || '').trim().slice(0, 16);
            Profile.nick = profDraft.nick;
            Profile.avatar = profDraft.avatar;
            saveProfile();
            if (Cloud.user) Cloud.scoreDirty = true;
            renderMenu();
            if ($('hud-player-name')) $('hud-player-name').textContent = nickOf();
            if (Game.save && document.body.dataset.screen === 'screen-map') $('map-name').textContent = nickOf();
            renderProfile(L().prof.saved);
            playSynthNote(784, 0.1);
        }
        function pickPhoto(input) {
            const f = input.files && input.files[0];
            input.value = '';
            if (!f) return;
            const rd = new FileReader();
            rd.onload = () => {
                const im = new Image();
                im.onload = () => {
                    const S = 128, c = document.createElement('canvas'); c.width = c.height = S;
                    const x = c.getContext('2d');
                    const s = Math.min(im.width, im.height);
                    x.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, S, S);
                    profDraft.avatar = c.toDataURL('image/jpeg', 0.8);
                    renderProfile();
                };
                im.onerror = () => renderProfile(L().prof.photoErr);
                im.src = rd.result;
            };
            rd.readAsDataURL(f);
        }
        function smallAvatar(a) {
            // skor tablosu için küçük sürüm
            if (!a || !a.startsWith('data:')) return Promise.resolve(a || 'sym:barista');
            return new Promise(res => {
                const im = new Image();
                im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 48; c.getContext('2d').drawImage(im, 0, 0, 48, 48); res(c.toDataURL('image/jpeg', 0.7)); };
                im.onerror = () => res('sym:barista');
                im.src = a;
            });
        }

        /* =====================================================
           KAYIT YEDEĞİ (kod)
           ===================================================== */
        function b64enc(str) { return btoa(unescape(encodeURIComponent(str))); }
        function b64dec(b) { return decodeURIComponent(escape(atob(b))); }
        function exportCode() {
            if (Game.save) persist();
            const data = JSON.stringify({ v: 5, t: Date.now(), slots: SLOTS, profile: Profile });
            const body = b64enc(data);
            return 'ROB5-' + (hashStr(body) % 1679616).toString(36).padStart(4, '0') + '-' + body;
        }
        function parseCode(code) {
            code = String(code || '').replace(/\s+/g, '');
            const m = code.match(/^ROB5-([0-9a-z]{4})-(.+)$/);
            if (!m) return null;
            if ((hashStr(m[2]) % 1679616).toString(36).padStart(4, '0') !== m[1]) return null;
            try { const d = JSON.parse(b64dec(m[2])); if (!d || !Array.isArray(d.slots)) return null; return d; } catch (e) { return null; }
        }
        function openBackup() {
            const B = L().bak;
            $('bk-title').textContent = B.title;
            $('bk-info').textContent = B.info;
            $('bk-copy').textContent = B.copy; $('bk-file').textContent = B.file; $('bk-load').textContent = B.load;
            $('bk-in').placeholder = B.paste; $('bk-in').value = '';
            $('bk-msg').textContent = '';
            $('bk-close').textContent = L().set.close;
            openModal('modal-backup');
        }
        function backupCopy() {
            const code = exportCode();
            const done = () => { $('bk-msg').textContent = L().bak.copied; };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done).catch(() => { $('bk-in').value = code; $('bk-in').select(); try { document.execCommand('copy'); } catch (e) {} done(); });
            else { $('bk-in').value = code; $('bk-in').select(); try { document.execCommand('copy'); } catch (e) {} done(); }
        }
        function backupFile() {
            const code = exportCode();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
            a.download = 'recipes-of-barista-yedek-' + dayStr(0) + '.txt';
            document.body.appendChild(a); a.click();
            setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        }
        function backupLoad() {
            const d = parseCode($('bk-in').value);
            const B = L().bak;
            if (!d) { $('bk-msg').textContent = B.bad; playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            closeModal('modal-backup');
            confirmBox({ title: B.okT, text: tf(B.okTxt, { n: d.slots.filter(Boolean).length }), art: ['book', 'goldenbean'], ok: B.yes, good: true, onOk: () => {
                applyImported(d.slots, d.profile, true);
                showDialog('barista', 'Bearista', B.done);
            } });
        }
        /* yedekten/buluttan gelen veriyi uygula */
        function applyImported(slots, prof, replace) {
            const arr = (slots || []).slice(0, SLOT_COUNT);
            while (arr.length < SLOT_COUNT) arr.push(null);
            for (let i = 0; i < SLOT_COUNT; i++) SLOTS[i] = arr[i] || (replace ? null : SLOTS[i]);
            writeSlots();
            if (prof) { Profile = normProfile(prof); lsSet(PROF_KEY, Profile); }
            if (Game.save) { Game.save = null; Game.slot = null; }
            if (document.body.dataset.mode === 'game' || document.body.dataset.screen === 'screen-map') returnToMenu(); else renderMenu();
            if (typeof Cloud !== 'undefined') Cloud.dirty();
        }

        /* =====================================================
           AYARLAR
           ===================================================== */
        Settings.musVol = Settings.musVol !== undefined ? Settings.musVol : 0.7;
        Settings.sfxVol = Settings.sfxVol !== undefined ? Settings.sfxVol : 0.9;
        Settings.turbo = !!Settings.turbo;
        Settings.vibe = Settings.vibe !== false;
        Settings.fx = Settings.fx || 'full';
        function turboOn() { return !!Settings.turbo; }
        function lowFx() { return Settings.fx === 'low'; }
        function openSettings() {
            playSynthNote(560, 0.06);
            refreshSettingsUI();
            openModal('modal-settings');
        }
        function refreshSettingsUI() {
            if (!$('modal-settings')) return;
            const S = L().set;
            $('set-title').textContent = S.title;
            const tog = (on) => on ? S.on : S.off;
            $('set-body').innerHTML = `
                <div class="set-row"><span>${S.lang}</span><div class="seg"><button class="${_lang === 'tr' ? 'on' : ''}" onclick="setLang('tr')">Türkçe</button><button class="${_lang === 'en' ? 'on' : ''}" onclick="setLang('en')">English</button></div></div>
                <div class="set-row"><span>${S.mute}</span><button class="tg ${isMuted ? '' : 'on'}" onclick="toggleMute()">${tog(!isMuted)}</button></div>
                <div class="set-row"><span>${S.music}</span><input type="range" min="0" max="100" value="${Math.round(Settings.musVol * 100)}" oninput="setVol('musVol', this.value)"></div>
                <div class="set-row"><span>${S.sfx}</span><input type="range" min="0" max="100" value="${Math.round(Settings.sfxVol * 100)}" oninput="setVol('sfxVol', this.value)" onchange="playSynthNote(880,0.1)"></div>
                <div class="set-row"><span>${S.turbo}</span><button class="tg ${Settings.turbo ? 'on' : ''}" onclick="toggleTurbo(true)">${tog(Settings.turbo)}</button></div>
                <div class="set-row"><span>${S.vibe}</span><button class="tg ${Settings.vibe ? 'on' : ''}" onclick="Settings.vibe=!Settings.vibe;saveSettings();buzz(40);refreshSettingsUI()">${tog(Settings.vibe)}</button></div>
                <div class="set-row"><span>${S.fx}</span><button class="tg ${lowFx() ? 'on' : ''}" onclick="toggleLowFx()">${tog(lowFx())}</button></div>
                <div class="set-links">
                    <button class="btn btn-soft btn-block" onclick="closeModal('modal-settings');openProfile()">${S.account}</button>
                    <button class="btn btn-soft btn-block" onclick="closeModal('modal-settings');openBackup()">${S.backup}</button>
                    ${document.body.dataset.mode === 'game' && gameState.chapter === 1 ? `<button class="btn btn-soft btn-block" onclick="closeModal('modal-settings');showTutorial()">${S.tut}</button>` : ''}
                    ${PWA.canInstall() ? `<button class="btn btn-green btn-block" onclick="PWA.install()">${S.install}</button>` : (PWA.installed() ? `<p class="hub-ok">${S.installed}</p>` : '')}
                    <button class="btn btn-block btn-danger" onclick="resetAll()">${S.reset}</button>
                </div>
                <p class="set-ver">${S.offline} · ${S.ver} 5.3</p>`;
            $('set-close').textContent = S.close;
        }
        function setVol(k, v) { Settings[k] = Math.max(0, Math.min(1, v / 100)); saveSettings(); applyVolumes(); }
        function setLang(l) {
            if (_lang !== l) { _lang = l; Settings.lang = l; saveSettings(); }
            playSynthNote(560, 0.06);
            applyStaticI18n(); renderMenu(); buildPayTable(); refreshSettingsUI();
            if (document.body.dataset.mode === 'game') { updateHUD(); updateBanner(); updateLoyaltyUI(); updateOvenUI(); updateMatchaUI(); updateTurboUI(); setMessage(L().msg.welcome); }
            if (document.body.dataset.screen === 'screen-map') openMap();
        }
        function toggleTurbo(fromSettings) {
            Settings.turbo = !Settings.turbo;
            saveSettings();
            playSynthNote(Settings.turbo ? 990 : 520, 0.08, 'square', 0.04);
            buzz(25);
            updateTurboUI();
            if (!fromSettings && document.body.dataset.mode === 'game') setMessage(Settings.turbo ? L().turbo.on : L().turbo.off);
            refreshSettingsUI();
        }
        function updateTurboUI() { const b = $('turbo-btn'); if (b) b.classList.toggle('on', turboOn()); document.body.classList.toggle('turbo', turboOn()); }
        function toggleLowFx() {
            Settings.fx = lowFx() ? 'full' : 'low';
            saveSettings();
            document.body.classList.toggle('lowfx', lowFx());
            if (renderer) renderer.setPixelRatio(lowFx() ? 1 : Math.min(window.devicePixelRatio || 1, 2));
            if (typeof onWindowResize === 'function') onWindowResize();
            refreshSettingsUI();
        }
        function resetAll() {
            const S = L().set;
            closeModal('modal-settings');
            confirmBox({ title: S.resetT, text: S.resetTxt, art: ['cozybear'], ok: S.resetYes, onOk: () => {
                try { localStorage.removeItem(SLOT_KEY); localStorage.removeItem(PROF_KEY); } catch (e) {}
                for (let i = 0; i < SLOT_COUNT; i++) SLOTS[i] = null;
                writeSlots();
                Profile = newProfile(); lsSet(PROF_KEY, Profile);
                Settings.last = null; saveSettings();
                Game.save = null; Game.slot = null;
                returnToMenu();
            } });
        }

        /* =====================================================
           ANA MENÜ PROFİL KARTI
           ===================================================== */
        function renderProfileChip() {
            const el = $('menu-profile');
            if (!el) return;
            const M = L().menu2;
            let st = Cloud.user ? (Cloud.busy ? M.cloudSync : (Cloud.err ? M.cloudErr : M.cloudOn)) : M.cloudOff;
            el.innerHTML = `<img src="${avatarSrc()}" alt=""><div><b>${escapeHtml(Profile.nick || M.guest)}</b><small>${st}</small></div><span class="pc-edit">✎</span>`;
            el.title = M.tapProfile;
        }

        /* =====================================================
           PWA: ana ekrana ekle + çevrimdışı (web sürümünde)
           ===================================================== */
        const PWA = {
            evt: null,
            init() {
                const web = /^https?:/.test(location.protocol);
                if (web) {
                    if (!document.querySelector('link[rel=apple-touch-icon]')) { const l = document.createElement('link'); l.rel = 'apple-touch-icon'; l.href = 'apple-touch-icon.png'; document.head.appendChild(l); }
                    if (!document.querySelector('link[rel=manifest]')) { const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.webmanifest'; document.head.appendChild(l); }
                    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
                }
                window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); PWA.evt = e; refreshSettingsUI(); });
                window.addEventListener('appinstalled', () => { PWA.evt = null; refreshSettingsUI(); });
            },
            canInstall() { return !!this.evt; },
            installed() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } },
            install() { if (!this.evt) return; this.evt.prompt(); this.evt.userChoice.finally(() => { PWA.evt = null; refreshSettingsUI(); }); }
        };

