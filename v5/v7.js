        /* =====================================================
           v7 "FİLTRE KAHVE": premium mağaza · arkadaş daveti · hukuki onay · dil seçici
           Metinler: PX_TXT (her dil) — PX() geçerli dili, eksikse İngilizceyi döndürür.
           ===================================================== */
        function PX() { const t = PX_TXT[CUR_LANG()] || PX_TXT.en; return t === PX_TXT.en ? t : Object.assign({}, PX_TXT.en, t, { names: Object.assign({}, PX_TXT.en.names, t.names || {}) }); }
        function UX(k) { const t = PX(); return (t.ui && t.ui[k]) || PX_TXT.en.ui[k] || k; }
        function LOC() { return ({ tr: 'tr-TR', en: 'en-US', de: 'de-DE', es: 'es-ES', pt: 'pt-BR', he: 'he-IL', ja: 'ja-JP', ko: 'ko-KR', zh: 'zh-CN' })[CUR_LANG()] || 'en-US'; }
        const LEGAL_VER = 1, AGE_GATE = true;
        const LEGAL_URL = { privacy: APP_IDS.web + '/privacy.html', terms: APP_IDS.web + '/terms.html', del: APP_IDS.web + '/delete-account.html' };
        function openLegal(k) { const u = LEGAL_URL[k] + '?lang=' + CUR_LANG(); try { window.open(u, '_blank', 'noopener'); } catch (e) { location.href = u; } }

        /* ---------- Premium mağaza bölümü ---------- */
        function storePremium() {
            const X = PX(), sv = Game.save, web = !Platform.native() && !Billing.testMode;
            const btn = p => iapOwned(p.id) ? `<span class="st-tag t2">✓ ${X.owned}</span>`
                : web ? `<a class="btn btn-sm btn-green" href="${APP_IDS.play}" target="_blank" rel="noopener">${X.onPlay}</a>`
                : `<button class="btn btn-sm btn-green" onclick="Billing.buy('${p.id}')">${Billing.price(p.id)}</button>`;
            const prev = p => iapLooks(p).slice(0, 3).map(([k, id]) => k === 'lever' ? `<span class="pm-pc lv-mini">${leverSVG(id)}</span>` : `<span class="pm-pc cz-mini cz-${k}">${cosmPreview(k, id)}</span>`).join('');
            const sup = IAP_PRODUCTS[0];
            let h = `<h4 class="st-h">💎 ${X.premT}</h4><p class="st-sub">${X.premSub}</p>`;
            h += `<div class="pm-sup ${iapOwned(sup.id) ? 'own' : ''}"><div class="pm-sh"><b>💖 ${X.supName}</b>${btn(sup)}</div>
                    <div class="pm-row">${prev(sup)}</div><ul class="pm-perks">${X.supPerks.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
            const cur = sv && eraKey(sv.stage);
            const sets = IAP_PRODUCTS.slice(1).sort((a, b) => (b.era === cur) - (a.era === cur));
            h += `<div class="pm-list">` + sets.map(p => `<div class="st-card pm ${iapOwned(p.id) ? 'own' : ''}"><div class="pm-row sm">${prev(p)}</div><div class="sb"><b>${iapName(p)}</b><small>${p.id === 'levers_all' ? X.leversTxt : p.id === 'cups_gold' ? X.cupsTxt : X.setTxt}</small></div>${btn(p)}</div>`).join('') + `</div>`;
            if (Platform.native()) h += `<button class="btn btn-sm btn-soft st-era-all" onclick="Billing.restore()">${X.restore}</button>`;
            h += `<p class="pm-note">${X.legalNote} <a href="#" onclick="openLegal('terms');return false">${X.terms}</a> · <a href="#" onclick="openLegal('privacy');return false">${X.privacy}</a></p>`;
            return h;
        }

        /* ---------- Arkadaş daveti ---------- */
        const Invite = {
            busy: false, count: null,
            code() {
                if (!Cloud.user) return '';
                const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = Cloud.user.uid;
                let h = 2166136261 >>> 0, h2 = 5381;
                for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0; h2 = ((h2 << 5) + h2 + s.charCodeAt(i)) >>> 0; }
                let out = '', x = h, y = h2;
                for (let i = 0; i < 6; i++) { const v = i < 3 ? x : y; out += A[v % 32]; if (i < 3) x = Math.floor(x / 32); else y = Math.floor(y / 32); }
                return 'RB' + out;
            },
            pretty(c) { return c ? c.slice(0, 2) + '-' + c.slice(2) : ''; },
            norm(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); },
            async ensure() {
                if (!Cloud.user || !Cloud.db) return;
                const c = this.code(), ref = Cloud.db.collection('invites').doc(c);
                try { const s = await ref.get(); if (!s.exists) await ref.set({ uid: Cloud.user.uid, at: firebase.firestore.FieldValue.serverTimestamp() }); } catch (e) {}
            },
            async refresh() {
                if (!Cloud.user || !Cloud.db) return;
                try {
                    const q = await Cloud.db.collection('redemptions').where('inviter', '==', Cloud.user.uid).limit(50).get();
                    this.count = q.size;
                    this.claim();
                } catch (e) {}
                renderInvite();
            },
            /* ödüller: her yeni arkadaş = bulunduğun bölümün başlangıç tutarı (en çok 10 arkadaş); 1/3/5 arkadaşta Dost seti parçaları */
            claim() {
                const n = this.count || 0, got = Profile.inviteClaimed || 0, X = PX();
                DOST_LOOKS.forEach(([k, id, need]) => { if (n >= need && !(Profile.cosmOwned && Profile.cosmOwned[k + ':' + id])) { Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { [k + ':' + id]: Date.now() }); achToast('dede', X.invUnlock, cosmName(k, id)); } });
                const pay = Math.min(10, n) - Math.min(10, got);
                if (pay > 0 && Game.save) {
                    const v = giftAmt() * pay;
                    gameState.balance += v; Profile.inviteClaimed = got + pay; persist(); refreshBank();
                    setTimeout(() => showDialog('cozybear', castName('cozybear'), tf(X.invPaid, { n: pay, v: fmt(v) })), 400);
                }
                saveProfile();
            },
            async redeem() {
                const X = PX(), inp = $('inv-in'), msg = t => { $('inv-msg').textContent = t; };
                const c = this.norm(inp && inp.value);
                if (!Cloud.user) { msg(X.invLogin); return; }
                if (Profile.invitedBy) { msg(X.invUsed); return; }
                if (!/^RB[A-Z2-9]{6}$/.test(c)) { msg(X.invBad); return; }
                if (c === this.code()) { msg(X.invSelf); return; }
                if (this.busy) return; this.busy = true; msg('…');
                try {
                    const s = await Cloud.db.collection('invites').doc(c).get();
                    if (!s.exists) { msg(X.invBad); return; }
                    await Cloud.db.collection('redemptions').doc(Cloud.user.uid).set({ code: c, inviter: s.data().uid, at: firebase.firestore.FieldValue.serverTimestamp() });
                    Profile.invitedBy = c;
                    Profile.cosmOwned = Object.assign(Profile.cosmOwned || {}, { 'cup:dost': Profile.cosmOwned && Profile.cosmOwned['cup:dost'] || Date.now() });
                    saveProfile();
                    if (Game.save) { const v = giftAmt() * 2; gameState.balance += v; persist(); refreshBank(); msg(tf(X.invOk, { v: fmt(v) })); }
                    else msg(tf(X.invOk, { v: '' }));
                    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.2, 'sine', 0.06), i * 90));
                    equipCosm('cup', 'dost');
                } catch (e) {
                    msg(e && /permission/i.test(e.code || e.message || '') ? X.invUsed : X.invErr);
                } finally { this.busy = false; }
            },
            share() {
                const X = PX(), c = this.pretty(this.code());
                if (!c) return;
                shareText(X.invShareT, tf(X.invShareTxt, { c }), APP_IDS.play);
            }
        };
        function openInvite() {
            if (!$('modal-invite')) {
                const m = document.createElement('div'); m.id = 'modal-invite'; m.className = 'modal';
                m.innerHTML = `<div class="panel inv"><button class="x-btn" onclick="closeModal('modal-invite')">✕</button><div id="inv-body"></div></div>`;
                document.body.appendChild(m);
                if (typeof ALL_MODALS !== 'undefined' && !ALL_MODALS.includes('modal-invite')) ALL_MODALS.push('modal-invite');
            }
            renderInvite(); openModal('modal-invite');
            if (Cloud.user) { Invite.ensure(); Invite.refresh(); }
        }
        function renderInvite() {
            const b = $('inv-body'); if (!b) return;
            const X = PX(), c = Invite.pretty(Invite.code()), n = Invite.count;
            const steps = DOST_LOOKS.map(([k, id, need]) => { const own = Profile.cosmOwned && Profile.cosmOwned[k + ':' + id]; return `<div class="inv-step ${own ? 'own' : ''}"><span class="cz-mini cz-${k}">${cosmPreview(k, id)}</span><small>${tf(X.invNeed, { n: need })}${own ? ' ✓' : ''}</small></div>`; }).join('');
            b.innerHTML = `<h3 class="good-title">🤝 ${X.invT}</h3><p class="hub-info">${X.invInfo}</p>
                ${Cloud.user ? `<div class="inv-code"><small>${X.invMine}</small><b>${c}</b><button class="btn btn-green btn-sm" onclick="Invite.share()">${X.invShare}</button></div>
                    <p class="hub-note">${n === null ? '…' : tf(X.invCount, { n })}</p>`
                  : `<p class="hub-note">${X.invLogin}</p><button class="btn btn-sm" onclick="closeModal('modal-invite');openProfile()">${X.invLoginBtn}</button>`}
                <div class="inv-steps">${steps}</div>
                <h4 class="set-h">${X.invHave}</h4>
                ${Profile.invitedBy ? `<p class="hub-ok">✓ ${tf(X.invDone, { c: Invite.pretty(Profile.invitedBy) })}</p>`
                  : `<div class="inv-in"><input id="inv-in" maxlength="9" placeholder="RB-XXXXXX" autocomplete="off"><button class="btn btn-sm" onclick="Invite.redeem()">${X.invUse}</button></div><p id="inv-msg" class="hub-note"></p>`}`;
        }

        /* ---------- İlk açılış: kullanıcı sözleşmesi + gizlilik + yaş onayı ---------- */
        function legalCheck(then) {
            if (Settings.legal >= LEGAL_VER) { then && then(); return; }
            const X = PX(), m = document.createElement('div');
            m.className = 'lg-wrap';
            m.innerHTML = `<div class="lg"><img src="${ASSETS.sym.barista}" alt=""><h3>${X.lgT}</h3>
                <div class="lg-langs">${LANGS.map(l => `<button class="${l === CUR_LANG() ? 'on' : ''}" data-l="${l}">${LANG_NAMES[l]}</button>`).join('')}</div>
                <p>${X.lgTxt}</p>
                <p class="lg-links"><a href="#" data-k="terms">${X.terms}</a> · <a href="#" data-k="privacy">${X.privacy}</a></p>
                ${AGE_GATE ? `<p class="lg-age">${X.lgAge}</p>` : ''}
                <button class="btn btn-green btn-block lg-ok">${X.lgOk}</button>
                ${AGE_GATE ? `<button class="btn btn-soft btn-block lg-no">${X.lgNo}</button>` : ''}<p class="lg-msg"></p></div>`;
            document.body.appendChild(m);
            m.querySelectorAll('[data-k]').forEach(a => a.onclick = e => { e.preventDefault(); openLegal(a.dataset.k); });
            m.querySelectorAll('[data-l]').forEach(bt => bt.onclick = () => { setLang(bt.dataset.l); m.remove(); legalCheck(then); });
            m.querySelector('.lg-ok').onclick = () => { Settings.legal = LEGAL_VER; Settings.legalAt = Date.now(); saveSettings(); m.remove(); initAudio(); then && then(); };
            const no = m.querySelector('.lg-no'); if (no) no.onclick = () => { m.querySelector('.lg-msg').textContent = X.lgMinor; };
        }

        /* ---------- Dil seçici (Ayarlar) ---------- */
        function langPicker() {
            return `<select class="lang-sel" onchange="setLang(this.value)">${LANGS.map(l => `<option value="${l}" ${l === CUR_LANG() ? 'selected' : ''}>${LANG_NAMES[l]}</option>`).join('')}</select>`;
        }
        function legalLinks() {
            const X = PX();
            return `<h4 class="set-h">${X.legalT}</h4><div class="set-links">
                <button class="btn btn-soft btn-block" onclick="openLegal('terms')">📄 ${X.terms}</button>
                <button class="btn btn-soft btn-block" onclick="openLegal('privacy')">🔒 ${X.privacy}</button>
                ${Platform.native() ? `<button class="btn btn-soft btn-block" onclick="Ads.privacyOptions()">🛡 ${X.adPriv}</button>` : ''}
                <button class="btn btn-soft btn-block" onclick="openLegal('del')">🗑 ${X.delAcc}</button>
                ${Platform.native() ? `<button class="btn btn-soft btn-block" onclick="Billing.restore()">♻ ${X.restore}</button>` : ''}
                <button class="btn btn-soft btn-block" onclick="closeModal('modal-settings');openInvite()">🤝 ${X.invT}</button></div>`;
        }
