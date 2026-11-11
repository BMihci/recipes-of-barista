        /* =====================================================
           HATIRLATMALAR (bildirim)
           · Uygulama açık/arka plandayken: zamanlayıcı ile
           · Yüklü uygulamada (Android): service worker "periodic sync" ile tarayıcı izin verdikçe kontrol
           · Uygulama tamamen kapalıyken garanti bildirim için sunucu gerekir (server/ klasöründeki Cloud Function)
           ===================================================== */
        const Notify = {
            timers: [],
            supported() { return 'Notification' in window && 'serviceWorker' in navigator; },
            on() { return this.supported() && !!Settings.notif && Notification.permission === 'granted'; },
            note() {
                const S = L().set;
                if (!this.supported()) return S.notifNo;
                if (Notification.permission === 'denied') return S.notifDenied;
                return '';
            },
            async toggle() {
                if (!this.supported()) return;
                if (this.on()) { Settings.notif = false; saveSettings(); this.clear(); refreshSettingsUI(); return; }
                let p = Notification.permission;
                if (p !== 'granted') { try { p = await Notification.requestPermission(); } catch (e) { p = 'denied'; } }
                Settings.notif = p === 'granted'; Settings.notifAsked = true; saveSettings();
                if (Settings.notif) { this.registerSync(); this.plan(); }
                refreshSettingsUI();
            },
            /* uygun anda bir kez sor */
            offer() {
                if (!this.supported() || Settings.notifAsked || Notification.permission !== 'default' || anyModalOpen()) return;
                Settings.notifAsked = true; saveSettings();
                const N = L().notif;
                confirmBox({ title: N.askT, text: N.ask, art: ['cozybear', 'goldenbean'], ok: N.yes, good: true, onOk: () => this.toggle() });
                $('cf-cancel').textContent = N.no;
            },
            async registerSync() {
                try {
                    const reg = await navigator.serviceWorker.ready;
                    if (reg.periodicSync) {
                        const st = await navigator.permissions.query({ name: 'periodic-background-sync' }).catch(() => null);
                        if (!st || st.state === 'granted') await reg.periodicSync.register('rob-reminders', { minInterval: 2 * 3600 * 1000 });
                    }
                } catch (e) {}
            },
            /* yaklaşan hatırlatmaları hesapla ve sakla */
            due() {
                const sv = Game.save || (Settings.last !== null && SLOTS[Settings.last]) || null;
                const out = [];
                if (sv) out.push({ id: 'gift', at: (sv.lastGift || sv.created || Date.now()) + 6 * 3600 * 1000 });
                const d = new Date(); d.setHours(24, 0, 30, 0);
                out.push({ id: 'daily', at: Profile.daily.last === dayStr(0) ? d.getTime() + 10 * 3600 * 1000 : Date.now() + 3 * 3600 * 1000 });   // ertesi gün 10:00
                return out;
            },
            clear() { this.timers.forEach(clearTimeout); this.timers = []; },
            async plan() {
                if (!this.on()) return;
                this.clear();
                const N = L().notif, v = fmt(typeof giftAmt === 'function' ? giftAmt() : 1000);
                const list = this.due().map(r => ({ id: r.id, at: r.at, title: N[r.id][0], body: tf(N[r.id][1], { v }) }));
                try { const c = await caches.open('rob-meta'); await c.put('/__reminders', new Response(JSON.stringify({ list, icon: 'icon-192.png' }))); } catch (e) {}
                list.forEach(r => {
                    const ms = r.at - Date.now();
                    if (ms > 0 && ms < 2147483000) this.timers.push(setTimeout(() => this.show(r), ms));
                });
            },
            async show(r) {
                if (!this.on() || !document.hidden) return;   // oyun açıkken bildirim gösterme
                try { const reg = await navigator.serviceWorker.ready; reg.showNotification(r.title, { body: r.body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'rob-' + r.id }); } catch (e) {}
            }
        };
        document.addEventListener('visibilitychange', () => { if (document.hidden) Notify.plan(); });

        /* =====================================================
           SÜRÜM ADI + YENİLİKLER
           Sürüm adları alfabetik kahve isimleriyle verilir (A: Americano, B: Balkabağı Latte, C: Cortado ...)
           ===================================================== */
        const APP_VERSION = /*__VERSION__*/{ num: '0', name: { tr: '', en: '' }, notes: { tr: [], en: [] } };
        function showNews(force) {
            if (!force && Settings.seenVer === APP_VERSION.num) return;
            const first = !Settings.seenVer && !SLOTS.some(Boolean);
            Settings.seenVer = APP_VERSION.num; saveSettings();
            if (first && !force) return;               // ilk kurulumda gösterme
            const lang = CUR_LANG(), notes = APP_VERSION.notes[lang] || APP_VERSION.notes.en;
            $('nw-title').textContent = UX('newsT') + ' · v' + APP_VERSION.num;
            $('nw-name').textContent = '“' + (APP_VERSION.name[lang] || APP_VERSION.name.en) + '”';
            $('nw-list').innerHTML = notes.map(n => `<li>${n}</li>`).join('');
            $('nw-ok').textContent = UX('letsPlay');
            openModal('modal-news');
        }
