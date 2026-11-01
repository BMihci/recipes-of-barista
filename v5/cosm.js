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
        function cosmEquipped(kind) { const id = Profile.cosm && Profile.cosm[kind]; return id && cosmUnlocked(kind, id) ? id : COSM[kind][0].id; }
        function setOpen(s) {
            if (!s.need) return true;
            const st = Profile.stats || {};
            if (s.need >= 5) return (st.finished || 0) > 0 || !!(Game.save && Game.save.finished);
            return Math.max(st.maxStage || 1, (Game.save && Game.save.stage) || 1) > s.need;
        }
        function cosmUnlocked(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            if (!it) return false;
            if (Profile.cosmOwned && Profile.cosmOwned[kind + ':' + id]) return true;
            if (it.set) return setOpen(it.set);
            return !it.buy && !it.event;
        }
        /* Satın alınabilir görünüm: fiyat bulunduğun şubeye göre ölçeklenir (çerçeve hedefin %12'si, şapka %6, fincan %5) */
        function cosmPrice(kind, id) {
            const st = (Game.save && Game.save.stage) || 1, it = COSM[kind].find(x => x.id === id);
            return Math.max(1000, Math.round(CHAPTERS[st].unlockAt * ((it && it.f) || 0.12) / 1000) * 1000);
        }
        function cosmName(kind, id) { return kind === 'lever' ? L().lever.names[id] : L().cosm.names[kind][id]; }
        function cosmBuyable(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            return !!(it && it.buy && Game.save && !cosmUnlocked(kind, id) && (!it.event || eventActive()));
        }
        function buyCosm(kind, id) {
            if (!cosmBuyable(kind, id)) return;
            const p = cosmPrice(kind, id);
            if (gameState.isSpinning || gameState.balance < p) { playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            confirmBox({ title: L().cosm.buyT, text: tf(L().cosm.buyTxt, { n: cosmName(kind, id), v: fmt(p) }), art: ['dede', 'goldenbean'], ok: tf(L().cosm.buyOk, { v: fmt(p) }), good: true, onOk: () => {
                if (gameState.balance < p) return;
                gameState.balance -= p;
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
            // Cadılar Bayramı: yalnızca mağazadan
            const own = HW_LOOKS.filter(([k, id]) => cosmUnlocked(k, id));
            h += `<div class="cz-set hw"><div class="cz-sh"><span class="cz-ic">🎃</span><b>${C.hwSet}</b><small>${C.hwShop}</small>
                    ${Game.save && eventActive() ? `<button class="btn btn-sm btn-green" onclick="closeModal('modal-hub');openStore()">🛒 ${L().store.title.replace(/^\S+\s/, '')}</button>` : ''}</div>
                  <div class="cz-row">${HW_LOOKS.map(([k, id]) => czPiece(k, id, cosmUnlocked(k, id))).join('')}</div></div>`;
            return h;
        }
        /* Mağaza bölümü: slot kolları (Atölye › Kol ile aynı) */
        function storeLevers() {
            const S = L().store, V = L().lever, C = L().cosm;
            return `<h4 class="st-h">${V.storeT}</h4><p class="st-sub">${V.storeTxt}</p>` + COSM.lever.filter(it => it.id !== 'yok').map(it => {
                const own = cosmUnlocked('lever', it.id), on = cosmEquipped('lever') === it.id, p = cosmPrice('lever', it.id);
                const act = on ? `<button class="btn btn-sm" onclick="equipCosm('lever','yok');buildStore()">${V.remove}</button>`
                    : own ? `<button class="btn btn-sm" onclick="equipCosm('lever','${it.id}');buildStore()">${C.wear}</button>`
                    : `<button class="btn btn-sm btn-green" ${gameState.balance < p || gameState.isSpinning ? 'disabled' : ''} onclick="buyCosm('lever','${it.id}')">${fmt(p)} ${beanIc()}</button>`;
                return `<div class="st-card ${on ? 'on' : ''}"><span class="si lv-mini">${leverSVG(it.id)}</span><div class="sb"><b>${V.names[it.id]}${on ? ' ✓' : ''}</b><small>${V.desc[it.id]}</small></div>${act}</div>`;
            }).join('');
        }
        /* Mağaza bölümü: Cadılar Bayramı görünümleri */
        function storeLooks() {
            const S = L().store, C = L().cosm;
            if (!eventActive() && !HW_LOOKS.some(([k, id]) => cosmUnlocked(k, id))) return '';
            return `<h4 class="st-h">${S.looksT}</h4>` + HW_LOOKS.map(([k, id]) => {
                const own = cosmUnlocked(k, id), on = cosmEquipped(k) === id, p = cosmPrice(k, id);
                const act = own ? (on ? `<span class="st-tag t2">${C.worn}</span>` : `<button class="btn btn-sm" onclick="equipCosm('${k}','${id}');buildStore()">${C.wear}</button>`)
                    : eventActive() ? `<button class="btn btn-sm btn-green" ${gameState.balance < p ? 'disabled' : ''} onclick="buyCosm('${k}','${id}')">${fmt(p)} ${beanIc()}</button>` : `<span class="st-tag">${C.byEvent}</span>`;
                return `<div class="st-card hw"><span class="si cz-mini cz-${k}">${cosmPreview(k, id)}</span><div class="sb"><b>🎃 ${C.names[k][id]}</b><small>${S.hwTxt[k]}</small></div>${act}</div>`;
            }).join('');
        }

        /* =====================================================
           ETKİNLİK: CADILAR BAYRAMI (24 Ekim – 2 Kasım)
           ===================================================== */
        const EVENT = { id: 'hw2026', key: 'hw', goal: 100 };
        function eventActive() {
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
            if (ft && typeof APP_VERSION !== 'undefined') ft.textContent = `Recipes of Barista — 3D Deluxe · v${APP_VERSION.num} “${APP_VERSION.name[CUR_LANG()] || APP_VERSION.name.tr}”`;
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
