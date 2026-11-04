        /* =====================================================
           ZAMAN YOLCULUĞU SAGASI (6–100. bölümler): dönemler, bölüm adları, dönem güçleri
           Matematik engine.js'de (ERAS / CHAPTERS); burada yalnızca görünüş ve metin var.
           ===================================================== */
        const ERA_META = {
            egypt:     { ic: '🏺', col: '#E8B84A', col2: '#C0782A', sky: ['#FFD58A', '#F59E4C'], ground: '#E9C37A', years: { tr: 'MÖ 2500', en: '2500 BC' } },
            greece:    { ic: '🏛️', col: '#5FA8E8', col2: '#2F6FB5', sky: ['#BFE6FF', '#6FB8F0'], ground: '#E6DCC8', years: { tr: 'MÖ 450', en: '450 BC' } },
            viking:    { ic: '🛡️', col: '#6C8FA8', col2: '#2E4A62', sky: ['#1B2A4A', '#3B6A8A'], ground: '#DDE8F0', years: { tr: 'MS 900', en: 'AD 900' } },
            rome:      { ic: '🏟️', col: '#C0392B', col2: '#7A1E14', sky: ['#FFE0B0', '#F3A35C'], ground: '#D9C4A0', years: { tr: 'MS 100', en: 'AD 100' } },
            ottoman:   { ic: '🕌', col: '#C73E3A', col2: '#1F6B5A', sky: ['#FFD9A8', '#E8836A'], ground: '#CFC2A8', years: { tr: '1550–1720', en: '1550–1720' } },
            victorian: { ic: '🎩', col: '#6B5B4B', col2: '#2E2A26', sky: ['#B9B4AC', '#7E7A74'], ground: '#8A8580', years: { tr: '1880', en: '1880' } },
            france:    { ic: '🎈', col: '#3B5BA8', col2: '#C9A13B', sky: ['#DDE7FF', '#9FB4E8'], ground: '#BFD9A0', years: { tr: '1780', en: '1780' } },
            italy:     { ic: '🎨', col: '#B8613A', col2: '#3F7A3A', sky: ['#FFE8C4', '#E8A86A'], ground: '#D8B890', years: { tr: '1500', en: '1500' } },
            jazz:      { ic: '🎷', col: '#D4A72C', col2: '#1E1A2E', sky: ['#1A1433', '#5A2A6A'], ground: '#2A2438', years: { tr: '1925', en: '1925' } }
        };
        const SAGA_TXT = {
            tr: {
                eraWord: 'Dönem', chWord: 'Bölüm', buffWord: 'Dönem gücü', treasure: 'Zaman Hazinesi',
                era: {
                    egypt: { name: 'Antik Mısır', buff: 'Nil Bereketi', buffD: 'Reçete Kitabı düşme şansı +%5' },
                    greece: { name: 'Antik Yunan', buff: 'Zeus’un Şimşeği', buffD: 'Kahve Dede’nin çarpanları %30 daha sık düşer' },
                    viking: { name: 'Viking Çağı', buff: 'Yağma Seferi', buffD: 'Her free spin turu +2 spin' },
                    rome: { name: 'Roma İmparatorluğu', buff: 'Zafer Alayı', buffD: 'Tüm kazançlar (free spin dahil) +%30' },
                    ottoman: { name: 'Osmanlı İmparatorluğu', buff: 'Kahvehane Muhabbeti', buffD: 'Genişleyen sembol +%30 öder, hat tamamlama şansı +%2' },
                    victorian: { name: 'Viktorya İngilteresi', buff: 'Buhar Gücü', buffD: 'Kaybeden her spinde bahsinin %20’si geri döner' },
                    france: { name: 'Aydınlanma Çağı Fransa', buff: 'Procope Salonu', buffD: 'Yüksek semboller (Bearista, MaviKuş, Fırıncı Ayı, Portafiltre) +%50 öder' },
                    italy: { name: 'Rönesans İtalya', buff: 'Usta İşi', buffD: 'Kahve sembolleri (V60, Espresso, AeroPress, Altın Çekirdek, Kruvasan) +%70 öder' },
                    jazz: { name: 'Caz Çağı New York', buff: 'Swing Ritmi', buffD: 'Free spin’de Dede çarpanları %35 daha sık' }
                },
                ch: {
                    egypt: ['Nil Kıyısı Kahvesi', 'Papirüs Pazarı', 'Giza’nın Gölgesi', 'Sfenks’in Bilmecesi', 'Karnak Sütunları', 'Kraliçeler Vadisi', 'Memphis Çarşısı', 'İskenderiye Feneri', 'Ebu Simbel', 'Firavunun Sarayı'],
                    greece: ['Atina Agorası', 'Delfi Kâhini', 'Olimpiyat Meşalesi', 'Sparta Kışlası', 'Girit Labirenti', 'Rodos Limanı', 'Efes Tiyatrosu', 'Truva Atı', 'Akropolis Terası', 'Olimpos Zirvesi'],
                    viking: ['Fiyort Köyü', 'Uzun Gemi İskelesi', 'Rün Taşları', 'Kuzey Işıkları', 'Buzul Mağarası', 'Ejder Pruva', 'Thing Meclisi', 'İzlanda Gayzerleri', 'Valhalla Kapısı', 'Odin’in Salonu'],
                    rome: ['Tiber Kıyısı', 'Forum Romanum', 'Su Kemerleri', 'Pompeii Fırınları', 'Roma Hamamı', 'Appia Yolu', 'Circus Maximus', 'Pantheon Kubbesi', 'Kolezyum Arenası', 'Sezar’ın Sarayı'],
                    ottoman: ['Tahtakale Kahvehanesi', 'Mısır Çarşısı', 'Kapalıçarşı', 'Galata Kulesi', 'Haliç Kayıkları', 'Süleymaniye Avlusu', 'Lale Bahçesi', 'Karagöz Perdesi', 'Boğaz Yalısı', 'Kız Kulesi', 'Bursa İpek Hanı', 'Topkapı Mutfakları', 'Mehter Meydanı', 'Lale Devri Sarayı', 'Sultanın Kahvesi'],
                    victorian: ['Londra Sisi', 'Buharlı Tren İstasyonu', 'Baker Sokağı', 'Kristal Saray', 'Thames Rıhtımı', 'Saat Kulesi', 'Kraliyet Çay Salonu', 'Buhar Atölyesi', 'Gaz Lambası Sokağı', 'Kraliçenin Balosu'],
                    france: ['Café Procope', 'Paris Salonu', 'Ansiklopedi Matbaası', 'Seine Kıyısı', 'Montgolfier Balonu', 'Bilimler Akademisi', 'Versay Bahçeleri', 'Aynalı Salon', 'Opera Kulisi', 'Işıklar Şehri'],
                    italy: ['Floransa Atölyesi', 'Medici Sarayı', 'Duomo Kubbesi', 'Venedik Kanalları', 'Rialto Köprüsü', 'Uçan Makine Taslağı', 'Sistina Tavanı', 'Pisa Kulesi', 'Murano Camcıları', 'Rönesans Şöleni'],
                    jazz: ['Harlem Kulübü', 'Broadway Işıkları', 'Gizli Kahve Barı', 'Caz Treni', 'Gökdelen İskelesi', 'Coney Adası', 'Radyo Stüdyosu', 'Charleston Pisti', 'Özgürlük Heykeli', 'Zamanın Kahvesi']
                },
                // bölüm girişi şeridi: dönem başına birkaç replik (bölüme göre döner)
                lines: {
                    egypt: [['barista', 'Kum fırtınası mı? Kahveyi kumda pişiririz, hem de kum kahvesi!'], ['cozybear', 'Firavunun aşçıbaşı bizim kahveyi duymuş!'], ['dede', 'Bu kervan kahve kokuyor evlat, takip edelim!'], ['bakingbear', 'Papirüse tarif yazdım: hurmalı kruvasan!']],
                    greece: [['barista', 'Agorada herkes filozof, ama kimse iyi kahve yapamıyor!'], ['cozybear', 'Kâhin söyledi: bugün çifte şimşek var!'], ['dede', 'Zeus bile köpüklü kahve istiyor, hadi bakalım!'], ['bakingbear', 'Zeytinyağlı poğaçalar fırında!']],
                    viking: [['barista', 'Buz gibi soğuk! Tam sıcak kahve havası!'], ['cozybear', 'Uzun gemiler limana girdi, sefere çıkıyoruz!'], ['dede', 'Rünler diyor ki: bol köpük, bol ganimet!'], ['bakingbear', 'Tarçınlı çörekler… Vikingler bayılacak!']],
                    rome: [['barista', 'Bütün yollar bizim kahveciye çıkıyor!'], ['cozybear', 'Gladyatörler bile mola veriyor, kahve molası!'], ['dede', 'Sezar gelsin, gördüğü kahveyi beğensin!'], ['bakingbear', 'Pompeii fırınları hâlâ sıcak, ekmek hazır!']],
                    ottoman: [['dede', 'İşte benim zamanım! Bir kahvenin kırk yıl hatırı vardır!'], ['barista', 'Cezve, köz, kum… Gerçek ustalık burada!'], ['cozybear', 'Kahvehanede Karagöz başlıyor, herkes kahvesini alsın!'], ['bakingbear', 'Lokumlar tepsiye dizildi!'], ['dede', 'Köpüğü kaçırma evlat, sultan bekliyor!']],
                    victorian: [['barista', 'Sis ağır ama kahve kokusu her yeri sarıyor!'], ['cozybear', 'Buharlı makinemiz tıkır tıkır çalışıyor!'], ['dede', 'Saat beşte çay mı? Biz kahve demleriz!'], ['bakingbear', 'Scone’lar fırından çıktı!']],
                    france: [['barista', 'Salonda fikirler kaynıyor, kahve de öyle!'], ['cozybear', 'Balonla Paris’in üstünden kahve dağıtıyoruz!'], ['dede', 'Ansiklopediye bir madde yazalım: “Türk kahvesi”!'], ['bakingbear', 'Kruvasanlar tam Paris usulü!']],
                    italy: [['barista', 'Sanatçılar boya karıştırıyor, biz espresso!'], ['cozybear', 'Venedik kanallarında gondol kahvesi!'], ['dede', 'Üstat bir makine çizmiş… Bu bir kahve makinesi!'], ['bakingbear', 'Biscotti’ler kahveye batırmalık!']],
                    jazz: [['barista', 'Caz başlasın, kahveler swing’le demlensin!'], ['cozybear', 'Broadway ışıkları altında latte art!'], ['dede', 'Bu ritim bana gençliğimi hatırlattı evlat!'], ['bakingbear', 'Donutlar sahneye!']]
                },
                comic: {
                    skip: 'GEÇ ⏭', next: 'DEVAM ▶', go: 'MACERAYA DEVAM ☕',
                    tm: [
                        { title: 'SAYI #6 · ZAMAN MAKİNESİ', panels: [
                            { cap: 'Şurup Kalesi’nin son kulesi de devrildi…', sfx: 'KABOOM!' },
                            { cap: 'SyruppoLab’ın dev şurup robotu yere serildi.', bub: ['villain', 'Bu… bu imkânsız! Şurupsuz bir dünya mı?!'] },
                            { cap: 'Kasaba sevinçten çılgına döndü!', bub: ['cozybear', 'BAŞARDIK BEARISTA!'] },
                            { cap: 'O gece Kahve Dede herkesi dükkânın bodrumuna çağırdı…', bub: ['dede', 'Sizi yıllardır sakladığım bir şeyle tanıştırayım evlatlar…'] }
                        ] },
                        { title: 'SAYI #6 · ZAMAN MAKİNESİ', panels: [
                            { cap: 'Pirinç borular, çark çark dişliler ve kocaman bir cezve: ZAMAN MAKİNESİ!', sfx: 'VIZZZ!' },
                            { bub: ['barista', 'Syruppolabs yenildi, şimdi tarihin her döneminde en güzel kahveyi ve kahveciyi yapma zamanı!'] },
                            { cap: 'Kadran ayarlandı: MÖ 2500 · NİL KIYISI', bub: ['dede', 'Kemerleri bağlayın, köpük kaçmasın!'] },
                            { cap: 'Ve tarih boyunca sürecek bir kahve macerası başladı…', sfx: 'VUUŞŞ!' }
                        ] }
                    ],
                    era: {
                        egypt: { title: 'SAYI #7 · ANTİK MISIR', panels: [
                            { cap: 'MÖ 2500. Zaman makinesi Nil’in kıyısına kondu.', sfx: 'PUFF!' },
                            { cap: 'Piramitlerin gölgesinde kervanlar, pazarlar… ama tek bir kahveci yok!', bub: ['cozybear', 'Burası çok sıcak! Buzlu kahve şart!'] },
                            { bub: ['dede', 'Firavunun sarayına kadar her şehre bir kahve ocağı kuracağız!'] },
                            { cap: 'DÖNEM GÜCÜ: NİL BEREKETİ — Reçete Kitabı şansı +%5', sfx: 'BEREKET!' }
                        ] },
                        greece: { title: 'SAYI #8 · ANTİK YUNAN', panels: [
                            { cap: 'MÖ 450. Atina. Mermer sütunlar ve bitmeyen tartışmalar.', sfx: 'VUUŞŞ!' },
                            { bub: ['barista', 'Filozoflar uykusuz kalmış, bize ihtiyaçları var!'] },
                            { cap: 'Olimpos’tan bir şimşek çaktı… Zeus da bir fincan istiyor!', sfx: 'ÇATIRT!' },
                            { cap: 'DÖNEM GÜCÜ: ZEUS’UN ŞİMŞEĞİ — Dede çarpanları %30 daha sık', bub: ['dede', 'Şimşekten çarpan olur mu? Olur!'] }
                        ] },
                        viking: { title: 'SAYI #9 · VİKİNG ÇAĞI', panels: [
                            { cap: 'MS 900. Kuzey. Buz, fiyort ve uzun gemiler.', sfx: 'BRRR!' },
                            { bub: ['cozybear', 'Kuzey ışıkları ne güzel… ama donuyorum!'] },
                            { cap: 'Viking reisi kocaman bir boynuz kupa uzattı.', bub: ['barista', 'Bal likörü yerine sıcak kahve? Anlaştık!'] },
                            { cap: 'DÖNEM GÜCÜ: YAĞMA SEFERİ — her free spin turu +2 spin', sfx: 'SEFER!' }
                        ] },
                        rome: { title: 'SAYI #10 · ROMA İMPARATORLUĞU', panels: [
                            { cap: 'MS 100. Bütün yollar Roma’ya çıkıyor.', sfx: 'TRAK TRAK!' },
                            { bub: ['bakingbear', 'Pompeii’nin fırınları! Burada harika ekmek yaparım!'] },
                            { cap: 'Kolezyum’da herkes zafer alayını bekliyor.', bub: ['dede', 'Alayın önünde bizim kahve arabası olacak!'] },
                            { cap: 'DÖNEM GÜCÜ: ZAFER ALAYI — tüm kazançlar +%30', sfx: 'ZAFER!' }
                        ] },
                        ottoman: { title: 'SAYI #11 · OSMANLI İMPARATORLUĞU', panels: [
                            { cap: '1550. İstanbul. Dünyanın ilk kahvehaneleri Tahtakale’de açılıyor!', sfx: 'MAAŞALLAH!' },
                            { bub: ['dede', 'Burası benim memleketim evlatlar! Cezveler hazır mı?'] },
                            { cap: 'Kahvehanelerde Karagöz, şiir, tavla… ve köpüklü Türk kahvesi.', bub: ['cozybear', 'Bir kahvenin kırk yıl hatırı varmış!'] },
                            { cap: 'DÖNEM GÜCÜ: KAHVEHANE MUHABBETİ — genişleyen sembol +%30, hat tamamlama +%2', sfx: 'KÖPÜK!' }
                        ] },
                        victorian: { title: 'SAYI #12 · VİKTORYA İNGİLTERESİ', panels: [
                            { cap: '1880. Londra. Sis, gaz lambaları ve buharlı makineler.', sfx: 'ÇUF ÇUF!' },
                            { bub: ['barista', 'Herkes çay içiyor… Onlara kahveyi sevdireceğiz!'] },
                            { cap: 'Dede buharlı bir espresso makinesi icat etti!', bub: ['dede', 'Buhar basıncı tamam, makaralar tıkır tıkır!'] },
                            { cap: 'DÖNEM GÜCÜ: BUHAR GÜCÜ — kaybeden spinde bahsin %20’si geri', sfx: 'FIŞŞŞ!' }
                        ] },
                        france: { title: 'SAYI #13 · AYDINLANMA ÇAĞI FRANSA', panels: [
                            { cap: '1780. Paris. Café Procope’ta fikirler kaynıyor.', sfx: 'VOİLÀ!' },
                            { bub: ['cozybear', 'Gökyüzünde bir balon var! İçinde koyun, ördek ve horoz!'] },
                            { cap: 'Salonun ünlüleri en iyi kahveyi yapana ödül verecek.', bub: ['barista', 'Ünlü misafirlere ünlü fincanlar!'] },
                            { cap: 'DÖNEM GÜCÜ: PROCOPE SALONU — yüksek semboller +%50', sfx: 'BRAVO!' }
                        ] },
                        italy: { title: 'SAYI #14 · RÖNESANS İTALYA', panels: [
                            { cap: '1500. Floransa. Atölyelerde boya ve mermer tozu.', sfx: 'ŞIPP!' },
                            { bub: ['bakingbear', 'Bu kubbe… kocaman bir kek kalıbına benziyor!'] },
                            { cap: 'Bir usta defterine tuhaf bir makine çizmiş.', bub: ['dede', 'Bu bir uçan makine değil… Bu bir ESPRESSO makinesi!'] },
                            { cap: 'DÖNEM GÜCÜ: USTA İŞİ — kahve sembolleri +%70', sfx: 'BELLİSSİMO!' }
                        ] },
                        jazz: { title: 'SAYI #15 · CAZ ÇAĞI NEW YORK', panels: [
                            { cap: '1925. New York. Gökdelenler, neon ve caz!', sfx: 'BAP-BA-DUP!' },
                            { bub: ['barista', 'Son durak! Tarihin en güzel kahvesini burada yapacağız!'] },
                            { cap: 'Ama gölgede tanıdık bir siluet var… Şurup kokusu!', bub: ['villain', 'Zamanda bile peşinizdeyim! Bu şehir ŞURUP içecek!'] },
                            { cap: 'DÖNEM GÜCÜ: SWING RİTMİ — free spin’de çarpanlar %35 daha sık', sfx: 'SWING!' }
                        ] }
                    },
                    finale: { title: 'SAYI #100 · ZAMANIN KAHVESİ', panels: [
                        { cap: 'Özgürlük Heykeli’nin meşalesinde son düello: SyruppoLab’ın zaman robotu!', sfx: 'KRAANG!' },
                        { cap: 'Tarihin bütün dönemlerinden dostlar kahveleriyle yetişti!', bub: ['cozybear', 'Firavun, Viking reisi, Sezar… hepsi burada!'] },
                        { bub: ['villain', 'Ah… bu kahve… şuruptan bile güzel…'], sfx: 'POF!' },
                        { cap: 'Ve böylece Bearista ile ekibi, tarihin her döneminde en güzel kahveyi yapan kahveciler oldu.', bub: ['dede', 'Bir kahvenin kırk yıl hatırı vardır… Bizimkinin beş bin yıl!'] }
                    ] }
                },
                lever: 'kol'
            },
            en: {
                eraWord: 'Era', chWord: 'Chapter', buffWord: 'Era power', treasure: 'Time Treasure',
                era: {
                    egypt: { name: 'Ancient Egypt', buff: 'Bounty of the Nile', buffD: 'Recipe Book chance +5%' },
                    greece: { name: 'Ancient Greece', buff: 'Zeus’s Thunderbolt', buffD: 'Grandpa Brew’s multipliers drop 30% more often' },
                    viking: { name: 'Viking Age', buff: 'Raiding Voyage', buffD: 'Every free spin round +2 spins' },
                    rome: { name: 'Roman Empire', buff: 'Triumphal Parade', buffD: 'All wins (free spins included) +30%' },
                    ottoman: { name: 'Ottoman Empire', buff: 'Coffeehouse Chat', buffD: 'Expanding symbol pays +30%, line completion chance +2%' },
                    victorian: { name: 'Victorian England', buff: 'Steam Power', buffD: '20% of your bet comes back on every losing spin' },
                    france: { name: 'Enlightenment France', buff: 'Procope Salon', buffD: 'High symbols (Bearista, BlueBird, Baker Bear, Portafilter) pay +50%' },
                    italy: { name: 'Renaissance Italy', buff: 'Master’s Touch', buffD: 'Coffee symbols (V60, Espresso, AeroPress, Golden Bean, Croissant) pay +70%' },
                    jazz: { name: 'Jazz Age New York', buff: 'Swing Rhythm', buffD: 'Grandpa’s multipliers 35% more often in free spins' }
                },
                ch: {
                    egypt: ['Nile Bank Café', 'Papyrus Market', 'Shadow of Giza', 'Riddle of the Sphinx', 'Pillars of Karnak', 'Valley of the Queens', 'Memphis Bazaar', 'Lighthouse of Alexandria', 'Abu Simbel', 'The Pharaoh’s Palace'],
                    greece: ['Agora of Athens', 'Oracle of Delphi', 'Olympic Flame', 'Sparta Barracks', 'Labyrinth of Crete', 'Harbour of Rhodes', 'Theatre of Ephesus', 'The Trojan Horse', 'Acropolis Terrace', 'Summit of Olympus'],
                    viking: ['Fjord Village', 'Longship Pier', 'Rune Stones', 'Northern Lights', 'Glacier Cave', 'Dragon Prow', 'The Thing Assembly', 'Geysers of Iceland', 'Gates of Valhalla', 'Hall of Odin'],
                    rome: ['Banks of the Tiber', 'Forum Romanum', 'The Aqueducts', 'Bakeries of Pompeii', 'Roman Baths', 'Appian Way', 'Circus Maximus', 'Pantheon Dome', 'Colosseum Arena', 'Caesar’s Palace'],
                    ottoman: ['Tahtakale Coffeehouse', 'Spice Bazaar', 'Grand Bazaar', 'Galata Tower', 'Golden Horn Boats', 'Süleymaniye Courtyard', 'Tulip Garden', 'Shadow-Play Stage', 'Bosphorus Mansion', 'Maiden’s Tower', 'Silk Inn of Bursa', 'Topkapı Kitchens', 'Mehter Square', 'Tulip Era Palace', 'The Sultan’s Coffee'],
                    victorian: ['London Fog', 'Steam Station', 'Baker Street', 'Crystal Palace', 'Thames Docks', 'Clock Tower', 'Royal Tea Room', 'Steam Workshop', 'Gaslight Lane', 'The Queen’s Ball'],
                    france: ['Café Procope', 'Paris Salon', 'Encyclopédie Press', 'Banks of the Seine', 'Montgolfier Balloon', 'Academy of Sciences', 'Gardens of Versailles', 'Hall of Mirrors', 'Opera Backstage', 'City of Light'],
                    italy: ['Florence Workshop', 'Medici Palace', 'The Duomo', 'Venice Canals', 'Rialto Bridge', 'Flying Machine Sketch', 'Sistine Ceiling', 'Tower of Pisa', 'Murano Glassmakers', 'Renaissance Feast'],
                    jazz: ['Harlem Club', 'Broadway Lights', 'Speakeasy Café', 'Jazz Train', 'Skyscraper Girders', 'Coney Island', 'Radio Studio', 'Charleston Floor', 'Statue of Liberty', 'The Coffee of Time']
                },
                lines: {
                    egypt: [['barista', 'A sandstorm? We’ll brew coffee in hot sand!'], ['cozybear', 'The Pharaoh’s head cook heard about our coffee!'], ['dede', 'That caravan smells of coffee, kiddo. Let’s follow it!'], ['bakingbear', 'I wrote a recipe on papyrus: date croissants!']],
                    greece: [['barista', 'Everyone at the agora is a philosopher, but nobody can brew!'], ['cozybear', 'The oracle says: double lightning today!'], ['dede', 'Even Zeus wants a frothy coffee!'], ['bakingbear', 'Olive-oil pastries in the oven!']],
                    viking: [['barista', 'Freezing! Perfect hot coffee weather!'], ['cozybear', 'The longships are in, we set sail!'], ['dede', 'The runes say: lots of foam, lots of loot!'], ['bakingbear', 'Cinnamon buns… the Vikings will love them!']],
                    rome: [['barista', 'All roads lead to our coffee cart!'], ['cozybear', 'Even gladiators take a coffee break!'], ['dede', 'Let Caesar come, see and like our coffee!'], ['bakingbear', 'The ovens of Pompeii are still warm!']],
                    ottoman: [['dede', 'This is my era! A cup of coffee is remembered for forty years!'], ['barista', 'Cezve, embers, sand… real craft lives here!'], ['cozybear', 'The shadow play starts, grab your coffee!'], ['bakingbear', 'Turkish delight on the tray!'], ['dede', 'Don’t lose the foam, the Sultan is waiting!']],
                    victorian: [['barista', 'The fog is thick but the coffee smell is everywhere!'], ['cozybear', 'Our steam machine is ticking along!'], ['dede', 'Tea at five? We brew coffee!'], ['bakingbear', 'Scones are out of the oven!']],
                    france: [['barista', 'Ideas are brewing in the salon, and so is coffee!'], ['cozybear', 'We’re serving coffee from a balloon over Paris!'], ['dede', 'Let’s write an encyclopedia entry: “Turkish coffee”!'], ['bakingbear', 'Croissants, the Paris way!']],
                    italy: [['barista', 'Artists mix paint, we mix espresso!'], ['cozybear', 'Gondola coffee on the canals of Venice!'], ['dede', 'The master drew a machine… it’s a coffee machine!'], ['bakingbear', 'Biscotti for dunking!']],
                    jazz: [['barista', 'Let the jazz start, coffee brewed with swing!'], ['cozybear', 'Latte art under the Broadway lights!'], ['dede', 'This rhythm takes me back, kiddo!'], ['bakingbear', 'Donuts on stage!']]
                },
                comic: {
                    skip: 'SKIP ⏭', next: 'NEXT ▶', go: 'CONTINUE THE ADVENTURE ☕',
                    tm: [
                        { title: 'ISSUE #6 · THE TIME MACHINE', panels: [
                            { cap: 'The last tower of Syrup Castle came crashing down…', sfx: 'KABOOM!' },
                            { cap: 'SyruppoLab’s giant syrup robot hit the ground.', bub: ['villain', 'Im… impossible! A world without syrup?!'] },
                            { cap: 'The whole town went wild with joy!', bub: ['cozybear', 'WE DID IT, BEARISTA!'] },
                            { cap: 'That night Grandpa Brew called everyone down to the café cellar…', bub: ['dede', 'Let me show you something I’ve kept hidden for years, kids…'] }
                        ] },
                        { title: 'ISSUE #6 · THE TIME MACHINE', panels: [
                            { cap: 'Brass pipes, spinning gears and a giant cezve: a TIME MACHINE!', sfx: 'VZZZ!' },
                            { bub: ['barista', 'SyruppoLab is beaten. Now it’s time to make the finest coffee and be the finest baristas in every era of history!'] },
                            { cap: 'Dial set: 2500 BC · BANKS OF THE NILE', bub: ['dede', 'Buckle up, don’t spill the foam!'] },
                            { cap: 'And so began a coffee adventure across all of history…', sfx: 'WHOOSH!' }
                        ] }
                    ],
                    era: {
                        egypt: { title: 'ISSUE #7 · ANCIENT EGYPT', panels: [
                            { cap: '2500 BC. The time machine lands on the banks of the Nile.', sfx: 'POOF!' },
                            { cap: 'Caravans and markets in the shadow of the pyramids… but not one coffee shop!', bub: ['cozybear', 'It’s so hot here! We need iced coffee!'] },
                            { bub: ['dede', 'We’ll open a coffee stove in every city, all the way to the Pharaoh’s palace!'] },
                            { cap: 'ERA POWER: BOUNTY OF THE NILE — Recipe Book chance +5%', sfx: 'BOUNTY!' }
                        ] },
                        greece: { title: 'ISSUE #8 · ANCIENT GREECE', panels: [
                            { cap: '450 BC. Athens. Marble columns and endless debates.', sfx: 'WHOOSH!' },
                            { bub: ['barista', 'The philosophers haven’t slept, they need us!'] },
                            { cap: 'Lightning flashes over Olympus… Zeus wants a cup too!', sfx: 'KRAK!' },
                            { cap: 'ERA POWER: ZEUS’S THUNDERBOLT — Grandpa’s multipliers 30% more often', bub: ['dede', 'Multipliers from lightning? Why not!'] }
                        ] },
                        viking: { title: 'ISSUE #9 · VIKING AGE', panels: [
                            { cap: 'AD 900. The North. Ice, fjords and longships.', sfx: 'BRRR!' },
                            { bub: ['cozybear', 'The northern lights are beautiful… but I’m freezing!'] },
                            { cap: 'The Viking chief holds out a huge drinking horn.', bub: ['barista', 'Hot coffee instead of mead? Deal!'] },
                            { cap: 'ERA POWER: RAIDING VOYAGE — every free spin round +2 spins', sfx: 'SAIL!' }
                        ] },
                        rome: { title: 'ISSUE #10 · ROMAN EMPIRE', panels: [
                            { cap: 'AD 100. All roads lead to Rome.', sfx: 'CLIP CLOP!' },
                            { bub: ['bakingbear', 'The ovens of Pompeii! I can bake wonders here!'] },
                            { cap: 'Everyone at the Colosseum awaits the triumphal parade.', bub: ['dede', 'Our coffee cart will lead the parade!'] },
                            { cap: 'ERA POWER: TRIUMPHAL PARADE — all wins +30%', sfx: 'VICTORY!' }
                        ] },
                        ottoman: { title: 'ISSUE #11 · OTTOMAN EMPIRE', panels: [
                            { cap: '1550. Istanbul. The world’s first coffeehouses open in Tahtakale!', sfx: 'MASHALLAH!' },
                            { bub: ['dede', 'This is my homeland, kids! Are the cezves ready?'] },
                            { cap: 'Shadow plays, poetry, backgammon… and frothy Turkish coffee.', bub: ['cozybear', 'They say a cup of coffee is remembered for forty years!'] },
                            { cap: 'ERA POWER: COFFEEHOUSE CHAT — expanding symbol +30%, line completion +2%', sfx: 'FOAM!' }
                        ] },
                        victorian: { title: 'ISSUE #12 · VICTORIAN ENGLAND', panels: [
                            { cap: '1880. London. Fog, gas lamps and steam engines.', sfx: 'CHOO CHOO!' },
                            { bub: ['barista', 'Everyone drinks tea… we’ll make them love coffee!'] },
                            { cap: 'Grandpa invented a steam-powered espresso machine!', bub: ['dede', 'Steam pressure is up, the reels are ticking!'] },
                            { cap: 'ERA POWER: STEAM POWER — 20% of your bet back on losing spins', sfx: 'HISSSS!' }
                        ] },
                        france: { title: 'ISSUE #13 · ENLIGHTENMENT FRANCE', panels: [
                            { cap: '1780. Paris. Ideas are brewing at Café Procope.', sfx: 'VOILÀ!' },
                            { bub: ['cozybear', 'There’s a balloon in the sky! With a sheep, a duck and a rooster!'] },
                            { cap: 'The salon’s celebrities will reward the best coffee.', bub: ['barista', 'Famous cups for famous guests!'] },
                            { cap: 'ERA POWER: PROCOPE SALON — high symbols +50%', sfx: 'BRAVO!' }
                        ] },
                        italy: { title: 'ISSUE #14 · RENAISSANCE ITALY', panels: [
                            { cap: '1500. Florence. Paint and marble dust in every workshop.', sfx: 'SPLAT!' },
                            { bub: ['bakingbear', 'That dome… it looks like a giant cake mould!'] },
                            { cap: 'A master has sketched a strange machine in his notebook.', bub: ['dede', 'That’s no flying machine… it’s an ESPRESSO machine!'] },
                            { cap: 'ERA POWER: MASTER’S TOUCH — coffee symbols +70%', sfx: 'BELLISSIMO!' }
                        ] },
                        jazz: { title: 'ISSUE #15 · JAZZ AGE NEW YORK', panels: [
                            { cap: '1925. New York. Skyscrapers, neon and jazz!', sfx: 'BAP-BA-DOO!' },
                            { bub: ['barista', 'Last stop! We’ll make history’s finest coffee right here!'] },
                            { cap: 'But a familiar silhouette lurks in the shadows… it smells of syrup!', bub: ['villain', 'I’ve followed you through time! This city will drink SYRUP!'] },
                            { cap: 'ERA POWER: SWING RHYTHM — multipliers 35% more often in free spins', sfx: 'SWING!' }
                        ] }
                    },
                    finale: { title: 'ISSUE #100 · THE COFFEE OF TIME', panels: [
                        { cap: 'A final duel on the torch of the Statue of Liberty: SyruppoLab’s time robot!', sfx: 'KRAANG!' },
                        { cap: 'Friends from every era of history rushed in with their coffee!', bub: ['cozybear', 'The Pharaoh, the Viking chief, Caesar… they’re all here!'] },
                        { bub: ['villain', 'Ah… this coffee… it’s better than syrup…'], sfx: 'POOF!' },
                        { cap: 'And so Bearista and the crew became the finest baristas in every era of history.', bub: ['dede', 'A cup of coffee is remembered for forty years… ours for five thousand!'] }
                    ] }
                }
            }
        };
        function ST() { return SAGA_TXT[CUR_LANG()] || SAGA_TXT.tr; }
        function eraKey(n) { const e = Engine.eraOf(n); return e ? e.key : null; }
        function eraName(k) { return ST().era[k].name; }
        /* 6–100. bölümlerin adlarını dil dosyasına ekle (mevcut kod L().stage[n] ile çalışmaya devam eder) */
        ['tr', 'en'].forEach(lg => {
            const S = SAGA_TXT[lg], st = I18N[lg].stage;
            Engine.ERAS.forEach(e => {
                for (let j = 0; j < e.n; j++) {
                    const n = e.from + j, nm = S.ch[e.key][j];
                    st[n] = { name: nm, place: nm, short: `${S.chWord} ${n}`, era: e.key };
                }
            });
        });

        /* Atölye › Dönem yükseltmeleri: adlar ve açıklamalar */
        (function () {
            const N = {
                tr: { egypt: ['Nil Papirüsü', 'Firavun Fincanı'], greece: ['Zeus’un Mührü', 'Agora Fincanı'], viking: ['Uzun Gemi Küreği', 'Boynuz Kupa'], rome: ['Lejyon Kartalı', 'Sezar Kadehi'], ottoman: ['Kahvehane Peşkiri', 'Zarflı Fincan'],
                      victorian: ['Buhar Kazanı', 'Kraliyet Fincanı'], france: ['Salon Davetiyesi', 'Sèvres Fincanı'], italy: ['Usta Fırçası', 'Medici Kadehi'], jazz: ['Swing Plağı', 'Broadway Fincanı'] },
                en: { egypt: ['Nile Papyrus', 'Pharaoh’s Cup'], greece: ['Seal of Zeus', 'Agora Cup'], viking: ['Longship Oar', 'Drinking Horn'], rome: ['Legion Eagle', 'Caesar’s Goblet'], ottoman: ['Coffeehouse Towel', 'Zarf Cup'],
                      victorian: ['Steam Boiler', 'Royal Cup'], france: ['Salon Invitation', 'Sèvres Cup'], italy: ['Master’s Brush', 'Medici Goblet'], jazz: ['Swing Record', 'Broadway Cup'] }
            };
            const D = {
                tr: { book: l => `Reçete Kitabı şansı +%${3 * l}`, orb: l => `Dede çarpanları +%${6 * l} daha sık`, fs: l => `Her free spin turu +${l} spin`, expand: l => `Genişleyen sembol +%${5 * l} öder`, assist: l => `Hat tamamlama şansı +%${l}`,
                      cash: l => `Kaybeden spinde bahsin %${5 * l}’i geri`, high: l => `Yüksek semboller +%${5 * l}`, low: l => `Kahve sembolleri +%${5 * l}`, fsorb: l => `Free spin’de çarpanlar +%${6 * l} daha sık`, pay: l => `Tüm kazançlar +%${2 * l}` },
                en: { book: l => `Recipe Book chance +${3 * l}%`, orb: l => `Grandpa’s multipliers ${6 * l}% more often`, fs: l => `Every free spin round +${l} spins`, expand: l => `Expanding symbol pays +${5 * l}%`, assist: l => `Line completion chance +${l}%`,
                      cash: l => `${5 * l}% of your bet back on losing spins`, high: l => `High symbols +${5 * l}%`, low: l => `Coffee symbols +${5 * l}%`, fsorb: l => `Multipliers ${6 * l}% more often in free spins`, pay: l => `All wins +${2 * l}%` }
            };
            ['tr', 'en'].forEach(lg => {
                const up = I18N[lg].up;
                Engine.UPGRADES.filter(u => u.group === 'era').forEach(u => {
                    const nm = N[lg][u.era][u.kind === 'pay' ? 1 : 0];
                    up[u.id] = { n: nm, d: l => (l ? D[lg][u.kind](l) : (lg === 'en' ? 'Not bought yet' : 'Henüz alınmadı')) + ' · ' + SAGA_TXT[lg].era[u.era].name };
                });
                I18N[lg].shop.tabs.era = lg === 'en' ? 'Era' : 'Dönem';
            });
            Object.assign(SAGA_TXT.tr, { upInfo: 'Dönem yükseltmeleri kalıcıdır: her dönemde 2 yeni yükseltme gelir ve sonraki bütün bölümlerde de işe yarar.', upLock: '🔒 Dönem yükseltmeleri zaman makinesine binince (6. bölüm) açılır.' });
            Object.assign(SAGA_TXT.en, { upInfo: 'Era upgrades are permanent: each era brings 2 new upgrades that keep working in every later chapter.', upLock: '🔒 Era upgrades unlock when you board the time machine (chapter 6).' });
        })();
