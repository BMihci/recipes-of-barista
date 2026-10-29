        const SVG_FESTIVAL = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="2.5" stroke-linejoin="round"><path d="M0 34 Q75 64 150 34 T300 34" fill="none"/><g class="flags"><polygon points="14,38 26,40 19,58" fill="#E63946"/><polygon points="44,47 57,49 49,67" fill="#FFD23F"/><polygon points="76,53 89,53 82,72" fill="#2EC4B6"/><polygon points="108,51 121,49 116,68" fill="#FF8FAB"/><polygon points="140,40 153,38 148,57" fill="#9BDB4D"/><polygon points="172,39 185,41 177,59" fill="#E63946"/><polygon points="204,48 217,50 209,68" fill="#FFD23F"/><polygon points="236,53 249,53 242,72" fill="#2EC4B6"/><polygon points="268,50 281,48 276,67" fill="#FF8FAB"/></g><rect x="14" y="120" width="80" height="80" fill="#FFF1DC"/><path d="M8 122 L100 122 L92 98 L16 98 Z" fill="#E63946"/><path d="M24 98 v24 M40 98 v24 M56 98 v24 M72 98 v24 M88 98 v24" stroke="#fff" stroke-width="5"/><rect x="206" y="120" width="80" height="80" fill="#FFF1DC"/><path d="M200 122 L292 122 L284 98 L208 98 Z" fill="#2EC4B6"/><path d="M216 98 v24 M232 98 v24 M248 98 v24 M264 98 v24 M280 98 v24" stroke="#fff" stroke-width="5"/></g></svg>`;
        const SVG_OVEN = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#111" stroke-width="3" stroke-linejoin="round"><rect x="70" y="60" width="160" height="140" rx="10" fill="#B9C6D2"/><rect x="92" y="96" width="116" height="70" rx="8" fill="#2a3a4a"/><circle cx="104" cy="78" r="7" fill="#fff"/><circle cx="130" cy="78" r="7" fill="#fff"/><rect x="150" y="72" width="60" height="12" rx="4" fill="#7EC8E3"/></g><g class="ice" fill="#D9F4FF" stroke="#111" stroke-width="2.5" stroke-linejoin="round"><polygon points="70,60 84,60 78,84"/><polygon points="100,60 116,60 108,92"/><polygon points="150,60 166,60 158,86"/><polygon points="196,60 214,60 205,96"/><polygon points="222,60 230,60 227,78"/></g><g class="drip" fill="#C8741B" stroke="#111" stroke-width="2.5"><path d="M118 96 q0 26 8 26 q8 0 8 -26z"/><path d="M170 96 q0 18 7 18 q7 0 7 -18z"/></g><text x="150" y="190" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="14" fill="#7bf1a8" stroke="#111" stroke-width=".8" letter-spacing="1">SYRUPPO LAB ❄</text></svg>`;
        const SVG_FARM = `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle class="sun" cx="250" cy="40" r="22" fill="#FFD23F" stroke="#111" stroke-width="3"/><g stroke="#111" stroke-width="3" stroke-linejoin="round"><path d="M-10 140 Q80 70 170 120 T310 110 V210 H-10Z" fill="#8FCB6B"/><path d="M-10 170 Q90 120 200 160 T310 150 V210 H-10Z" fill="#5FA83A"/><rect x="40" y="96" width="50" height="40" fill="#F3E1C2"/><polygon points="34,98 65,74 96,98" fill="#B8452F"/><rect x="58" y="112" width="14" height="24" fill="#6B4226"/></g><g fill="#3F6A44" stroke="#111" stroke-width="2"><circle cx="130" cy="128" r="9"/><circle cx="160" cy="132" r="9"/><circle cx="190" cy="136" r="9"/><circle cx="220" cy="134" r="9"/><circle cx="250" cy="130" r="9"/><circle cx="145" cy="160" r="9"/><circle cx="175" cy="164" r="9"/><circle cx="205" cy="166" r="9"/><circle cx="235" cy="164" r="9"/></g><g fill="#E63946"><circle cx="133" cy="126" r="3"/><circle cx="163" cy="130" r="3"/><circle cx="193" cy="134" r="3"/><circle cx="223" cy="132" r="3"/><circle cx="148" cy="158" r="3"/><circle cx="208" cy="164" r="3"/></g></svg>`;

        /* Sahne düzenleri (dil bağımsız). Metinler STORY_TXT içinde. */
        const STORIES = {
            1: { shots: [
                    { bg: 'sun', burst: true, music: 'cozy', cam: 'drift', actors: [{ k: 'barista', x: 6, b: 4, h: 70, a: 'in-left', d: 0.2 }, { k: 'cozybear', r: 6, b: 4, h: 60, a: 'in-right', d: 0.5 }, { k: 'espresso', x: 42, b: 8, h: 26, a: 'pop', d: 1.0, idle: 'bob' }], bub: { x: 30, y: 7, d: 1.4 }, snd: [[1.4, 'pop']] },
                    { bg: 'cream', music: 'cozy', cam: 'zoom', actors: [{ k: 'bakingbear', x: 36, b: 2, h: 72, a: 'in-bottom', d: 0.2 }, { k: 'v60', x: 6, b: 8, h: 36, a: 'pop', d: 0.8, idle: 'bob' }, { k: 'aeropress', r: 6, b: 8, h: 36, a: 'pop', d: 1.0, idle: 'bob' }], rain: ['croissant', 'cupcake', 'cake', 'goldenbean'], bub: { r: 8, y: 6, d: 1.3 }, snd: [[1.3, 'pop']] },
                    { bg: 'night', music: 'villain', cam: 'zoom', svg: SVG_CITY, shakeAt: 1.3, sfx: { r: 3, y: 4, d: 1.3, s: 26 }, bub: { x: 4, y: 6, d: 2.0, evil: true }, snd: [[0.2, 'whoosh'], [1.3, 'boom']] },
                    { bg: 'teal', burst: true, music: 'heroic', cam: 'zoom', actors: [{ k: 'barista', x: 8, b: 3, h: 74, a: 'in-left', d: 0.2 }, { k: 'goldenbean', x: 42, b: 10, h: 26, a: 'pop', d: 0.9, idle: 'bob' }, { k: 'cozybear', r: 8, b: 3, h: 64, a: 'in-right', d: 0.4 }], bub: { x: 4, y: 6, d: 1.2 }, sfx: { r: 3, y: 3, d: 1.9, s: 24, c: 'orange' }, snd: [[1.9, 'sparkle']] }
                ] },
            2: { shots: [
                    { bg: 'sun', burst: true, music: 'heroic', cam: 'drift', actors: [{ k: 'barista', x: 8, b: 3, h: 70, a: 'in-left', d: 0.2 }, { k: 'coffeebag', x: 40, b: 8, h: 34, a: 'pop', d: 0.8, idle: 'bob' }, { k: 'cozybear', r: 8, b: 3, h: 60, a: 'in-right', d: 0.4 }], bub: { x: 6, y: 6, d: 1.2 }, sfx: { r: 3, y: 3, d: 1.8, s: 22, c: 'orange' }, snd: [[1.8, 'sparkle']] },
                    { bg: 'nightred', music: 'villain', cam: 'zoom', svg: SVG_ANGRY, shakeAt: 1.0, sfx: { r: 3, y: 4, d: 1.0, s: 22 }, bub: { x: 6, y: 8, d: 1.8, evil: true }, snd: [[1.0, 'boom']] },
                    { bg: 'green', burst: true, music: 'villain', cam: 'drift', actors: [{ k: 'matcha', x: 34, b: 6, h: 66, a: 'drop', d: 0.3, idle: 'bob' }], rain: ['matcha', 'matcha', 'leaf'], sfx: { r: 2, y: 3, d: 1.1, s: 24, c: 'green' }, snd: [[0.3, 'whoosh'], [1.1, 'splash']] },
                    { bg: 'teal', burst: true, music: 'heroic', cam: 'drift', actors: [{ k: 'barista', x: 6, b: 3, h: 70, a: 'in-left', d: 0.2 }, { k: 'matcha', x: 40, b: 12, h: 40, a: 'drop', d: 0.5, idle: 'bob' }, { k: 'espresso', r: 10, b: 10, h: 42, a: 'in-right', d: 0.9, idle: 'bob' }], sfx: { x: 40, y: 8, d: 1.0, s: 24, c: 'orange' }, bub: { x: 4, y: 4, d: 1.6 }, snd: [[1.0, 'sparkle']] }
                ] },
            3: { shots: [
                    { bg: 'sun', burst: true, music: 'heroic', cam: 'drift', svg: SVG_FESTIVAL, actors: [{ k: 'bakingbear', x: 34, b: 2, h: 70, a: 'in-bottom', d: 0.2, idle: 'bob' }], rain: ['cupcake', 'cake', 'croissant'], bub: { x: 4, y: 26, d: 1.2 }, snd: [[1.2, 'sparkle']] },
                    { bg: 'night', music: 'villain', cam: 'zoom', svg: SVG_OVEN, shakeAt: 1.1, sfx: { r: 3, y: 4, d: 1.1, s: 22, c: 'teal' }, bub: { x: 4, y: 6, d: 1.8, evil: true }, snd: [[1.1, 'boom']] },
                    { bg: 'pink', burst: true, music: 'heroic', cam: 'zoom', actors: [{ k: 'cupcake', x: 10, b: 10, h: 40, a: 'in-left', d: 0.2, idle: 'bob' }, { k: 'cake', x: 38, b: 6, h: 50, a: 'pop', d: 0.7, idle: 'bob' }, { k: 'cupcake', r: 10, b: 10, h: 40, a: 'in-right', d: 0.3, idle: 'bob' }], rain: ['cupcake'], sfx: { x: 36, y: 3, d: 1.2, s: 28, c: 'orange' }, snd: [[1.2, 'sparkle']] },
                    { bg: 'orange', burst: true, music: 'heroic', cam: 'zoom', actors: [{ k: 'barista', x: 6, b: 3, h: 72, a: 'in-left', d: 0.2 }, { k: 'bakingbear', x: 38, b: 3, h: 62, a: 'in-bottom', d: 0.5 }, { k: 'cozybear', r: 6, b: 3, h: 62, a: 'in-right', d: 0.4 }], bub: { x: 4, y: 6, d: 1.2 }, snd: [[1.2, 'pop']] }
                ] },
            4: { shots: [
                    { bg: 'cream', music: 'cozy', cam: 'drift', svg: SVG_FARM, actors: [{ k: 'cozybear', x: 6, b: 4, h: 52, a: 'in-left', d: 0.3 }], bub: { r: 6, y: 8, d: 1.3 }, snd: [[1.3, 'pop']] },
                    { bg: 'nightred', music: 'villain', cam: 'zoom', svg: SVG_ANGRY, shakeAt: 1.0, sfx: { r: 3, y: 4, d: 1.0, s: 24 }, bub: { x: 4, y: 6, d: 1.7, evil: true }, snd: [[1.0, 'boom']] },
                    { bg: 'green', burst: true, music: 'heroic', cam: 'zoom', actors: [{ k: 'coffeebag', x: 8, b: 8, h: 44, a: 'in-left', d: 0.2, idle: 'bob' }, { k: 'coffeebag', x: 38, b: 12, h: 52, a: 'pop', d: 0.6, idle: 'bob' }, { k: 'coffeebag', r: 8, b: 8, h: 44, a: 'in-right', d: 0.3, idle: 'bob' }], rain: ['leaf', 'bloom', 'goldenbean'], sfx: { x: 34, y: 2, d: 1.2, s: 30, c: 'green' }, snd: [[1.2, 'sparkle']] },
                    { bg: 'teal', burst: true, music: 'heroic', cam: 'zoom', actors: [{ k: 'barista', x: 8, b: 3, h: 74, a: 'in-left', d: 0.2 }, { k: 'goldenbean', x: 42, b: 10, h: 26, a: 'pop', d: 0.9, idle: 'bob' }, { k: 'cozybear', r: 8, b: 3, h: 64, a: 'in-right', d: 0.4 }], bub: { x: 4, y: 6, d: 1.2 }, snd: [[1.2, 'pop']] }
                ] },
            5: { shots: [
                    { bg: 'purple', music: 'battle', cam: 'zoom', svgFn: () => SVG_CASTLE(), shakeAt: 1.4, sfx: { r: 3, y: 4, d: 1.4, s: 22 }, snd: [[0.2, 'whoosh'], [1.4, 'boom']] },
                    { bg: 'syrup', music: 'battle', cam: 'drift', svg: SVG_FLOOD, sfx: { x: 6, y: 6, d: 0.9, s: 20, c: 'orange' }, snd: [[0.9, 'splash']] },
                    { bg: 'pink', burst: true, music: 'heroic', cam: 'drift', actors: [{ k: 'stamp', x: 32, b: 8, h: 64, a: 'stamp', d: 0.4 }], rain: ['stamp'], bub: { x: 4, y: 6, d: 1.3 }, snd: [[0.6, 'stamp'], [1.3, 'pop']] },
                    { bg: 'orange', burst: true, music: 'battle', cam: 'zoom', actors: [{ k: 'barista', x: 6, b: 3, h: 74, a: 'in-left', d: 0.2 }, { k: 'goldenbean', x: 42, b: 10, h: 26, a: 'pop', d: 0.9, idle: 'bob' }, { k: 'cozybear', r: 6, b: 3, h: 64, a: 'in-right', d: 0.4 }], bub: { x: 4, y: 6, d: 1.2 }, sfx: { r: 3, y: 3, d: 1.9, s: 22 }, snd: [[1.9, 'boom']] }
                ] },
            6: { shots: [
                    { bg: 'purple', music: 'battle', cam: 'zoom', svg: SVG_RUINS, shakeAt: 0.4, sfx: { r: 3, y: 4, d: 0.4, s: 24 }, snd: [[0.4, 'crash']] },
                    { bg: 'sun', burst: true, music: 'victory', cam: 'drift', actors: [{ k: 'bakingbear', x: 36, b: 2, h: 70, a: 'in-bottom', d: 0.2, idle: 'bob' }], rain: ['cupcake', 'croissant', 'goldenbean', 'bloom', 'cake'], sfx: { r: 3, y: 4, d: 1.0, s: 22 }, snd: [[1.0, 'sparkle']] },
                    { bg: 'pink', burst: true, music: 'victory', cam: 'zoom', hearts: true, actors: [{ k: 'barista', x: 16, b: 3, h: 74, a: 'in-left', d: 0.2 }, { k: 'cozybear', r: 16, b: 3, h: 64, a: 'in-right', d: 0.2 }], bub: { x: 26, y: 5, d: 1.2 }, snd: [[1.2, 'sparkle']] },
                    { bg: 'cream', music: 'victory', cam: 'drift', end: true, hearts: true, actors: [{ k: 'book', x: 39, b: 22, h: 46, a: 'pop', d: 0.3, idle: 'bob' }], snd: [[0.3, 'sparkle']] }
                ] }
        };

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

        const StoryPlayer = {
            id: 0, idx: 0, timers: [], typing: [],
            later(fn, ms) { const t = setTimeout(fn, ms); this.timers.push(t); return t; },
            clear() { this.timers.forEach(clearTimeout); this.timers = []; this.typing = []; },
            theme() { const s = STORIES[this.id]; return s ? (s.shots[this.idx].music || 'cozy') : null; },
            txt() { return STORY_TXT[CUR_LANG()][this.id]; },
            play(id) {
                this.id = id; this.idx = 0;
                const tx = this.txt();
                $('st-title').textContent = tx.title;
                $('st-issue').textContent = tx.issue;
                $('st-stage').innerHTML = '';
                const dots = $('st-dots'); dots.innerHTML = '';
                STORIES[id].shots.forEach(() => dots.appendChild(document.createElement('i')));
                switchScreen('screen-story');
                stopCasinoMusic(); stopBonusMusic();
                this.show(0);
            },
            show(i) {
                this.clear();
                const st = STORIES[this.id], sh = st.shots[i], tx = this.txt(), stx = tx.shots[i];
                this.idx = i;
                const stage = $('st-stage');
                const old = stage.querySelector('.shot:not(.leave)');
                if (old) { old.classList.add('leave'); setTimeout(() => old.remove(), 500); }

                const el = document.createElement('div');
                el.className = 'shot enter cam-' + (sh.cam || 'drift');
                let h = `<div class="art bg-${sh.bg}">${sh.burst ? '<div class="burst"></div>' : ''}${sh.svgFn ? sh.svgFn() : (sh.svg || '')}</div>`;
                h += `<span class="tag">${stx.tag}</span>`;
                (sh.actors || []).forEach(a => {
                    const pos = (a.x !== undefined ? `left:${a.x}%;` : `right:${a.r}%;`) + `bottom:${a.b}%;height:${a.h}%;--d:${a.d}s`;
                    h += `<div class="actor ${a.a}" style="${pos}"><img class="ink ${a.idle ? 'idle-' + a.idle : ''}" src="${ASSETS.sym[a.k]}" alt=""></div>`;
                });
                if (sh.rain) for (let k = 0; k < 14; k++) {
                    const key = sh.rain[k % sh.rain.length];
                    h += `<img class="rainy" src="${ASSETS.sym[key]}" alt="" style="left:${Math.random() * 92}%;width:${7 + Math.random() * 6}%;animation-delay:${(0.3 + Math.random() * 3).toFixed(2)}s;animation-duration:${(2.6 + Math.random() * 2).toFixed(2)}s">`;
                }
                if (sh.hearts) for (let k = 0; k < 10; k++) h += `<span class="heart" style="left:${8 + Math.random() * 84}%;animation-delay:${(0.5 + Math.random() * 3).toFixed(2)}s">❤</span>`;
                if (sh.sfx && stx.sfx) {
                    const p = (sh.sfx.x !== undefined ? `left:${sh.sfx.x}%;` : `right:${sh.sfx.r}%;`) + `top:${sh.sfx.y}%;--d:${sh.sfx.d}s;width:${sh.sfx.s}%;`;
                    h += `<div class="ssfx ${sh.sfx.c || ''}" style="${p}"><span>${stx.sfx}</span></div>`;
                }
                if (sh.bub && stx.bub) {
                    const p = (sh.bub.x !== undefined ? `left:${sh.bub.x}%;` : `right:${sh.bub.r}%;`) + `top:${sh.bub.y}%;--d:${sh.bub.d}s`;
                    h += `<div class="sbub ${sh.bub.evil ? 'evil' : ''}" style="${p}"><span></span></div>`;
                }
                if (sh.end) h += `<div class="the-end">${stx.tag}</div>`;
                el.innerHTML = h;
                stage.appendChild(el);
                setTimeout(() => el.classList.remove('enter'), 650);

                $('st-dots').querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k <= i));
                StoryMusic.start(sh.music || 'cozy');
                StoryMusic.sfx('whoosh');
                (sh.snd || []).forEach(s => this.later(() => StoryMusic.sfx(s[1]), s[0] * 1000));
                if (sh.shakeAt !== undefined) this.later(() => { el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 700); }, sh.shakeAt * 1000);
                if (sh.bub && stx.bub) this.typeInto(el.querySelector('.sbub span'), stx.bub, sh.bub.d * 1000 + 250, 34);
                const narr = $('st-narr');
                narr.textContent = '';
                const doneAt = this.typeInto(narr, stx.narr, 600, 22);

                const last = i === st.shots.length - 1;
                $('st-next').classList.toggle('hidden', last);
                $('st-skip').classList.toggle('hidden', last);
                const cta = $('st-cta');
                cta.innerHTML = '';
                cta.classList.toggle('hidden', !last);
                if (last) tx.cta.forEach((label, k) => {
                    const b = document.createElement('button');
                    b.className = 'btn-comic' + (k > 0 ? ' green' : '');
                    b.textContent = label;
                    b.onclick = () => { this.stop(); STORY_CTA[this.id][k](); };
                    cta.appendChild(b);
                });
                if (!last) this.later(() => this.next(), doneAt + 3600);
            },
            typeInto(node, text, delay, speed) {
                if (!node) return delay;
                const job = { node, text, done: false };
                this.typing.push(job);
                let k = 0;
                const tick = () => {
                    if (job.done) return;
                    k++;
                    node.textContent = text.slice(0, k);
                    if (k >= text.length) { job.done = true; return; }
                    this.later(tick, speed);
                };
                this.later(tick, delay);
                return delay + text.length * speed;
            },
            tap() {
                const pending = this.typing.filter(j => !j.done);
                if (pending.length) {
                    pending.forEach(j => { j.done = true; j.node.textContent = j.text; });
                    if (this.idx < STORIES[this.id].shots.length - 1) { this.timers.forEach(clearTimeout); this.timers = []; this.later(() => this.next(), 4200); }
                    return;
                }
                this.next();
            },
            next() {
                const st = STORIES[this.id];
                if (!st) return;
                if (this.idx < st.shots.length - 1) { playSynthNote(620, 0.04); this.show(this.idx + 1); }
            },
            skip() { const st = STORIES[this.id]; if (st) this.show(st.shots.length - 1); },
            stop() { this.clear(); StoryMusic.stop(); }
        };
        function playStory(id) {
            if (Game.save) { Game.save.seen['story' + id] = true; persist(); }
            StoryPlayer.play(id);
        }
