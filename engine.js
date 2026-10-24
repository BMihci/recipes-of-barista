/* =====================================================================
   RECIPES OF BARISTA — MATEMATİK MOTORU
   Saf JavaScript: DOM yok, global durum yok. Oyun (tarayıcı) ve
   simülasyon (Node) AYNI dosyayı kullanır; böylece denge testleri
   gerçek oyun matematiğini ölçer.
   ===================================================================== */
const Engine = (function () {
    'use strict';

    /* ---------------- Temel sabitler ---------------- */
    const REELS = 5, ROWS = 3;
    const PAYLINES = [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
        [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 1, 2, 1], [1, 2, 1, 0, 1], [0, 1, 1, 1, 2]
    ];
    // 6. makara için hatlar: ilk 5 aynı; 6. durak = 5. makaranın satırı (4. ile aynıysa o, değilse orta satır)
    const PAYLINES6 = PAYLINES.map(l => l.concat([l[4] === l[3] ? l[4] : 1]));
    function lines(ctx) { return (ctx.eff.reels || 5) === 6 ? PAYLINES6 : PAYLINES; }
    const EXPAND_K = 10;                          // genişleyen sembol: değer × çizgi bahsi × EXPAND_K (ekranın neresinde olursa olsun)
    const SPECIAL_REELS = [0, 2, 4];            // Matcha / Pitcher yalnızca 1., 3., 5. makarada
    const BASE_SCATTER = 0.05;                  // hücre başına Reçete Kitabı ihtimali (taban)
    const BASE_FREE_SPINS = 10;

    /* Bahis merdiveni (1-2-5 dizisi). Her 3 basamak = 1 "bahis kademesi".
       Kademe yükseldikçe: kazanç bonusu, free spin şansı ve atölye çekirdeği artar. */
    const LADDER = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    const MAX_TIER = 5;
    const TIER_PAY = 0.04;       // kademe başına +%4 hat kazancı
    const TIER_SCATTER = 0.05;   // kademe başına +%5 (göreli) kitap şansı
    const TIER_BEAN = 0.10;      // kademe başına +%10 atölye çekirdeği

    /* ---------------- Semboller ---------------- */
    // weight: makarada çıkma ağırlığı (kitap ve özel semboller ayrı hesaplanır)
    const SYMBOLS = [
        { id: 'book',        img: 'book',        name: 'Reçete Kitabı',    values: { 5: 2000, 4: 500, 3: 100, 2: 10 }, weight: 0,  isScatter: true },
        { id: 'barista',     img: 'barista',     name: 'Bearista',         values: { 5: 1000, 4: 200, 3: 50, 2: 10 },  weight: 5 },
        { id: 'girlfriend',  img: 'cozybear',    name: 'MaviKuş',          values: { 5: 500, 4: 100, 3: 30, 2: 5 },    weight: 6 },
        { id: 'baking_bear', img: 'bakingbear',  name: 'Fırıncı Ayı',      values: { 5: 400, 4: 80, 3: 25, 2: 5 },     weight: 7 },
        { id: 'portafilter', img: 'portafilter', name: 'Portafiltre',      values: { 5: 300, 4: 60, 3: 20, 2: 5 },     weight: 8 },
        { id: 'v60',         img: 'v60',         name: 'V60 Dripper',      values: { 5: 100, 4: 30, 3: 10 },           weight: 10 },
        { id: 'espresso',    img: 'espresso',    name: 'Espresso Fincanı', values: { 5: 80, 4: 25, 3: 10 },            weight: 12 },
        { id: 'aeropress',   img: 'aeropress',   name: 'AeroPress',        values: { 5: 70, 4: 20, 3: 5 },             weight: 12 },
        { id: 'golden_bean', img: 'goldenbean',  name: 'Altın Çekirdek',   values: { 5: 50, 4: 15, 3: 5 },             weight: 12 },
        { id: 'croissant',   img: 'croissant',   name: 'Kruvasan',         values: { 5: 30, 4: 10, 3: 5 },             weight: 14 }
    ];
    const BOOK = SYMBOLS[0];
    const NORMALS = SYMBOLS.filter(s => !s.isScatter);
    const TOTAL_W = NORMALS.reduce((a, s) => a + s.weight, 0);

    const SPECIALS = {
        // Pitcher: JOKER. Hatlarda diğer sembollerin yerine geçer; ekranda 3 tane = Latte Art Bonusu.
        pitcher: { id: 'pitcher', img: 'pitcher', name: 'Pitcher', special: 'wild' },
        // Matcha: KÖPÜK. Ekranda Pitcher ile birlikte gelirse "Matcha Latte" kombosu; hat kazancını çarpar.
        matcha:  { id: 'matcha',  img: 'matcha',  name: 'Matcha',  special: 'foam' },
        // Damga: Bölüm 3 sadakat kartı sembolü. Hat ödemez; ekrandaki her damga karta 1 damga ekler.
        stamp:   { id: 'stamp',   img: 'stamp',   name: 'Damga',   special: 'stamp' }
    };
    const STAMP_RATE = 0.012;                    // hücre başına damga ihtimali (yalnız loyalty bölümü)
    const STAMPS_PER_CARD = 10;

    /* ---------------- Bölümler ----------------
       payScale: o bölümün taban RTP'sini hedefe çeken kalibrasyon katsayısı (simülasyonla bulundu). */
    const CHAPTERS = {
        1: { id: 1, name: 'BÖLÜM 1', title: 'Huzurlu Dem',        start: 5000,   goal: 100000,   minBet: 10,    maxBet: 10000,    payScale: 0.4551, specials: false, boost: {},
             phases: [0.5], bonus: 5000, beanRate: 0.02 },
        2: { id: 2, name: 'BÖLÜM 2', title: 'Matcha Savaşı',      start: 20000,  goal: 1000000,  minBet: 100,   maxBet: 100000,   payScale: 0.3079, specials: true,  boost: {},
             phases: [0.5], bonus: 50000, beanRate: 0.012 },
        3: { id: 3, name: 'BÖLÜM 3', title: 'Büyük Final',        start: 100000,  goal: 10000000, minBet: 1000,  maxBet: 1000000,  payScale: 0.1512, specials: true,  boost: { book: 1.5, barista: 1.5, girlfriend: 1.25 },
             phases: [0.25, 0.5, 0.75], bonus: 500000, loyalty: true, beanRate: 0.008 }
    };

    /* ---------------- Yükseltmeler (Barista Atölyesi) ---------------- */
    const SYMBOL_UP_COST = { croissant: 600, golden_bean: 800, aeropress: 1000, espresso: 1250, v60: 1600, portafilter: 2500, baking_bear: 4000, girlfriend: 6000, barista: 10000, book: 20000 };
    const UPGRADES = [];
    SYMBOLS.forEach(s => UPGRADES.push({
        id: 'sym_' + s.id, group: 'symbol', icon: s.img, name: s.name + ' Çarpanı', max: 6,
        baseCost: SYMBOL_UP_COST[s.id], growth: 1.7,
        desc: l => `Ödemeleri ×${(1 + 0.25 * l).toFixed(2).replace(/\.?0+$/, '')}`
    }));
    UPGRADES.push(
        { id: 'sk_scatter', group: 'skill', icon: 'book',       name: 'Kitap İlhamı',      max: 5, baseCost: 3000, growth: 1.8, desc: l => `Kitap şansı %${(5 + 0.15 * l).toFixed(2).replace(/\.?0+$/, '')} (hücre başına)` },
        { id: 'sk_assist',  group: 'skill', icon: 'espresso',   name: 'Kombo Ustası',      max: 5, baseCost: 4000, growth: 1.8, desc: l => `Her spinde %${l * 2} ihtimalle bir hat 1 sembol uzar` },
        { id: 'sk_free',    group: 'skill', icon: 'cozybear',   name: 'Uzun Mola',         max: 3, baseCost: 7500, growth: 2.0, desc: l => `Free spin sayısı ${BASE_FREE_SPINS + l}` },
        { id: 'sk_expand',  group: 'skill', icon: 'portafilter',name: 'Not Defteri Gücü',  max: 5, baseCost: 6000, growth: 1.8, desc: l => `Free spinde her hücrenin genişleyen sembol olma şansı +%${l}` },
        { id: 'sk_cash',    group: 'skill', icon: 'cupcake',    name: 'Sadık Müşteriler',  max: 5, baseCost: 3500, growth: 1.8, desc: l => `Boş spinde bahsin %${2 * l} kadarı geri döner` },
        { id: 'sk_bean',    group: 'skill', icon: 'goldenbean', name: 'Çırak Eğitimi',     max: 5, baseCost: 2000, growth: 1.6, desc: l => `Atölye çekirdeği kazancı +%${15 * l}` },
        { id: 'sp_pitcher', group: 'special', icon: 'pitcher',  name: 'Pitcher Şansı',     max: 4, baseCost: 4500, growth: 1.9, unlock: 2, desc: l => `Pitcher şansı %${(7 + 0.5 * l).toFixed(1).replace('.0', '')} (1-3-5. makara)` },
        { id: 'sp_latte',   group: 'special', icon: 'pitcher',  name: 'Latte Art Bonusu',  max: 4, baseCost: 5500, growth: 1.9, unlock: 2, desc: l => `3 Pitcher bonusu: bahsin ${2 + 0.5 * l} katı` },
        { id: 'sp_foam',    group: 'special', icon: 'matcha',   name: 'Matcha Köpüğü',     max: 4, baseCost: 5000, growth: 1.9, unlock: 2, desc: l => `Matcha Latte çarpanı +%${50 + 10 * l} (çift başına)` },
        { id: 'sp_matcha',  group: 'special', icon: 'matcha',   name: 'Matcha Şansı',      max: 3, baseCost: 4000, growth: 1.9, unlock: 2, desc: l => `Matcha şansı %${7 + l} (1-3-5. makara)` }
    );
    UPGRADES.push(
        { id: 'lx_pay',    group: 'late', icon: 'goldenbean', name: 'Usta Barista',    max: 8, baseCost: 20000,   growth: 1.55, unlock: 3, desc: l => `Tüm hat kazançları +%${5 * l}` },
        { id: 'lx_book',   group: 'late', icon: 'book',       name: 'Şanslı Kitap',    max: 8, baseCost: 15000,   growth: 1.55, unlock: 3, desc: l => `Kitap (Wild) şansı +%${3 * l}` },
        { id: 'lx_free',   group: 'late', icon: 'bakingbear', name: 'Ekstra Mola',     max: 5, baseCost: 50000,   growth: 2.0,  unlock: 3, desc: l => `Free spin'e +${l} ek tur` },
        { id: 'lx_expand', group: 'late', icon: 'portafilter',name: 'Defter Ustası',   max: 5, baseCost: 40000,   growth: 1.8,  unlock: 3, desc: l => `Genişleyen sembol ödemesi +%${10 * l}` },
        { id: 'lx_stamp',  group: 'late', icon: 'stamp',      name: 'Damga Ustası',    max: 5, baseCost: 30000,   growth: 1.8,  unlock: 3, desc: l => `Damga şansı %${(1.2 + 0.2 * l).toFixed(1).replace('.0', '')} (Bölüm 3)` },
        { id: 'lx_reel6',  group: 'late', icon: 'espresso',   name: '6. Makara',       max: 1, baseCost: 1000000, growth: 1,    unlock: 3, desc: l => l ? 'Makara sayısı: 6 (6 eşleşme = süper ödül)' : 'Makara sayısı: 5' }
    );
    function upgradeCost(up, lvl) { return Math.round(up.baseCost * Math.pow(up.growth, lvl)); }

    function effects(ups, extra) {
        const L = id => (ups && ups[id]) || 0;
        const e = {
            symMult: {},
            scatterAdd: 0.0015 * L('sk_scatter'),
            assist: 0.02 * L('sk_assist'),
            freeSpins: BASE_FREE_SPINS + L('sk_free') + L('lx_free'),
            reels: L('lx_reel6') ? 6 : 5,
            payBonus: 1 + 0.05 * L('lx_pay'),
            expandMul: 1 + 0.10 * L('lx_expand'),
            stampAdd: 0.002 * L('lx_stamp'),
            expandChance: 0.01 * L('sk_expand'),
            cashback: 0.02 * L('sk_cash'),
            beanMult: 1 + 0.15 * L('sk_bean'),
            pitcherRate: 0.07 + 0.005 * L('sp_pitcher'),
            matchaRate: 0.07 + 0.01 * L('sp_matcha'),
            latteMult: 2 + 0.5 * L('sp_latte'),
            foam: 0.5 + 0.10 * L('sp_foam'),
            bookMult: (1 + 0.03 * L('lx_book')) * (1 + 0.10 * ((extra && extra.latte) || 0))      // Sadakat kartı: Latte (kalıcı Wild/Kitap şansı)
        };
        SYMBOLS.forEach(s => { e.symMult[s.id] = 1 + 0.25 * L('sym_' + s.id); });
        return e;
    }

    /* ---------------- Bahis yardımcıları ---------------- */
    function ladderIndex(bet) {
        let idx = 0;
        for (let i = 0; i < LADDER.length; i++) if (LADDER[i] <= bet) idx = i;
        return idx;
    }
    function tierOf(bet) { return Math.min(MAX_TIER, Math.floor(ladderIndex(bet) / 3)); }
    /** Bölümde ve bakiyede geçerli bahis basamakları */
    function betOptions(chapter, balance) {
        const ch = CHAPTERS[chapter];
        return LADDER.filter(b => b >= ch.minBet && b <= ch.maxBet && b <= balance);
    }

    /* ---------------- Makara ---------------- */
    function isWild(s) { return s.id === 'book' || s.special === 'wild'; }

    function pickSymbol(ctx, reel, rng) {
        const ch = CHAPTERS[ctx.chapter], e = ctx.eff;
        if (ch.loyalty && rng() < STAMP_RATE + (e.stampAdd || 0)) return SPECIALS.stamp;
        if (ch.specials && SPECIAL_REELS.indexOf(reel) !== -1) {
            const q = rng();
            if (q < e.matchaRate) return SPECIALS.matcha;
            if (q < e.matchaRate + e.pitcherRate) return SPECIALS.pitcher;
        }
        const scatter = (BASE_SCATTER + e.scatterAdd) * (1 + TIER_SCATTER * ctx.tier) * (e.bookMult || 1);
        if (rng() < scatter) return BOOK;
        let r = rng() * TOTAL_W;
        for (let i = 0; i < NORMALS.length; i++) { r -= NORMALS[i].weight; if (r < 0) return NORMALS[i]; }
        return NORMALS[NORMALS.length - 1];
    }

    /** Kombo Ustası: rastgele bir hatta, zinciri kıran ilk sembolü eşleşmeye çevirir (özel sembollere dokunmaz). */
    function applyAssist(grid, ctx, rng) {
        if (rng() >= ctx.eff.assist) return false;
        const LN = lines(ctx), R = ctx.eff.reels || 5;
        const line = LN[Math.floor(rng() * LN.length)];
        let base = null;
        for (let r = 0; r < R; r++) {
            const s = grid[r][line[r]];
            if (isWild(s)) continue;
            if (s.special || !s.values) return false;
            base = s; break;
        }
        if (!base) return false;
        for (let r = 0; r < R; r++) {
            const s = grid[r][line[r]];
            if (s.id === base.id || isWild(s)) continue;
            if (s.special) return false;
            grid[r][line[r]] = base;
            return true;
        }
        return false;
    }

    /** ctx: { chapter, bet, tier, eff, expandingSymbolId } */
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

    /** Genişleyen sembol: ekranda (hat dışı da olsa) en az 2 (yüksek semboller) / 3 (düşük semboller) adet varsa,
        o sembolü içeren her makara tamamen o sembolle dolar. Saf fonksiyon: yeni ızgara döndürür. */
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

    function countScatter(grid) {
        let n = 0;
        for (let r = 0; r < grid.length; r++) for (let row = 0; row < ROWS; row++) if (grid[r][row].id === 'book') n++;
        return n;
    }

    /* ---------------- Değerlendirme ---------------- */
    function symPay(sym, count, ctx) {
        const ch = CHAPTERS[ctx.chapter];
        let v = sym.values && sym.values[count];
        if (!v && count === 6 && sym.values && sym.values[5]) v = sym.values[5] * 2.5;   // 6. makara süper ödülü
        if (!v) return 0;
        return v * ctx.eff.symMult[sym.id] * ch.payScale * (ch.boost[sym.id] || 1);
    }

    function stampCount(grid) {
        let n = 0;
        for (let r = 0; r < grid.length; r++) for (let row = 0; row < ROWS; row++) if (grid[r][row].id === 'stamp') n++;
        return n;
    }

    function evaluate(grid, ctx) {
        const ch = CHAPTERS[ctx.chapter], e = ctx.eff;
        const lineBet = ctx.bet / 10;
        const marks = [];
        const R = grid.length;
        let lineTotal = 0;

        lines(ctx).forEach(line => {
            // 1) saf kitap hattı
            let bookRun = 0;
            while (bookRun < R && grid[bookRun][line[bookRun]].id === 'book') bookRun++;
            let best = { pay: 0, n: 0 };
            if (bookRun >= 2) best = { pay: symPay(BOOK, bookRun, ctx), n: bookRun };

            // 2) joker (kitap/pitcher) destekli hat
            let base = null, count = 0;
            for (let r = 0; r < R; r++) {
                const s = grid[r][line[r]];
                if (isWild(s)) { count++; continue; }
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

        // Bölüm 2+: Matcha Latte kombosu ve Latte Art bonusu
        let matcha = 0, pitcher = 0;
        const matchaCells = [], pitcherCells = [];
        if (ch.specials) {
            for (let r = 0; r < R; r++) for (let row = 0; row < ROWS; row++) {
                const id = grid[r][row].id;
                if (id === 'matcha') { matcha++; matchaCells.push([r, row]); }
                else if (id === 'pitcher') { pitcher++; pitcherCells.push([r, row]); }
            }
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

        // Genişleyen sembol (free spin): ekranda yeterli sayıda varsa o makaralar tamamen dolar ve
        // sembol HER YERDE ödeme yapar (değer = kaç makarada olduğu)
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
        const total = Math.round(((lineTotal * foamMult + expandPay) * tierBonus + latte) * mult);
        const cashback = total === 0 ? Math.round(ctx.bet * e.cashback) : 0;

        return {
            total, cashback, lineTotal: Math.round(lineTotal * foamMult * tierBonus * mult), latte: Math.round(latte * mult), mult,
            expandPay: Math.round(expandPay * tierBonus * mult), expanded,
            foamMult, pairs, tierBonus, matcha, pitcher, marks,
            scatter: countScatter(grid),
            stamps: stampCount(grid)
        };
    }

    /* ---------------- Atölye çekirdeği kazancı ---------------- */
    function workshopEarn(bet, win, tier, eff, isFree, chapter) {
        const k = (CHAPTERS[chapter] && CHAPTERS[chapter].beanRate) || 0.02;
        return ((isFree ? 0 : bet * k) + win * k) * (1 + TIER_BEAN * tier) * eff.beanMult;
    }
    const LATTE_MAX = 2;                         // Latte (kalıcı wild +%10) bir bölüm boyunca en fazla 2 kez birikir

    /* ---------------- Simülasyon yardımcıları (Node) ----------------
       Tek "spin turu": normal spin + tetiklenirse tüm free spin zinciri. */
    function playRound(st, rng) {
        // st: { chapter, bet, eff, balance, [ups], [loy] }  → balance'ı günceller, ayrıntı döndürür
        const tier = st.tier !== undefined ? st.tier : tierOf(st.bet);
        const ch = CHAPTERS[st.chapter];
        const L = st.loy || (st.loy = { stamps: 0, americano: 0, filtre: false, latte: 0, pick: 0 });
        const eff = L.latte && st.ups ? effects(st.ups, { latte: L.latte }) : st.eff;
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
        const base = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: null, mult: mult() };
        let wagered = st.bet, won = 0, bean = 0, spins = 1, free = 0;
        st.balance -= st.bet;
        const grid = genGrid(base, rng);
        const res = evaluate(grid, base);
        won += res.total + res.cashback;
        bean += workshopEarn(st.bet, res.total, tier, eff, false, st.chapter);
        addStamps(res.stamps);
        if (res.scatter >= 3) {
            const pool = SYMBOLS.filter(s => s.id !== 'book');
            const exp = pool[Math.floor(rng() * pool.length)].id;
            let remaining = L.filtre ? 20 : eff.freeSpins, guard = 0;
            L.filtre = false;
            while (remaining > 0 && guard++ < 400) {
                remaining--;
                const fctx = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: exp, mult: mult() };
                const g = genGrid(fctx, rng);
                const extra = countScatter(g);
                if (extra >= 3) remaining += extra;            // free spin sırasında 3+ Kitap: o kadar free spin eklenir
                const rr = evaluate(g, fctx);
                won += rr.total + rr.cashback;
                bean += workshopEarn(st.bet, rr.total, tier, eff, true, st.chapter);
                addStamps(rr.stamps);
                free++; spins++;
            }
        }
        st.balance += won;
        return { wagered, won, bean, spins, free };
    }

    return {
        REELS, ROWS, PAYLINES, LADDER, SPECIAL_REELS, BASE_SCATTER, BASE_FREE_SPINS, MAX_TIER, TIER_PAY, TIER_SCATTER, TIER_BEAN,
        SYMBOLS, BOOK, NORMALS, SPECIALS, CHAPTERS, UPGRADES, PAYLINES6, lines, EXPAND_K,
        upgradeCost, effects, ladderIndex, tierOf, betOptions,
        isWild, pickSymbol, genGrid, expandGrid, expandMin, countScatter, stampCount, evaluate, workshopEarn, playRound, STAMP_RATE, STAMPS_PER_CARD, LATTE_MAX
    };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
