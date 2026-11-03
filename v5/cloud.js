        /* =====================================================
           BULUT HESABI (Firebase: Google / e-posta girişi + Firestore)
           Ayar yoksa (FIREBASE_CONFIG = null) oyun tamamen cihazda çalışır.
           Firebase kütüphanesi YALNIZCA giriş yapılmak istendiğinde internetten yüklenir;
           oyunun kendisi çevrimdışı çalışır.
           ===================================================== */
        const FIREBASE_CONFIG = /*__FBCONFIG__*/null;
        const FB_VER = '10.12.2';
        const PRIVACY_URL = 'https://recipes-of-barista.netlify.app/privacy.html';
        function loadScript(src) {
            return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); });
        }
        /* iki veri kümesini birleştir: her kayıt yuvasında daha yeni olan kalır; rozet/albüm/istatistik birleşir */
        function mergeProfiles(a, b) {
            a = normProfile(a); b = normProfile(b);
            const newer = (a.updated || 0) >= (b.updated || 0) ? a : b, older = newer === a ? b : a;
            const m = normProfile(JSON.parse(JSON.stringify(newer)));
            Object.keys(older.badges).forEach(k => { m.badges[k] = m.badges[k] ? Math.min(m.badges[k], older.badges[k]) : older.badges[k]; });
            Object.keys(older.album).forEach(k => { m.album[k] = Math.max(m.album[k] || 0, older.album[k]); });
            Object.keys(older.stars).forEach(k => { m.stars[k] = Math.max(m.stars[k] || 0, older.stars[k]); });
            Object.keys(older.stats).forEach(k => { m.stats[k] = Math.max(m.stats[k] || 0, older.stats[k] || 0); });
            // v6: skor = Saga ilerlemesi; eski (v5) skorlar taşınmaz
            if (!newer.sagaV) { m.best = 0; m.bestName = ''; }
            if (older.sagaV && (older.best || 0) > (m.best || 0)) { m.best = older.best; m.bestName = older.bestName; }
            m.sagaV = a.sagaV || b.sagaV || 0;
            ['story', 'std', 'gambler'].forEach(k => { m.bestBy[k] = Math.max(m.bestBy[k] || 0, older.bestBy[k] || 0); });
            if ((older.daily.last || '') > (m.daily.last || '')) m.daily = older.daily;
            m.seenDede = a.seenDede || b.seenDede;
            return m;
        }
        function mergeSlots(local, remote, keepIdx) {
            const out = [];
            for (let i = 0; i < SLOT_COUNT; i++) {
                const l = local[i] || null, r = (remote || [])[i] || null;
                if (i === keepIdx) out.push(l);
                else if (!l) out.push(r);
                else if (!r) out.push(l);
                else out.push((r.updated || 0) > (l.updated || 0) ? r : l);
            }
            return out;
        }

        const Cloud = {
            user: null, busy: false, err: false, lastSync: 0, timer: null, loading: null, scoreDirty: false, pending: false,
            available() { return !!(FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey); },
            load() {
                if (this.loading) return this.loading;
                const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
                this.loading = loadScript(base + 'firebase-app-compat.js')
                    .then(() => Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]))
                    .then(() => {
                        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
                        this.auth = firebase.auth();
                        this.db = firebase.firestore();
                        this.auth.getRedirectResult().catch(e => this.fail(e));
                        return new Promise(res => {
                            let first = true;
                            this.auth.onAuthStateChanged(u => { this.onUser(u); if (first) { first = false; res(); } });
                        });
                    })
                    .catch(e => { this.loading = null; throw e; });
                return this.loading;
            },
            init() {
                if (!this.available()) return;
                // daha önce giriş yapıldıysa ve internet varsa sessizce bağlan
                if (Settings.cloud && navigator.onLine) this.load().catch(() => { this.err = true; renderProfileChip(); });
                window.addEventListener('online', () => { if (Settings.cloud && !this.auth) this.load().catch(() => {}); else if (this.pending) this.push(); });
            },
            ui(msg) { if ($('modal-profile').classList.contains('open')) renderProfile(msg); renderProfileChip(); },
            fail(e) {
                this.busy = false;
                const P = L().prof; let c = (e && e.code) || (e && e.message) || '?';
                if (/^load /.test(c) || /network|fetch/i.test(c)) c = 'auth/network-request-failed';
                this.ui(P.errs[c] || tf(P.errs.def, { c: escapeHtml(c) }));
            },
            google() {
                this.busy = true; this.ui();
                this.load().then(() => {
                    const p = new firebase.auth.GoogleAuthProvider();
                    return this.auth.signInWithPopup(p).catch(e => {
                        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/cancelled-popup-request')) return this.auth.signInWithRedirect(p);
                        throw e;
                    });
                }).catch(e => this.fail(e));
            },
            emailLogin(create) {
                const mail = ($('pf-mail').value || '').trim(), pass = $('pf-pass').value || '';
                this.busy = true; this.ui();
                this.load().then(() => create ? this.auth.createUserWithEmailAndPassword(mail, pass) : this.auth.signInWithEmailAndPassword(mail, pass)).catch(e => this.fail(e));
            },
            resetPass() {
                const mail = ($('pf-mail') && $('pf-mail').value || '').trim();
                if (!mail) { this.ui(L().prof.needMail); return; }
                this.load().then(() => this.auth.sendPasswordResetEmail(mail)).then(() => this.ui(L().prof.resetSent)).catch(e => this.fail(e));
            },
            logout() {
                if (!this.auth) return;
                this.push().catch(() => {}).then(() => this.auth.signOut());
            },
            onUser(u) {
                this.user = u || null;
                Settings.cloud = !!u; saveSettings();
                this.busy = false;
                if (u) this.pull(); else this.ui();
            },
            ref() { return this.db.collection('users').doc(this.user.uid); },
            async pull() {
                if (!this.user) return;
                this.busy = true; this.ui();
                try {
                    const snap = await this.ref().get();
                    let merged = false;
                    if (snap.exists) {
                        const d = JSON.parse(snap.data().data || '{}');
                        const keep = Game.save ? Game.slot : -1;
                        if (Game.save) persist();
                        const slots = mergeSlots(SLOTS, d.slots || [], keep);
                        for (let i = 0; i < SLOT_COUNT; i++) SLOTS[i] = slots[i];
                        writeSlots();
                        Profile = mergeProfiles(Profile, d.profile || {});
                        lsSet(PROF_KEY, Profile);
                        merged = true;
                    }
                    if (!Profile.nick && this.user.displayName) { Profile.nick = this.user.displayName.slice(0, 16); lsSet(PROF_KEY, Profile); }
                    this.err = false;
                    this.busy = false;
                    await this.push();
                    if (document.body.dataset.screen === 'screen-menu') renderMenu();
                    this.ui(merged ? L().prof.merged : '');
                } catch (e) { this.err = true; this.fail(e); }
            },
            dirty() {
                if (!this.user) return;
                clearTimeout(this.timer);
                this.timer = setTimeout(() => this.push().catch(() => {}), 5000);
            },
            async push() {
                if (!this.user || !this.db) return;
                if (!navigator.onLine) { this.pending = true; return; }
                this.pending = false;
                const data = JSON.stringify({ v: 5, slots: SLOTS, profile: Profile });
                try {
                    await this.ref().set({ data, updatedAt: Date.now() });
                    if (typeof sagaScoreUpdate === 'function') sagaScoreUpdate();
                    if ((Profile.best || 0) > 0 && Date.now() - (this.lastLb || 0) > 25000) {
                        this.lastLb = Date.now();
                        const avatar = await smallAvatar(Profile.avatar);
                        await this.db.collection('leaderboard').doc(this.user.uid).set({ nick: (Profile.nick || Profile.bestName || '?').slice(0, 16), avatar, best: Math.floor(Profile.best || 0), bestStory: 0, bestGambler: 0, spins: Profile.stats.spins || 0, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                        this.scoreDirty = false;
                    }
                    this.lastSync = Date.now(); this.err = false;
                } catch (e) { this.err = true; this.pending = true; }
                renderProfileChip();
            },
            syncNow() { this.pull(); },
            askDelete() {
                const P = L().prof;
                closeModal('modal-profile');
                confirmBox({ title: P.delT, text: P.delTxt, art: ['cozybear'], ok: P.delYes, onOk: () => this.deleteAccount() });
            },
            async deleteAccount() {
                if (!this.user) return;
                const P = L().prof, uid = this.user.uid;
                try {
                    clearTimeout(this.timer);
                    await this.db.collection('leaderboard').doc(uid).delete().catch(() => {});
                    await this.db.collection('users').doc(uid).delete();
                    await this.user.delete();
                    Settings.cloud = false; saveSettings();
                    showDialog('cozybear', CUR_LANG() === 'en' ? 'BlueBird' : 'MaviKuş', P.delDone);
                } catch (e) {
                    if (e && e.code === 'auth/requires-recent-login') showDialog('cozybear', CUR_LANG() === 'en' ? 'BlueBird' : 'MaviKuş', P.relogin);
                    else this.fail(e);
                }
                renderProfileChip();
            },
            async top(field) {
                await this.load();
                const q = await this.db.collection('leaderboard').orderBy(field || 'best', 'desc').limit(50).get();
                return q.docs.map(d => Object.assign({ uid: d.id }, d.data())).filter(r => (r[field || 'best'] || 0) > 0);
            }
        };

