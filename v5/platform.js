        /* =====================================================
           PLATFORM KATMANI (v7 "Filtre Kahve")
           Aynı oyun hem web'de (Netlify / oyun portalları) hem Google Play uygulamasında (Capacitor) çalışır.
           - Ads: ödüllü reklam. Uygulamada AdMob; web'de portal SDK'sı (Poki / CrazyGames) ya da kendi tanıtım arası.
           - Billing: gerçek parayla kozmetik / destekçi paketi. Uygulamada Google Play Billing (cordova-plugin-purchase);
             web'de satış yok (Play Store'a yönlendirilir). Çekirdek (oyun parası) ASLA satılmaz.
           - Share: davet kodu paylaşımı.
           ===================================================== */
        const APP_IDS = {
            pkg: 'com.limitededucation.recipesofbarista',
            play: 'https://play.google.com/store/apps/details?id=com.limitededucation.recipesofbarista',
            web: 'https://recipes-of-barista.netlify.app',
            // AdMob: hesap açılınca kendi kimliklerinle değiştir (bkz. PLAY_STORE_REHBERI.md). Boşken Google'ın resmi TEST reklamları gösterilir.
            admobRewarded: (window.ROB_CONFIG && window.ROB_CONFIG.admobRewarded) || '',   // Android: app_config.json → kurulum betiği doldurur
            admobTestRewarded: 'ca-app-pub-3940256099942544/5224354917',
            /* TEST REKLAMI: gerçek reklam kimliği girilene kadar reklam izleme yerlerinde test reklamı gösterilir.
               - Android: Google'ın resmi AdMob test reklamı (ödüllü video). Reklam yüklenemezse aşağıdaki test reklamı.
               - Web: 15 sn'lik oyun içi test reklamı (gerçek reklam değildir, para kazandırmaz).
               Kapatmak için: app_config.json → "testAds": false · Web'de dene/kapat: adrese ?testads=1 / ?testads=0 ekle. */
            testAds: (() => {
                try { const q = new URLSearchParams(location.search).get('testads'); if (q === '1' || q === '0') return q === '1'; } catch (e) {}
                const C = window.ROB_CONFIG;
                if (C && 'testAds' in C) return !!C.testAds;
                return !(C && C.admobRewarded);
            })(),
            testAdSeconds: 15
        };
        const Platform = {
            native() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); },
            plugin(name) { return this.native() && window.Capacitor.Plugins ? window.Capacitor.Plugins[name] : null; },
            name() { return this.native() ? 'android' : (window.PokiSDK ? 'poki' : (window.CrazyGames && window.CrazyGames.SDK) ? 'crazygames' : 'web'); }
        };

        /* ---------- DESTEKÇİ / SATIN ALINANLAR ---------- */
        function iapOwned(id) { return !!(Profile.iap && Profile.iap[id]); }
        function isSupporter() { return iapOwned('supporter_pack'); }

        /* ---------- ÖDÜLLÜ REKLAM ---------- */
        const Ads = {
            ready: false, consent: null,
            async init() {
                const A = Platform.plugin('AdMob');
                if (!A) return;
                try {
                    await A.initialize({ initializeForTesting: !APP_IDS.admobRewarded });
                    // AB/İngiltere: Google UMP izin formu (kişiselleştirilmiş reklam izni)
                    try {
                        const info = await A.requestConsentInfo();
                        let ci = info;
                        if (info && info.isConsentFormAvailable && info.status === 'REQUIRED') ci = await A.showConsentForm();
                        this.consent = ci || null;
                    } catch (e) {}
                    this.ready = true;
                } catch (e) { this.ready = false; }
            },
            /* GDPR: kullanıcı reklam iznini istediği zaman değiştirebilir (UMP gizlilik seçenekleri formu) */
            async privacyOptions() {
                const A = Platform.plugin('AdMob');
                if (!A) return false;
                try { if (A.showPrivacyOptionsForm) { await A.showPrivacyOptionsForm(); return true; } await A.showConsentForm(); return true; } catch (e) { return false; }
            },
            /* true: ödül kazanıldı · false: iptal / reklam yok */
            async rewarded() {
                if (isSupporter()) return true;   // destekçiler reklamsız ödül alır
                const A = Platform.plugin('AdMob');
                if (A) {
                    try {
                        if (!this.ready) await this.init();
                        if (this.consent && this.consent.canRequestAds === false) return houseBreak(true);   // izin yoksa reklam isteme
                        const test = APP_IDS.testAds || !APP_IDS.admobRewarded;
                        await A.prepareRewardVideoAd({ adId: test ? APP_IDS.admobTestRewarded : APP_IDS.admobRewarded, isTesting: test });
                        stopCasinoMusic(); stopBonusMusic();
                        const r = await A.showRewardVideoAd();
                        return !!r;
                    } catch (e) { return APP_IDS.testAds ? testAd() : houseBreak(true); }
                }
                if (window.PokiSDK && window.PokiSDK.rewardedBreak) { try { return !!(await window.PokiSDK.rewardedBreak()); } catch (e) { return false; } }
                if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ad) {
                    return new Promise(res => { try { window.CrazyGames.SDK.ad.requestAd('rewarded', { adFinished: () => res(true), adError: () => res(houseBreak(false)) }); } catch (e) { res(false); } });
                }
                return APP_IDS.testAds ? testAd() : houseBreak(false);
            }
        };
        /* Oyun içi TEST REKLAMI (ödüllü video taklidi): sayaç bitince ödül; erken kapatılırsa ödül yok (gerçek ödüllü reklam gibi). */
        function testAd() {
            return new Promise(res => {
                const X = PX(), T = APP_IDS.testAdSeconds, m = document.createElement('div');
                m.className = 'ta-wrap';
                m.innerHTML = `<div class="ta" role="dialog" aria-label="${X.taTag}">
                    <div class="ta-top"><span class="ta-tag">${X.taTag}</span><span class="ta-cd">${T}</span><button class="ta-x" aria-label="${X.taQuit}">✕</button></div>
                    <div class="ta-vid"><div class="ta-sun"></div><img class="ta-b1" src="${ASSETS.sym.barista}" alt=""><img class="ta-b2" src="${ASSETS.sym.goldenbean}" alt=""><img class="ta-b3" src="${ASSETS.sym.espresso}" alt="">
                      <div class="ta-cap"><b>${X.taAdT}</b><span>${X.taAdS}</span></div><div class="ta-wm">TEST AD</div></div>
                    <div class="ta-bar"><i></i></div>
                    <div class="ta-foot"><span class="ta-left">${tf(X.taLeft, { t: T })}</span><button class="btn btn-sm btn-green ta-go" disabled>${X.hbClaim}</button></div>
                    <p class="ta-note">${X.taNote}</p>
                    <div class="ta-ask" hidden><p>${X.taAsk}</p><button class="btn btn-sm btn-green ta-keep">${X.taKeep}</button> <button class="btn btn-sm btn-soft ta-quit">${X.taQuit}</button></div></div>`;
                document.body.appendChild(m);
                try { stopCasinoMusic(); stopBonusMusic(); } catch (e) {}
                const q = s => m.querySelector(s), bar = q('.ta-bar i'), cd = q('.ta-cd'), left = q('.ta-left'), go = q('.ta-go'), ask = q('.ta-ask');
                let t0 = performance.now(), paused = 0, pauseAt = 0, done = false, raf = 0;
                const finish = ok => { cancelAnimationFrame(raf); m.remove(); res(ok); };
                const loop = now => {
                    if (!pauseAt) {
                        const el = (now - t0 - paused) / 1000, r = Math.max(0, T - el);
                        bar.style.width = Math.min(100, el / T * 100) + '%';
                        cd.textContent = Math.ceil(r); left.textContent = tf(X.taLeft, { t: Math.ceil(r) });
                        if (r <= 0 && !done) { done = true; m.classList.add('done'); cd.textContent = '✓'; left.textContent = X.taDone; go.disabled = false; ask.hidden = true; playSynthNote(784, 0.2, 'sine', 0.06); setTimeout(() => playSynthNote(1047, 0.25, 'sine', 0.06), 120); }
                    }
                    if (!done) raf = requestAnimationFrame(loop);
                };
                raf = requestAnimationFrame(loop);
                go.onclick = () => finish(true);
                q('.ta-x').onclick = () => { if (done) return finish(true); if (!pauseAt) pauseAt = performance.now(); ask.hidden = false; m.classList.add('paused'); };
                q('.ta-keep').onclick = () => { paused += performance.now() - pauseAt; pauseAt = 0; ask.hidden = true; m.classList.remove('paused'); };
                q('.ta-quit').onclick = () => finish(false);
            });
        }
        /* Reklam ağı yoksa (web) ya da reklam bulunamadıysa: 5 sn'lik kendi tanıtım arası (Play Store uygulaması) */
        function houseBreak(fallback) {
            return new Promise(res => {
                const X = PX(), m = document.createElement('div');
                m.className = 'hb-wrap';
                m.innerHTML = `<div class="hb"><small>${X.hbTag}</small><img src="${ASSETS.sym.barista}" alt=""><b>${X.hbTitle}</b><p>${fallback ? X.hbNoAd : X.hbTxt}</p>
                    ${Platform.native() ? '' : `<a class="btn btn-sm btn-green" href="${APP_IDS.play}" target="_blank" rel="noopener">${X.hbGet}</a>`}
                    <button class="btn btn-block hb-go" disabled>5</button></div>`;
                document.body.appendChild(m);
                const go = m.querySelector('.hb-go'); let t = 5;
                const iv = setInterval(() => { t--; if (t > 0) go.textContent = t; else { clearInterval(iv); go.disabled = false; go.textContent = X.hbClaim; } }, 1000);
                go.onclick = () => { m.remove(); res(true); };
            });
        }

        /* ---------- GERÇEK PARAYLA SATIŞ (yalnızca kozmetik + destekçi paketi) ---------- */
        /* Fiyatlar Play Console'da ayarlanır (Türkiye): destekçi 49,99 TL · dönem/özel set 29,99 TL · kol koleksiyonu 9,99 TL.
           Buradaki "tl" yalnızca web'de / mağaza bağlanmadan önce gösterilen bilgi fiyatıdır; uygulamada Google'ın yerel fiyatı görünür. */
        const IAP_PRODUCTS = [
            { id: 'supporter_pack', kind: 'supporter', tl: '49,99 TL' },
            { id: 'set_zaman', kind: 'set', looks: [['frame', 'zaman'], ['cap', 'pilot'], ['cup', 'kumsaati']], tl: '29,99 TL' },
            { id: 'cups_gold', kind: 'set', looks: ['egypt', 'greece', 'viking', 'rome', 'ottoman', 'victorian', 'france', 'italy', 'jazz'].map(k => ['cup', 'h_' + k]), tl: '29,99 TL' },
            { id: 'levers_all', kind: 'set', looks: ['kirmizi', 'portafiltre', 'cezve', 'cekirdek', 'altin'].map(k => ['lever', k]), tl: '9,99 TL' }
        ].concat(['egypt', 'greece', 'viking', 'rome', 'ottoman', 'victorian', 'france', 'italy', 'jazz'].map(k => ({ id: 'set_' + k, kind: 'set', era: k, looks: null, tl: '29,99 TL' })));
        function iapLooks(p) {
            if (p.kind === 'supporter') return [['frame', 'destekci'], ['cap', 'destekci'], ['cup', 'destekci']];
            if (p.era) return ['frame', 'cap', 'cup'].map(kind => [kind, ERA_LOOKS[p.era][kind]]);
            return p.looks;
        }
        function grantIap(id, silent) {
            const p = IAP_PRODUCTS.find(x => x.id === id); if (!p) return;
            const first = !iapOwned(id);
            Profile.iap = Object.assign(Profile.iap || {}, { [id]: Profile.iap && Profile.iap[id] || Date.now() });
            Profile.cosmOwned = Object.assign(Profile.cosmOwned || {});
            iapLooks(p).forEach(([k, lid]) => { if (!Profile.cosmOwned[k + ':' + lid]) Profile.cosmOwned[k + ':' + lid] = Date.now(); });
            saveProfile();
            if (first && !silent) {
                const L0 = iapLooks(p)[0];
                if (L0 && L0[0] !== 'lever') equipCosm(L0[0], L0[1]);
                if (p.kind === 'supporter') { Profile.cosm = Object.assign({}, Profile.cosm || {}, { frame: 'destekci', cap: 'destekci', cup: 'destekci' }); saveProfile(); applyCosm(); }
                [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => setTimeout(() => playSynthNote(f, 0.22, 'sine', 0.06), i * 90));
                achToast('dede', PX().thanks, iapName(p));
                if (typeof celebrate === 'function' && document.body.dataset.mode === 'game') celebrate(Math.max(gameState.bet, 1) * 20);
            }
            if ($('modal-store') && $('modal-store').classList.contains('open') && typeof buildStore === 'function') buildStore();
        }
        function iapName(p) { const X = PX(); return p.kind === 'supporter' ? X.supName : p.era ? tf(X.eraSet, { era: eraName(p.era) }) : X.names[p.id]; }
        const Billing = {
            ready: false, prices: {}, testMode: false,
            available() { return this.ready || this.testMode; },
            init() {
                if (!Platform.native()) return;
                const boot = () => {
                    const C = window.CdvPurchase; if (!C || !C.store) return;
                    const { store, ProductType, Platform: P } = C;
                    store.register(IAP_PRODUCTS.map(p => ({ id: p.id, type: ProductType.NON_CONSUMABLE, platform: P.GOOGLE_PLAY })));
                    store.when()
                        .approved(t => t.verify())
                        .verified(r => r.finish())
                        .finished(t => (t.products || []).forEach(pp => grantIap(pp.id)))
                        .productUpdated(pr => { if (pr && pr.pricing) this.prices[pr.id] = pr.pricing.price; if (pr && pr.owned) grantIap(pr.id, true); });
                    store.initialize([P.GOOGLE_PLAY]).then(() => { this.ready = true; IAP_PRODUCTS.forEach(p => { const pr = store.get(p.id, P.GOOGLE_PLAY); if (pr && pr.owned) grantIap(p.id, true); }); });
                };
                if (window.CdvPurchase) boot(); else document.addEventListener('deviceready', boot, { once: true });
            },
            price(id) { const p = IAP_PRODUCTS.find(x => x.id === id); return this.prices[id] || (p && p.tl) || ''; },
            buy(id) {
                if (iapOwned(id)) return;
                if (this.testMode && !Platform.native()) { grantIap(id); return; }   // yalnızca test kodu ile (geliştirici denemesi)
                const C = window.CdvPurchase;
                if (!C || !this.ready) { showDialog('dede', L().dede.name, PX().noStore); return; }
                const pr = C.store.get(id, C.Platform.GOOGLE_PLAY), offer = pr && pr.getOffer();
                if (!offer) { showDialog('dede', L().dede.name, PX().noStore); return; }
                offer.order().then(err => { if (err && err.code !== C.ErrorCode.PAYMENT_CANCELLED) showDialog('dede', L().dede.name, PX().failed); });
            },
            restore() {
                const C = window.CdvPurchase;
                if (!C || !this.ready) { showDialog('dede', L().dede.name, PX().noStore); return; }
                C.store.restorePurchases().then(() => { setMessage(PX().restored); if (typeof buildStore === 'function') buildStore(); });
            }
        };

        /* ---------- PAYLAŞ (davet kodu) ---------- */
        async function shareText(title, text, url) {
            const S = Platform.plugin('Share');
            try {
                if (S) { await S.share({ title, text, url, dialogTitle: title }); return true; }
                if (navigator.share) { await navigator.share({ title, text, url }); return true; }
            } catch (e) { return false; }
            try { await navigator.clipboard.writeText(text + ' ' + url); setMessage(PX().copied); return true; } catch (e) { return false; }
        }

        /* Android geri tuşu: açık pencereyi kapat, yoksa ana menüye dön, ana menüde uygulamadan çık */
        function initNativeShell() {
            const App = Platform.plugin('App');
            if (App && App.addListener) App.addListener('backButton', () => {
                if (typeof Cinema !== 'undefined' && Cinema.isOpen()) { Cinema.finish(); return; }
                const open = [...document.querySelectorAll('.modal.open')];
                if (open.length) { closeModal(open[open.length - 1].id); return; }
                if (document.body.dataset.mode === 'game' || document.body.dataset.screen === 'screen-map') { returnToMenu(); return; }
                App.exitApp();
            });
            if (App && App.addListener) App.addListener('pause', () => { try { persist(); } catch (e) {} });
            document.body.classList.toggle('native', Platform.native());
        }
