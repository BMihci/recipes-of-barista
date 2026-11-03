        /* Hikâye metinleri (1–5. şubeler). Sahneler cinema.js'de 3D olarak kurulur. */
        const STORY_TXT = {
            tr: {
                1: { title: 'NİTELİKLİ KAHVE SAVAŞI', issue: 'SAYI #1 · CHİBİ KAHVE MASALI', cta: ['MACERAYA BAŞLA ☕'], shots: [
                    { tag: 'HUZURLU DEM', bub: 'LATTE ART ZAMANI!', narr: 'Kasabanın en sıcak köşesinde Bearista ve sevgilisi MaviKuş, her fincana sevgiyle latte art çiziyordu...' },
                    { tag: 'SADIK MÜŞTERİLER', bub: 'TAZE KRUVASANLAR HAZIR!', narr: 'Fırıncı Ayı’nın kruvasanları, V60’tan süzülen kahveler... Müşteriler her sabah kapıda kuyruk oluyordu.' },
                    { tag: 'TEHLİKE', sfx: 'BOOM!', bub: 'BÜTÜN BAĞIMSIZ KAHVECİLER KAPANACAK!', narr: 'Ama bir gece şehrin öbür ucunda dev bir kule yükseldi: SyruppoLab! Şurupla dolu zincir kahveleriyle herkesi yutmak istiyordu...' },
                    { tag: 'DİRENİŞ', bub: 'ZİNCİRE MÜŞTERİ KAPTIRMAYACAĞIZ!', sfx: 'KAHVE<br>GÜCÜ!', narr: 'Plan basit: kasada 100.000 çekirdek biriktir, ikinci şubeyi aç ve kasabayı adım adım geri kazan!' }] },
                2: { title: 'MATCHA SAVAŞI', issue: 'SAYI #2 · İKİNCİ ŞUBE', cta: ['2. ŞUBEYİ AÇ ☕'], shots: [
                    { tag: 'YENİ ŞUBE', bub: 'İKİNCİ ŞUBEMİZ AÇILDI!', sfx: 'YAŞASIN!', narr: 'Biriktirdiğimiz çekirdeklerle Matcha Caddesi’nde ikinci şubemizi açtık! Kasadaki fazla çekirdekler de bizimle geldi.' },
                    { tag: 'ÖFKE', sfx: 'GRRR!', bub: 'O ZAMAN... MATCHA!', narr: 'SyruppoLab müşterilerimizi çalamayınca çılgına döndü ve tam karşımıza dev bir matcha dükkânı açtı...' },
                    { tag: 'MATCHA İSTİLASI', sfx: 'MATCHA<br>İSTİLASI!', narr: 'Kasaba yeşile boyandı, herkes matcha kuyruğunda...' },
                    { tag: 'KARŞI SALDIRI', sfx: 'DÖNÜŞÜM!', bub: 'MATCHAYI GERÇEK KAHVEYE ÇEVİRİYORUZ!', narr: 'Biz gerçek kahveciyiz! Makaraya düşen her matchayı aynı anda tek bir kahveye çeviriyoruz. 15 matcha = KAHVE ZAFERİ. Hedef: 500.000 çekirdek!' }] },
                3: { title: 'PASTANE FESTİVALİ', issue: 'SAYI #3 · TATLI MEYDAN', cta: ['3. ŞUBEYİ AÇ 🧁'], shots: [
                    { tag: 'FESTİVAL', bub: 'FESTİVAL BAŞLIYOR!', narr: 'Üçüncü şubemiz Pastane Meydanı’nda! Fırıncı Ayı kasabanın Pasta Festivali için kolları sıvadı.' },
                    { tag: 'SABOTAJ', sfx: 'BUZ!', bub: 'FIRINLARINIZ DONSUN!', narr: 'Ama SyruppoLab gece fırınlara buzlu şurup döktü! Soğuk fırında kek kabarmaz...' },
                    { tag: 'PASTA YAĞMURU', sfx: 'PASTA<br>YAĞMURU!', narr: 'Makaralarda çıkan her kek fırını ısıtır. Fırın dolunca PASTA YAĞMURU başlar: kekler JOKER olur!' },
                    { tag: 'HEP BİRLİKTE', bub: 'FIRINLARI YAKALIM!', narr: 'Bearista, MaviKuş ve Fırıncı Ayı omuz omuza. Hedef: 2.500.000 çekirdek!' }] },
                4: { title: 'HASAT TEPESİ', issue: 'SAYI #4 · KENDİ ÇEKİRDEĞİMİZ', cta: ['4. ŞUBEYİ AÇ 🌾'], shots: [
                    { tag: 'ÇİFTLİK', bub: 'KENDİ ÇEKİRDEĞİMİZİ YETİŞTİRELİM!', narr: 'Dördüncü şube bir çiftlik: Hasat Tepesi! Artık çekirdeklerimizi kendimiz yetiştireceğiz.' },
                    { tag: 'TEKEL', sfx: 'HAH HAH!', bub: 'BÜTÜN ÇEKİRDEKLERİ BEN ALACAĞIM!', narr: 'SyruppoLab kasabadaki bütün çekirdekleri satın alıp bize kahve bırakmamaya çalışıyor...' },
                    { tag: 'HASAT', sfx: 'BEREKET!', narr: 'Makaralarda çıkan Kahve Çuvalları ekranın neresinde olursa olsun öder: 3 çuval ve üstü = HASAT!' },
                    { tag: 'UMUT', bub: 'BEREKETLİ BİR HASAT!', narr: 'Toprak bizden yana. Hedef: 10.000.000 çekirdek ve son büyük adım!' }] },
                5: { title: 'ŞURUP KALESİ', issue: 'SAYI #5 · BÜYÜK FİNAL', cta: ['FİNALE BAŞLA ☕'], shots: [
                    { tag: 'SON KOZ', sfx: 'SON KOZ!', narr: 'Her şeyini kaybeden SyruppoLab son kozunu oynadı: dev bir Şurup Kalesi!' },
                    { tag: 'ŞURUP SELİ', sfx: 'ŞLAP!', narr: 'Kaleden akan şurup seli sokaklara yayılıyor... Bütün kahveler şekere boğulmak üzere!' },
                    { tag: 'SADAKAT KARTI', bub: 'HER 10 DAMGAYA BİR İKRAM!', narr: 'Sadık müşteriler yanımızda! Damgaları topla; kart dolunca ücretsiz içeceğini seç: Filtre Kahve, Americano ya da Latte.' },
                    { tag: 'FİNAL', bub: 'SYRUPPOLAB’I SATIN ALACAĞIZ!', sfx: 'FİNAL<br>SAVAŞI!', narr: 'Hedef: kasada 50.000.000 çekirdek görüp SyruppoLab’ı satın almak ve kasabayı kurtarmak!' }] },
                6: { title: 'GERÇEK KAHVE KAZANDI!', issue: 'SAYI #6 · SON', cta: ['🗺 KASABA HARİTASI', '🏠 ANA MENÜ'], shots: [
                    { tag: 'ÇÖKÜŞ', sfx: 'KRAAAK!', narr: 'SyruppoLab satın alındı ve Şurup Kalesi’nin surları tek tek indirildi! Şurup imparatorluğu bir süt köpüğü gibi dağıldı...' },
                    { tag: 'KASABA', sfx: 'ZAFER!', narr: 'Kasaba halkı sokaklara döküldü! Bağımsız kahveciler yeniden açıldı, fırınlar yeniden mis gibi koktu.' },
                    { tag: 'İKİMİZ', bub: 'GERÇEK KAHVE KAZANDI!', narr: 'Bearista ve MaviKuş tabelayı astı: “Nitelikli Kahve, Sevgiyle”.' },
                    { tag: 'SON', narr: 'Ve reçete kitabının yeni sayfası açıldı... İstersen serbest oyunla çarkları çevirmeye devam edebilirsin. ☕❤' }] }
            },
            en: {
                1: { title: 'THE SPECIALTY COFFEE WAR', issue: 'ISSUE #1 · A CHIBI COFFEE TALE', cta: ['START THE ADVENTURE ☕'], shots: [
                    { tag: 'COZY BREW', bub: 'LATTE ART TIME!', narr: 'In the coziest corner of town, Bearista and his sweetheart BlueBird drew latte art on every cup with love...' },
                    { tag: 'LOYAL CUSTOMERS', bub: 'FRESH CROISSANTS!', narr: 'Baker Bear’s croissants, coffee dripping from the V60... Every morning a queue formed at the door.' },
                    { tag: 'DANGER', sfx: 'BOOM!', bub: 'ALL INDEPENDENT CAFÉS WILL CLOSE!', narr: 'But one night a giant tower rose on the other side of town: SyruppoLab! Its syrupy chain cafés wanted to swallow everyone...' },
                    { tag: 'RESISTANCE', bub: 'WE WON’T LOSE OUR CUSTOMERS!', sfx: 'COFFEE<br>POWER!', narr: 'The plan is simple: save 100,000 beans, open a second branch and win the town back step by step!' }] },
                2: { title: 'THE MATCHA WAR', issue: 'ISSUE #2 · SECOND BRANCH', cta: ['OPEN BRANCH 2 ☕'], shots: [
                    { tag: 'NEW BRANCH', bub: 'OUR SECOND BRANCH IS OPEN!', sfx: 'HOORAY!', narr: 'With the beans we saved we opened our second branch on Matcha Street! Our extra beans came along too.' },
                    { tag: 'RAGE', sfx: 'GRRR!', bub: 'THEN... MATCHA!', narr: 'Unable to steal our customers, SyruppoLab went mad and opened a giant matcha shop right across the street...' },
                    { tag: 'MATCHA INVASION', sfx: 'MATCHA<br>INVASION!', narr: 'The town turned green; everyone was queuing for matcha...' },
                    { tag: 'COUNTERATTACK', sfx: 'CONVERT!', bub: 'WE TURN MATCHA INTO REAL COFFEE!', narr: 'We are real baristas! Every matcha on the reels turns into one and the same coffee. 15 matchas = COFFEE VICTORY. Goal: 500,000 beans!' }] },
                3: { title: 'BAKERY FESTIVAL', issue: 'ISSUE #3 · SWEET SQUARE', cta: ['OPEN BRANCH 3 🧁'], shots: [
                    { tag: 'FESTIVAL', bub: 'THE FESTIVAL BEGINS!', narr: 'Our third branch is on Bakery Square! Baker Bear rolled up his sleeves for the town’s Cake Festival.' },
                    { tag: 'SABOTAGE', sfx: 'FREEZE!', bub: 'MAY YOUR OVENS FREEZE!', narr: 'But at night SyruppoLab poured icy syrup into the ovens! Cakes don’t rise in a cold oven...' },
                    { tag: 'CAKE RAIN', sfx: 'CAKE<br>RAIN!', narr: 'Every cupcake on the reels heats the oven. When it’s full, CAKE RAIN begins: cupcakes become JOKERS!' },
                    { tag: 'ALL TOGETHER', bub: 'LET’S FIRE UP THE OVENS!', narr: 'Bearista, BlueBird and Baker Bear side by side. Goal: 2,500,000 beans!' }] },
                4: { title: 'HARVEST HILL', issue: 'ISSUE #4 · OUR OWN BEANS', cta: ['OPEN BRANCH 4 🌾'], shots: [
                    { tag: 'THE FARM', bub: 'LET’S GROW OUR OWN BEANS!', narr: 'The fourth branch is a farm: Harvest Hill! From now on we grow our own beans.' },
                    { tag: 'MONOPOLY', sfx: 'HA HA!', bub: 'I’LL BUY EVERY BEAN IN TOWN!', narr: 'SyruppoLab is buying up every bean in town so that we’re left with no coffee...' },
                    { tag: 'HARVEST', sfx: 'BOUNTY!', narr: 'Coffee Sacks on the reels pay anywhere on screen: 3 or more sacks = HARVEST!' },
                    { tag: 'HOPE', bub: 'A BOUNTIFUL HARVEST!', narr: 'The land is on our side. Goal: 10,000,000 beans and the last big step!' }] },
                5: { title: 'SYRUP CASTLE', issue: 'ISSUE #5 · THE GRAND FINALE', cta: ['START THE FINALE ☕'], shots: [
                    { tag: 'LAST TRICK', sfx: 'LAST TRICK!', narr: 'Having lost everything, SyruppoLab played its last card: a giant Syrup Castle!' },
                    { tag: 'SYRUP FLOOD', sfx: 'SPLASH!', narr: 'A flood of syrup pours from the castle into the streets... All the coffee is about to drown in sugar!' },
                    { tag: 'LOYALTY CARD', bub: 'A TREAT FOR EVERY 10 STAMPS!', narr: 'Our loyal customers are with us! Collect stamps; when the card is full pick a free drink: Filter Coffee, Americano or Latte.' },
                    { tag: 'FINALE', bub: 'WE’LL BUY OUT SYRUPPOLAB!', sfx: 'FINAL<br>BATTLE!', narr: 'Goal: see 50,000,000 beans in the bank, buy out SyruppoLab and save the town!' }] },
                6: { title: 'REAL COFFEE WON!', issue: 'ISSUE #6 · THE END', cta: ['🗺 TOWN MAP', '🏠 MAIN MENU'], shots: [
                    { tag: 'COLLAPSE', sfx: 'CRAAACK!', narr: 'SyruppoLab was bought out and the walls of Syrup Castle came down one by one! The syrup empire vanished like milk foam...' },
                    { tag: 'THE TOWN', sfx: 'VICTORY!', narr: 'The townsfolk poured into the streets! Independent cafés reopened and the bakeries smelled wonderful again.' },
                    { tag: 'US TWO', bub: 'REAL COFFEE WON!', narr: 'Bearista and BlueBird hung up the sign: “Specialty Coffee, with Love”.' },
                    { tag: 'THE END', narr: 'And a new page of the recipe book opened... You can keep spinning in free play if you like. ☕❤' }] }
            }
        };
        const STORY_CTA = {
            1: [() => enterStage(1)], 2: [() => enterStage(2)], 3: [() => enterStage(3)], 4: [() => enterStage(4)], 5: [() => enterStage(5)],
            6: [() => openMap(), () => returnToMenu()]
        };

