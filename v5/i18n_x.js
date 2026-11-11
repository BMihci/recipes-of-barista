        /* =====================================================
           DİL PAKETLERİ (v7): de, es, pt, he, ja, ko, zh
           Her paket İngilizcenin üzerine yazılır; eksik anahtar İngilizce kalır.
           Paket anahtarları: I18N.* · SAGA.* · STORY.* · ORDER.* · COMIC.* · COVER.* · X.* (türetilen/yan tablolar)
           "ƒ" ile başlayan değerler fonksiyon kaynağıdır.
           ===================================================== */
        (function () {
            const cloneDeep = o => { if (o === null || typeof o !== 'object') return o; if (Array.isArray(o)) return o.map(cloneDeep); const r = {}; for (const k in o) r[k] = cloneDeep(o[k]); return r; };
            const val = v => (typeof v === 'string' && v.charAt(0) === 'ƒ') ? (new Function('return (' + v.slice(1) + ')'))() : v;
            const setPath = (o, path, v) => { const ks = path.split('.'); let c = o; for (let i = 0; i < ks.length - 1; i++) { if (c[ks[i]] == null || typeof c[ks[i]] !== 'object') c[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; c = c[ks[i]]; } c[ks[ks.length - 1]] = v; };
            const ROOTS = { I18N: () => I18N, SAGA: () => SAGA_TXT, STORY: () => STORY_TXT, ORDER: () => ORDER_TXT, COMIC: () => COMIC_TXT, COVER: () => COVER_TXT };
            Object.keys(typeof LANG_PACKS !== 'undefined' ? LANG_PACKS : {}).forEach(lg => {
                const P = LANG_PACKS[lg], X = {};
                const base = {}; Object.keys(ROOTS).forEach(r => { base[r] = cloneDeep(ROOTS[r]().en); });
                Object.keys(P).forEach(key => {
                    const i = key.indexOf('.'), r = key.slice(0, i), rest = key.slice(i + 1);
                    try { if (base[r]) setPath(base[r], rest, val(P[key])); else if (r === 'X') setPath(X, rest, val(P[key])); } catch (e) {}
                });
                Object.keys(ROOTS).forEach(r => { ROOTS[r]()[lg] = base[r]; });
                const S = SAGA_TXT[lg], I = I18N[lg];
                I.htmlLang = lg;
                // 6–100. bölüm adları
                Engine.ERAS.forEach(e => { for (let j = 0; j < e.n; j++) { const n = e.from + j, nm = S.ch[e.key][j]; I.stage[n] = { name: nm, place: nm, short: `${S.chWord} ${n}`, era: e.key }; } });
                // dönem yükseltmeleri
                if (X.eraUp) Engine.UPGRADES.filter(u => u.group === 'era').forEach(u => {
                    const nm = X.eraUp.names[u.era][u.kind === 'pay' ? 1 : 0], D = X.eraUp.desc[u.kind];
                    I.up[u.id] = { n: nm, d: l => (l ? D(l) : X.eraUp.notBought) + ' · ' + S.era[u.era].name };
                });
                if (X.eraTab) I.shop.tabs.era = X.eraTab;
                // altın fincan adları
                if (X.golden) Object.keys(ERA_LOOKS).forEach(k => { I.cosm.names.cup['h_' + k] = tf(X.golden, { n: I.cosm.names.cup[ERA_LOOKS[k].cup] }); });
                // karakter adları ve dönem yılları
                if (X.cast) Object.keys(X.cast).forEach(k => { if (COMIC_CAST[k] && typeof COMIC_CAST[k] === 'object') COMIC_CAST[k][lg] = X.cast[k]; });
                if (X.years) Object.keys(X.years).forEach(k => { if (ERA_META[k]) ERA_META[k].years[lg] = X.years[k]; });
            });
        })();
