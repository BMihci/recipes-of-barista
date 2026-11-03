        /* =====================================================
           OYUN VERİSİ + KAYIT SİSTEMİ (3 yuva, tek kasa)
           ===================================================== */
        let scene, camera, renderer;
        let reelColumns = [];
        let winningMeshRefs = [];
        let teasePlanes = [];
        let builtReels = 0;
        let threeReady = false;
        let threeActive = false;
        let rafId = null;

        const SYMBOLS = Engine.SYMBOLS;
        const CHAPTERS = Engine.CHAPTERS;
        const SLOT_COUNT = 3;
        const SLOT_KEY = 'rob_v5_slots';
        const SET_KEY = 'rob_v5_settings';

        function lsGet(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
        function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

        const Settings = Object.assign({ lang: 'tr', last: null, muted: false }, lsGet(SET_KEY, {}));
        function saveSettings() { lsSet(SET_KEY, Settings); }
        _lang = I18N[Settings.lang] ? Settings.lang : 'tr';

        let SLOTS = lsGet(SLOT_KEY, []);
        if (!Array.isArray(SLOTS)) SLOTS = [];
        while (SLOTS.length < SLOT_COUNT) SLOTS.push(null);
        function writeSlots() { lsSet(SLOT_KEY, SLOTS); }

        function newLoyalty() { return { stamps: 0, americano: 0, filtre: false, latte: 0 }; }
        function newSave(name, diff) {
            return { v: 6, saga: true, name, diff: 'story', treasure: 0, stage: 1, balance: CHAPTERS[1].seed, bet: 0, ups: {}, loy: newLoyalty(), oven: 0, phases: {}, seen: {}, tut: false, finished: false, busts: 0, videos: 0, fs: null, peak: 0, quests: null, dedeGift: false, lastGift: Date.now(), created: Date.now(), updated: Date.now() };
        }

        /* Aktif kayıt */
        const Game = { slot: null, save: null };

        let gameState = {
            playerName: 'Bearista',
            balance: CHAPTERS[1].seed,
            bet: CHAPTERS[1].minBet,
            grid: [],
            isSpinning: false,
            spinFree: false,
            autoSpinActive: false,
            freeSpinsRemaining: 0,
            freeSpinsTotal: 0,
            expandingSymbolId: null,
            rainRemaining: 0,          // Pasta Yağmuru (Aşama 3)
            rainTotal: 0,
            rainPending: false,
            fsMult: 0,
            fsWin: 0,
            chapter: 1,
            phasesShown: {},
            loy: newLoyalty(),
            oven: 0,
            reelsPending: false
        };

        /* Kaydı oyun durumuna yükle / oyun durumunu kayda yaz */
        function loadIntoState(sv) {
            gameState.playerName = sv.name;
            gameState.chapter = sv.stage;
            gameState.balance = sv.balance;
            gameState.bet = sv.bet || 0;
            gameState.loy = Object.assign(newLoyalty(), sv.loy || {});
            gameState.oven = sv.oven || 0;
            gameState.mwar = sv.mwar || 0;
            const fs = sv.fs || {};
            gameState.freeSpinsRemaining = fs.rem || 0;
            gameState.freeSpinsTotal = fs.total || 0;
            gameState.expandingSymbolId = fs.exp || null;
            gameState.rainRemaining = fs.rain || 0;
            gameState.rainTotal = fs.rainTotal || 0;
            gameState.rainPending = !!fs.rainPending;
            gameState.fsMult = fs.fsMult || 0;
            gameState.fsWin = fs.fsWin || 0;
            if (!sv.lastGift) sv.lastGift = sv.created || Date.now();
            gameState.phasesShown = {};
            gameState.autoSpinActive = false;
            gameState.isSpinning = false;
            gameState.grid = [];
            refreshEff();
        }
        function persist() {
            const sv = Game.save;
            if (!sv) return;
            sv.balance = Math.floor(gameState.balance);
            sv.bet = gameState.bet;
            sv.stage = gameState.chapter;
            sv.loy = gameState.loy;
            sv.oven = gameState.oven;
            sv.mwar = gameState.mwar || 0;
            sv.fs = (gameState.freeSpinsRemaining > 0 || gameState.rainRemaining > 0 || gameState.rainPending)
                ? { rem: gameState.freeSpinsRemaining, total: gameState.freeSpinsTotal, exp: gameState.expandingSymbolId, rain: gameState.rainRemaining, rainTotal: gameState.rainTotal, rainPending: gameState.rainPending, fsMult: gameState.fsMult || 0, fsWin: gameState.fsWin || 0 }
                : null;
            sv.updated = Date.now();
            SLOTS[Game.slot] = sv;
            writeSlots();
            Settings.last = Game.slot;
            saveSettings();
            if (typeof Cloud !== 'undefined') Cloud.dirty();
        }

        /* Atölye etkileri (kayıttaki yükseltmeler) + aşama içi sadakat etkisi */
        let RUN_EFF = Engine.effects({});
        function refreshEff() {
            const ups = (Game.save && Game.save.ups) || {};
            RUN_EFF = Engine.effects(ups, { latte: gameState.loy.latte, chapter: gameState.chapter || (Game.save && Game.save.stage) || 1 });
        }
        function upLevel(id) { return (Game.save && Game.save.ups[id]) || 0; }
        function reelCount() { return RUN_EFF.reels || 5; }
        function nextFreeSpins() { return gameState.loy.filtre ? 20 : RUN_EFF.freeSpins; }
        function stageUnlocked(n) { return !!Game.save && Game.save.stage >= n; }

        function fmt(n) { return fmtN(n); }
        function fmtX(v) { return fx(v >= 100 ? Math.round(v) : v >= 10 ? Math.round(v * 10) / 10 : Math.round(v * 100) / 100); }
        function beanIc() { return `<img class="bean-ic" src="${ASSETS.sym.goldenbean}" alt="">`; }

        /* Spin sırasında dönen (görsel) semboller */
        function visualSymbol(r) {
            return Engine.pickSymbol({ chapter: gameState.chapter, tier: 0, eff: RUN_EFF, ovenRain: gameState.rainRemaining > 0 }, r, Math.random);
        }
