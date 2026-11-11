        /* =====================================================
           GÖRÜNÜMLER (kozmetik): çerçeve · Dede'nin şapkası · fincan deseni
           Rozet / albüm / etkinlik ile açılır; profilde (bulutta) saklanır.
           ===================================================== */
        const FRAME_SKINS = {
            klasik:    { wood: 0x8A5530, gold: 0xF2C25A, glow: 0x3a2200, back: 0x2a160b, bulbs: [0xFFD27A, 0xFF8FAB, 0x7FE3FF, 0xA8F07A], sw: ['#8A5530', '#F2C25A'] },
            bal:       { wood: 0xB9771F, gold: 0xFFE08A, glow: 0x553300, back: 0x2e1a06, bulbs: [0xFFE08A, 0xFFB347, 0xFFF3C4, 0xFFC94D], sw: ['#B9771F', '#FFE08A'] },
            pastel:    { wood: 0xD98FA8, gold: 0xFFF1F6, glow: 0x3a1a26, back: 0x3a1c2a, bulbs: [0xFFC2D6, 0xC9E7FF, 0xFFF0B3, 0xCFF5D2], sw: ['#D98FA8', '#FFF1F6'] },
            gece:      { wood: 0x24345C, gold: 0xA9C8FF, glow: 0x0a1a3a, back: 0x0c1428, bulbs: [0xA9C8FF, 0xFFFFFF, 0x7FE3FF, 0xC7B8FF], sw: ['#24345C', '#A9C8FF'] },
            hasat:     { wood: 0x7A4A22, gold: 0xE8B84A, glow: 0x3a2000, back: 0x24140a, bulbs: [0xFFB347, 0xE8B84A, 0xFF7A3D, 0xFFE08A], sw: ['#7A4A22', '#E8B84A'] },
            matcha:    { wood: 0x4F7A52, gold: 0xD9EFA8, glow: 0x1a2a0a, back: 0x14200f, bulbs: [0xD9EFA8, 0xA8F07A, 0xFFF6C8, 0x7FD6A0], sw: ['#4F7A52', '#D9EFA8'] },
            nil:       { wood: 0x2F4F9F, gold: 0xF2C25A, glow: 0x3a2a00, back: 0x0f1a33, bulbs: [0xF2C25A, 0x7FD6FF, 0xFFE08A, 0x2F7FD8], sw: ['#2F4F9F', '#F2C25A'] },
            ege:       { wood: 0xF4EFE6, gold: 0x2F86D0, glow: 0x0a2a4a, back: 0x1a2a3a, bulbs: [0x7FC4FF, 0xFFFFFF, 0x2F86D0, 0xBFE6FF], sw: ['#F4EFE6', '#2F86D0'] },
            fiyort:    { wood: 0x5A4030, gold: 0xC9CED4, glow: 0x1a2a3a, back: 0x101820, bulbs: [0x7FE3FF, 0x9CFFC8, 0xC7B8FF, 0xFFFFFF], sw: ['#5A4030', '#C9CED4'] },
            sezar:     { wood: 0x8E1E1E, gold: 0xF2C25A, glow: 0x3a1a00, back: 0x200808, bulbs: [0xFFD27A, 0xFF6B4A, 0xFFF3C4, 0xF2C25A], sw: ['#8E1E1E', '#F2C25A'] },
            cini:      { wood: 0x24508A, gold: 0xE8F2FF, glow: 0x0a1a3a, back: 0x0c1428, bulbs: [0xE63946, 0xFFFFFF, 0x2F7FD8, 0x3FA34D], sw: ['#24508A', '#E8F2FF'] },
            buhar:     { wood: 0x4A3A2E, gold: 0xB87333, glow: 0x2a1400, back: 0x1a1410, bulbs: [0xFFD27A, 0xFFB347, 0xFFF0C8, 0xE8A33A], sw: ['#4A3A2E', '#B87333'] },
            versay:    { wood: 0xF4EFE6, gold: 0xE8C04A, glow: 0x3a2a00, back: 0x1a2040, bulbs: [0xFFF3C4, 0xFFC2D6, 0xC9E7FF, 0xE8C04A], sw: ['#F4EFE6', '#E8C04A'] },
            floransa:  { wood: 0xB8613A, gold: 0xEFE4CF, glow: 0x2a1a0a, back: 0x24160c, bulbs: [0xFFE08A, 0x7FD6A0, 0xFF9F7A, 0xFFFFFF], sw: ['#B8613A', '#EFE4CF'] },
            deco:      { wood: 0x1A1A22, gold: 0xD4A72C, glow: 0x3a2a00, back: 0x0c0c12, bulbs: [0xFFD86B, 0xFF4FA3, 0x7FE3FF, 0xFFFFFF], sw: ['#1A1A22', '#D4A72C'] },
            destekci:  { wood: 0x6A2C3E, gold: 0xF7C873, glow: 0x5a1a2a, back: 0x24101a, bulbs: [0xFFB3C8, 0xF7C873, 0xFFFFFF, 0xFF6F91], sw: ['#6A2C3E', '#F7C873'] },
            dost:      { wood: 0x3A6EA5, gold: 0xFFD27A, glow: 0x1a3a5a, back: 0x0e1c2e, bulbs: [0xFF8FAB, 0x9FE3FF, 0xFFD27A, 0xB8F28A], sw: ['#3A6EA5', '#FFD27A'] },
            beta:      { wood: 0x14594A, gold: 0x59D29A, glow: 0x0a3a2a, back: 0x07211b, bulbs: [0x59D29A, 0xE9FFE8, 0xF2C25A, 0x7FE3FF], sw: ['#14594A', '#59D29A'] },
            zaman:     { wood: 0x2A1E3A, gold: 0xC9963A, glow: 0x4a2a8a, back: 0x120c20, bulbs: [0x9F7BFF, 0x7FE3FF, 0xF2C25A, 0xFFFFFF], sw: ['#2A1E3A', '#C9963A'] },
            balkabagi: { wood: 0x3A1A4F, gold: 0xFF8A1E, glow: 0x3a1400, back: 0x160a1f, bulbs: [0xFF8A1E, 0xB66DFF, 0x9CFF6E, 0xFFD27A], sw: ['#3A1A4F', '#FF8A1E'] }
        };
        /* Görünüm SETLERİ: her şube tamamlanınca yeni bir set (çerçeve + Dede şapkası + fincan) açılır.
           Cadılar Bayramı görünümleri yalnızca Mağaza'dan (etkinlik süresince) satın alınır. */
        const COSM_SETS = [
            { id: 's1', ic: 'barista', frame: 'klasik', cap: 'kasket', cup: 'klasik', need: 0 },   // başlangıç
            { id: 's2', ic: 'matcha', frame: 'matcha', cap: 'bandana', cup: 'matcha', need: 1 },   // 1. şube bitince
            { id: 's3', ic: 'cupcake', frame: 'pastel', cap: 'chef', cup: 'pastel', need: 2 },
            { id: 's4', ic: 'coffeebag', frame: 'hasat', cap: 'hasir', cup: 'toprak', need: 3 },
            { id: 's5', ic: 'stamp', frame: 'gece', cap: 'beret', cup: 'lale', need: 4 },
            { id: 's6', ic: 'goldenbean', frame: 'bal', cap: 'crown', cup: 'altin', need: 5 }     // oyunu bitirince
        ];
        const HW_LOOKS = [['frame', 'balkabagi', 0.12], ['cap', 'witch', 0.06], ['cup', 'balkabagi', 0.05]];
        const COSM = { frame: [], cap: [], cup: [] };
        COSM_SETS.forEach(s => ['frame', 'cap', 'cup'].forEach(k => COSM[k].push({ id: s[k], set: s })));
        HW_LOOKS.forEach(([k, id, f]) => COSM[k].push({ id, event: 'hw', buy: true, f }));
        /* DÖNEM KOLEKSİYONU: her tarihi döneme özel çerçeve + Dede kıyafeti + fincan. O döneme ulaşınca Mağaza'da satılır. */
        const ERA_LOOKS = {
            egypt: { frame: 'nil', cap: 'nemes', cup: 'lapis' }, greece: { frame: 'ege', cap: 'defne', cup: 'amfora' }, viking: { frame: 'fiyort', cap: 'boynuz', cup: 'run' },
            rome: { frame: 'sezar', cap: 'migfer', cup: 'zafer' }, ottoman: { frame: 'cini', cap: 'kavuk', cup: 'zarf' }, victorian: { frame: 'buhar', cap: 'silindir', cup: 'gul' },
            france: { frame: 'versay', cap: 'tricorne', cup: 'sevr' }, italy: { frame: 'floransa', cap: 'ronesans', cup: 'majolika' }, jazz: { frame: 'deco', cap: 'fotr', cup: 'caz' }
        };
        const ERA_PRICE = { frame: 0.12, cap: 0.06, cup: 0.05 };
        Object.keys(ERA_LOOKS).forEach(k => ['frame', 'cap', 'cup'].forEach(kind => COSM[kind].push({ id: ERA_LOOKS[k][kind], era: k, buy: true, f: ERA_PRICE[kind] })));
        function eraReached(k) { const e = Engine.ERAS.find(x => x.key === k), sv = Game.save; return !!(e && sv && (sv.finished || sv.stage >= e.from)); }
        /* Slot makinesi kolu: Atölye'den satın alınır (profilde kalıcı) */
        COSM.lever = [{ id: 'yok' }, { id: 'kirmizi', buy: true, f: 0.03 }, { id: 'portafiltre', buy: true, f: 0.05 }, { id: 'cezve', buy: true, f: 0.06 }, { id: 'cekirdek', buy: true, f: 0.08 }, { id: 'altin', buy: true, f: 0.12 }];
        const LEVER_ICON = { kirmizi: ['#D8DDE3', '#E0262E'], portafiltre: ['#C9CED4', '#1E1A18'], cezve: ['#C77A3A', '#6A3B1C'], cekirdek: ['#E3AE4A', '#5A3016'], altin: ['#F2C25A', '#FFD86B'] };
        function leverSVG(id) {
            const [s, k] = LEVER_ICON[id] || ['#ccc', '#999'];
            const grip = id === 'portafiltre' || id === 'cezve';
            const kn = grip ? `<rect x="25" y="4" width="14" height="26" rx="6" fill="${k}" stroke="#2a160b" stroke-width="2"/>`
                : id === 'cekirdek' ? `<ellipse cx="32" cy="16" rx="11" ry="14" fill="${k}" stroke="#2a160b" stroke-width="2"/><path d="M32 4 q-5 12 0 24" stroke="#2a160b" stroke-width="2.4" fill="none"/>`
                : `<circle cx="32" cy="16" r="12" fill="${k}" stroke="#2a160b" stroke-width="2"/><circle cx="28" cy="12" r="4" fill="#fff" opacity=".55"/>`;
            return `<svg viewBox="0 0 64 100" class="lv-ic" aria-hidden="true"><rect x="8" y="62" width="24" height="34" rx="6" fill="#8E959C" stroke="#2a160b" stroke-width="2"/><circle cx="32" cy="76" r="9" fill="${s}" stroke="#2a160b" stroke-width="2"/><rect x="29" y="22" width="6" height="56" rx="3" fill="${s}" stroke="#2a160b" stroke-width="1.5"/>${kn}</svg>`;
        }
        /* Zaman Bekçisi seti: yalnızca Zaman Hazinesi ile alınır (fiyat: bulunduğun bölümün hedefine göre) */
        const TREASURE_LOOKS = [['frame', 'zaman', 1.2], ['cap', 'pilot', 0.8], ['cup', 'kumsaati', 0.6]];
        TREASURE_LOOKS.forEach(([k, id, f]) => COSM[k].push({ id, buy: true, tre: true, f }));
        /* Altın dönem fincanları: her döneme ulaşınca yalnızca Zaman Hazinesi ile alınır */
        Object.keys(ERA_LOOKS).forEach(k => COSM.cup.push({ id: 'h_' + k, buy: true, tre: true, era: k, f: 0.4 }));
        ['tr', 'en'].forEach(lg => { const N = I18N[lg] && I18N[lg].cosm && I18N[lg].cosm.names; if (N) Object.keys(ERA_LOOKS).forEach(k => { N.cup['h_' + k] = (lg === 'en' ? 'Golden ' : 'Altın ') + N.cup[ERA_LOOKS[k].cup]; }); });
        /* Beta tester seti: yalnızca özel test koduyla açılır (satılmaz) */
        const BETA_LOOKS = [['frame', 'beta'], ['cap', 'beta'], ['cup', 'beta']];
        /* v7: Destekçi seti (Destekçi Paketi ile) ve Dost seti (arkadaş davetiyle) — satılmaz/çekirdekle alınmaz */
        const SUP_LOOKS = [['frame', 'destekci'], ['cap', 'destekci'], ['cup', 'destekci']];
        const DOST_LOOKS = [['cup', 'dost', 1], ['frame', 'dost', 3], ['cap', 'dost', 5]];   // 1 / 3 / 5 arkadaş
        SUP_LOOKS.forEach(([k, id]) => COSM[k].push({ id, iap: true }));
        DOST_LOOKS.forEach(([k, id]) => COSM[k].push({ id, invite: true }));
        BETA_LOOKS.forEach(([k, id]) => COSM[k].push({ id, beta: true }));
        function betaCode(code) {   // kod düz metin olarak kaynakta durmasın: FNV-1a özeti karşılaştırılır
            const s = String(code || '').replace(/[^A-Z0-9]/g, '');
            let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
            return s.length >= 8 && h === 1879465457;
        }
        function betaOwned() { return BETA_LOOKS.every(([k, id]) => Profile.cosmOwned && Profile.cosmOwned[k + ':' + id]); }
        function equipBeta() {
            if (!betaOwned()) return;
            Profile.cosm = Object.assign({}, Profile.cosm || {}, { frame: 'beta', cap: 'beta', cup: 'beta' });
            saveProfile(); applyCosm(); renderHub();
            [659, 784, 988].forEach((f, k) => setTimeout(() => playSynthNote(f, 0.12, 'triangle', 0.05), k * 70));
        }
        function cosmEquipped(kind) { const id = Profile.cosm && Profile.cosm[kind]; return id && cosmUnlocked(kind, id) ? id : COSM[kind][0].id; }
        function setOpen(s) {
            if (!s.need) return true;
            const st = Profile.stats || {};
            return Math.max(st.maxStage || 1, (Game.save && Game.save.stage) || 1) > s.need || (st.finished || 0) > 0;
        }
        function cosmUnlocked(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            if (!it) return false;
            if (Profile.cosmOwned && Profile.cosmOwned[kind + ':' + id]) return true;
            if (it.set) return setOpen(it.set);
            return !it.buy && !it.event && !it.beta && !it.iap && !it.invite;
        }
        /* Satın alınabilir görünüm: fiyat bulunduğun şubeye göre ölçeklenir (çerçeve hedefin %12'si, şapka %6, fincan %5) */
        function cosmPrice(kind, id) {
            const st = (Game.save && Game.save.stage) || 1, it = COSM[kind].find(x => x.id === id);
            return Math.max(1000, Math.round(CHAPTERS[st].unlockAt * ((it && it.f) || 0.12) / 1000) * 1000);
        }
        /* ödeme: Zaman Hazinesi önce harcanır, eksik kalırsa kasadan; hazine görünümleri yalnızca hazineyle */
        function cosmAfford(kind, id) {
            const it = COSM[kind].find(x => x.id === id), p = cosmPrice(kind, id), tr = (Game.save && Game.save.treasure) || 0;
            return it && it.tre ? tr >= p : tr + gameState.balance >= p;
        }
        function cosmSplit(kind, id) {
            const it = COSM[kind].find(x => x.id === id), p = cosmPrice(kind, id), tr = (Game.save && Game.save.treasure) || 0;
            const fromT = it && it.tre ? p : Math.min(tr, p);
            return { p, fromT, fromB: p - fromT };
        }
        function cosmName(kind, id) { return kind === 'lever' ? L().lever.names[id] : L().cosm.names[kind][id]; }
        function cosmBuyable(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            return !!(it && it.buy && Game.save && !cosmUnlocked(kind, id) && (!it.event || eventActive()) && (!it.era || eraReached(it.era)) && (!it.tre || Game.save.stage >= Engine.SAGA_FIRST || Game.save.finished));
        }
        function buyCosm(kind, id) {
            if (!cosmBuyable(kind, id)) return;
            const p = cosmPrice(kind, id);
            if (gameState.isSpinning || !cosmAfford(kind, id)) { playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            const sp = cosmSplit(kind, id);
            const how = sp.fromT ? '<br><small>' + tf(L().cosm.paySplit, { t: fmt(sp.fromT), b: fmt(sp.fromB) }) + '</small>' : '';
            confirmBox({ title: L().cosm.buyT, text: tf(L().cosm.buyTxt, { n: cosmName(kind, id), v: fmt(p) }) + how, art: ['dede', 'goldenbean'], ok: tf(L().cosm.buyOk, { v: fmt(p) }), good: true, onOk: () => {
                if (!cosmAfford(kind, id)) return;
                const s2 = cosmSplit(kind, id);
                Game.save.treasure = (Game.save.treasure || 0) - s2.fromT;
                gameState.balance -= s2.fromB;
                Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { [kind + ':' + id]: Date.now() });
                saveProfile(); persist();
                [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), i * 100));
                equipCosm(kind, id);
                if (typeof refreshBank === 'function') refreshBank();
                if ($('modal-store').classList.contains('open') && typeof buildStore === 'function') buildStore();
                if ($('modal-shop').classList.contains('open') && typeof buildShop === 'function') buildShop();
                achToast('dede', L().cosm.bought, cosmName(kind, id));
            } });
        }
        function setCond(s) {
            const C = L().cosm;
            if (!s.need) return C.free;
            if (s.need >= 5) return C.bySetFinal;
            return tf(C.bySet, { n: L().stage[s.need].place });
        }
        function equipCosm(kind, id) {
            if (!cosmUnlocked(kind, id)) return;
            Profile.cosm = Object.assign({ frame: 'klasik', cap: 'kasket', cup: 'klasik', lever: 'yok' }, Profile.cosm || {}, { [kind]: id });
            saveProfile();
            playSynthNote(784, 0.1, 'triangle', 0.05);
            applyCosm();
            if ($('modal-hub') && $('modal-hub').classList.contains('open')) renderHub();
        }
        function equipSet(i) {
            const s = COSM_SETS[i];
            if (!s || !setOpen(s)) return;
            Profile.cosm = Object.assign({}, Profile.cosm || {}, { frame: s.frame, cap: s.cap, cup: s.cup });
            saveProfile();
            [659, 784, 988].forEach((f, k) => setTimeout(() => playSynthNote(f, 0.12, 'triangle', 0.05), k * 70));
            applyCosm(); renderHub();
        }
        function applyCosm() {
            if (typeof applyFrameSkin === 'function') applyFrameSkin();
            if (typeof refreshLever === 'function' && (leverObj ? true : leverOn())) refreshLever();
            const box = $('dede');
            if (box && box.dataset.ready) { const f = box.querySelector('.dd-fig'); if (f) f.innerHTML = dedeSVG(cosmEquipped('cap')); }
        }
        /* önizleme: küçük çerçeve, Dede başı, fincan */
        function cosmPreview(kind, id) {
            if (kind === 'frame') {
                const s = FRAME_SKINS[id], hex = n => '#' + n.toString(16).padStart(6, '0');
                return `<div class="cz-frame" style="--w:${s.sw[0]};--g:${s.sw[1]}">${s.bulbs.concat(s.bulbs).map(b => `<i style="background:${hex(b)}"></i>`).join('')}<span></span></div>`;
            }
            if (kind === 'cap') return `<div class="cz-cap">${dedeSVG(id)}</div>`;
            return `<div class="cz-cup">${cupSVG('o2', id)}</div>`;
        }
        function czPiece(kind, id, un) {
            const C = L().cosm, on = cosmEquipped(kind) === id;
            return `<button class="cz-p ${on ? 'on' : ''}" ${un && !on ? `onclick="equipCosm('${kind}','${id}')"` : 'disabled'} title="${escapeHtml(C.names[kind][id])}">${cosmPreview(kind, id)}<small>${C.names[kind][id]}${on ? ' ✓' : ''}</small></button>`;
        }
        function hubLooks() {
            const C = L().cosm;
            let h = eventCard() + `<p class="cz-note">${C.setNote}</p>`;
            COSM_SETS.forEach((s, i) => {
                const un = setOpen(s), all = un && ['frame', 'cap', 'cup'].every(k => cosmEquipped(k) === s[k]);
                h += `<div class="cz-set ${un ? '' : 'locked'} ${all ? 'on' : ''}">
                        <div class="cz-sh"><img src="${ASSETS.sym[s.ic]}" alt=""><b>${C.sets[s.id]}</b>
                          <small>${un ? (all ? C.worn : C.ready) : '🔒 ' + setCond(s)}</small>
                          ${un && !all ? `<button class="btn btn-sm" onclick="equipSet(${i})">${C.wearSet}</button>` : ''}</div>
                        <div class="cz-row">${['frame', 'cap', 'cup'].map(k => czPiece(k, s[k], un)).join('')}</div></div>`;
            });
            // Dönem koleksiyonu (yalnızca Mağaza'dan, döneme ulaşınca)
            h += `<h4 class="lb-h">${ICON.hourglass(20)} ${C.eraT}</h4>`;
            Object.keys(ERA_LOOKS).forEach(k => {
                const EL = ERA_LOOKS[k], EM = ERA_META[k], reached = eraReached(k);
                const any = ['frame', 'cap', 'cup'].some(kind => cosmUnlocked(kind, EL[kind]));
                h += `<div class="cz-set era ${reached ? '' : 'locked'}" style="--c:${EM.col};--c2:${EM.col2}"><div class="cz-sh"><span class="cz-ic">${eraIcon(k, 30)}</span><b>${eraName(k)}</b><small>${reached ? (any ? C.eraOwn : C.eraShop) : tf(C.eraLock, { n: Engine.ERAS.find(e => e.key === k).from })}</small>
                        ${reached && Game.save ? `<button class="btn btn-sm btn-green" onclick="closeModal('modal-hub');openStore()">🛒</button>` : ''}</div>
                      ${reached ? `<div class="cz-row">${['frame', 'cap', 'cup'].map(kind => czPiece(kind, EL[kind], cosmUnlocked(kind, EL[kind]))).join('')}</div>` : ''}</div>`;
            });
            // Zaman Hazinesi görünümleri (sahip olunanlar)
            const treOwn = COSM.frame.concat(COSM.cap, COSM.cup).filter(it => it.tre).map(it => [COSM.frame.includes(it) ? 'frame' : COSM.cap.includes(it) ? 'cap' : 'cup', it.id]).filter(([k, id]) => cosmUnlocked(k, id));
            if (treOwn.length) h += `<div class="cz-set tre"><div class="cz-sh"><span class="cz-ic">${ICON.chest(30)}</span><b>${ST().treasure}</b><small>${C.treOwn}</small></div>
                  <div class="cz-row">${treOwn.map(([k, id]) => czPiece(k, id, true)).join('')}</div></div>`;
            // v7: Destekçi seti ve Dost seti
            const so = SUP_LOOKS.every(([k, id]) => cosmUnlocked(k, id)), X = PX();
            h += `<div class="cz-set sup ${so ? '' : 'locked'}"><div class="cz-sh"><span class="cz-ic">💖</span><b>${X.supSet}</b><small>${so ? C.ready : '🔒 ' + X.supLock}</small>
                    ${so ? `<button class="btn btn-sm" onclick="Profile.cosm=Object.assign({},Profile.cosm||{},{frame:'destekci',cap:'destekci',cup:'destekci'});saveProfile();applyCosm();renderHub()">${C.wearSet}</button>` : (Game.save ? `<button class="btn btn-sm btn-green" onclick="closeModal('modal-hub');openStore()">💎</button>` : '')}</div>
                  <div class="cz-row">${SUP_LOOKS.map(([k, id]) => czPiece(k, id, cosmUnlocked(k, id))).join('')}</div></div>`;
            h += `<div class="cz-set dost"><div class="cz-sh"><span class="cz-ic">🤝</span><b>${X.dostSet}</b><small>${X.dostLock}</small>
                    <button class="btn btn-sm btn-green" onclick="closeModal('modal-hub');openInvite()">${X.invShare}</button></div>
                  <div class="cz-row">${DOST_LOOKS.map(([k, id]) => czPiece(k, id, cosmUnlocked(k, id))).join('')}</div></div>`;
            // Beta tester seti
            const bo = betaOwned(), ball = bo && BETA_LOOKS.every(([k, id]) => cosmEquipped(k) === id);
            h += `<div class="cz-set beta ${bo ? '' : 'locked'} ${ball ? 'on' : ''}"><div class="cz-sh"><span class="cz-ic">${ICON.beta(30)}</span><b>${C.betaSet}</b><small>${bo ? (ball ? C.worn : C.ready) : '🔒 ' + C.betaLock}</small>
                    ${bo && !ball ? `<button class="btn btn-sm" onclick="equipBeta()">${C.wearSet}</button>` : ''}</div>
                  <div class="cz-row">${BETA_LOOKS.map(([k, id]) => czPiece(k, id, bo)).join('')}</div></div>`;
            // Cadılar Bayramı: etkinlik bitti — yalnızca sahip olanlara görünür
            const own = HW_LOOKS.filter(([k, id]) => cosmUnlocked(k, id));
            if (own.length || eventActive()) h += `<div class="cz-set hw"><div class="cz-sh"><span class="cz-ic">🎃</span><b>${C.hwSet}</b><small>${eventActive() ? C.hwShop : C.hwOver}</small>
                    ${Game.save && eventActive() ? `<button class="btn btn-sm btn-green" onclick="closeModal('modal-hub');openStore()">🛒 ${L().store.title.replace(/^\S+\s/, '')}</button>` : ''}</div>
                  <div class="cz-row">${HW_LOOKS.map(([k, id]) => czPiece(k, id, cosmUnlocked(k, id))).join('')}</div></div>`;
            return h;
        }
        /* Mağaza bölümü: dönem koleksiyonu — bulunduğun dönem en üstte, ulaştığın eski dönemler altında */
        function storeEra() {
            const S = L().store, C = L().cosm, sv = Game.save;
            if (!sv) return '';
            const cur = eraKey(sv.stage), keys = Object.keys(ERA_LOOKS).filter(eraReached).sort((a, b) => (b === cur) - (a === cur));
            const nextEra = Engine.ERAS.find(e => !eraReached(e.key));
            let h = `<h4 class="st-h">${ICON.hourglass(20)} ${C.eraT}</h4>`;
            if (!keys.length) return h + `<div class="st-card soon"><span class="si">⏳</span><div class="sb"><b>${C.eraT}</b><small>${C.eraNone}</small></div></div>`;
            keys.forEach(k => {
                const EL = ERA_LOOKS[k], EM = ERA_META[k];
                h += `<div class="st-era" style="--c:${EM.col};--c2:${EM.col2}"><b class="st-era-h">${eraIcon(k, 24)} ${eraName(k)}${k === cur ? ' · ' + C.eraNow : ''}</b>`;
                ['frame', 'cap', 'cup'].forEach(kind => {
                    const id = EL[kind], own = cosmUnlocked(kind, id), on = cosmEquipped(kind) === id, p = cosmPrice(kind, id);
                    const act = own ? (on ? `<span class="st-tag t2">${C.worn}</span>` : `<button class="btn btn-sm" onclick="equipCosm('${kind}','${id}');buildStore()">${C.wear}</button>`)
                        : `<button class="btn btn-sm btn-green" ${!cosmAfford(kind, id) || gameState.isSpinning ? 'disabled' : ''} onclick="buyCosm('${kind}','${id}')">${fmt(p)} ${beanIc()}</button>`;
                    h += `<div class="st-card era"><span class="si cz-mini cz-${kind}">${cosmPreview(kind, id)}</span><div class="sb"><b>${C.names[kind][id]}</b><small>${C.kinds[kind]}</small></div>${act}</div>`;
                });
                h += `<button class="btn btn-sm btn-soft st-era-all" onclick="buyEraSet('${k}')">${C.eraWearAll}</button></div>`;
            });
            if (nextEra) h += `<p class="st-sub">🔒 ${tf(C.eraNext, { era: eraName(nextEra.key), n: nextEra.from })}</p>`;
            return h;
        }
        function buyEraSet(k) {   // sahip olunan parçaları birlikte giy
            const EL = ERA_LOOKS[k];
            const own = ['frame', 'cap', 'cup'].filter(kind => cosmUnlocked(kind, EL[kind]));
            if (!own.length) { playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            Profile.cosm = Object.assign({}, Profile.cosm || {}); own.forEach(kind => { Profile.cosm[kind] = EL[kind]; });
            saveProfile(); applyCosm(); buildStore();
            [659, 784, 988].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.12, 'triangle', 0.05), i * 70));
        }
        /* Mağaza bölümü: Zaman Hazinesi cüzdanı + yalnızca hazineyle alınan Zaman Bekçisi seti */
        function storeTreasure() {
            const sv = Game.save, C = L().cosm;
            if (!sv || !(sv.stage >= Engine.SAGA_FIRST || sv.finished)) return '';
            let h = `<h4 class="st-h">${ICON.chest(20)} ${ST().treasure}</h4><div class="st-card tre"><span class="si">${ICON.chest(34)}</span><div class="sb"><b>${fmt(sv.treasure || 0)}</b><small>${C.treTxt}</small></div></div>`;
            const tr = sv.treasure || 0, cp = chestPrice(), pp = potionPrice(), pool = chestPool();
            h += `<div class="st-card tre"><span class="si">${ICON.flask(34)}</span><div class="sb"><b>${C.potion}${sv.potion > 0 ? ' · ' + tf(C.potionLeft, { n: sv.potion }) : ''}</b><small>${C.potionTxt}</small></div>
                    <button class="btn btn-sm btn-green" ${tr < pp || gameState.isSpinning || (sv.potion || 0) >= POTION_MAX ? 'disabled' : ''} onclick="buyPotion()">${ICON.chest(16)} ${fmt(pp)}</button></div>`;
            if (pool.length) h += `<div class="st-card tre"><span class="si">${ICON.chest(34)}</span><div class="sb"><b>${C.chest}</b><small>${tf(C.chestTxt, { n: pool.length })}</small></div>
                    <button class="btn btn-sm btn-green" ${tr < cp || gameState.isSpinning ? 'disabled' : ''} onclick="openChest()">${ICON.chest(16)} ${fmt(cp)}</button></div>`;
            const looks = TREASURE_LOOKS.concat(Object.keys(ERA_LOOKS).filter(eraReached).map(k => ['cup', 'h_' + k]));
            h += looks.map(([k, id]) => {
                const own = cosmUnlocked(k, id), on = cosmEquipped(k) === id, p = cosmPrice(k, id);
                const act = own ? (on ? `<span class="st-tag t2">${C.worn}</span>` : `<button class="btn btn-sm" onclick="equipCosm('${k}','${id}');buildStore()">${C.wear}</button>`)
                    : `<button class="btn btn-sm btn-green" ${!cosmAfford(k, id) || gameState.isSpinning ? 'disabled' : ''} onclick="buyCosm('${k}','${id}')">${ICON.chest(16)} ${fmt(p)}</button>`;
                return `<div class="st-card era tre"><span class="si cz-mini cz-${k}">${cosmPreview(k, id)}</span><div class="sb"><b>${C.names[k][id]}</b><small>${C.kinds[k]}</small></div>${act}</div>`;
            }).join('');
            return h;
        }
        /* Zaman Hazinesi harcamaları: Hazine Sandığı (rastgele görünüm) ve Zaman İksiri (birkaç spin hat tamamlama +%8) */
        const POTION_SPINS = 25, POTION_MAX = 75;
        function chestPrice() { const st = (Game.save && Game.save.stage) || 1; return Math.max(1000, Math.round(CHAPTERS[st].unlockAt * 0.5 / 1000) * 1000); }
        function potionPrice() { const st = (Game.save && Game.save.stage) || 1; return Math.max(1000, Math.round(CHAPTERS[st].unlockAt * 0.25 / 1000) * 1000); }
        function chestPool() {
            const out = [];
            ['frame', 'cap', 'cup', 'lever'].forEach(k => COSM[k].forEach(it => { if (it.buy && !it.tre && !it.event && cosmBuyable(k, it.id)) out.push([k, it.id]); }));
            return out;
        }
        function payTreasure(p) { const sv = Game.save; if (!sv || (sv.treasure || 0) < p || gameState.isSpinning) { playSynthNote(200, 0.15, 'triangle', 0.05); return false; } sv.treasure -= p; return true; }
        function openChest() {
            const pool = chestPool(), p = chestPrice(), C = L().cosm;
            if (!pool.length) return;
            confirmBox({ title: C.chest, text: tf(C.chestAsk, { v: fmt(p) }), art: ['dede', 'goldenbean'], ok: tf(L().cosm.buyOk, { v: fmt(p) }), good: true, onOk: () => {
                if (!payTreasure(p)) return;
                const [k, id] = pool[Math.floor(Math.random() * pool.length)];
                Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { [k + ':' + id]: Date.now() });
                saveProfile(); persist();
                [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), i * 90));
                if (k !== 'lever') equipCosm(k, id);
                buildStore();
                achToast('dede', C.chestGot, k === 'lever' ? L().lever.names[id] : cosmName(k, id));
            } });
        }
        function buyPotion() {
            const sv = Game.save, p = potionPrice(), C = L().cosm;
            if (!sv || (sv.potion || 0) >= POTION_MAX) return;
            if (!payTreasure(p)) return;
            sv.potion = Math.min(POTION_MAX, (sv.potion || 0) + POTION_SPINS);
            persist(); refreshEff();
            [392, 523, 784].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.18, 'sine', 0.06), i * 80));
            buildStore(); if (typeof renderOrder === 'function') renderOrder();
            achToast('dede', C.potion, tf(C.potionLeft, { n: sv.potion }));
        }
        /* Mağaza bölümü: slot kolları (Atölye › Kol ile aynı) */
        function storeLevers() {
            const S = L().store, V = L().lever, C = L().cosm;
            return `<h4 class="st-h">${V.storeT}</h4><p class="st-sub">${V.storeTxt}</p>` + COSM.lever.filter(it => it.id !== 'yok').map(it => {
                const own = cosmUnlocked('lever', it.id), on = cosmEquipped('lever') === it.id, p = cosmPrice('lever', it.id);
                const act = on ? `<button class="btn btn-sm" onclick="equipCosm('lever','yok');buildStore()">${V.remove}</button>`
                    : own ? `<button class="btn btn-sm" onclick="equipCosm('lever','${it.id}');buildStore()">${C.wear}</button>`
                    : `<button class="btn btn-sm btn-green" ${!cosmAfford('lever', it.id) || gameState.isSpinning ? 'disabled' : ''} onclick="buyCosm('lever','${it.id}')">${fmt(p)} ${beanIc()}</button>`;
                return `<div class="st-card ${on ? 'on' : ''}"><span class="si lv-mini">${leverSVG(it.id)}</span><div class="sb"><b>${V.names[it.id]}${on ? ' ✓' : ''}</b><small>${V.desc[it.id]}</small></div>${act}</div>`;
            }).join('');
        }
        /* Mağaza bölümü: Cadılar Bayramı görünümleri */
        function storeLooks() {
            const S = L().store, C = L().cosm;
            const list = eventActive() ? HW_LOOKS : HW_LOOKS.filter(([k, id]) => cosmUnlocked(k, id));   // etkinlik bitti: yalnızca sahip olunanlar (giymek için)
            if (!list.length) return '';
            return `<h4 class="st-h">${S.looksT}</h4>` + list.map(([k, id]) => {
                const own = cosmUnlocked(k, id), on = cosmEquipped(k) === id, p = cosmPrice(k, id);
                const act = own ? (on ? `<span class="st-tag t2">${C.worn}</span>` : `<button class="btn btn-sm" onclick="equipCosm('${k}','${id}');buildStore()">${C.wear}</button>`)
                    : eventActive() ? `<button class="btn btn-sm btn-green" ${!cosmAfford(k, id) ? 'disabled' : ''} onclick="buyCosm('${k}','${id}')">${fmt(p)} ${beanIc()}</button>` : `<span class="st-tag">${C.byEvent}</span>`;
                return `<div class="st-card hw"><span class="si cz-mini cz-${k}">${cosmPreview(k, id)}</span><div class="sb"><b>🎃 ${C.names[k][id]}</b><small>${S.hwTxt[k]}</small></div>${act}</div>`;
            }).join('');
        }

        /* =====================================================
           ETKİNLİK: CADILAR BAYRAMI (24 Ekim – 2 Kasım)
           ===================================================== */
        const EVENT = { id: 'hw2026', key: 'hw', goal: 100 };
        /* Cadılar Bayramı 2026 sona erdi: ürünler satılmaz, sahip olanlar giymeye devam eder */
        const EVENT_OVER = true;
        function eventActive() {
            if (EVENT_OVER) return false;
            const d = new Date(), m = d.getMonth(), day = d.getDate();
            return (m === 9 && day >= 24) || (m === 10 && day <= 2);
        }
        function themeOn() { return eventActive() && Settings.eventTheme !== false; }
        function eventState() { Profile.event = Profile.event || {}; return Profile.event[EVENT.id] || (Profile.event[EVENT.id] = { spins: 0, done: false }); }
        function eventSpin() {
            if (!eventActive()) return;
            const E = eventState();
            if (E.done) return;
            E.spins++;
            if (E.spins >= EVENT.goal) {
                E.done = true;
                achToast('dede', L().ev.doneT, L().ev.doneS);
                const v = grant(150 * rewardUnit());
                if (v) setTimeout(() => achToast('goldenbean', '+' + fmt(v), ''), 3200);
            }
        }
        function eventCard() {
            if (!eventActive()) return '';
            const E = eventState(), V = L().ev;
            const pct = Math.min(100, E.spins / EVENT.goal * 100);
            return `<div class="ev-card"><div class="ev-ic">🎃</div><div class="ev-b"><b>${V.title}</b><small>${E.done ? V.done : tf(V.task, { n: EVENT.goal })}</small>
                    <div class="ac-bar"><i style="width:${pct}%"></i></div><small>${Math.min(E.spins, EVENT.goal)} / ${EVENT.goal} · ${V.until}</small></div></div>`;
        }
        /* süsler: yarasalar, balkabakları */
        function applyTheme() {
            const on = themeOn();
            document.body.classList.toggle('halloween', on);
            let d = $('hw-deco');
            if (on && !d) {
                d = document.createElement('div'); d.id = 'hw-deco'; d.setAttribute('aria-hidden', 'true');
                const bat = `<svg viewBox="0 0 60 30"><path d="M30 8 q4 -6 6 0 q8 -8 22 -2 q-8 2 -8 10 q-6 -4 -10 2 q-4 -4 -6 4 q-4 -8 -6 -4 q-4 -6 -10 -2 q0 -8 -8 -10 q14 -6 22 2 q2 -6 6 0z" fill="#2A1238"/><circle cx="27" cy="10" r="1.4" fill="#FFD27A"/><circle cx="33" cy="10" r="1.4" fill="#FFD27A"/></svg>`;
                d.innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="hw-bat b${i}">${bat}</span>`).join('') + '<span class="hw-pk p1">🎃</span><span class="hw-pk p2">🎃</span><span class="hw-pk p3">🕯️</span>';
                document.body.appendChild(d);
            } else if (!on && d) d.remove();
            const ft = document.querySelector('footer.foot');
            if (ft && typeof APP_VERSION !== 'undefined') ft.textContent = `Recipes of Barista — 3D Deluxe · v${APP_VERSION.num} “${APP_VERSION.name[CUR_LANG()] || APP_VERSION.name.en}”`;
            const b = $('menu-event');
            if (b) { b.classList.toggle('hidden', !on); b.innerHTML = on ? L().ev.banner : ''; }
        }

        /* =====================================================
           TEST / HİLE KODLARI (gizli): Ayarlar'da sürüm yazısına 5 kez dokun
           CERENKUS   → test modu aç/kapat: spin bahsi kasadan düşmez
           SUBEAC     → kasayı bulunduğun şubenin hedefine çıkarır
           EASTEREGG  → profil başına bir kez 5.000 çekirdek hediye (hile sayılmaz)
           Hile kullanılan kayıt skor tablosuna gönderilmez.
           ===================================================== */
        let cheatTaps = 0, cheatT = null;
        function cheatTap() {
            cheatTaps++; clearTimeout(cheatT); cheatT = setTimeout(() => { cheatTaps = 0; }, 1500);
            if (cheatTaps < 5) return;
            cheatTaps = 0;
            closeModal('modal-settings');
            $('ch-in').value = ''; $('ch-msg').textContent = '';
            $('ch-title').textContent = L().cheat.title; $('ch-ok').textContent = L().cheat.ok; $('ch-cancel').textContent = L().set.close;
            $('ch-in').placeholder = L().cheat.ph;
            openModal('modal-cheat');
            setTimeout(() => { try { $('ch-in').focus(); } catch (e) {} }, 60);
        }
        function cheatApply() {
            const C = L().cheat, code = ($('ch-in').value || '').trim().toLocaleUpperCase('tr-TR').replace(/\s+/g, '').replace(/[İIŞĞÜÖÇ]/g, ch => ({ 'İ': 'I', 'I': 'I', 'Ş': 'S', 'Ğ': 'G', 'Ü': 'U', 'Ö': 'O', 'Ç': 'C' })[ch]);
            const msg = t => { $('ch-msg').textContent = t; };
            if (betaCode(code)) {   // beta tester kodu: profile kalıcı görünüm seti (kaydı etkilemez, skor tablosuna engel değil)
                if (betaOwned()) { msg(L().cosm.betaHave); return; }
                const now = Date.now();
                Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}); BETA_LOOKS.forEach(([k, id]) => { Profile.cosmOwned[k + ':' + id] = now; });
                Profile.cosm = Object.assign({}, Profile.cosm || {}, { frame: 'beta', cap: 'beta', cup: 'beta' });
                saveProfile(); applyCosm();
                msg(L().cosm.betaOk);
                [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 90));
                setTimeout(() => { closeModal('modal-cheat'); achToast('dede', L().cosm.betaSet, L().cosm.betaOk); }, 1100);
                return;
            }
            if (!Game.save) { msg(C.needSave); return; }
            const sv = Game.save;
            if (code === 'EASTEREGG') {
                if (Profile.egg) { msg(C.eggUsed); playSynthNote(200, 0.15, 'triangle', 0.05); return; }
                Profile.egg = Date.now(); saveProfile();
                gameState.balance += 5000;
                msg(C.egg);
                [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 90));
                persist(); if (typeof refreshBank === 'function') refreshBank();
                setTimeout(() => { closeModal('modal-cheat'); achToast('goldenbean', C.egg, '+' + fmt(5000)); }, 900);
                return;
            }
            if (code === 'CERENKUS') {
                sv.cheat = !sv.cheat; sv.tainted = true;
                msg(sv.cheat ? C.on : C.off);
            } else if (code === 'SUBEAC') {
                const c = CHAPTERS[sv.stage];
                if (!sv.finished) gameState.balance = Math.max(gameState.balance, c.unlockAt);
                sv.tainted = true; msg(C.rich);
            } else { msg(C.bad); playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            playSynthNote(988, 0.12, 'sine', 0.05);
            persist();
            if (typeof refreshBank === 'function') refreshBank();
        }
