        /* =====================================================
           OYUN VERİSİ — matematik Engine'den gelir (engine.js)
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
        const PAYLINES = Engine.PAYLINES;
        const CHAPTERS = Engine.CHAPTERS;

        /* ---------- KALICI KAYIT (Barista Atölyesi) ---------- */
        const SAVE_KEY = 'barista_save_v2';
        const Save = {
            data: { wallet: 0, earned: 0, ups: {}, done: {}, seen: {}, phases: {}, name: 'Bearista' },
            load() {
                try {
                    const raw = localStorage.getItem(SAVE_KEY);
                    if (raw) {
                        const d = JSON.parse(raw);
                        Object.keys(this.data).forEach(k => { if (d && d[k] !== undefined) this.data[k] = d[k]; });
                    }
                } catch (e) {}
            },
            save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) {} },
            level(id) { return this.data.ups[id] || 0; }
        };
        Save.load();

        function newLoyalty() { return { stamps: 0, americano: 0, filtre: false, latte: 0 }; }

        let gameState = {
            playerName: Save.data.name || "Bearista",
            balance: CHAPTERS[1].start,
            bet: CHAPTERS[1].minBet,
            rows: 3,
            grid: [],
            isSpinning: false,
            spinFree: false,
            autoSpinActive: false,
            freeSpinsRemaining: 0,
            freeSpinsTotal: 0,
            expandingSymbolId: null,
            chapter: 1,
            chapterStartBalance: CHAPTERS[1].start,
            chapterDone: false,
            phasesShown: {},
            loy: newLoyalty(),         // Bölüm 3 sadakat kartı (bölüm boyunca geçerli)
            reelsPending: false
        };

        /* Atölye etkileri (EFF) + bölüm içi sadakat etkileri (RUN_EFF: oyunda kullanılan) */
        let EFF = Engine.effects(Save.data.ups);
        let RUN_EFF = EFF;
        function refreshEff() {
            EFF = Engine.effects(Save.data.ups);
            RUN_EFF = Engine.effects(Save.data.ups, { latte: gameState.loy.latte });
        }
        refreshEff();
        function reelCount() { return RUN_EFF.reels || 5; }
        function nextFreeSpins() { return gameState.loy.filtre ? 20 : RUN_EFF.freeSpins; }

        function chapterUnlocked(n) { return n <= 1 || !!Save.data.done[n - 1]; }
        function fmt(n) { return Math.floor(n + 1e-9).toLocaleString('tr-TR'); }
        function fmtX(v) {
            const s = v >= 100 ? Math.round(v).toString() : v >= 10 ? v.toFixed(1) : v.toFixed(2);
            return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
        }
        /* Atölye para birimi simgesi (kahve çuvalı) — emoji yerine görsel, her sistemde görünür */
        function beanIc() { return `<img class="bean-ic" src="${ASSETS.sym.coffeebag}" alt="">`; }

        /* Spin sırasında dönen (görsel) semboller */
        function visualSymbol(r) {
            return Engine.pickSymbol({ chapter: gameState.chapter, tier: 0, eff: RUN_EFF }, r, Math.random);
        }
