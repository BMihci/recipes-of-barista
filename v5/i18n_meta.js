        /* =====================================================
           DİL: Profil · Bulut · Kupa Odası · Ayarlar · Turbo · Kahve Dede
           ===================================================== */
        (function () {
            const TR = {
                diff: { title: 'Oyun Modunu Seç', sub: 'Bu kayıt boyunca değişmez. Skorlar her mod için ayrı tutulur.',
                    story: ['Hikâye Modu', 'Kolay', 'Kazançlar daha cömert, şans desteği güçlü, iflasta 10.000 çekirdek yardım. Hikâyenin tadını çıkar.'],
                    std: ['Standart Mod', 'Orta · önerilen', 'Oyunun asıl dengesi.'],
                    gambler: ['Kumarbaz Modu', 'Zor', 'Kazançlar düşük, şans desteği yok, ara durak ödülleri yarıda; ama Kahve Dede neredeyse iki kat sık çarpan atar. Yüksek risk, yüksek heyecan!'],
                    note: 'Hikâye Modu yaklaşık %40 daha kısa, Kumarbaz Modu yaklaşık %40 daha uzun sürer.' },
                dede: { name: 'Kahve Dede', lines: ['Al evladım, ×{v}!', 'Dede’den sana ×{v}!', 'Hadi bakalım torunum: ×{v}!', 'Bu demlik hakkını veriyor: ×{v}!', 'Cezvem taştı: ×{v}!'], big: 'DEDE ÇARPAN VERDİ! ×{v}', first: 'Ben Kahve Dede! Bearista’nın dedesiyim. Çatıdaki pencereden makaraları izliyorum; beğendiğim spinlere cezvemden çarpan fırlatırım. “Dede çarpan verdi!” diye bağırmayı unutma!', gift: 'Dede’nin hediyesi: bu spine ×5 çarpan!' },
                turbo: { on: '⚡ TURBO açık: makaralar hızlı durur, kısa kazanç gösterisi.', off: 'Turbo kapalı.', label: 'TURBO' },
                menu2: { hub: '🏅 KUPA ODASI', set: '⚙ AYARLAR', guest: 'Misafir', tapProfile: 'Profilini düzenle', cloudOn: '☁ Bulut: açık', cloudOff: '📱 Bu cihaza kayıtlı', cloudSync: '☁ Eşitleniyor…', cloudErr: '☁ Bağlantı yok — kayıt bu cihazda' },
                prof: {
                    title: 'Oyuncu Profili', nick: 'Oyuncu adı (nick)', nickPh: 'Nick yaz…', avatar: 'Profil resmi', upload: '📷 FOTOĞRAF YÜKLE', save: 'KAYDET', close: 'KAPAT',
                    acc: 'Hesap ve bulut kaydı', accInfo: 'Giriş yaparsan kayıtların, rozetlerin ve albümün buluta yedeklenir; hangi cihazda giriş yaparsan oradan devam edersin.',
                    google: 'Google ile giriş yap', email: 'E-posta', pass: 'Şifre (en az 6 karakter)', login: 'GİRİŞ YAP', register: 'HESAP AÇ', forgot: 'Şifremi unuttum',
                    out: 'ÇIKIŞ YAP', del: 'Hesabımı sil', delT: 'HESAP SİLİNSİN Mİ?', delTxt: 'Bulut hesabın, buluttaki kayıtların ve skor tablosundaki satırın <b>kalıcı olarak</b> silinecek. Bu cihazdaki kayıtlar kalır.', delYes: 'EVET, HESABI SİL', delDone: 'Hesabın silindi.', relogin: 'Güvenlik için önce çıkış yapıp yeniden giriş yapman, sonra tekrar silmeyi denemen gerekiyor.', privacy: 'Gizlilik politikası', syncNow: '☁ ŞİMDİ EŞİTLE', signedAs: 'Giriş yapıldı: <b>{e}</b>', lastSync: 'Son eşitleme: {t}', never: 'henüz yok',
                    nocfg: 'Bulut hesabı bu sürümde henüz bağlanmadı (oyun sahibi Firebase ayarlarını eklemeli). Şimdilik kayıt kodu ile yedekleyebilirsin.',
                    offline: 'İnternet yok. Oyun çevrimdışı çalışmaya devam ediyor; bağlantı gelince giriş yapabilirsin.',
                    loading: 'Bağlanıyor…', resetSent: 'Şifre sıfırlama e-postası gönderildi.', needMail: 'Önce e-posta adresini yaz.',
                    merged: 'Bulut kaydı ile bu cihazdaki kayıtlar birleştirildi ✓', saved: 'Profil kaydedildi ✓', photoErr: 'Fotoğraf okunamadı.',
                    errs: { 'auth/invalid-email': 'E-posta adresi geçersiz.', 'auth/user-not-found': 'Bu e-postayla hesap yok. “Hesap Aç”ı dene.', 'auth/wrong-password': 'Şifre yanlış.', 'auth/invalid-credential': 'E-posta ya da şifre yanlış.', 'auth/email-already-in-use': 'Bu e-postayla zaten hesap var. “Giriş Yap”ı dene.', 'auth/weak-password': 'Şifre en az 6 karakter olmalı.', 'auth/popup-closed-by-user': 'Giriş penceresi kapatıldı.', 'auth/network-request-failed': 'İnternet bağlantısı yok.', 'auth/unauthorized-domain': 'Google girişi için oyunun bir web adresinde açılması gerekir (dosyadan açınca çalışmaz).', 'auth/operation-not-supported-in-this-environment': 'Google girişi için oyunun bir web adresinde açılması gerekir (dosyadan açınca çalışmaz).', def: 'Bir sorun oldu: {c}' }
                },
                bak: {
                    title: 'Kayıt Yedeği', info: 'Tüm kayıtların, profilin, rozetlerin ve albümün tek bir koda dönüşür. Kodu sakla; başka cihazda “Kodu Yükle” ile aynen devam edersin.',
                    copy: '📋 KODU KOPYALA', file: '💾 DOSYA OLARAK İNDİR', load: '📥 KODU YÜKLE', paste: 'Yedek kodunu buraya yapıştır…', copied: 'Kod panoya kopyalandı ✓',
                    bad: 'Kod geçersiz ya da eksik kopyalanmış.', okT: 'YEDEK YÜKLENSİN Mİ?', okTxt: 'Bu cihazdaki kayıtların yerine yedekteki <b>{n}</b> kayıt ve profil gelecek.', yes: 'EVET, YÜKLE', done: 'Yedek yüklendi ✓'
                },
                hub: {
                    title: '🏅 Kupa Odası', tabs: { daily: '🎁 Günlük', badges: '🏅 Rozetler', album: '📔 Albüm', looks: '🎨 Görünüm', comics: '📚 Çizgi Roman', quests: '📋 Görevler', top: '🏆 Skorlar' },
                    needSave: 'Ödülleri almak için önce bir kayıt yükle.'
                },
                daily: {
                    title: 'Günlük Giriş Ödülü', day: '{n}. GÜN', claim: 'ÖDÜLÜ AL', claimed: 'Bugünün ödülü alındı ✓ Yarın tekrar gel!', streak: 'Giriş serisi: <b>{n} gün</b>',
                    info: 'Her gün oyuna gir, ödül büyüsün! Bir gün kaçırırsan seri 1. günden başlar. 7. gün: büyük ödül + Kahve Dede’nin ×5 çarpan hediyesi.',
                    got: '🎁 Günlük ödül: +{v} çekirdek!', got7: '🎁 7. GÜN! +{v} çekirdek + sonraki spinde Dede’den ×5!', later: 'Sonra'
                },
                badges: {
                    got: '🏅 ROZET: {n}', reward: '+{v} çekirdek', locked: 'Kilitli', count: '{a}/{b} rozet', when: '{d} tarihinde kazanıldı',
                    list: {
                        first_win: ['İlk Demleme', 'İlk kazancını al.'], spins100: ['Isınma Turu', '100 spin at.'], spins1000: ['Makara Ustası', '1.000 spin at.'], spins5000: ['Durmak Yok', '5.000 spin at.'],
                        fs1: ['Not Defteri Açıldı', 'Free spin bonusunu tetikle.'], fs25: ['Defter Kurdu', '25 kez free spin bonusu tetikle.'],
                        big: ['Büyük Kazanç', 'Bahsinin 15 katını tek seferde kazan.'], mega: ['Mega Kazanç', 'Bahsinin 40 katını tek seferde kazan.'], epic: ['Epik Kazanç', 'Bahsinin 100 katını tek seferde kazan.'],
                        dede1: ['Dede Çarpan Verdi', 'Kahve Dede’den ilk çarpanını al.'], dede25: ['Dedenin Gözdesi', '×25 veya üstü çarpanla kazan.'], dede100: ['Dede Çıldırdı', '100 çarpan çekirdeği topla.'],
                        zafer: ['Kahve Zaferi', 'Matcha Savaşı’nda ilk zaferini kazan.'], rain: ['Pasta Yağmuru', 'Fırını doldurup Pasta Yağmuru başlat.'], harvest: ['Bereketli Hasat', 'Hasat ödemesi kazan.'], loy: ['Sadık Müşteri', 'Sadakat kartını doldur.'],
                        st2: ['2. Şube', 'Matcha Caddesi’ni satın al.'], st3: ['3. Şube', 'Pastane Meydanı’nı satın al.'], st4: ['4. Şube', 'Hasat Tepesi’ni satın al.'], st5: ['Kale Kapısında', 'Şurup Kalesi’ne ulaş.'], hero: ['Kasabanın Kahramanı', 'SyruppoLab’ı satın alıp oyunu bitir.'],
                        reel6: ['Altıncı Makara', '6. makarayı aç.'], fullpower: ['Tam Donanım', 'Atölyedeki tüm yükseltmeleri sonuna kadar al.'],
                        rich1m: ['Milyoner Barista', 'Kasanda 1.000.000 çekirdek gör.'], rich100m: ['Kahve İmparatoru', 'Kasanda 100.000.000 çekirdek gör.'],
                        daily7: ['Haftalık Müdavim', '7 gün üst üste giriş yap.'], album1: ['Koleksiyoncu', 'Albümdeki tüm kartları aç.'], album3: ['Efsane Koleksiyoncu', 'Albümdeki tüm kartları 3 yıldıza çıkar.'],
                        turbo: ['Hız Tutkunu', 'Turbo ile 500 spin at.'], quest10: ['Görev Adamı', '10 günlük görev tamamla.']
                    }
                },
                album: {
                    title: 'Koleksiyon Albümü', info: 'Semboller kazandıran kombinasyonlarda yer aldıkça kartları açılır ve yıldız kazanır. Her yıldız kasana ödül verir!',
                    count: '{a}/{b} kart · {s} yıldız', lockedName: '???', prog: '{a}/{b}', max: 'TAM ★★★', starGot: '📔 ALBÜM: {n} {s} +{v} çekirdek',
                    bios: {
                        book: 'Bearista’nın büyükannesinden kalma reçete kitabı. Sayfaları açıldığında free spin sihri başlar; free spinde her makarayı tek başına kaplayabilir.',
                        barista: 'Hikâyemizin kahramanı. Sabah altıda kalkar, değirmeni ayarlar, ilk kahveyi daima MaviKuş için demler.',
                        girlfriend: 'Mavi bereli, kalbi sıcak, kahvesi sütlü. Bearista’nın en büyük destekçisi ve kasabanın en tatlı gülümsemesi.',
                        baking_bear: 'Pastane Meydanı’nın unlu yüzü. Kruvasan hamurunu 27 kat açar, kekleri asla yakmaz (neredeyse).',
                        portafilter: 'Espresso makinesinin kalbi. Doğru tamper basıncını bilir ve bunu herkese anlatmaya bayılır.',
                        v60: 'Sabırlı ve zarif. 3 dakikalık demlemeyi bir meditasyon gibi yaşar.',
                        espresso: 'Küçük ama güçlü. Kasabada sabahları uyanmanın resmî yolu.',
                        aeropress: 'Yolculukların vazgeçilmezi. Ters de çalışır, düz de; her hâliyle mutlu.',
                        golden_bean: 'Efsaneye göre Hasat Tepesi’nde her yüz yılda bir yetişir. Şimdilik kasandaki her şeyin para birimi.',
                        croissant: 'Kahvenin en yakın dostu. Tereyağlı, çıtır ve her zaman yanında bir fincan bekler.',
                        pitcher: 'Süt köpürtme ustası. 1, 3 ve 5. makarada joker olur; üçü bir araya gelince Latte Art yapar.',
                        matcha: 'SyruppoLab’ın yeşil istilası! Ama baristalarımız her matchayı gerçek kahveye çevirir.',
                        cupcake: 'Fırından yeni çıkmış. Fırın dolunca gökten yağar ve joker olur.',
                        coffeebag: 'Hasat Tepesi’nin bereketi. Üç çuval bir araya gelince hasat ödemesi verir.',
                        stamp: 'Sadık müşterilerin işareti. On damga bir bedava içecek demek.',
                        dede: 'Bearista’nın dedesi, kasabanın ilk kavurmacısı. Çatıdaki penceresinden izler, beğendiği spinlere cezvesinden çarpan fırlatır.'
                    }
                },
                quests: {
                    title: 'Günlük Görevler', locked: 'Günlük görevler zaman makinesine binince (6. bölüm) açılır. Sonra her gün 3 yeni görev ve sandık seni bekler!',
                    info: 'Her gün 3 görev. Hepsini bitirince Usta Sandığı açılır. Görevler gece yarısı yenilenir.', claim: 'AL', done: 'ALINDI ✓', chest: '🎁 USTA SANDIĞI', chestTxt: '3 görevi de bitir: +{v}', chestGot: 'Sandık açıldı ✓',
                    got: '📋 Görev tamamlandı: +{v} çekirdek!', btn: '📋 GÖREVLER {a}/{b}',
                    list: { spins: '{n} spin at', winx: 'Tek spinde bahsinin {n} katını kazan', fs: 'Free spin bonusunu {n} kez tetikle', orbs: 'Kahve Dede’den {n} çarpan al', loy: 'Sadakat kartını {n} kez doldur', winsum: 'Toplamda bahsinin {n} katı kazan', big: '{n} kez Büyük Kazanç yap (×15+)' }
                },
                lb: { title: 'Zaman Yolcuları Sıralaması', info: 'Sıralama, Zaman Yolculuğu Sagası’nda ulaştığın bölüme göre yapılır; eşitlikte Zaman Hazinen (bölüm geçerken taşan çekirdekler) belirler. 100. bölümü bitirince Usta Kafesi’ndeki rekorun da hazineye eklenir.', me: 'Senin ilerlemen', none: 'Henüz skor yok. Zamanda yolculuğa çık!', local: 'Bu cihazdaki kayıtlar', world: 'Dünya sıralaması', login: 'Dünya sıralamasına katılmak için profilinden giriş yap.', loading: 'Yükleniyor…', err: 'Sıralama yüklenemedi (internet yok olabilir).', rank: 'Sıran: #{n}' },
                usta: { place: 'Usta Kafesi', lockTxt: '100. bölümü bitirince açılır. Burada sonsuz oynayıp rekor kırarsın.', title: '🏆 USTA MODU', rec: 'Rekor: {v}', newRec: '🏆 YENİ REKOR: {v}!' },
                set: {
                    title: '⚙ Ayarlar', lang: 'Dil', music: 'Müzik sesi', sfx: 'Efekt sesi', mute: 'Tüm sesler', turbo: 'Turbo spin (varsayılan)', vibe: 'Titreşim', fx: 'Hafif efekt modu (zayıf telefonlar için)', fxAuto: 'Telefonun biraz zorlandı, hafif efekt moduna geçtim (Ayarlar’dan kapatabilirsin) ☕',
                    on: 'AÇIK', off: 'KAPALI', account: '👤 Profil ve hesap', backup: '💾 Kayıt yedeği (kod)', tut: '❔ Rehberi tekrar göster', reset: '🗑 Tüm verileri sil', resetT: 'HER ŞEY SİLİNSİN Mİ?', resetTxt: 'Bu cihazdaki <b>tüm kayıtlar, profil, rozetler ve albüm</b> silinecek. Bulut hesabındaki kayıt silinmez.', resetYes: 'EVET, SİL',
                    install: '📲 Ana ekrana ekle', installed: 'Uygulama olarak yüklendi ✓', offline: '✈ Çevrimdışı çalışır', ver: 'Sürüm', close: 'KAPAT'
                },
                pwaInstall: 'Ana ekrana ekle'
            };
            const EN = {
                diff: { title: 'Choose a Game Mode', sub: 'It stays the same for this save. Scores are kept separately for each mode.',
                    story: ['Story Mode', 'Easy', 'More generous wins, strong luck boost, 10,000 beans of help when you go broke. Enjoy the story.'],
                    std: ['Standard Mode', 'Medium · recommended', 'The game’s main balance.'],
                    gambler: ['Gambler Mode', 'Hard', 'Lower wins, no luck boost, half checkpoint rewards; but Grandpa Brew tosses multipliers almost twice as often. High risk, high thrill!'],
                    note: 'Story Mode is about 40% shorter, Gambler Mode about 40% longer.' },
                dede: { name: 'Grandpa Brew', lines: ['Here you go, kiddo: ×{v}!', 'From Grandpa with love: ×{v}!', 'Come on, grandchild: ×{v}!', 'This brew deserves it: ×{v}!', 'My coffee pot overflowed: ×{v}!'], big: 'GRANDPA GAVE A MULTIPLIER! ×{v}', first: 'I’m Grandpa Brew, Bearista’s grandfather! I watch the reels from the rooftop window and toss multipliers from my coffee pot onto spins I like.', gift: 'Grandpa’s gift: ×5 on this spin!' },
                turbo: { on: '⚡ TURBO on: reels stop fast, short win show.', off: 'Turbo off.', label: 'TURBO' },
                menu2: { hub: '🏅 TROPHY ROOM', set: '⚙ SETTINGS', guest: 'Guest', tapProfile: 'Edit your profile', cloudOn: '☁ Cloud: on', cloudOff: '📱 Saved on this device', cloudSync: '☁ Syncing…', cloudErr: '☁ Offline — saved on this device' },
                prof: {
                    title: 'Player Profile', nick: 'Nickname', nickPh: 'Type a nick…', avatar: 'Profile picture', upload: '📷 UPLOAD PHOTO', save: 'SAVE', close: 'CLOSE',
                    acc: 'Account & cloud save', accInfo: 'Sign in to back up your saves, badges and album to the cloud and continue on any device you sign in on.',
                    google: 'Sign in with Google', email: 'E-mail', pass: 'Password (6+ characters)', login: 'SIGN IN', register: 'CREATE ACCOUNT', forgot: 'Forgot password',
                    out: 'SIGN OUT', del: 'Delete my account', delT: 'DELETE ACCOUNT?', delTxt: 'Your cloud account, cloud saves and leaderboard entry will be deleted <b>permanently</b>. Saves on this device stay.', delYes: 'YES, DELETE ACCOUNT', delDone: 'Your account was deleted.', relogin: 'For security, sign out and sign in again, then try deleting once more.', privacy: 'Privacy policy', syncNow: '☁ SYNC NOW', signedAs: 'Signed in: <b>{e}</b>', lastSync: 'Last sync: {t}', never: 'not yet',
                    nocfg: 'Cloud accounts aren’t connected in this build yet (the game owner must add the Firebase settings). For now, back up with a save code.',
                    offline: 'No internet. The game keeps working offline; sign in when you’re back online.',
                    loading: 'Connecting…', resetSent: 'Password reset e-mail sent.', needMail: 'Type your e-mail first.',
                    merged: 'Cloud save and this device’s saves were merged ✓', saved: 'Profile saved ✓', photoErr: 'Couldn’t read the photo.',
                    errs: { 'auth/invalid-email': 'Invalid e-mail address.', 'auth/user-not-found': 'No account with this e-mail. Try “Create account”.', 'auth/wrong-password': 'Wrong password.', 'auth/invalid-credential': 'Wrong e-mail or password.', 'auth/email-already-in-use': 'An account already exists. Try “Sign in”.', 'auth/weak-password': 'Password must be at least 6 characters.', 'auth/popup-closed-by-user': 'Sign-in window was closed.', 'auth/network-request-failed': 'No internet connection.', 'auth/unauthorized-domain': 'Google sign-in needs the game opened from a web address (not from a file).', 'auth/operation-not-supported-in-this-environment': 'Google sign-in needs the game opened from a web address (not from a file).', def: 'Something went wrong: {c}' }
                },
                bak: {
                    title: 'Save Backup', info: 'All your saves, profile, badges and album become a single code. Keep it; on another device use “Load code” to continue exactly where you were.',
                    copy: '📋 COPY CODE', file: '💾 DOWNLOAD AS FILE', load: '📥 LOAD CODE', paste: 'Paste your backup code here…', copied: 'Code copied ✓',
                    bad: 'The code is invalid or incomplete.', okT: 'LOAD BACKUP?', okTxt: 'The <b>{n}</b> saves and profile in the backup will replace this device’s data.', yes: 'YES, LOAD', done: 'Backup loaded ✓'
                },
                hub: {
                    title: '🏅 Trophy Room', tabs: { daily: '🎁 Daily', badges: '🏅 Badges', album: '📔 Album', looks: '🎨 Looks', comics: '📚 Comics', quests: '📋 Quests', top: '🏆 Scores' },
                    needSave: 'Load a save first to collect rewards.'
                },
                daily: {
                    title: 'Daily Login Reward', day: 'DAY {n}', claim: 'CLAIM', claimed: 'Today’s reward claimed ✓ Come back tomorrow!', streak: 'Login streak: <b>{n} days</b>',
                    info: 'Log in every day and the reward grows! Miss a day and the streak restarts at day 1. Day 7: big reward + Grandpa Brew’s ×5 multiplier gift.',
                    got: '🎁 Daily reward: +{v} beans!', got7: '🎁 DAY 7! +{v} beans + ×5 from Grandpa on your next spin!', later: 'Later'
                },
                badges: {
                    got: '🏅 BADGE: {n}', reward: '+{v} beans', locked: 'Locked', count: '{a}/{b} badges', when: 'Earned on {d}',
                    list: {
                        first_win: ['First Brew', 'Get your first win.'], spins100: ['Warm-up', 'Spin 100 times.'], spins1000: ['Reel Master', 'Spin 1,000 times.'], spins5000: ['Unstoppable', 'Spin 5,000 times.'],
                        fs1: ['Notebook Opened', 'Trigger the free spin bonus.'], fs25: ['Bookworm', 'Trigger free spins 25 times.'],
                        big: ['Big Win', 'Win 15× your bet at once.'], mega: ['Mega Win', 'Win 40× your bet at once.'], epic: ['Epic Win', 'Win 100× your bet at once.'],
                        dede1: ['Grandpa’s Gift', 'Get your first multiplier from Grandpa Brew.'], dede25: ['Grandpa’s Favourite', 'Win with a ×25 or bigger multiplier.'], dede100: ['Grandpa Went Wild', 'Collect 100 multiplier beans.'],
                        zafer: ['Coffee Victory', 'Win your first Matcha War victory.'], rain: ['Cake Rain', 'Fill the oven and start Cake Rain.'], harvest: ['Bountiful Harvest', 'Win a harvest payout.'], loy: ['Loyal Customer', 'Fill the loyalty card.'],
                        st2: ['Branch 2', 'Buy Matcha Street.'], st3: ['Branch 3', 'Buy Bakery Square.'], st4: ['Branch 4', 'Buy Harvest Hill.'], st5: ['At the Castle Gate', 'Reach Syrup Castle.'], hero: ['Town Hero', 'Buy SyruppoLab and finish the game.'],
                        reel6: ['Sixth Reel', 'Unlock the 6th reel.'], fullpower: ['Fully Equipped', 'Max out every Workshop upgrade.'],
                        rich1m: ['Millionaire Barista', 'See 1,000,000 beans in your bank.'], rich100m: ['Coffee Emperor', 'See 100,000,000 beans in your bank.'],
                        daily7: ['Weekly Regular', 'Log in 7 days in a row.'], album1: ['Collector', 'Unlock every album card.'], album3: ['Legendary Collector', 'Get every album card to 3 stars.'],
                        turbo: ['Speed Lover', 'Spin 500 times in Turbo.'], quest10: ['Quest Hero', 'Finish 10 daily quests.']
                    }
                },
                album: {
                    title: 'Collection Album', info: 'Cards unlock and earn stars as symbols take part in winning combos. Every star pays beans into your bank!',
                    count: '{a}/{b} cards · {s} stars', lockedName: '???', prog: '{a}/{b}', max: 'MAX ★★★', starGot: '📔 ALBUM: {n} {s} +{v} beans',
                    bios: {
                        book: 'Bearista’s grandmother’s recipe book. When it opens, free spin magic begins; in free spins it can cover whole reels on its own.',
                        barista: 'Our hero. Up at six, tunes the grinder, and always brews the first coffee for BlueBird.',
                        girlfriend: 'Blue beanie, warm heart, milky coffee. Bearista’s biggest supporter and the sweetest smile in town.',
                        baking_bear: 'The floury face of Bakery Square. Laminates croissant dough 27 times and never burns a cake (almost).',
                        portafilter: 'The heart of the espresso machine. Knows the perfect tamping pressure and loves telling everyone.',
                        v60: 'Patient and elegant. Treats a 3-minute brew like meditation.',
                        espresso: 'Small but mighty. The town’s official way to wake up.',
                        aeropress: 'Every traveller’s friend. Works upright or inverted — happy either way.',
                        golden_bean: 'Legend says it grows on Harvest Hill once a century. For now it’s the currency of everything in your bank.',
                        croissant: 'Coffee’s best friend. Buttery, flaky and always waiting next to a cup.',
                        pitcher: 'The milk-steaming master. A joker on reels 1, 3 and 5; three together make Latte Art.',
                        matcha: 'SyruppoLab’s green invasion! But our baristas turn every matcha into real coffee.',
                        cupcake: 'Fresh out of the oven. When the oven is full they rain from the sky as jokers.',
                        coffeebag: 'The bounty of Harvest Hill. Three sacks together pay a harvest.',
                        stamp: 'The mark of loyal customers. Ten stamps mean a free drink.',
                        dede: 'Bearista’s grandfather and the town’s first roaster. Watches from the rooftop window and tosses multipliers from his coffee pot.'
                    }
                },
                quests: {
                    title: 'Daily Quests', locked: 'Daily quests unlock when you board the time machine (chapter 6). Then 3 new quests and a chest await you every day!',
                    info: '3 quests per day. Finish all three to open the Master Chest. Quests refresh at midnight.', claim: 'CLAIM', done: 'CLAIMED ✓', chest: '🎁 MASTER CHEST', chestTxt: 'Finish all 3 quests: +{v}', chestGot: 'Chest opened ✓',
                    got: '📋 Quest complete: +{v} beans!', btn: '📋 QUESTS {a}/{b}',
                    list: { spins: 'Spin {n} times', winx: 'Win {n}× your bet in one spin', fs: 'Trigger free spins {n} time(s)', orbs: 'Get {n} multipliers from Grandpa Brew', loy: 'Fill the loyalty card {n} time(s)', winsum: 'Win {n}× your bet in total', big: 'Land {n} Big Win(s) (×15+)' }
                },
                lb: { title: 'Time Travellers Ranking', info: 'Ranking is by the chapter you reach in the Time Travel Saga; ties are broken by your Time Treasure (beans that overflow when you change chapters). After chapter 100, your Master Café record is added to the treasure.', me: 'Your progress', none: 'No score yet. Start travelling through time!', local: 'Saves on this device', world: 'World ranking', login: 'Sign in from your profile to join the world ranking.', loading: 'Loading…', err: 'Couldn’t load the ranking (maybe no internet).', rank: 'Your rank: #{n}' },
                usta: { place: 'Master Café', lockTxt: 'Unlocks after chapter 100. Play endlessly here and set records.', title: '🏆 MASTER MODE', rec: 'Record: {v}', newRec: '🏆 NEW RECORD: {v}!' },
                set: {
                    title: '⚙ Settings', lang: 'Language', music: 'Music volume', sfx: 'Effects volume', mute: 'All sound', turbo: 'Turbo spin (default)', vibe: 'Vibration', fx: 'Light effects mode (for slower phones)', fxAuto: 'Your phone was struggling, so I switched to light effects (you can turn it off in Settings) ☕',
                    on: 'ON', off: 'OFF', account: '👤 Profile & account', backup: '💾 Save backup (code)', tut: '❔ Show the guide again', reset: '🗑 Delete all data', resetT: 'DELETE EVERYTHING?', resetTxt: '<b>All saves, profile, badges and album</b> on this device will be deleted. Your cloud save is not deleted.', resetYes: 'YES, DELETE',
                    install: '📲 Add to home screen', installed: 'Installed as an app ✓', offline: '✈ Works offline', ver: 'Version', close: 'CLOSE'
                },
                pwaInstall: 'Add to home screen'
            };
            Object.assign(I18N.tr.top, { setT: ' AYARLAR', hubT: ' KUPA', storeT: ' MAĞAZA' });
            Object.assign(I18N.tr.ctl, { turbo: 'TURBO', stop: 'DUR' });
            Object.assign(I18N.en.ctl, { turbo: 'TURBO', stop: 'STOP' });
            Object.assign(I18N.tr, TR);
            Object.assign(I18N.en, EN);
            I18N.tr.store = { btn: '🛒 MAĞAZA', title: '🛒 Mağaza', open: '🛒 MAĞAZAYA GİT', video: 'Reklam izle', videoTxt: 'Kısa bir video izle, kasana anında +{v} çekirdek. Dilediğin zaman!', wait: '⏳ {t} sn',
                free: 'Ücretsiz hediye', freeTxt: 'Oyuna girdiğin her 6 saatte bir +{v} çekirdek kendiliğinden gelir.', ready: 'HAZIR!', soonT: 'Çok yakında', soonTag: 'ÇOK YAKINDA', looksT: '🎃 Cadılar Bayramı Görünümleri', hwTxt: { frame: 'Mor-turuncu çerçeve: parlayan balkabakları, örümcek ağı, sallanan örümcek, uçan hayalet ve mum gibi titreşen lambalar. Kalıcıdır.', cap: 'Kahve Dede’ye mor-turuncu kuşaklı sivri cadı şapkası.', cup: 'Oyulmuş yüzlü balkabağı fincan: çarpanlar korkunç tatlı gelir.' },
                soon: [['💰', 'Çekirdek paketleri', 'Küçük, orta ve dev çekirdek çuvalları.'], ['🚫', 'Reklamsız oyun', 'Videolar olmadan ödüllerin tamamı.'], ['🎨', 'Premium görünüm paketi', 'Özel çerçeve, şapka ve fincan setleri.'], ['🎟', 'Sezon kartı', 'Sezon boyunca ekstra ödüller ve görevler.']] };
            I18N.en.store = { btn: '🛒 SHOP', title: '🛒 Shop', open: '🛒 GO TO SHOP', video: 'Watch an ad', videoTxt: 'Watch a short video and get +{v} beans instantly. Any time!', wait: '⏳ {t}s',
                free: 'Free gift', freeTxt: 'Every 6 hours you play, +{v} beans arrive on their own.', ready: 'READY!', soonT: 'Coming soon', soonTag: 'COMING SOON', looksT: '🎃 Halloween Looks', hwTxt: { frame: 'Purple-orange frame: glowing pumpkins, a spider web, a dangling spider, a floating ghost and candle-flicker lights. Yours forever.', cap: 'A pointy witch hat with a purple-orange band for Grandpa Brew.', cup: 'A carved pumpkin cup: multipliers arrive spooky-sweet.' },
                soon: [['💰', 'Bean packs', 'Small, medium and giant sacks of beans.'], ['🚫', 'Ad-free play', 'All rewards without videos.'], ['🎨', 'Premium look pack', 'Special frame, hat and cup sets.'], ['🎟', 'Season pass', 'Extra rewards and quests all season long.']] };
            Object.assign(I18N.tr.shop, { onlyAt: 'Yalnızca {place} şubesinde işe yarar' });
            Object.assign(I18N.en.shop, { onlyAt: 'Only works at {place}' });
            I18N.tr.cheat = { title: '🧪 Test Kodu', ph: 'Kodu yaz…', ok: 'UYGULA', needSave: 'Önce bir kayıt yükle.', on: 'Test modu AÇIK: spinler kasadan çekirdek düşürmez. (Bu kayıt skor tablosuna girmez.)', off: 'Test modu kapandı.', rich: 'Kasan bu şubenin hedefine çıkarıldı.', egg: '🥚 Tebrikler, bir easter egg buldunuz! +5.000 çekirdek', eggUsed: 'Bu easter egg’i zaten buldun 😉', bad: 'Geçersiz kod.' };
            I18N.en.cheat = { title: '🧪 Test Code', ph: 'Type the code…', ok: 'APPLY', needSave: 'Load a save first.', on: 'Test mode ON: spins don’t take beans from your bank. (This save won’t go to the leaderboard.)', off: 'Test mode off.', rich: 'Your bank was raised to this branch’s goal.', egg: '🥚 Congratulations, you found an easter egg! +5,000 beans', eggUsed: 'You already found this easter egg 😉', bad: 'Invalid code.' };
            I18N.tr.lever = { storeT: '🎰 Slot Kolları', storeTxt: 'Makinenin sağına takılır; her spinde iner kalkar, dokununca spin atar. Bir kez alırsın, tüm kayıtlarında kalır.', aria: 'Slot kolu: çek ve çevir', remove: 'KALDIR', foot: 'Kollar kalıcıdır ve tüm kayıtlarında kullanılır. Kola dokunarak da spin atabilirsin.',
                note: '🎰 Makinenin sağına gerçek bir slot kolu tak! Her spinde hızla aşağı iner, makaralar dönerken yavaşça kalkar. Turboda hızlı in-çık; “Durdur”a basınca hemen geri döner.',
                names: { yok: 'Kolsuz', kirmizi: 'Klasik Kırmızı', portafiltre: 'Portafiltre Sapı', cezve: 'Bakır Cezve', cekirdek: 'Kahve Çekirdeği', altin: 'Altın Usta Kolu' },
                desc: { yok: 'Makinede kol olmaz.', kirmizi: 'Krom gövde, parlak kırmızı top: Las Vegas klasiği.', portafiltre: 'Espresso makinesinin siyah sapı, krom çubukta.', cezve: 'Dövme bakır gövde, ahşap cezve sapı.', cekirdek: 'Ucunda kocaman bir kahve çekirdeği.', altin: 'Baştan aşağı altın, hafifçe ışıldar.' } };
            I18N.en.lever = { storeT: '🎰 Slot Levers', storeTxt: 'Fits to the right of the machine; it moves on every spin and you can tap it to spin. Buy once, keep it on all saves.', aria: 'Slot lever: pull to spin', remove: 'REMOVE', foot: 'Levers are permanent and work on all your saves. You can also tap the lever to spin.',
                note: '🎰 Fit a real slot lever to the right of the machine! It snaps down on every spin and slowly rises while the reels turn. Quick down-up in turbo; it springs back when you press “Stop”.',
                names: { yok: 'No lever', kirmizi: 'Classic Red', portafiltre: 'Portafilter Handle', cezve: 'Copper Cezve', cekirdek: 'Coffee Bean', altin: 'Golden Master Lever' },
                desc: { yok: 'No lever on the machine.', kirmizi: 'Chrome body, shiny red ball: a Las Vegas classic.', portafiltre: 'An espresso machine’s black handle on a chrome rod.', cezve: 'Hammered copper body with a wooden cezve grip.', cekirdek: 'A giant coffee bean on top.', altin: 'Gold from top to bottom, softly glowing.' } };
            I18N.tr.cosm = { kinds: { frame: '🎰 Makara çerçevesi', cap: '👴 Kahve Dede’nin şapkası', cup: '☕ Çarpan fincanı' }, wear: 'TAK', worn: '✓ Takılı', ready: 'Açıldı',
                free: 'Başlangıç', byBadge: '“{n}” rozetiyle açılır', byStar: '{n} albüm kartı {s} olunca açılır', byAlbum: 'Albümde {n} kart açınca', byEvent: 'Cadılar Bayramı etkinliğine özel',
                buyT: 'GÖRÜNÜM SATIN AL', buyTxt: '<b>{n}</b> kalıcı olarak senin olsun mu? Fiyat: <b>{v}</b> çekirdek.', buyOk: 'SATIN AL · {v}', bought: '🎃 Yeni görünüm takıldı!', wearSet: 'SETİ TAK',
                setNote: 'Her şubeyi tamamladığında yeni bir set açılır. Parçaları tek tek de takabilirsin.', bySet: '{n} tamamlanınca açılır', bySetFinal: 'Zaman makinesine binince açılır', eraT: 'Dönem Koleksiyonu', eraOwn: 'Koleksiyonun · parçaları tek tek tak', eraShop: 'Mağaza’da satışta!', eraLock: '{n}. bölümde açılır', eraNow: 'ŞU AN BURADASIN', eraNone: 'Zaman makinesine binince (6. bölüm) her tarihi dönemin kıyafetleri, fincanları ve makine çerçeveleri burada satışa çıkar.', eraNext: 'Sıradaki koleksiyon: {era} ({n}. bölümde)', eraWearAll: 'Sahip olduğum parçaları birlikte giy', paySplit: 'Zaman Hazinesi’nden {t} + kasadan {b}', hwOver: 'Etkinlik sona erdi — artık satılmıyor', treOwn: 'Hazineyle aldığın görünümler',
                    betaSet: 'Beta Tester Seti', betaLock: 'Yalnızca beta testerlara özel kodla açılır', betaOk: 'Beta Tester Seti açıldı ve giyildi! Teşekkürler 💚', betaHave: 'Beta Tester Seti zaten sende 💚',
                    potion: 'Zaman İksiri', potionLeft: '{n} spin kaldı', potionTxt: 'Sonraki 25 normal spinde hat tamamlama şansı +%8. Üst üste alınabilir (en çok 75 spin).',
                    chest: 'Hazine Sandığı', chestTxt: 'Henüz sahip olmadığın {n} görünümden biri rastgele çıkar (çerçeve, şapka, fincan ya da kol).', chestAsk: 'Zaman Hazinesi’nden {v} harcayıp sandığı açalım mı?', chestGot: 'Sandıktan çıktı!', treTxt: 'Bölüm geçerken taşan çekirdekler burada birikir. Görünüm alırken önce hazine harcanır; Zaman Bekçisi seti yalnızca hazineyle alınır. (Sıralamadaki puanın azalmaz.)',
                hwSet: 'Cadılar Bayramı Seti', hwShop: 'Yalnızca Mağaza’da · etkinlik süresince',
                sets: { s1: 'Huzurlu Dem Seti', s2: 'Matcha Seti', s3: 'Pastane Seti', s4: 'Hasat Seti', s5: 'Kale Gecesi Seti', s6: 'Usta Seti' },
                names: { frame: { klasik: 'Klasik Ahşap', bal: 'Bal Altını', gece: 'Gece Mavisi', matcha: 'Zümrüt Matcha', pastel: 'Pastel Şeker', hasat: 'Hasat Buğdayı', nil: 'Nil Lapisi', ege: 'Ege Mermeri', fiyort: 'Fiyort Demiri', sezar: 'Sezar’ın Kızılı', cini: 'İznik Çinisi', buhar: 'Buhar Bakırı', versay: 'Versay Altını', floransa: 'Floransa Terrakotası', deco: 'Art Deco', zaman: 'Zaman Bekçisi', beta: 'Beta Laboratuvarı', balkabagi: 'Balkabağı' },
                         cap: { kasket: 'Kasket', beret: 'Mavi Bere', chef: 'Aşçı Şapkası', crown: 'Usta Tacı', bandana: 'Yeşil Bandana', hasir: 'Hasır Şapka', nemes: 'Firavun Nemesi', defne: 'Defne Tacı', boynuz: 'Viking Miğferi', migfer: 'Lejyon Miğferi', kavuk: 'Kavuk', silindir: 'Silindir Şapka', tricorne: 'Üç Köşeli Şapka', ronesans: 'Rönesans Beresi', fotr: 'Fötr Şapka', pilot: 'Zaman Pilotu Gözlüğü', beta: 'Beta Tester Beresi', witch: 'Cadı Şapkası' },
                         cup: { klasik: 'Klasik', lale: 'Lale Desenli', altin: 'Altın Fincan', matcha: 'Matcha Çanağı', pastel: 'Şekerli Pastel', toprak: 'Toprak Fincan', lapis: 'Lapis Fincan', amfora: 'Amfora Fincan', run: 'Rünlü Kupa', zafer: 'Zafer Fincanı', zarf: 'Zarflı Fincan', gul: 'Güllü Porselen', sevr: 'Sèvres Fincan', majolika: 'Majolika Fincan', caz: 'Caz Fincanı', kumsaati: 'Kum Saati Fincanı', beta: 'Beta İksir Fincanı', balkabagi: 'Balkabağı' } } };
            I18N.en.cosm = { kinds: { frame: '🎰 Reel frame', cap: '👴 Grandpa Brew’s hat', cup: '☕ Multiplier cup' }, wear: 'WEAR', worn: '✓ Equipped', ready: 'Unlocked',
                free: 'Starter', byBadge: 'Unlocks with the “{n}” badge', byStar: 'Unlocks when the {n} album card reaches {s}', byAlbum: 'Open {n} album cards', byEvent: 'Halloween event exclusive',
                buyT: 'BUY LOOK', buyTxt: 'Make <b>{n}</b> yours forever? Price: <b>{v}</b> beans.', buyOk: 'BUY · {v}', bought: '🎃 New look equipped!', wearSet: 'WEAR SET',
                setNote: 'Each branch you complete unlocks a new set. You can also wear pieces one by one.', bySet: 'Unlocks when {n} is completed', bySetFinal: 'Unlocks when you board the time machine', eraT: 'Era Collection', eraOwn: 'In your collection · wear pieces one by one', eraShop: 'On sale in the Store!', eraLock: 'Unlocks at chapter {n}', eraNow: 'YOU ARE HERE', eraNone: 'Once you board the time machine (chapter 6), each era’s outfits, cups and machine frames go on sale here.', eraNext: 'Next collection: {era} (chapter {n})', eraWearAll: 'Wear the pieces I own together', paySplit: '{t} from the Time Treasure + {b} from your bank', hwOver: 'The event has ended — no longer sold', treOwn: 'Looks you bought with treasure',
                    betaSet: 'Beta Tester Set', betaLock: 'Unlocked only with the beta testers’ special code', betaOk: 'Beta Tester Set unlocked and equipped! Thank you 💚', betaHave: 'You already have the Beta Tester Set 💚',
                    potion: 'Time Potion', potionLeft: '{n} spins left', potionTxt: 'Line-completion chance +8% for your next 25 normal spins. Stackable (up to 75 spins).',
                    chest: 'Treasure Chest', chestTxt: 'Gives a random look you don’t own yet ({n} left: frame, hat, cup or lever).', chestAsk: 'Spend {v} from the Time Treasure to open the chest?', chestGot: 'From the chest!', treTxt: 'Beans that overflow when you change chapters collect here. Looks are paid from the treasure first; the Time Keeper set can only be bought with treasure. (Your ranking score doesn’t drop.)',
                hwSet: 'Halloween Set', hwShop: 'Store only · during the event',
                sets: { s1: 'Cozy Brew Set', s2: 'Matcha Set', s3: 'Bakery Set', s4: 'Harvest Set', s5: 'Castle Night Set', s6: 'Master Set' },
                names: { frame: { klasik: 'Classic Wood', bal: 'Honey Gold', gece: 'Midnight Blue', matcha: 'Emerald Matcha', pastel: 'Pastel Candy', hasat: 'Harvest Wheat', nil: 'Nile Lapis', ege: 'Aegean Marble', fiyort: 'Fjord Iron', sezar: 'Caesar’s Crimson', cini: 'Iznik Tile', buhar: 'Steam Copper', versay: 'Versailles Gold', floransa: 'Florence Terracotta', deco: 'Art Deco', zaman: 'Time Keeper', beta: 'Beta Lab', balkabagi: 'Pumpkin' },
                         cap: { kasket: 'Flat Cap', beret: 'Blue Beret', chef: 'Chef’s Hat', crown: 'Master’s Crown', bandana: 'Green Bandana', hasir: 'Straw Hat', nemes: 'Pharaoh’s Nemes', defne: 'Laurel Wreath', boynuz: 'Viking Helmet', migfer: 'Legion Helmet', kavuk: 'Ottoman Kavuk', silindir: 'Top Hat', tricorne: 'Tricorne', ronesans: 'Renaissance Beret', fotr: 'Fedora', pilot: 'Time Pilot Goggles', beta: 'Beta Tester Beanie', witch: 'Witch Hat' },
                         cup: { klasik: 'Classic', lale: 'Tulip Pattern', altin: 'Golden Cup', matcha: 'Matcha Bowl', pastel: 'Candy Pastel', toprak: 'Clay Cup', lapis: 'Lapis Cup', amfora: 'Amphora Cup', run: 'Rune Mug', zafer: 'Triumph Cup', zarf: 'Zarf Cup', gul: 'Rose Porcelain', sevr: 'Sèvres Cup', majolika: 'Majolica Cup', caz: 'Jazz Cup', kumsaati: 'Hourglass Cup', beta: 'Beta Potion Cup', balkabagi: 'Pumpkin' } } };
            I18N.tr.ev = { title: '🎃 Cadılar Bayramı Etkinliği', task: 'Etkinlik süresince {n} spin at, büyük çekirdek ödülünü kap! Balkabağı görünümleri Mağaza’da.', done: 'Tamamlandı! Ödülün kasana eklendi.', until: '2 Kasım’a kadar',
                doneT: '🎃 ETKİNLİK TAMAMLANDI!', doneS: 'Etkinlik ödülü kasana eklendi', banner: '🎃 <b>Cadılar Bayramı etkinliği</b> başladı! 2 Kasım’a kadar özel görünümler Mağaza’da.', theme: 'Etkinlik teması (süsler ve müzik)' };
            I18N.en.ev = { title: '🎃 Halloween Event', task: 'Spin {n} times during the event to win a big bean reward! Pumpkin looks are in the Store.', done: 'Completed! Your reward was added to your bank.', until: 'until 2 November',
                doneT: '🎃 EVENT COMPLETE!', doneS: 'Event reward added to your bank', banner: '🎃 <b>Halloween event</b> is on! Special looks in the Store until 2 November.', theme: 'Event theme (decorations and music)' };
            Object.assign(I18N.tr.set, { a11yT: 'Erişilebilirlik', cb: 'Renk körü modu (sembollere şekil işareti)', text: 'Yazı boyutu', textS: ['Normal', 'Büyük', 'Çok büyük'], motion: 'Hareketi azalt', notifT: 'Hatırlatmalar', notif: 'Hediye ve günlük ödül bildirimleri', notifDenied: 'Bildirim izni tarayıcı ayarlarından kapalı.', notifNo: 'Bu cihaz bildirimleri desteklemiyor.', whatsNew: '✨ Bu sürümde neler var?' });
            Object.assign(I18N.en.set, { a11yT: 'Accessibility', cb: 'Colour-blind mode (shape marks on symbols)', text: 'Text size', textS: ['Normal', 'Large', 'Extra large'], motion: 'Reduce motion', notifT: 'Reminders', notif: 'Gift and daily reward notifications', notifDenied: 'Notifications are blocked in your browser settings.', notifNo: 'This device doesn’t support notifications.', whatsNew: '✨ What’s new in this version?' });
            I18N.tr.notif = { gift: ['☕ Hediyen hazır!', 'Kasana {v} çekirdek eklendi, Bearista seni bekliyor.'], daily: ['🎁 Günlük ödülün hazır!', 'Giriş serini kaçırma: bugünkü ödülünü almak için uğra.'], askT: 'Hatırlatma ister misin?', ask: 'Hediyen ve günlük ödülün hazır olunca sana haber verelim mi?', yes: 'EVET, HABER VER', no: 'Şimdi değil' };
            I18N.en.notif = { gift: ['☕ Your gift is ready!', '{v} beans were added to your bank. Bearista is waiting.'], daily: ['🎁 Daily reward ready!', 'Keep your login streak: drop by for today’s reward.'], askT: 'Want reminders?', ask: 'Shall we let you know when your gift and daily reward are ready?', yes: 'YES, REMIND ME', no: 'Not now' };

            Object.assign(I18N.en.top, { setT: ' SETTINGS', hubT: ' TROPHY', storeT: ' SHOP' });

            // Kitap: tuş listesi güncellemesi
            const patchKeys = (lang, rows, replace) => {
                const keys = I18N[lang].info.keys;
                Object.keys(replace).forEach(k => { const i = keys.findIndex(r => r[0] === k); if (i >= 0) keys[i] = replace[k]; });
                const at = keys.findIndex(r => r[0] === (lang === 'tr' ? 'OTO' : 'AUTO'));
                keys.splice(at + 1, 0, rows[0]);
                rows.slice(1).forEach(r => keys.push(r));
            };
            patchKeys('tr', [
                ['⚡ TURBO', 'Hızlı oyun: makaralar neredeyse anında durur, küçük kazanç gösterileri kısalır. Sonuçlar ve kazanma şansı değişmez. 2 Kitap düşünce kalan makaralar yine yavaşlar, heyecan kaçmaz. Dönerken SPİN’e tekrar basarsan makaraları hemen durdurursun.'],
                ['⚙ AYARLAR', 'Dil, müzik ve efekt sesi, turbo, titreşim, hafif efekt modu, profil/hesap ve kayıt yedeği.'],
                ['🏅 KUPA ODASI', 'Günlük giriş ödülü, rozetler, koleksiyon albümü, (oyun bitince) günlük görevler ve skor tablosu.'],
                ['👤 PROFİL', 'Ana menüdeki profil kartı: nick, profil resmi, Google/e-posta ile giriş ve bulut kaydı.']
            ], { '⚡ ÇARPAN ÇEKİRDEĞİ': ['👴 KAHVE DEDE', 'Makaraların üstündeki Kahve Dede bazen cezvesinden bir çarpan çekirdeği fırlatır (×2 – ×100). O spinde kazanç varsa kazancın çarpılır. Free spin’de çarpanlar birikir (en fazla ×25) ve sonraki her kazancı çarpar. “Dede çarpan verdi!”'] });
            patchKeys('en', [
                ['⚡ TURBO', 'Fast play: reels stop almost instantly and small win shows are shortened. Results and odds don’t change. When 2 Books land the remaining reels still slow down, so the thrill stays. Press SPIN again while spinning to stop the reels at once.'],
                ['⚙ SETTINGS', 'Language, music and effects volume, turbo, vibration, light effects mode, profile/account and save backup.'],
                ['🏅 TROPHY ROOM', 'Daily login reward, badges, collection album, (after the finale) daily quests and the leaderboard.'],
                ['👤 PROFILE', 'The profile card on the main menu: nickname, picture, Google/e-mail sign-in and cloud save.']
            ], { '⚡ MULTIPLIER BEAN': ['👴 GRANDPA BREW', 'Grandpa Brew sits above the reels and sometimes tosses a multiplier bean from his coffee pot (×2 – ×100). If that spin wins, the win is multiplied. In free spins multipliers add up (max ×25) and multiply every following win.'] });
        })();

