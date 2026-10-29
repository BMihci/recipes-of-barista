/* =====================================================================
   RECIPES OF BARISTA — MATEMATİK MOTORU (v5: 5 aşama, tek kasa)
   Saf JavaScript: DOM yok, global durum yok. Oyun (tarayıcı) ve
   simülasyon (Node) AYNI dosyayı kullanır; böylece denge testleri
   gerçek oyun matematiğini ölçer.
   ===================================================================== */
const Engine = (function () {
    'use strict';

    /* ---------------- Temel sabitler ---------------- */
    const ROWS = 3;
    const PAYLINES = [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
        [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 1, 2, 1], [1, 2, 1, 0, 1], [0, 1, 1, 1, 2]
    ];
    // 6. makara için hatlar: ilk 5 aynı; 6. durak = 5. makaranın satırı (4. ile aynıysa o, değilse orta satır)
    const PAYLINES6 = PAYLINES.map(l => l.concat([l[4] === l[3] ? l[4] : 1]));
    function lines(ctx) { return (ctx.eff.reels || 5) === 6 ? PAYLINES6 : PAYLINES; }
    const EXPAND_K = 10;                        // genişleyen sembol: 10 hattın hepsinde öder
    const SPECIAL_REELS = [0, 2, 4];            // Matcha / Pitcher yalnızca 1., 3., 5. makarada
    const BASE_SCATTER = 0.05;                  // hücre başına Reçete Kitabı ihtimali (taban)
    const BASE_FREE_SPINS = 10;

    /* Bahis merdiveni (1-2-5 dizisi). Her 3 basamak = 1 "bahis kademesi". */
    const LADDER = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000];
    const MAX_TIER = 5;
    const TIER_PAY = 0.04;       // kademe başına +%4 kazanç
    const TIER_SCATTER = 0.02;   // kademe başına +%5 (göreli) kitap şansı

    /* ---------------- Semboller ---------------- */
    const SYMBOLS = [
        { id: 'book',        img: 'book',        values: { 5: 2000, 4: 500, 3: 100, 2: 10 }, weight: 0,  isScatter: true },
        { id: 'barista',     img: 'barista',     values: { 5: 1000, 4: 200, 3: 50, 2: 10 },  weight: 5 },
        { id: 'girlfriend',  img: 'cozybear',    values: { 5: 500, 4: 100, 3: 30, 2: 5 },    weight: 6 },
        { id: 'baking_bear', img: 'bakingbear',  values: { 5: 400, 4: 80, 3: 25, 2: 5 },     weight: 7 },
        { id: 'portafilter', img: 'portafilter', values: { 5: 300, 4: 60, 3: 20, 2: 5 },     weight: 8 },
        { id: 'v60',         img: 'v60',         values: { 5: 100, 4: 30, 3: 10 },           weight: 10 },
        { id: 'espresso',    img: 'espresso',    values: { 5: 80, 4: 25, 3: 10 },            weight: 12 },
        { id: 'aeropress',   img: 'aeropress',   values: { 5: 70, 4: 20, 3: 5 },             weight: 12 },
        { id: 'golden_bean', img: 'goldenbean',  values: { 5: 50, 4: 15, 3: 5 },             weight: 12 },
        { id: 'croissant',   img: 'croissant',   values: { 5: 30, 4: 10, 3: 5 },             weight: 14 }
    ];
    const BOOK = SYMBOLS[0];
    const NORMALS = SYMBOLS.filter(s => !s.isScatter);
    const TOTAL_W = NORMALS.reduce((a, s) => a + s.weight, 0);

    const SPECIALS = {
        pitcher: { id: 'pitcher', img: 'pitcher', special: 'wild' },      // JOKER; 3 tane = Latte Art bonusu
        matcha:  { id: 'matcha',  img: 'matcha',  special: 'foam' },      // SyruppoLab'ın matchası: düşünce baristalarımız hepsini AYNI kahve sembolüne çevirir (sadece kazandırır)
        cupcake: { id: 'cupcake', img: 'cupcake', special: 'oven' },      // Aşama 3: fırın sayacı; Pasta Yağmuru'nda JOKER
        coffeebag: { id: 'coffeebag', img: 'coffeebag', special: 'bag' }, // Aşama 4: 3+ çuval = hasat ödemesi (her yerde)
        stamp:   { id: 'stamp',   img: 'stamp',   special: 'stamp' }      // Aşama 5: sadakat kartı damgası
    };
    const STAMP_RATE = 0.012, STAMPS_PER_CARD = 10, LATTE_MAX = 2;
    const OVEN_RATE = 0.03, OVEN_RAIN_RATE = 0.10, OVEN_FULL = 12, OVEN_SPINS = 6;
    const BAG_RATE = 0.035, BAG_PAY = { 3: 2, 4: 6, 5: 20, 6: 60, 7: 150 };   // bahsin katı

    /* Çarpan çekirdekleri (Gates of Olympus tarzı): spin başına şansla düşer; kazanç varsa çarpar.
       Free spin'de çarpanlar birikir ve sonraki her kazancı çarpar. */
    const ORB_P = 0.04, ORB_P_FS = 0.08, FS_MULT_CAP = 25;
    const ORB_TABLE = [[2, 46], [3, 26], [5, 15], [10, 8], [25, 3.5], [50, 1.1], [100, 0.4]];
    const ORB_TW = ORB_TABLE.reduce((a, o) => a + o[1], 0);
    /* Şans desteği: art arda boş geçen her spin, sonraki spinde bir hattın tamamlanma ihtimalini artırır
       (en fazla %LUCK_MAX). Kazanınca sıfırlanır. Oyuncunun uzun kuru serilere düşmesini engeller. */
    const LUCK_STEP = 0.07, LUCK_MAX = 0.49;
    /* Zorluk modları (yeni oyunda seçilir; kayıtta saklanır)
       pay: tüm kazançların katsayısı · luck: şans desteği adımı/üst sınırı · orb: Dede çarpanı sıklığı
       gift: iflas/24 saat hediyesi · phase: ara durak ödülü katsayısı */
    const DIFFS = {
        story:   { pay: 1.251, luckStep: 0.10, luckMax: 0.60, orb: 1.0, gift: 10000, phase: 1.5 },
        std:     { pay: 1.0, luckStep: LUCK_STEP, luckMax: LUCK_MAX, orb: 1.0, gift: 5000, phase: 1.0 },
        gambler: { pay: 0.657, luckStep: 0, luckMax: 0, orb: 1.8, gift: 5000, phase: 0.5 }
    };
    function diffOf(d) { return DIFFS[d] || DIFFS.std; }
    function luckFor(streak, diff) { const D = typeof diff === 'object' && diff ? diff : diffOf(diff); return Math.min(D.luckMax, D.luckStep * (streak || 0)); }
    function rollOrbs(inFS, rng, orbMul) {
        if (rng() >= (inFS ? ORB_P_FS : ORB_P) * (orbMul || 1)) return [];
        const n = rng() < 0.12 ? 2 : 1, out = [];
        for (let i = 0; i < n; i++) {
            let x = rng() * ORB_TW;
            for (const [v, w] of ORB_TABLE) { x -= w; if (x < 0) { out.push(v); break; } }
            if (out.length < i + 1) out.push(2);
        }
        return out;
    }

    /* ---------------- Aşamalar (şubeler) ----------------
       seed: aşamanın taban sermayesi (kasa tükenirse mahalle desteği bu kadar koyar)
       unlockAt: kasada bu kadar görülünce sonraki şube satın alınabilir; price: satın alma bedeli
       payScale: o aşamanın taban RTP'sini hedefe çeken kalibrasyon katsayısı (simülasyonla bulundu). */
    const CHAPTERS = {
        1: { id: 1, key: 'cafe',    seed: 5000,    unlockAt: 100000,   price: 80000,    minBet: 10,    maxBet: 10000,   payScale: 0.4434, specials: false, boost: {}, phases: [0.5] },
        2: { id: 2, key: 'matcha',  seed: 20000,   unlockAt: 500000,   price: 400000,   minBet: 100,   maxBet: 50000,   payScale: 0.2615,   specials: true,  boost: {}, phases: [0.5] },
        3: { id: 3, key: 'bakery',  seed: 100000,  unlockAt: 2500000,  price: 2000000,  minBet: 500,   maxBet: 200000,  payScale: 0.2225,   specials: false,  boost: {}, phases: [0.5], oven: true },
        4: { id: 4, key: 'harvest', seed: 500000,  unlockAt: 10000000, price: 8000000,  minBet: 1000,  maxBet: 1000000, payScale: 0.1729,   specials: false,  boost: {}, phases: [0.5], harvest: true },
        5: { id: 5, key: 'castle',  seed: 2000000, unlockAt: 50000000, price: 50000000, minBet: 2000,  maxBet: 5000000, payScale: 0.0493,   specials: false,  boost: { book: 1.5, barista: 1.5, girlfriend: 1.25 }, phases: [0.25, 0.5, 0.75], loyalty: true, final: true }
    };
    const STAGE_COUNT = 5;

    /* ---------------- Yükseltmeler (Barista Atölyesi) — kasadaki çekirdekle alınır ----------------
       unlock: o aşamaya ulaşınca açılır. Metinler arayüz katmanında (dil dosyası) tutulur. */
    const SYMBOL_UP_COST = { croissant: 1500, golden_bean: 2000, aeropress: 2500, espresso: 3000, v60: 4000, portafilter: 6000, baking_bear: 10000, girlfriend: 15000, barista: 25000, book: 50000 };
    const UPGRADES = [];
    SYMBOLS.forEach(s => UPGRADES.push({ id: 'sym_' + s.id, group: 'symbol', sym: s.id, icon: s.img, max: 8, baseCost: SYMBOL_UP_COST[s.id], growth: 2.2 }));
    UPGRADES.push(
        { id: 'sk_scatter', group: 'skill', icon: 'book',        max: 5, baseCost: 8000,    growth: 2.3 },
        { id: 'sk_assist',  group: 'skill', icon: 'espresso',    max: 5, baseCost: 10000,   growth: 2.3 },
        { id: 'sk_free',    group: 'skill', icon: 'cozybear',    max: 3, baseCost: 30000,   growth: 3.0 },
        { id: 'sk_expand',  group: 'skill', icon: 'portafilter', max: 5, baseCost: 20000,   growth: 2.4 },
        { id: 'sk_cash',    group: 'skill', icon: 'cake',        max: 5, baseCost: 8000,    growth: 2.3 },
        { id: 'sp_pitcher', group: 'special', icon: 'pitcher',   max: 4, baseCost: 30000,   growth: 2.3, unlock: 2 },
        { id: 'sp_latte',   group: 'special', icon: 'pitcher',   max: 4, baseCost: 40000,   growth: 2.3, unlock: 2 },
        { id: 'sp_foam',    group: 'special', icon: 'matcha',    max: 4, baseCost: 35000,   growth: 2.3, unlock: 2 },
        { id: 'sp_matcha',  group: 'special', icon: 'matcha',    max: 3, baseCost: 25000,   growth: 2.3, unlock: 2 },
        { id: 'sp_oven',    group: 'special', icon: 'cupcake',   max: 3, baseCost: 250000,  growth: 2.4, unlock: 3 },
        { id: 'sp_rain',    group: 'special', icon: 'cake',      max: 3, baseCost: 350000,  growth: 2.4, unlock: 3 },
        { id: 'sp_bag',     group: 'special', icon: 'coffeebag', max: 4, baseCost: 1200000, growth: 2.3, unlock: 4 },
        { id: 'sp_bagrate', group: 'special', icon: 'leaf',      max: 3, baseCost: 900000,  growth: 2.3, unlock: 4 },
        { id: 'lx_pay',     group: 'late', icon: 'goldenbean',   max: 8, baseCost: 2500000, growth: 1.7, unlock: 4 },
        { id: 'lx_book',    group: 'late', icon: 'book',         max: 8, baseCost: 2000000, growth: 1.7, unlock: 4 },
        { id: 'lx_free',    group: 'late', icon: 'bakingbear',   max: 3, baseCost: 5000000, growth: 2.0, unlock: 5 },
        { id: 'lx_expand',  group: 'late', icon: 'portafilter',  max: 5, baseCost: 4000000, growth: 1.9, unlock: 5 },
        { id: 'lx_stamp',   group: 'late', icon: 'stamp',        max: 5, baseCost: 3000000, growth: 1.9, unlock: 5 },
        { id: 'lx_reel6',   group: 'late', icon: 'espresso',     max: 1, baseCost: 25000000, growth: 1,  unlock: 5 }
    );
    function upgradeCost(up, lvl) { return Math.round(up.baseCost * Math.pow(up.growth, lvl) / 10) * 10; }

    function effects(ups, extra) {
        const L = id => (ups && ups[id]) || 0;
        const e = {
            symMult: {},
            scatterAdd: 0.0008 * L('sk_scatter'),
            assist: 0.02 * L('sk_assist'),
            freeSpins: BASE_FREE_SPINS + L('sk_free') + L('lx_free'),
            reels: L('lx_reel6') ? 6 : 5,
            payBonus: 1 + 0.04 * L('lx_pay'),
            expandMul: 1 + 0.05 * L('lx_expand'),
            stampAdd: 0.002 * L('lx_stamp'),
            expandChance: 0.0015 * L('sk_expand'),
            cashback: 0.02 * L('sk_cash'),
            pitcherRate: 0.07 + 0.005 * L('sp_pitcher'),
            matchaRate: 0.05 + 0.01 * L('sp_matcha'),
            convBias: 0.35 * L('sp_foam'),
            latteMult: 2 + 0.4 * L('sp_latte'),
            foam: 0.5 + 0.08 * L('sp_foam'),
            ovenFull: OVEN_FULL - L('sp_oven'),
            ovenSpins: OVEN_SPINS + 2 * L('sp_rain'),
            bagMult: 1 + 0.25 * L('sp_bag'),
            bagRate: BAG_RATE + 0.005 * L('sp_bagrate'),
            bookMult: (1 + 0.015 * L('lx_book')) * (1 + 0.10 * ((extra && extra.latte) || 0))
        };
        e.diffKey = (extra && extra.diff) || 'std';
        e.diff = diffOf(e.diffKey);
        e.diffPay = e.diff.pay;
        e.orbMul = e.diff.orb;
        SYMBOLS.forEach(s => { e.symMult[s.id] = 1 + 0.06 * L('sym_' + s.id); });
        return e;
    }

    /* ---------------- Bahis yardımcıları ---------------- */
    function ladderIndex(bet) {
        let idx = 0;
        for (let i = 0; i < LADDER.length; i++) if (LADDER[i] <= bet) idx = i;
        return idx;
    }
    function tierOf(bet) { return Math.min(MAX_TIER, Math.floor(ladderIndex(bet) / 3)); }
    function betOptions(chapter, balance) {
        const ch = CHAPTERS[chapter];
        return LADDER.filter(b => b >= ch.minBet && b <= ch.maxBet && b <= balance);
    }

    /* ---------------- Makara ---------------- */
    function isWild(s, ctx) { return s.id === 'book' || s.special === 'wild' || (s.special === 'oven' && ctx && ctx.ovenRain); }

    function pickSymbol(ctx, reel, rng) {
        const ch = CHAPTERS[ctx.chapter], e = ctx.eff;
        if (ch.loyalty && rng() < STAMP_RATE + (e.stampAdd || 0)) return SPECIALS.stamp;
        if (ch.oven && rng() < (ctx.ovenRain ? OVEN_RAIN_RATE : OVEN_RATE)) return SPECIALS.cupcake;
        if (ch.harvest && rng() < (e.bagRate || BAG_RATE)) return SPECIALS.coffeebag;
        if (ch.specials) {
            if (rng() < e.matchaRate) return SPECIALS.matcha;                                   // her makarada
            if (SPECIAL_REELS.indexOf(reel) !== -1 && rng() < e.pitcherRate) return SPECIALS.pitcher;   // 1-3-5
        }
        const scatter = (BASE_SCATTER + e.scatterAdd) * (1 + TIER_SCATTER * ctx.tier) * (e.bookMult || 1);
        if (rng() < scatter) return BOOK;
        let r = rng() * TOTAL_W;
        for (let i = 0; i < NORMALS.length; i++) { r -= NORMALS[i].weight; if (r < 0) return NORMALS[i]; }
        return NORMALS[NORMALS.length - 1];
    }

    /** Kombo Ustası: rastgele bir hatta, zinciri kıran ilk sembolü eşleşmeye çevirir. */
    function applyAssist(grid, ctx, rng) {
        if (rng() >= ctx.eff.assist + (ctx.luck || 0)) return false;
        const LN = lines(ctx), R = grid.length;
        const line = LN[Math.floor(rng() * LN.length)];
        let base = null;
        for (let r = 0; r < R; r++) {
            const s = grid[r][line[r]];
            if (isWild(s, ctx)) continue;
            if (s.special || !s.values) return false;
            base = s; break;
        }
        if (!base) return false;
        for (let r = 0; r < R; r++) {
            const s = grid[r][line[r]];
            if (s.id === base.id || isWild(s, ctx)) continue;
            if (s.special) return false;
            grid[r][line[r]] = base;
            return true;
        }
        return false;
    }

    /** ctx: { chapter, bet, tier, eff, expandingSymbolId, ovenRain, mult } */
    function genGrid(ctx, rng) {
        const grid = [];
        const expSym = ctx.expandingSymbolId ? SYMBOLS.find(s => s.id === ctx.expandingSymbolId) : null;
        const R = ctx.eff.reels || 5;
        for (let r = 0; r < R; r++) {
            grid[r] = [];
            for (let row = 0; row < ROWS; row++) {
                let sym = pickSymbol(ctx, r, rng);
                if (expSym && rng() < ctx.eff.expandChance) sym = expSym;
                grid[r][row] = sym;
            }
        }
        applyAssist(grid, ctx, rng);
        return grid;
    }

    /** Genişleyen sembol: ekranda en az 2 (yüksek semboller) / 3 (diğerleri) adet varsa o makaraları kaplar. */
    function expandMin(sym) { return sym.values && sym.values[2] ? 2 : 3; }
    function expandGrid(grid, ctx) {
        if (!ctx.expandingSymbolId) return { grid, reels: [], count: 0 };
        const sym = SYMBOLS.find(s => s.id === ctx.expandingSymbolId);
        let count = 0; const reels = [];
        for (let r = 0; r < grid.length; r++) {
            let has = false;
            for (let row = 0; row < ROWS; row++) if (grid[r][row].id === sym.id) { count++; has = true; }
            if (has) reels.push(r);
        }
        if (count < expandMin(sym)) return { grid, reels: [], count, sym };
        const g = grid.map((col, r) => reels.indexOf(r) !== -1 ? [sym, sym, sym] : col.slice());
        return { grid: g, reels, count, sym };
    }

    /* Matcha → Kahve: ekrandaki tüm matchalar tek bir rastgele kahve sembolüne dönüşür (gizemli sembol).
       Matcha hiçbir zaman hattı bozmaz; sadece ek kazanç getirir. convBias yüksek sembollere eğilim verir. */
    const MATCHA_WAR = 15, ZAFER_MULT = 10;
    function convertMatcha(grid, ctx, rng) {
        const cells = [];
        for (let r = 0; r < grid.length; r++) for (let row = 0; row < ROWS; row++) if (grid[r][row].id === 'matcha') cells.push([r, row]);
        if (!cells.length) return { grid, cells, sym: null };
        const bias = (ctx.eff && ctx.eff.convBias) || 0;
        const ws = NORMALS.map((s, i) => s.weight * (1 + bias * (NORMALS.length - i) / NORMALS.length * 2));
        let x = rng() * ws.reduce((a, b) => a + b, 0), sym = NORMALS[NORMALS.length - 1];
        for (let i = 0; i < NORMALS.length; i++) { x -= ws[i]; if (x < 0) { sym = NORMALS[i]; break; } }
        const g = grid.map(col => col.slice());
        cells.forEach(([r, row]) => { g[r][row] = sym; });
        return { grid: g, cells, sym };
    }

    function countId(grid, id) {
        let n = 0;
        for (let r = 0; r < grid.length; r++) for (let row = 0; row < ROWS; row++) if (grid[r][row].id === id) n++;
        return n;
    }
    function countScatter(grid) { return countId(grid, 'book'); }
    function stampCount(grid) { return countId(grid, 'stamp'); }

    /* ---------------- Değerlendirme ---------------- */
    function symPay(sym, count, ctx) {
        const ch = CHAPTERS[ctx.chapter];
        let v = sym.values && sym.values[count];
        if (!v && count === 6 && sym.values && sym.values[5]) v = sym.values[5] * 2.5;   // 6. makara süper ödülü
        if (!v) return 0;
        return v * ctx.eff.symMult[sym.id] * ch.payScale * (ch.boost[sym.id] || 1);
    }

    function evaluate(grid, ctx) {
        const e = ctx.eff;
        const lineBet = ctx.bet / 10;
        const marks = [];
        const R = grid.length;
        let lineTotal = 0;

        lines(ctx).forEach(line => {
            let bookRun = 0;
            while (bookRun < R && grid[bookRun][line[bookRun]].id === 'book') bookRun++;
            let best = { pay: 0, n: 0 };
            if (bookRun >= 2) best = { pay: symPay(BOOK, bookRun, ctx), n: bookRun };

            let base = null, count = 0;
            for (let r = 0; r < R; r++) {
                const s = grid[r][line[r]];
                if (isWild(s, ctx)) { count++; continue; }
                if (!base) {
                    if (s.special || !s.values) break;
                    base = s; count++; continue;
                }
                if (s.id === base.id) { count++; continue; }
                break;
            }
            if (base && count >= 2) {
                const p = symPay(base, count, ctx);
                if (p > best.pay) best = { pay: p, n: count };
            }
            if (best.pay > 0) {
                lineTotal += best.pay * lineBet;
                for (let r = 0; r < best.n; r++) marks.push({ r, row: line[r], mode: 'win' });
            }
        });

        // Matcha Latte kombosu ve Latte Art bonusu
        let matcha = 0, pitcher = 0;
        const matchaCells = [], pitcherCells = [], cupCells = [], bagCells = [];
        for (let r = 0; r < R; r++) for (let row = 0; row < ROWS; row++) {
            const id = grid[r][row].id;
            if (id === 'matcha') { matcha++; matchaCells.push([r, row]); }
            else if (id === 'pitcher') { pitcher++; pitcherCells.push([r, row]); }
            else if (id === 'cupcake') cupCells.push([r, row]);
            else if (id === 'coffeebag') bagCells.push([r, row]);
        }
        const pairs = Math.min(matcha, pitcher);
        let foamMult = 1;
        if (pairs > 0 && lineTotal > 0) {
            foamMult = 1 + e.foam * pairs;
            matchaCells.concat(pitcherCells).forEach(c => marks.push({ r: c[0], row: c[1], mode: 'win' }));
        }
        let latte = 0;
        if (pitcher >= 3) {
            latte = ctx.bet * e.latteMult;
            pitcherCells.forEach(c => marks.push({ r: c[0], row: c[1], mode: 'win' }));
        }

        // Hasat (Aşama 4): 3+ kahve çuvalı ekranın neresinde olursa olsun öder
        let harvest = 0;
        const bags = bagCells.length;
        if (bags >= 3) {
            harvest = ctx.bet * (BAG_PAY[Math.min(bags, 7)] || 0) * (e.bagMult || 1);
            bagCells.forEach(c => marks.push({ r: c[0], row: c[1], mode: 'win' }));
        }

        // Genişleyen sembol (free spin)
        let expandPay = 0, expanded = [];
        if (ctx.expandingSymbolId) {
            const ex = expandGrid(grid, ctx);
            expanded = ex.reels;
            if (ex.reels.length) {
                expandPay = symPay(ex.sym, ex.reels.length, ctx) * lineBet * EXPAND_K * (e.expandMul || 1);
                ex.reels.forEach(r => { for (let row = 0; row < ROWS; row++) marks.push({ r, row, mode: 'win' }); });
            }
        }

        const tierBonus = 1 + TIER_PAY * ctx.tier;
        const mult = ctx.mult || 1;                       // Americano: geçici x2
        lineTotal *= (e.payBonus || 1);
        let total = Math.round(((lineTotal * foamMult + expandPay) * tierBonus + latte + harvest) * mult * (e.diffPay || 1));
        // çarpan çekirdekleri
        const orbs = ctx.orbs || [];
        const orbSum = orbs.reduce((a, v) => a + v, 0);
        let fsMult = ctx.fsMult || 0, orbX = 1;
        if (total > 0) {
            if (ctx.inFS) {
                if (orbSum > 0) fsMult = Math.min(FS_MULT_CAP, fsMult + orbSum);
                if (fsMult > 0) orbX = fsMult;
            } else if (orbSum > 0) orbX = orbSum;
        }
        const baseWin = total;
        total = Math.round(total * orbX);
        const cashback = total === 0 ? Math.round(ctx.bet * e.cashback) : 0;

        return {
            total, cashback, lineTotal: Math.round(lineTotal * foamMult * tierBonus * mult), latte: Math.round(latte * mult), mult,
            expandPay: Math.round(expandPay * tierBonus * mult), expanded, harvest: Math.round(harvest * mult), bags,
            foamMult, pairs, tierBonus, matcha, pitcher, marks,
            cupcakes: cupCells.length, cupCells,
            scatter: countScatter(grid), orbs, orbSum, orbX, fsMult, baseWin,
            stamps: stampCount(grid)
        };
    }

    /* ---------------- Simülasyon yardımcıları (Node) ----------------
       Tek "spin turu": normal spin + tetiklenirse tüm free spin / pasta yağmuru zinciri. */
    function playRound(st, rng) {
        // st: { chapter, bet, eff, ups, balance, [loy], [oven] }
        const tier = st.tier !== undefined ? st.tier : tierOf(st.bet);
        const ch = CHAPTERS[st.chapter];
        const L = st.loy || (st.loy = { stamps: 0, americano: 0, filtre: false, latte: 0, pick: 0 });
        if (st.oven === undefined) st.oven = 0;
        const eff = L.latte && st.ups ? effects(st.ups, { latte: L.latte, diff: st.diff }) : st.eff;
        const om = eff.orbMul || 1;
        const mult = () => { if (L.americano > 0) { L.americano--; return 2; } return 1; };
        const addStamps = n => {
            if (!ch.loyalty || !n) return;
            L.stamps += n;
            while (L.stamps >= STAMPS_PER_CARD) {
                L.stamps -= STAMPS_PER_CARD;
                const c = st.choice || ['americano', 'filtre', 'latte'][L.pick++ % 3];
                if (c === 'americano') L.americano += 10;
                else if (c === 'filtre') L.filtre = true;
                else if (L.latte < LATTE_MAX) L.latte++;
                else L.americano += 10;
            }
        };
        let wagered = st.bet, won = 0, spins = 1, free = 0, ovenRains = 0;
        const runOvenRain = () => {
            ovenRains++;
            for (let i = 0; i < eff.ovenSpins; i++) {
                const c = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: null, ovenRain: true, mult: mult(), orbs: rollOrbs(false, rng, om) };
                const cv = convertMatcha(genGrid(c, rng), c, rng);
                won += addMatcha(cv.cells.length);
                const rr = evaluate(cv.grid, c);
                won += rr.total + rr.cashback; spins++; free++;
            }
        };
        const addMatcha = n => {
            if (st.chapter !== 2 || !n) return 0;
            st.mCount = (st.mCount || 0) + n;
            let bonus = 0;
            while (st.mCount >= MATCHA_WAR) { st.mCount -= MATCHA_WAR; bonus += st.bet * ZAFER_MULT; }
            return bonus;
        };
        const addOven = n => {
            if (!ch.oven || !n) return false;
            st.oven += n;
            if (st.oven >= eff.ovenFull) { st.oven = 0; return true; }
            return false;
        };
        const base = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: null, mult: mult(), orbs: rollOrbs(false, rng, om), luck: st.noLuck ? 0 : luckFor(st.streak, eff.diff) };
        st.balance -= st.bet;
        const cv0 = convertMatcha(genGrid(base, rng), base, rng);
        won += addMatcha(cv0.cells.length);
        const res = evaluate(cv0.grid, base);
        won += res.total + res.cashback;
        st.streak = res.total > 0 ? 0 : (st.streak || 0) + 1;
        addStamps(res.stamps);
        let rain = addOven(res.cupcakes);
        if (res.scatter >= 3) {
            const pool = SYMBOLS.filter(s => s.id !== 'book');
            const exp = pool[Math.floor(rng() * pool.length)].id;
            let remaining = L.filtre ? 20 : eff.freeSpins, guard = 0, fsMult = 0;
            L.filtre = false;
            while (remaining > 0 && guard++ < 400) {
                remaining--;
                const fctx = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: exp, mult: mult(), inFS: true, fsMult, orbs: rollOrbs(true, rng, om) };
                const cvf = convertMatcha(genGrid(fctx, rng), fctx, rng);
                won += addMatcha(cvf.cells.length);
                const g = cvf.grid;
                const extra = countScatter(g);
                if (extra >= 3) remaining += extra;
                const rr = evaluate(g, fctx);
                fsMult = rr.fsMult;
                won += rr.total + rr.cashback;
                addStamps(rr.stamps);
                if (addOven(rr.cupcakes)) rain = true;
                free++; spins++;
            }
        }
        if (rain) runOvenRain();
        st.balance += won;
        return { wagered, won, spins, free, ovenRains };
    }

    return {
        ROWS, PAYLINES, PAYLINES6, LADDER, SPECIAL_REELS, BASE_SCATTER, BASE_FREE_SPINS, MAX_TIER, TIER_PAY, TIER_SCATTER, EXPAND_K,
        SYMBOLS, BOOK, NORMALS, SPECIALS, CHAPTERS, STAGE_COUNT, UPGRADES,
        STAMP_RATE, STAMPS_PER_CARD, LATTE_MAX, OVEN_FULL, OVEN_SPINS, BAG_PAY,
        ORB_TABLE, DIFFS, diffOf, rollOrbs, convertMatcha, MATCHA_WAR, ZAFER_MULT, luckFor, LUCK_MAX, lines, upgradeCost, effects, ladderIndex, tierOf, betOptions,
        isWild, pickSymbol, genGrid, expandGrid, expandMin, countScatter, stampCount, evaluate, playRound
    };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
