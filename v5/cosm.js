        /* =====================================================
           GÖRÜNÜMLER (kozmetik): çerçeve · Dede'nin şapkası · fincan deseni
           Rozet / albüm / etkinlik ile açılır; profilde (bulutta) saklanır.
           ===================================================== */
        const FRAME_SKINS = {
            klasik:    { wood: 0x8A5530, gold: 0xF2C25A, glow: 0x3a2200, back: 0x2a160b, bulbs: [0xFFD27A, 0xFF8FAB, 0x7FE3FF, 0xA8F07A], sw: ['#8A5530', '#F2C25A'] },
            bal:       { wood: 0xB9771F, gold: 0xFFE08A, glow: 0x553300, back: 0x2e1a06, bulbs: [0xFFE08A, 0xFFB347, 0xFFF3C4, 0xFFC94D], sw: ['#B9771F', '#FFE08A'] },
            pastel:    { wood: 0xD98FA8, gold: 0xFFF1F6, glow: 0x3a1a26, back: 0x3a1c2a, bulbs: [0xFFC2D6, 0xC9E7FF, 0xFFF0B3, 0xCFF5D2], sw: ['#D98FA8', '#FFF1F6'] },
            gece:      { wood: 0x24345C, gold: 0xA9C8FF, glow: 0x0a1a3a, back: 0x0c1428, bulbs: [0xA9C8FF, 0xFFFFFF, 0x7FE3FF, 0xC7B8FF], sw: ['#24345C', '#A9C8FF'] },
            matcha:    { wood: 0x4F7A52, gold: 0xD9EFA8, glow: 0x1a2a0a, back: 0x14200f, bulbs: [0xD9EFA8, 0xA8F07A, 0xFFF6C8, 0x7FD6A0], sw: ['#4F7A52', '#D9EFA8'] },
            balkabagi: { wood: 0x3A1A4F, gold: 0xFF8A1E, glow: 0x3a1400, back: 0x160a1f, bulbs: [0xFF8A1E, 0xB66DFF, 0x9CFF6E, 0xFFD27A], sw: ['#3A1A4F', '#FF8A1E'] }
        };
        const COSM = {
            frame: [
                { id: 'klasik' }, { id: 'bal', badge: 'big' }, { id: 'gece', badge: 'fs25' },
                { id: 'matcha', badge: 'zafer' }, { id: 'pastel', album: 8 }, { id: 'balkabagi', event: 'hw', buy: true }
            ],
            cap: [
                { id: 'kasket' }, { id: 'beret', star: ['girlfriend', 2] }, { id: 'chef', badge: 'rain' },
                { id: 'crown', badge: 'hero' }, { id: 'witch', event: 'hw' }
            ],
            cup: [
                { id: 'klasik' }, { id: 'lale', badge: 'dede25' }, { id: 'altin', badge: 'epic' }, { id: 'balkabagi', event: 'hw' }
            ]
        };
        function cosmEquipped(kind) { return (Profile.cosm && Profile.cosm[kind]) || COSM[kind][0].id; }
        function cosmUnlocked(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            if (!it) return false;
            if (it.badge) return !!Profile.badges[it.badge];
            if (it.star) return (Profile.stars[it.star[0]] || 0) >= it.star[1];
            if (it.album) return albumCards().filter(c => (Profile.stars[c.id] || 0) >= 1).length >= it.album;
            if (Profile.cosmOwned && Profile.cosmOwned[kind + ':' + id]) return true;
            if (it.event) return !!(Profile.event && Profile.event[EVENT.id] && Profile.event[EVENT.id].done);
            return true;
        }
        /* Satın alınabilir görünüm: fiyat bulunduğun şubeye göre ölçeklenir (şube hedefinin %12'si)
           1. şube 12 bin · 2. 60 bin · 3. 300 bin · 4. 1,2 milyon · Final 6 milyon */
        function cosmPrice(kind, id) {
            const st = (Game.save && Game.save.stage) || 1;
            return Math.round(CHAPTERS[st].unlockAt * 0.12 / 1000) * 1000;
        }
        function buyCosm(kind, id) {
            const it = COSM[kind].find(x => x.id === id);
            if (!it || !it.buy || !Game.save || cosmUnlocked(kind, id)) return;
            const p = cosmPrice(kind, id);
            if (gameState.isSpinning || gameState.balance < p) { playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            confirmBox({ title: L().cosm.buyT, text: tf(L().cosm.buyTxt, { n: L().cosm.names[kind][id], v: fmt(p) }), art: ['dede', 'goldenbean'], ok: tf(L().cosm.buyOk, { v: fmt(p) }), good: true, onOk: () => {
                if (gameState.balance < p) return;
                gameState.balance -= p;
                Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { [kind + ':' + id]: Date.now() });
                saveProfile(); persist();
                [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), i * 100));
                equipCosm(kind, id);
                if (typeof refreshBank === 'function') refreshBank();
                achToast('dede', L().cosm.bought, L().cosm.names[kind][id]);
            } });
        }
        function cosmCond(kind, it) {
            const C = L().cosm;
            if (it.badge) return tf(C.byBadge, { n: L().badges.list[it.badge][0] });
            if (it.star) return tf(C.byStar, { n: symName(it.star[0]), s: '★'.repeat(it.star[1]) });
            if (it.album) return tf(C.byAlbum, { n: it.album });
            if (it.event) return C.byEvent;
            return C.free;
        }
        function equipCosm(kind, id) {
            if (!cosmUnlocked(kind, id)) return;
            Profile.cosm = Object.assign({ frame: 'klasik', cap: 'kasket', cup: 'klasik' }, Profile.cosm || {}, { [kind]: id });
            saveProfile();
            playSynthNote(784, 0.1, 'triangle', 0.05);
            applyCosm();
            renderHub();
        }
        function applyCosm() {
            if (typeof applyFrameSkin === 'function') applyFrameSkin();
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
        function hubLooks() {
            const C = L().cosm;
            let h = eventCard();
            ['frame', 'cap', 'cup'].forEach(kind => {
                h += `<h4 class="lb-h">${C.kinds[kind]}</h4><div class="cz-grid">`;
                COSM[kind].forEach(it => {
                    const un = cosmUnlocked(kind, it.id), on = cosmEquipped(kind) === it.id;
                    h += `<div class="cz ${un ? '' : 'locked'} ${on ? 'on' : ''}">${cosmPreview(kind, it.id)}<b>${C.names[kind][it.id]}</b>
                          <small>${un ? (on ? C.worn : C.ready) : '🔒 ' + cosmCond(kind, it)}</small>
                          ${un && !on ? `<button class="btn btn-sm" onclick="equipCosm('${kind}','${it.id}')">${C.wear}</button>` : ''}
                          ${!un && it.buy && Game.save ? `<button class="btn btn-sm btn-green" ${gameState.balance < cosmPrice(kind, it.id) ? 'disabled' : ''} onclick="buyCosm('${kind}','${it.id}')">${fmt(cosmPrice(kind, it.id))} ${beanIc()}</button>` : ''}</div>`;
                });
                h += '</div>';
            });
            return h;
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
                Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { 'frame:balkabagi': 1, 'cap:witch': 1, 'cup:balkabagi': 1 });
                Profile.cosm = Object.assign({ frame: 'klasik', cap: 'kasket', cup: 'klasik' }, Profile.cosm || {}, { frame: 'balkabagi', cap: 'witch', cup: 'balkabagi' });
                achToast('dede', L().ev.doneT, L().ev.doneS);
                const v = grant(150 * rewardUnit());
                if (v) setTimeout(() => achToast('goldenbean', '+' + fmt(v), ''), 3200);
                applyCosm();
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
           KAHVEDEDE    → test modu aç/kapat: spin bahsi kasadan düşmez
           SONRAKISUBE  → kasayı bulunduğun şubenin hedefine çıkarır
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
            if (code === 'KAHVEDEDE') {
                sv.cheat = !sv.cheat; sv.tainted = true;
                msg(sv.cheat ? C.on : C.off);
            } else if (code === 'SONRAKISUBE') {
                const c = CHAPTERS[sv.stage];
                if (!sv.finished) gameState.balance = Math.max(gameState.balance, c.unlockAt);
                sv.tainted = true; msg(C.rich);
            } else { msg(C.bad); playSynthNote(200, 0.15, 'triangle', 0.05); return; }
            playSynthNote(988, 0.12, 'sine', 0.05);
            persist();
            if (typeof refreshBank === 'function') refreshBank();
        }
