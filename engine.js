/* =====================================================================
   RECIPES OF BARISTA — MATEMATİK MOTORU (v5: 5 aşama, tek kasa)
   Saf JavaScript: DOM yok, global durum yok. Oyun (tarayıcı) ve
   simülasyon (Node) AYNI dosyayı kullanır; böylece denge testleri
   gerçek oyun matematiğini ölçer.
   ===================================================================== */
const Engine = (function () {
    'use strict';

    /* ---------------- Temel sabitler ---------------- */
    /* v5.5: 5 makara × 5 satır, 20 ödeme hattı. Hücre başına özel sembol oranları 3 satırdaki
       ekran başına ortalama sayıyı koruyacak şekilde ölçeklendi (× 3/5). */
    const ROWS = 5;
    const PAYLINES = [
        [2, 2, 2, 2, 2], [1, 1, 1, 1, 1], [3, 3, 3, 3, 3], [0, 0, 0, 0, 0], [4, 4, 4, 4, 4],
        [0, 1, 2, 3, 4], [4, 3, 2, 1, 0], [1, 2, 3, 2, 1], [3, 2, 1, 2, 3], [0, 1, 0, 1, 0],
        [4, 3, 4, 3, 4], [2, 1, 2, 3, 2], [2, 3, 2, 1, 2], [1, 0, 1, 2, 1], [3, 4, 3, 2, 3],
        [0, 0, 2, 4, 4], [4, 4, 2, 0, 0], [1, 2, 2, 2, 3], [3, 2, 2, 2, 1], [2, 0, 2, 4, 2]
    ];
    const LINES = PAYLINES.length;
    // 6. makara için hatlar: ilk 5 aynı; 6. durak = 5. makaranın satırı (4. ile aynıysa o, değilse orta satır)
    const PAYLINES6 = PAYLINES.map(l => l.concat([l[4] === l[3] ? l[4] : 2]));
    function lines(ctx) { return (ctx.eff.reels || 5) === 6 ? PAYLINES6 : PAYLINES; }
    const EXPAND_K = LINES;                     // genişleyen sembol: 20 hattın hepsinde öder
    let EXPAND_SCALE = 0.15;                       // 5 satırda genişleme çok daha sık olduğu için ödemesi ölçeklenir (simülasyonla)
    const SPECIAL_REELS = [0, 2, 4];            // Pitcher yalnızca 1., 3., 5. makarada
    const CELL = 0.6;                           // hücre başı oran ölçeği (3 satır → 5 satır)
    const BASE_SCATTER = 0.05 * CELL;           // hücre başına Reçete Kitabı ihtimali (taban)
    const BASE_FREE_SPINS = 10;

    /* Bahis merdiveni (1-2-5 dizisi). Her 3 basamak = 1 "bahis kademesi". */
    const LADDER = [];   // 10 … 50 milyar (Saga'nın son bölümlerine kadar)
    for (let m = 10; m <= 5e10; m *= 10) LADDER.push(m, m * 2, m * 5);
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
    const STAMP_RATE = 0.012 * CELL, STAMPS_PER_CARD = 10, LATTE_MAX = 2;
    const OVEN_RATE = 0.03 * CELL, OVEN_RAIN_RATE = 0.10 * CELL, OVEN_FULL = 12, OVEN_SPINS = 6;
    const BAG_RATE = 0.035 * CELL, BAG_PAY = { 3: 2, 4: 6, 5: 20, 6: 60, 7: 150 };   // bahsin katı

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
    /* v6: zorluk seçimi kaldırıldı — oyun her zaman en kolay "Hikâye" matematiğiyle oynanır
       (eski Standart/Kumarbaz kayıtları da otomatik olarak Hikâye'ye geçer). */
    const DIFFS = {
        story:   { pay: 1.29, luckStep: 0.10, luckMax: 0.60, orb: 1.0, gift: 1000, phase: 1.5 }
    };
    function diffOf() { return DIFFS.story; }
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
        1: { id: 1, key: 'cafe',    seed: 5000,    unlockAt: 60000,    price: 48000,    minBet: 10,    maxBet: 10000,   payScale: 0.7581, specials: false, boost: {}, phases: [0.5] },
        2: { id: 2, key: 'matcha',  seed: 20000,   unlockAt: 500000,   price: 400000,   minBet: 100,   maxBet: 50000,   payScale: 0.397,   specials: true,  boost: {}, phases: [0.5] },
        3: { id: 3, key: 'bakery',  seed: 100000,  unlockAt: 2500000,  price: 2000000,  minBet: 500,   maxBet: 200000,  payScale: 0.4567,   specials: false,  boost: {}, phases: [0.5], oven: true },
        4: { id: 4, key: 'harvest', seed: 500000,  unlockAt: 10000000, price: 8000000,  minBet: 1000,  maxBet: 1000000, payScale: 0.3167,   specials: false,  boost: {}, phases: [0.5], harvest: true },
        5: { id: 5, key: 'castle',  seed: 2000000, unlockAt: 50000000, price: 50000000, minBet: 2000,  maxBet: 5000000, payScale: 0.1642,   specials: false,  boost: { book: 1.5, barista: 1.5, girlfriend: 1.25 }, phases: [0.25, 0.5, 0.75], loyalty: true }
    };

    /* ---------------- ZAMAN YOLCULUĞU SAGASI: 6–100. bölümler ----------------
       Her dönem ~10 bölüm (Osmanlı 15). Dönemin gücü (buff) yalnızca o dönemin bölümlerinde etkindir
       ve YALNIZCA oyuncunun lehinedir. Bölüm hedefleri yavaşça büyür (bölüm başı ×SAGA_GROWTH);
       bahisler hedefe oranla ölçeklenir, böylece matematik her bölümde aynı kalır.
       Zaman makinesine binerken kasa sonraki bölüme en az `start`, en çok `carryMax` olarak taşınır;
       fazlası "Zaman Hazinesi"ne (skor) aktarılır — böylece bir şanslı bölüm sonraki 10 bölümü bitirmez. */
    const ERAS = [   // güç değerleri: simülasyonla, dönem bölümleri güçsüze göre ~%20 daha kısa sürecek şekilde ayarlandı (buff_tune.js)
        { key: 'egypt',     from: 6,  n: 10, buff: { book: 1.05 } },                 // Nil Bereketi: Reçete Kitabı şansı +%5
        { key: 'greece',    from: 16, n: 10, buff: { orb: 1.3 } },                   // Zeus'un Şimşeği: Dede çarpanları %30 daha sık
        { key: 'viking',    from: 26, n: 10, buff: { fs: 2 } },                      // Yağma Seferi: her free spin turu +2 spin
        { key: 'rome',      from: 36, n: 10, buff: { pay: 1.3 } },                   // Zafer Alayı: tüm kazançlar +%30
        { key: 'ottoman',   from: 46, n: 15, buff: { expand: 1.3, assist: 0.02 } },  // Kahvehane Muhabbeti: genişleyen sembol +%30, kombo +%2
        { key: 'victorian', from: 61, n: 10, buff: { cash: 0.2 } },                   // Buhar Gücü: kaybeden spinde bahsin %20'si geri
        { key: 'france',    from: 71, n: 10, buff: { high: 1.5 } },                  // Procope Salonu: yüksek semboller +%50
        { key: 'italy',     from: 81, n: 10, buff: { low: 1.7 } },                   // Usta İşi: kahve sembolleri +%70
        { key: 'jazz',      from: 91, n: 10, buff: { fsOrb: 1.35 } }                 // Swing Ritmi: free spin'de çarpanlar %35 daha sık
    ];
    const SAGA_FIRST = 6, STAGE_COUNT = 100, SAGA_GROWTH = 1.075, SAGA_KEEP = 0.2;
    /* dönem başına ödeme ölçeği: Atölye yükseltmeleri tamamlandıkça oyun kolaylaşmasın diye simülasyonla ayarlandı (saga_tune.js) */
    /* bölüm başına ince ayar (Atölye'nin pahalı yükseltmeleri bazı bölümleri uzatıyordu): chapter_tune.js */
    const SAGA_PS_CH = {"6":0.01216,"7":0.01206,"8":0.01165,"9":0.01111,"10":0.01071,"11":0.01006,"12":0.00946,"13":0.009062,"14":0.008658,"15":0.00811,"16":0.007462,"17":0.006599,"18":0.005875,"19":0.005193,"20":0.00469,"21":0.004417,"22":0.004101,"23":0.003801,"24":0.003481,"25":0.003179,"26":0.00286,"27":0.002705,"28":0.002551,"29":0.002427,"30":0.002311,"31":0.002202,"32":0.002079,"33":0.001944,"34":0.001837,"35":0.001735,"36":0.001628,"37":0.00154,"38":0.001447,"39":0.001344,"40":0.001252,"41":0.001189,"42":0.001134,"43":0.001104,"44":0.001092,"45":0.001062,"46":0.001008,"47":0.0009527,"48":0.0008968,"49":0.00084,"50":0.0007961,"51":0.0007737,"52":0.0007492,"53":0.0007279,"54":0.0007106,"55":0.0006989,"56":0.0006924,"57":0.000695,"58":0.0007007,"59":0.0007065,"60":0.0007123,"61":0.0007146,"62":0.0006962,"63":0.0006782,"64":0.000651,"65":0.0006342,"66":0.000609,"67":0.0005983,"68":0.000585,"69":0.0005806,"70":0.0005658,"71":0.0005595,"72":0.000555,"73":0.0005498,"74":0.0005446,"75":0.0005334,"76":0.0005226,"77":0.0005119,"78":0.0005047,"79":0.0004974,"80":0.0004809,"81":0.000465,"82":0.0004517,"83":0.0004365,"84":0.0004221,"85":0.0004221,"86":0.000424,"87":0.000424,"88":0.0004211,"89":0.0004182,"90":0.0004168,"91":0.0004135,"92":0.0004103,"93":0.0004106,"94":0.0004108,"95":0.0004104,"96":0.00041,"97":0.0004088,"98":0.0004096,"99":0.0004103,"100":0.0004099};
    const SAGA_PS = [0.09726, 0.07119, 0.05392, 0.01962, 0.0038, 0.00345, 0.00329, 0.00339, 0.0036];
    function eraOf(ch) { if (ch < SAGA_FIRST) return null; for (let i = ERAS.length - 1; i >= 0; i--) if (ch >= ERAS[i].from) return ERAS[i]; return null; }
    function eraIndex(ch) { const e = eraOf(ch); return e ? ERAS.indexOf(e) : -1; }
    const snapLadder = v => { let b = LADDER[0]; for (const x of LADDER) if (x <= v) b = x; return b; };
    for (let n = SAGA_FIRST; n <= STAGE_COUNT; n++) {
        const T = Math.round(30000000 * Math.pow(SAGA_GROWTH, n - SAGA_FIRST) / 100000) * 100000;
        const minBet = snapLadder(T / 15000);
        const e = eraOf(n), j = n - e.from;
        CHAPTERS[n] = { id: n, key: e.key, era: e.key, eraStep: j, seed: Math.round(T * 0.04), unlockAt: T, price: Math.round(T * (1 - SAGA_KEEP)),
            start: Math.round(T * SAGA_KEEP / SAGA_GROWTH), carryMax: Math.round(T * SAGA_KEEP * 1.5 / SAGA_GROWTH), minBet, maxBet: minBet * 2500, get payScale() { return SAGA_PS_CH[n] || SAGA_PS[ERAS.indexOf(e)]; }, specials: false,
            boost: { book: 1.25, barista: 1.25 }, phases: [0.5], loyalty: true, saga: true, final: n === STAGE_COUNT };
    }

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
    /* Dönem yükseltmeleri: her dönemde Atölye'ye o döneme özel 2 kalıcı yükseltme gelir (fiyatları dönemin ölçeğinde) */
    const ERA_UP_KIND = { egypt: 'book', greece: 'orb', viking: 'fs', rome: 'expand', ottoman: 'assist', victorian: 'cash', france: 'high', italy: 'low', jazz: 'fsorb' };
    const ERA_UP_ICON = { egypt: 'book', greece: 'goldenbean', viking: 'cozybear', rome: 'portafilter', ottoman: 'espresso', victorian: 'cake', france: 'barista', italy: 'croissant', jazz: 'bakingbear' };
    ERAS.forEach(e => {
        const late = ['victorian', 'france', 'italy', 'jazz'].indexOf(e.key) >= 0 ? 0.7 : 1;   // geç dönemler %30 ucuz (oyuncular yetişebilsin)
        const base = Math.round(CHAPTERS[e.from].unlockAt * 0.05 * late / 1000) * 1000;
        UPGRADES.push({ id: 'er_' + e.key, group: 'era', icon: ERA_UP_ICON[e.key], max: ERA_UP_KIND[e.key] === 'fs' ? 2 : 3, baseCost: base, growth: 1.8, unlock: e.from, era: e.key, kind: ERA_UP_KIND[e.key] });
        UPGRADES.push({ id: 'ep_' + e.key, group: 'era', icon: 'goldenbean', max: 3, baseCost: Math.round(base * 1.3 / 1000) * 1000, growth: 1.8, unlock: e.from, era: e.key, kind: 'pay' });
    });
    function upgradeCost(up, lvl) { return Math.round(up.baseCost * Math.pow(up.growth, lvl) / 10) * 10; }

    function effects(ups, extra) {
        const L = id => (ups && ups[id]) || 0;
        const e = {
            symMult: {},
            scatterAdd: 0.0008 * CELL * L('sk_scatter'),
            assist: 0.02 * L('sk_assist'),
            freeSpins: BASE_FREE_SPINS + L('sk_free') + L('lx_free'),
            reels: L('lx_reel6') ? 6 : 5,
            payBonus: 1 + 0.04 * L('lx_pay'),
            expandMul: 1 + 0.05 * L('lx_expand'),
            stampAdd: 0.002 * CELL * L('lx_stamp'),
            expandChance: 0.0015 * L('sk_expand'),
            cashback: 0.02 * L('sk_cash'),
            pitcherRate: (0.07 + 0.005 * L('sp_pitcher')) * CELL,
            matchaRate: (0.05 + 0.01 * L('sp_matcha')) * CELL,
            convBias: 0.35 * L('sp_foam'),
            latteMult: 2 + 0.4 * L('sp_latte'),
            foam: 0.5 + 0.08 * L('sp_foam'),
            ovenFull: OVEN_FULL - L('sp_oven'),
            ovenSpins: OVEN_SPINS + 2 * L('sp_rain'),
            bagMult: 1 + 0.25 * L('sp_bag'),
            bagRate: BAG_RATE + 0.005 * CELL * L('sp_bagrate'),
            bookMult: (1 + 0.015 * L('lx_book')) * (1 + 0.10 * ((extra && extra.latte) || 0))
        };
        e.diffKey = 'story';
        e.diff = diffOf();
        e.diffPay = e.diff.pay;
        e.orbMul = e.diff.orb;
        e.fsOrbMul = 1;
        SYMBOLS.forEach(s => { e.symMult[s.id] = 1 + 0.06 * L('sym_' + s.id); });
        // acemi şansı: 1. şubede kombo (hat tamamlama) şansı biraz yüksek
        if (extra && extra.chapter === 1) e.assist += 0.16;
        if (extra && extra.potion) e.assist += 0.08;   // Zaman İksiri (Zaman Hazinesi ile alınır, birkaç spin sürer)
        // dönem yükseltmeleri (kalıcı)
        let payLv = 0;
        ERAS.forEach(er => { payLv += L('ep_' + er.key); });
        e.allPay = 1 + 0.02 * payLv;
        e.bookMult *= 1 + 0.03 * L('er_egypt');
        e.orbMul *= 1 + 0.06 * L('er_greece');
        e.freeSpins += L('er_viking');
        e.expandMul *= 1 + 0.05 * L('er_rome');
        e.assist += 0.01 * L('er_ottoman');
        e.cashback += 0.05 * L('er_victorian');
        ['barista', 'girlfriend', 'baking_bear', 'portafilter'].forEach(id => { e.symMult[id] *= 1 + 0.05 * L('er_france'); });
        ['v60', 'espresso', 'aeropress', 'golden_bean', 'croissant'].forEach(id => { e.symMult[id] *= 1 + 0.05 * L('er_italy'); });
        e.fsOrbMul *= 1 + 0.06 * L('er_jazz');
        // dönem gücü (yalnızca o dönemin bölümlerinde)
        const era = extra && extra.chapter && !(extra && extra.noEra) ? eraOf(extra.chapter) : null;
        e.era = era ? era.key : null;
        if (era) {
            const B = era.buff;
            if (B.book) e.bookMult *= B.book;
            if (B.orb) e.orbMul *= B.orb;
            if (B.fs) e.freeSpins += B.fs;
            if (B.pay) e.allPay *= B.pay;         // tüm kazançlar (hat + genişleyen + bonuslar)
            if (B.cash) e.cashback += B.cash;     // kaybeden spinde bahsin bir kısmı geri
            if (B.expand) e.expandMul *= B.expand;
            if (B.assist) e.assist += B.assist;
            if (B.fsOrb) e.fsOrbMul *= B.fsOrb;
            if (B.high) ['barista', 'girlfriend', 'baking_bear', 'portafilter'].forEach(id => { e.symMult[id] *= B.high; });
            if (B.low) ['v60', 'espresso', 'aeropress', 'golden_bean', 'croissant'].forEach(id => { e.symMult[id] *= B.low; });
        }
        return e;
    }

    /* ---------------- Bahis yardımcıları ---------------- */
    function ladderIndex(bet) {
        let idx = 0;
        for (let i = 0; i < LADDER.length; i++) if (LADDER[i] <= bet) idx = i;
        return idx;
    }
    function tierOf(bet, chapter) {
        const ch = chapter && CHAPTERS[chapter];
        // Saga bölümlerinde kademe, o bölümün en düşük bahsine göre sayılır (5. şubedeki gibi 2.000 = taban)
        const idx = ch && ch.saga ? ladderIndex(bet) - ladderIndex(ch.minBet) + 7 : ladderIndex(bet);
        return Math.max(0, Math.min(MAX_TIER, Math.floor(idx / 3)));
    }
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
        const lineBet = ctx.bet / LINES;
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
                expandPay = symPay(ex.sym, ex.reels.length, ctx) * lineBet * EXPAND_K * (e.expandMul || 1) * EXPAND_SCALE;
                ex.reels.forEach(r => { for (let row = 0; row < ROWS; row++) marks.push({ r, row, mode: 'win' }); });
            }
        }

        const tierBonus = 1 + TIER_PAY * ctx.tier;
        const mult = ctx.mult || 1;                       // Americano: geçici x2
        lineTotal *= (e.payBonus || 1);
        let total = Math.round(((lineTotal * foamMult + expandPay) * tierBonus + latte + harvest) * mult * (e.diffPay || 1) * (e.allPay || 1));
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

    /* ---------------- SİPARİŞ FİŞLERİ: normal spinlerde kısa mini hedefler ----------------
       Arayüz ve simülasyon aynı kuralı kullanır. Ödül: bahsin katı (tamamlandığı spindeki bahis). */
    const ORDER_TYPES = [
        { id: 'wins',   goal: 3, spins: 10, reward: 1.5 },   // 10 spinde 3 kazanç
        { id: 'big',    goal: 1, spins: 12, reward: 2, x: 5 },// tek spinde bahsin 5 katı
        { id: 'books',  goal: 1, spins: 14, reward: 2 },      // tek spinde 2+ Reçete Kitabı
        { id: 'streak', goal: 2, spins: 10, reward: 1.5 }     // art arda 2 kazanç
    ];
    const ORDER_JAR = 2;   // 3 sipariş üst üste (arada kaçırmadan) = bahşiş kavanozu: bahsin 2 katı ek
    function orderNew(rng, s) { const T = ORDER_TYPES[Math.floor(rng() * ORDER_TYPES.length)]; return { t: T.id, left: T.spins, prog: 0, goal: T.goal, cd: 0, s: s || 0 }; }
    /* o: sipariş durumu (null = yok); info: { win, bet, scatter } — yalnızca normal (ücretsiz olmayan) spinlerde çağrılır.
       Döner: { o, reward, done, failed } */
    function orderStep(o, info, rng) {
        if (!o) o = { cd: 2 };
        if (o.cd > 0) { o.cd--; if (o.cd === 0) return { o: orderNew(rng, o.s), reward: 0, fresh: true }; return { o, reward: 0 }; }
        const T = ORDER_TYPES.find(x => x.id === o.t);
        const win = info.win > 0;
        if (o.t === 'wins' && win) o.prog++;
        if (o.t === 'big' && info.win >= T.x * info.bet) o.prog++;
        if (o.t === 'books' && info.scatter >= 2) o.prog++;
        if (o.t === 'streak') o.prog = win ? o.prog + 1 : 0;
        o.left--;
        if (o.prog >= o.goal) { const s = (o.s || 0) + 1, jar = s >= 3; return { o: { cd: 3, s: jar ? 0 : s }, reward: Math.round(T.reward * info.bet) + (jar ? Math.round(ORDER_JAR * info.bet) : 0), jar: jar ? Math.round(ORDER_JAR * info.bet) : 0, done: true, type: o.t }; }
        if (o.left <= 0) return { o: { cd: 3, s: 0 }, reward: 0, failed: true, type: o.t };
        return { o, reward: 0 };
    }

    /* ---------------- Simülasyon yardımcıları (Node) ----------------
       Tek "spin turu": normal spin + tetiklenirse tüm free spin / pasta yağmuru zinciri. */
    function playRound(st, rng) {
        // st: { chapter, bet, eff, ups, balance, [loy], [oven] }
        const tier = st.tier !== undefined ? st.tier : tierOf(st.bet, st.chapter);
        const ch = CHAPTERS[st.chapter];
        const L = st.loy || (st.loy = { stamps: 0, americano: 0, filtre: false, latte: 0, pick: 0 });
        if (st.oven === undefined) st.oven = 0;
        const eff = L.latte && st.ups ? effects(st.ups, { latte: L.latte, chapter: st.chapter, noEra: st.noEra }) : st.eff;
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
        if (st.orders !== false) { const os = orderStep(st.order, { win: res.total, bet: st.bet, scatter: res.scatter }, rng); st.order = os.o; won += os.reward; }
        addStamps(res.stamps);
        let rain = addOven(res.cupcakes);
        if (res.scatter >= 3) {
            const pool = SYMBOLS.filter(s => s.id !== 'book');
            const exp = pool[Math.floor(rng() * pool.length)].id;
            let remaining = (L.filtre ? 20 : eff.freeSpins) + Math.max(0, res.scatter - 3), guard = 0, fsMult = 0;   // 3'ten fazla her kitap +1 spin
            L.filtre = false;
            while (remaining > 0 && guard++ < 400) {
                remaining--;
                const fctx = { chapter: st.chapter, bet: st.bet, tier, eff, expandingSymbolId: exp, mult: mult(), inFS: true, fsMult, orbs: rollOrbs(true, rng, om * (eff.fsOrbMul || 1)) };
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
        ROWS, LINES, CELL, setExpandScale: v => { EXPAND_SCALE = v; }, PAYLINES, PAYLINES6, LADDER, SPECIAL_REELS, BASE_SCATTER, BASE_FREE_SPINS, MAX_TIER, TIER_PAY, TIER_SCATTER, EXPAND_K,
        SYMBOLS, BOOK, NORMALS, SPECIALS, CHAPTERS, STAGE_COUNT, UPGRADES,
        STAMP_RATE, STAMPS_PER_CARD, LATTE_MAX, OVEN_FULL, OVEN_SPINS, BAG_PAY,
        ORB_TABLE, ORDER_TYPES, orderNew, orderStep, DIFFS, diffOf, ERAS, eraOf, eraIndex, SAGA_PS_CH, SAGA_FIRST, SAGA_GROWTH, SAGA_KEEP, SAGA_PS, rollOrbs, convertMatcha, MATCHA_WAR, ZAFER_MULT, luckFor, LUCK_MAX, lines, upgradeCost, effects, ladderIndex, tierOf, betOptions,
        isWild, pickSymbol, genGrid, expandGrid, expandMin, countScatter, stampCount, evaluate, playRound
    };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Engine;
