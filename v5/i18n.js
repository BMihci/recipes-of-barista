        /* =====================================================
           DİL DESTEĞİ (TR / EN)
           ===================================================== */
        /* 10 milyar ve üstü kısaltılır (Saga'nın son bölümleri): 26,9 Mr / 26.9B */
        const fmtN = n => {
            const en = CUR_LANG() === 'en', a = Math.abs(n);
            if (a >= 1e10) { const [d, s] = a >= 1e12 ? [1e12, en ? 'T' : ' Tr'] : [1e9, en ? 'B' : ' Mr']; return (Math.floor(n / d * 100) / 100).toLocaleString(en ? 'en-US' : 'tr-TR') + s; }
            return Math.floor(n + 1e-9).toLocaleString(en ? 'en-US' : 'tr-TR');
        };
        const pctS = v => (CUR_LANG() === 'en' ? v + '%' : '%' + v);
        const I18N = {
            tr: {
                htmlLang: 'tr', castleSign: 'ŞURUP KALESİ',
                sym: { book: 'Reçete Kitabı', barista: 'Bearista', girlfriend: 'MaviKuş', baking_bear: 'Fırıncı Ayı', portafilter: 'Portafiltre', v60: 'V60 Dripper', espresso: 'Espresso Fincanı', aeropress: 'AeroPress', golden_bean: 'Altın Çekirdek', croissant: 'Kruvasan', pitcher: 'Pitcher', matcha: 'Matcha', cupcake: 'Fırın Keki', coffeebag: 'Kahve Çuvalı', stamp: 'Damga' },
                mwar: { title: 'MATCHA SAVAŞI', tip: 'Dönüştürdüğün her matcha sayacı doldurur. 15 matchada Kahve Zaferi: bahsin 10 katı!', win: 'KAHVE ZAFERİ! 15 matcha gerçek kahveye döndü: +{v} çekirdek!' },
                badge: { book: 'WILD', foam: 'DÖNÜŞÜM', wild: 'JOKER', stamp: 'DAMGA', oven: 'FIRIN', bag: 'HASAT' },
                stage: {
                    1: { name: 'Huzurlu Dem', place: 'Huzurlu Dem Kafe', short: '1. Şube' },
                    2: { name: 'Matcha Savaşı', place: 'Matcha Caddesi', short: '2. Şube' },
                    3: { name: 'Pastane Festivali', place: 'Pastane Meydanı', short: '3. Şube' },
                    4: { name: 'Hasat Tepesi', place: 'Hasat Tepesi Çiftliği', short: '4. Şube' },
                    5: { name: 'Şurup Kalesi', place: 'Şurup Kalesi', short: 'Final' }
                },
                stageWord: 'AŞAMA',
                menu: { sub: '3D Deluxe Edition', cont: '▶ DEVAM ET', newGame: 'YENİ OYUN', saves: '💾 KAYITLI OYUNLAR', lang: '🌐 DİL: TÜRKÇE', contInfo: '{name} · {stage} · {bal} çekirdek' },
                slots: { slotN: 'Kayıt {n}', title: 'Kayıtlı Oyunlar', newTitle: 'Yeni Oyun İçin Kayıt Seç', empty: 'Boş kayıt', load: 'YÜKLE', start: 'BAŞLA', del: 'SİL', close: 'KAPAT', info: '{stage} · Kasa: {bal}', fin: '🏆 Oyun bitti · Serbest mod', overwriteT: 'KAYIT SİLİNSİN Mİ?', overwrite: '<b>{name}</b> içindeki oyun silinecek ve yerine yeni oyun başlayacak.', delT: 'KAYIT SİLİNSİN Mİ?', delTxt: '<b>{name}</b> kalıcı olarak silinecek.', yesDel: 'EVET, SİL', yesNew: 'EVET, YENİ OYUN' },
                name: { title: 'Oyuncu Adın', hint: 'Profilinde ve skor tablosunda bu isim görünür. Sonra profilinden değiştirebilirsin.', cancel: 'İPTAL', ok: 'DEVAM ET', def: 'Bearista' },
                top: { map: '🗺', mapT: ' HARİTA', shop: '🛠', shopT: ' ATÖLYE', menu: '🏠', menuT: ' MENÜ' },
                ctl: { bet: 'BAHİS', bank: 'KASA', spin: 'SPİN', auto: 'OTO' },
                goal: {
                    buyNext: '⏳ {short} · {price}', buyFinal: '🏆 FİNAL · {price}', buyTM: '⏳ ZAMAN MAKİNESİ · {price}',
                    lockedTip: 'Kasan {at} çekirdeği görünce sonraki şubeyi ({place}) {price} çekirdeğe satın alabilirsin. Kalan çekirdekler kasanda kalır.',
                    lockedTipFinal: 'Kasan {at} çekirdeği görünce SyruppoLab’ı {price} çekirdeğe satın alıp kasabayı kurtarabilirsin!',
                    readyTip: 'Hazır! Sonraki şubeyi ({place}) {price} çekirdeğe satın alabilirsin.',
                    free: '🏆 KASABA KURTARILDI · Serbest oyun',
                    phaseTip: 'Ara durak: {at} çekirdek ({pct}). Buraya ulaşınca kasana +{r} çekirdek ödül!',
                    phaseGot: 'Ara durak ödülü alındı ✓'
                },
                buy: {
                    t: '{short} SATIN ALINSIN MI?', txt: '<b>{place}</b> için kasandan <b>{price}</b> çekirdek ödenecek. Kalan <b>{left}</b> çekirdek kasanda kalır.<br>Bu aşamaya bir daha dönülmez.', ok: 'SATIN AL',
                    tF: 'SYRUPPOLAB SATIN ALINSIN MI?', txtF: 'Kasandan <b>{price}</b> çekirdek ödeyerek SyruppoLab’ı satın alacaksın. Kalan <b>{left}</b> çekirdek kasanda kalır ve serbest oyuna devam edebilirsin.', okF: 'SATIN AL VE KURTAR!',
                    txtTM: 'Kasandan <b>{price}</b> çekirdek ödeyerek SyruppoLab’ı satın alacaksın. Sonra Kahve Dede’nin <b>zaman makinesine</b> binip tarihin her döneminde kahve macerasına başlayacaksın! (Kalan: <b>{left}</b>)', okTM: 'SATIN AL VE ZAMANDA YOLCULUK ET! ⏳'
                },
                intro: {
                    btn: 'BAŞLA ☕',
                    saga: '⏳ <b>{era}</b> · {years}<br><b>Kasa: {bal}</b> · Hedef: kasada <b>{at}</b> görüp zaman makinesini <b>{price}</b> çekirdekle bir sonraki bölüme yollamak. Fazla çekirdekler <b>Zaman Hazinesi</b>’ne gider.<br><br>✨ <b>Dönem gücü · {buff}:</b> {buffD}. (Yalnızca bu dönemde.)<br>☕ Sadakat kartı bu bölümde de seninle. Final’e <b>{left}</b> bölüm kaldı!',
                    eraInfo: '<b>{era}</b> (bölüm {a}–{b})<br>✨ <b>{buff}:</b> {buffD}.<br>Bu güç yalnızca bu dönemin bölümlerinde geçerli ve yalnızca senin lehine çalışır!',
                    1: '<b>Kasa: {bal} çekirdek.</b> Hedef: kasada <b>{at}</b> çekirdek görmek ve ikinci şubeyi <b>{price}</b> çekirdeğe açmak.<br><br>🛠 Kazandığın çekirdeklerle <b>Atölye</b>’de sembollerini kalıcı olarak güçlendirebilirsin. Ne kadar harcayacağın sana kalmış!',
                    2: 'İkinci şubemiz Matcha Caddesi’nde! <b>Kasa: {bal}</b> · Hedef: <b>{at}</b>.<br><br>🍵 SyruppoLab makaralara <b>Matcha</b> sızdırıyor; ama biz gerçek kahveciyiz! Ekrana düşen <b>bütün matchalar aynı anda tek bir kahve sembolüne dönüşür</b>. Matcha hattı asla bozmaz, sadece kazandırır.<br>⚔️ Dönüştürdüğün her matcha <b>Matcha Savaşı</b> sayacını doldurur: 15 matchada <b>Kahve Zaferi</b> = bahsinin 10 katı!<br>🥛 <b>Pitcher</b> (1-3-5. makara) bir <b>jokerdir</b>; ekranda 3 Pitcher = <b>Latte Art Bonusu</b>!',
                    3: 'Pastane Meydanı’nda festival var! <b>Kasa: {bal}</b> · Hedef: <b>{at}</b>.<br><br>🧁 Makaralarda <b>Fırın Keki</b> çıkar. Her kek fırını ısıtır; <b>{full} kek</b> dolunca <b>PASTA YAĞMURU</b> başlar: {spins} bedava spin boyunca kekler <b>JOKER</b> olur ve sık düşer!',
                    4: 'Kendi çekirdeğimizi yetiştirdiğimiz Hasat Tepesi! <b>Kasa: {bal}</b> · Hedef: <b>{at}</b>.<br><br>🌾 <b>Kahve Çuvalı</b> ekranın neresinde olursa olsun öder: 3 çuval = bahsin 2 katı, 4 = 6, 5 = 20, 6 = 60, 7+ = 150 katı!',
                    5: 'SyruppoLab’ın Şurup Kalesi! <b>Kasa: {bal}</b> · Hedef: kasada <b>{at}</b> görüp SyruppoLab’ı satın almak.<br><br><b>Reçete Kitabı</b> ve <b>Bearista</b> +%50, <b>MaviKuş</b> +%25 değerli. Surlar çatladıkça (%25 · %50 · %75) ödül kazanırsın.<br>☕ <b>Sadakat kartı:</b> makarada çıkan damgaları topla; her 10 damgada ücretsiz içeceğini seç!'
                },
                map: { title: 'Zaman Haritası', play: '▶ OYNA', done: '✓ Tamamlandı', locked: '🔒 Kilitli', needs: 'Önceki bölümde kasan {at} olunca açılır', story: '📖 Hikâye', shop: '🛠 ATÖLYE', menu: '🏠 MENÜ', here: 'Buradasın', bank: 'Kasa' },
                shop: { title: '🛠 Barista Atölyesi', bank: 'Kasa', tabs: { symbol: '🍪 Semboller', skill: '⚡ Yetenekler', special: '🍵 Özel', late: '✨ Usta', lever: '🎰 Kol' }, lockSpecial: '🔒 Bazı özel yükseltmeler ilgili aşamaya ulaşınca açılır.', lockLate: '🔒 Usta yükseltmeleri 4. aşamada açılır.', lateInfo: '✨ Usta yükseltmeleri: oyun sonu için pahalı ama güçlü geliştirmeler.', max: 'MAKS', maxed: '★ MAKSİMUM', foot: 'Yükseltmeler kalıcıdır ve kasandaki çekirdekle alınır.', power: 'Atölye gücü: {have} / {total} seviye', spinWait: 'Makaralar dönerken alışveriş yapılamaz.' },
                up: {
                    sym: { n: s => s + ' Çarpanı', d: l => `Ödemeleri ×${fx(1 + 0.06 * l)}` },
                    sk_scatter: { n: 'Kitap İlhamı', d: l => `Kitap şansı %${fx(5 + 0.08 * l)} (hücre başına)` },
                    sk_assist: { n: 'Kombo Ustası', d: l => `Her spinde %${l * 2} ihtimalle bir hat 1 sembol uzar` },
                    sk_free: { n: 'Uzun Mola', d: l => `Free spin sayısı +${l}` },
                    sk_expand: { n: 'Not Defteri Gücü', d: l => `Free spinde genişleyen sembol şansı +%${fx(0.15 * l)}` },
                    sk_cash: { n: 'Sadık Müşteriler', d: l => `Boş spinde bahsin %${2 * l} kadarı geri döner` },
                    sp_pitcher: { n: 'Pitcher Şansı', d: l => `Pitcher şansı %${fx(7 + 0.5 * l)} (1-3-5. makara)` },
                    sp_latte: { n: 'Latte Art Bonusu', d: l => `3 Pitcher bonusu: bahsin ${fx(2 + 0.4 * l)} katı` },
                    sp_foam: { n: 'Usta Dönüşüm', d: l => l ? `Matchalar daha değerli kahvelere dönüşür (+%${35 * l} eğilim)` : 'Matchalar rastgele bir kahveye dönüşür' },
                    sp_matcha: { n: 'Matcha Avcısı', d: l => `Dönüştürülecek matcha şansı %${5 + l} (her makara)` },
                    sp_oven: { n: 'Büyük Fırın', d: l => `Pasta Yağmuru için ${Engine.OVEN_FULL - l} kek yeter` },
                    sp_rain: { n: 'Bol Krema', d: l => `Pasta Yağmuru ${Engine.OVEN_SPINS + 2 * l} spin sürer` },
                    sp_bag: { n: 'Hasat Bereketi', d: l => `Çuval ödemeleri ×${fx(1 + 0.25 * l)}` },
                    sp_bagrate: { n: 'Verimli Toprak', d: l => `Çuval şansı %${fx(3.5 + 0.5 * l)}` },
                    lx_pay: { n: 'Usta Barista', d: l => `Tüm hat kazançları +%${4 * l}` },
                    lx_book: { n: 'Şanslı Kitap', d: l => `Kitap (Wild) şansı +%${fx(1.5 * l)}` },
                    lx_free: { n: 'Ekstra Mola', d: l => `Free spin'e +${l} ek tur` },
                    lx_expand: { n: 'Defter Ustası', d: l => `Genişleyen sembol ödemesi +%${5 * l}` },
                    lx_stamp: { n: 'Damga Ustası', d: l => `Damga şansı %${fx(1.2 + 0.2 * l)} (Final)` },
                    lx_reel6: { n: '6. Makara', d: l => l ? 'Makara sayısı: 6 (6’lı eşleşme süper ödül)' : 'Makara sayısı: 5' }
                },
                msg: {
                    welcome: 'Çarkları çevir, nitelikli kahveni demle!', spinning: 'Çarklar hızla dönüyor...', freeSpinning: 'Free Spin döndürülüyor...', rainSpinning: '🧁 Pasta Yağmuru! Kekler JOKER...',
                    americanoSpin: '☕ Americano ×2 aktif! Çarklar dönüyor...', brewed: 'Nitelikli kahve demlendi.', win: '🏆 KAZANÇ: +{v}', beans: 'ÇEKİRDEK!',
                    expand: '📖 {n} MAKARA +{v}', expandTitle: '📖 GENİŞLEYEN SEMBOL: {s}!', foam: '🍵🥛 MATCHA LATTE ×{v}', latte: '🥛 LATTE ART +{v}', harvest: '🌾 HASAT ×{n} +{v}',
                    cash: '☕ Sadık müşteriler +{v}', americano: '☕ AMERICANO ×2', stamps: '🎟 +{n} DAMGA', cupcakes: '🧁 +{n} KEK', matchaHint: '', convert: '☕ {n} MATCHA GERÇEK KAHVEYE DÖNDÜ: {s}!',
                    matchaAlone: 'Nitelikli kahve demlendi.', tease: '📖📖 İki Reçete Kitabı! Üçüncüsü gelecek mi...?', retrig: '📖 {n} REÇETE KİTABI! +{n} FREE SPIN EKLENDİ!',
                    betLock: 'Oto Spin veya Free Spin sırasında bahis değiştirilemez!', autoLock: 'Free Spin sırasında Oto Spin durumu değiştirilemez!', autoOn: 'Oto Spin aktif edildi.', autoOff: 'Oto Spin durduruldu.',
                    rainStart: '🧁 FIRIN DOLDU! PASTA YAĞMURU: {n} spin boyunca kekler JOKER!', saved: 'Oyun kaydedildi.'
                },
                banner: { fs: 'FREE SPIN! Kalan:', exp: 'Genişleyen sembol:', rain: 'PASTA YAĞMURU! Kalan:', rainInfo: 'Kekler JOKER 🧁', badgeFs: 'FREE SPIN', badgeRain: 'PASTA YAĞMURU', mult: '⚡ TOPLAM ÇARPAN ×{v}' },
                tier: t => t > 0 ? `⭐ KADEME ${t} · +%${t * 4} KAZANÇ` : '⭐ KADEME 0',
                nb: { title: 'BARİSTA NOT DEFTERİ!', found: '3 Reçete Kitabı bulundu! Not defteri açılıyor...', picking: 'Not defteri bugünün sembolünü seçiyor...', result: 'Genişleyen sembol: <b>{s}</b>! {n} Free Spin başlıyor{f}.<br><small>Ekranda {min}+ {s} gelirse makarayı kaplar.</small>', filtre: ' (☕ Filtre Kahve)', extra: '(+{k} fazla kitap bonusu)', start: 'FREE SPIN’LERİ BAŞLAT 🚀', cover: 'BARİSTA<br>NOT DEFTERİ', backTop: 'BUGÜNÜN', back: 'Özel Reçetesi' },
                oven: { title: 'FIRIN', tip: 'Her kek fırını ısıtır. Dolunca Pasta Yağmuru başlar!' },
                loy: { title: 'SADAKAT KARTI', tip: 'Sadakat kartı: her 10 damgada ücretsiz içecek', full: 'SADAKAT KARTI DOLDU!', pick: 'Ücretsiz içeceğini seç:', empty: 'Kart dolunca içecek seç',
                       filtreB: '☕ Filtre: sonraki FS 20', americanoB: '☕ Americano ×2 · {n} spin', latteB: '🥛 Latte: Wild +%{n}', maxed: 'En fazla {n} kez seçilebilir',
                       drinks: { filtre: ['Filtre Kahve', 'Sonraki free spin’lerin <b>20</b> tane olur.'], americano: ['Americano', 'Sonraki <b>10 çevirimde ×2</b> çarpan.'], latte: ['Latte', 'Wild (Reçete Kitabı) ihtimali bu aşama boyunca <b>+%10</b>.'] },
                       ready: '{d} hazır!', said: { filtre: 'Sonraki free spin bonusun 20 tur olacak.', americano: 'Sonraki 10 çevirimde kazançların ×2!', latte: 'Reçete Kitabı artık daha sık geliyor (+%10).' } },
                bust: { rescue: 'Hoop, kasan boşaldı evlat! Yedek depodan sana <b>{v}</b> çekirdek getirdim. (Her bölümde bir kez.)', t: 'KASAN BOŞALDI!', txt: 'Bütün çekirdeklerin bitti! Oyuna girdiğin her 6 saatte bir kasana <b>{v}</b> çekirdek hediye eklenir. Sıradaki hediyeye kalan süre:', video: '🎬 VİDEO İZLE (+{v})', wait: '⏳ BEKLE', waitMsg: 'Sıradaki hediyene {t} kaldı. Mağazadan video izleyerek hemen çekirdek alabilirsin.' },
                gift: { got: '6 saatlik hediye: kasana +{v} çekirdek eklendi! ☕', video: '🎬 Video izlendi: +{v} çekirdek!' },
                bigwin: ['BÜYÜK KAZANÇ!', 'MEGA KAZANÇ!', 'EPİK KAZANÇ!'], bigwinTap: 'devam etmek için dokun',
                fsdone: { t: 'FREE SPIN BİTTİ!', txt: 'Toplam kazancın', mult: 'Toplam çarpan ×{v}', ok: 'DEVAM ET ☕' },
                done: { cont: 'SLOTA DEVAM ET', shop: '🛠 ATÖLYE' },
                tut: { spin: 'Çevirmek ve ilerlemek için <b>SPİN</b> tuşuna bas', book: 'Detaylı bilgi için <b>KİTAP</b> tuşuna bas', ok: 'ANLADIM' },
                info: {
                    title: '📖 Reçete Kitabı', ok: 'ANLADIM', paysT: '💎 Sembol Çarpanları (çizgi bahsi × değer)',
                    rulesT: '🎯 20 Ödeme Çizgisi & Kurallar',
                    pages: { era: 'Dönem Gücü', rules: 'Kurallar', book: 'Reçete Kitabı', high: 'Yüksek Semboller', low: 'Kahve Sembolleri', special: 'Bu Şubeye Özel', lines: 'Ödeme Çizgileri', keys: 'Tuşlar' },
                    eraNote: 'Her tarihi dönemin kendine özgü bir gücü vardır; dönem bitince bu güç kapanır, yenisi başlar. Dönem mağazasında o çağa özel görünümler satılır.',
                    bookTxt: 'Reçete Kitabı hem <b>Wild</b> (her sembolün yerine geçer) hem <b>Scatter</b>dır: ekranın neresinde olursa olsun öder.<br>• <b>3 Kitap</b> = <b>{n} Free Spin</b>.<br>• 3’ün üstündeki <b>her kitap +1 Free Spin</b> verir (4 kitap = {n}+1, 5 kitap = {n}+2…).<br>• Kitap açılır, sayfalar hızla çevrilir ve bir <b>genişleyen sembol</b> seçilir. Free spin’de bu sembol yeterince gelirse makarasını baştan aşağı kaplar ve tüm hatlarda öder.',
                    linesTxt: 'Kazançlar soldan sağa, <b>{n} ödeme çizgisi</b> üzerinde sayılır. Her çizgide en yüksek kazanç ödenir; farklı çizgilerdeki kazançlar toplanır.',
                    rules: (E, s) => `Soldan sağa aktif hatlar üzerinde eşleşen semboller kazanç sağlar. Değerler <b>çizgi bahsi (bahis ÷ 20)</b> ile çarpılır; ödeme tablosunda şu anki bahsine göre çekirdek olarak gösterilir. <b>Reçete Kitabı</b> hem Wild hem Scatter: 3 Reçete Kitabı = <b>${E.freeSpins} Free Spin</b>, 3’ün üstündeki her kitap <b>+1 Free Spin</b>. Free spin sırasında yeniden 3+ Kitap gelirse <b>gelen kitap sayısı kadar</b> free spin eklenir.<br><b>Genişleyen sembol:</b> Not defterinin seçtiği sembol free spin’de ekranda en az <b>2</b> (yüksek semboller) ya da <b>3</b> (diğerleri) kez görünürse bulunduğu makaraları kaplar ve <b>20 hattın hepsinde</b> ödeme yapar.<br><b>Bahis kademesi:</b> bahsini yükselttikçe (her 3 basamakta bir, en fazla 5 kademe) kazançlar +%4 artar ve kitap şansı biraz yükselir.` + (E.reels === 6 ? '<br><b>6. Makara açık:</b> 6’lı eşleşme, 5’li ödemenin 2,5 katını öder.' : ''),
                    keysT: '🎮 Tuşlar ve Fonksiyonlar',
                    keys: [
                        ['SPİN', 'Makaraları çevirir. Bahis kasadan düşer. PC’de <b>Boşluk</b> tuşu da çevirir.'],
                        ['OTO', 'Otomatik spin’i açar/kapatır. Açıkken bahis değiştirilemez.'],
                        ['− / +', 'Bahsi aşamanın bahis merdiveninde azaltır/artırır. Yüksek bahis = daha hızlı ama daha riskli.'],
                        ['KİTAP', 'Bu sayfayı açar: kurallar, ödeme tablosu, çizgiler ve tüm tuşlar. Sayfalar arasında ◀ ▶ (PC’de ok tuşları) ile gezinirsin.'],
                        ['🎰 KOL', 'Atölye › Kol’dan alınan slot kolu makinenin sağında durur; dokununca spin atar.'],
                        ['⭐ KADEME', 'Makaranın sol üstündeki rozet, bahis kademeni ve kazanç bonusunu gösterir.'],
                        ['🎯 HEDEF ÇUBUĞU', 'Kasanın hedefe oranını gösterir. 🎁 ara duraklarda ödül alırsın. Hedefe ulaşınca sağdaki <b>🏪 şube düğmesi</b> açılır ve sonraki şubeyi satın alırsın; artan çekirdekler kasanda kalır.'],
                        ['🗺 HARİTA', 'Kasaba haritasını açar. Oyun otomatik kaydedilir.'],
                        ['🛠 ATÖLYE', 'Kasadaki çekirdekle sembollerini ve yeteneklerini kalıcı olarak geliştirirsin.'],
                        ['🏠 MENÜ', 'Ana menüye döner. İlerlemen kayıtlıdır; “Devam Et” ile kaldığın yerden sürersin.'],
                        ['🔊', 'Sesi ve müziği açar/kapatır.'],
                        ['FREE SPIN SAYACI', 'Free spin ve Pasta Yağmuru sırasında kalan tur sayısını gösterir.'],
                        ['⚡ ÇARPAN ÇEKİRDEĞİ', 'Bazen makaraların üstüne şimşekle bir çarpan çekirdeği düşer (×2 – ×100). O spinde kazanç varsa kazancın çarpılır. Free spin’de çarpanlar birikir (en fazla ×25) ve sonraki her kazancı çarpar.'],
                        ['🎉 BÜYÜK KAZANÇ', 'Bahsinin 15 katı ve üstü kazançlarda Büyük, 40 katında Mega, 100 katında Epik kazanç gösterisi açılır. Dokununca hızlanır.'],
                        ['🛒 MAĞAZA · HEDİYE', 'Oyuna girdiğin her 6 saatte bir kasana 1.000 çekirdek eklenir. Mağazadan istediğin zaman reklam izleyerek +1.000 çekirdek alabilirsin.']
                    ],
                    specialT: '🍵 Matcha → Kahve & 🥛 Pitcher (2. aşamadan itibaren)',
                    pitcher: (E) => `1., 3., 5. makarada.<br>Hatlarda diğer sembollerin yerine geçer.<br>Ekranda 3 tane = <b>Latte Art Bonusu: bahsin ${fx(E.latteMult)} katı</b>`,
                    matcha: (E) => `Her makarada düşebilir.<br>Düşen <b>bütün matchalar aynı anda tek bir rastgele kahve sembolüne dönüşür</b> ve öyle değerlendirilir. Hattı asla bozmaz.<br>2. aşamada her 15 matcha = <b>Kahve Zaferi</b> (bahsin 10 katı).`,
                    specialNote: 'Matcha SyruppoLab’ın içeceği; biz onu her seferinde gerçek kahveye çeviriyoruz. Ceza yok, sadece bonus!',
                    ovenT: '🧁 Fırın & Pasta Yağmuru (3. aşama)', oven: (E) => `Her <b>Fırın Keki</b> fırın sayacını 1 artırır. <b>${E.ovenFull}</b> kek dolunca <b>Pasta Yağmuru</b>: ${E.ovenSpins} bedava spin; kekler sık düşer ve <b>JOKER</b> olur.`,
                    bagT: '🌾 Hasat (4. aşama)', bag: (E) => `<b>Kahve Çuvalı</b> ekranın neresinde olursa olsun öder (bahsin katı): 3 → 2×, 4 → 6×, 5 → 20×, 6 → 60×, 7+ → 150×${E.bagMult > 1 ? ' (Atölye ile ×' + fx(E.bagMult) + ')' : ''}.`,
                    loyT: '☕ Sadakat Kartı (Final)', loy: 'Makaralarda nadiren <b>Damga</b> çıkar (hat ödemez). <b>10 damgada</b> ücretsiz içeceğini seç:<br>• <b>Filtre Kahve:</b> sonraki free spin’lerin 20 tane olur.<br>• <b>Americano:</b> sonraki 10 çevirimde ×2 çarpan.<br>• <b>Latte:</b> Wild ihtimali bu aşama boyunca +%10 (en fazla 2 kez).'
                },
                phase: {
                    1: [['cozybear', 'MaviKuş', 'Müşteri kuyruğu uzuyor Bearista! Yolun yarısındayız, atölyeye de uğra!']],
                    2: [['barista', 'Bearista', 'Her matchayı gerçek kahveye çeviriyoruz! SyruppoLab’ın dükkânı boş kaldı...']],
                    3: [['bakingbear', 'Fırıncı Ayı', 'Fırınlar ısınıyor, festival kalabalığı bizde!']],
                    4: [['cozybear', 'MaviKuş', 'Çuvallar doluyor! SyruppoLab çekirdekleri kapatamayacak!']],
                    5: [['barista', 'Bearista', 'Şurup Kalesi’nin dış surları çatladı! Devam!'], ['cozybear', 'MaviKuş', 'Kapılar sallanıyor... İçeriden şurup kokusu geliyor!'], ['book', 'SyruppoLab Patronu', 'İmkânsız! Bir avuç ayı kalemi yıkıyor mu?!']]
                },
                phaseReward: '  🎁 +{v} çekirdek!',
                newStage: { 4: ['cozybear', 'MaviKuş', 'Bu tepede rüzgâr sert esiyor; Atölye yükseltmelerini ihmal etme!'], 5: ['barista', 'Bearista', 'Final zorlu! Atölyede güçlenmeden SyruppoLab’a meydan okuma.'] },
                reel6Said: '6. makara kuruldu! Artık 6’lı eşleşmeler süper ödül veriyor.',
                finalDone: 'Kasabayı kurtardın! İstediğin kadar serbest oyuna devam edebilirsin.'
            },
            en: {
                htmlLang: 'en', castleSign: 'SYRUP CASTLE',
                sym: { book: 'Recipe Book', barista: 'Bearista', girlfriend: 'BlueBird', baking_bear: 'Baker Bear', portafilter: 'Portafilter', v60: 'V60 Dripper', espresso: 'Espresso Cup', aeropress: 'AeroPress', golden_bean: 'Golden Bean', croissant: 'Croissant', pitcher: 'Pitcher', matcha: 'Matcha', cupcake: 'Oven Cupcake', coffeebag: 'Coffee Sack', stamp: 'Stamp' },
                mwar: { title: 'MATCHA WAR', tip: 'Every matcha you convert fills the meter. 15 matchas = Coffee Victory: 10× your bet!', win: 'COFFEE VICTORY! 15 matchas became real coffee: +{v} beans!' },
                badge: { book: 'WILD', foam: 'CONVERT', wild: 'JOKER', stamp: 'STAMP', oven: 'OVEN', bag: 'HARVEST' },
                stage: {
                    1: { name: 'Cozy Brew', place: 'Cozy Brew Café', short: 'Branch 1' },
                    2: { name: 'Matcha War', place: 'Matcha Street', short: 'Branch 2' },
                    3: { name: 'Bakery Festival', place: 'Bakery Square', short: 'Branch 3' },
                    4: { name: 'Harvest Hill', place: 'Harvest Hill Farm', short: 'Branch 4' },
                    5: { name: 'Syrup Castle', place: 'Syrup Castle', short: 'Finale' }
                },
                stageWord: 'STAGE',
                menu: { sub: '3D Deluxe Edition', cont: '▶ CONTINUE', newGame: 'NEW GAME', saves: '💾 SAVED GAMES', lang: '🌐 LANGUAGE: ENGLISH', contInfo: '{name} · {stage} · {bal} beans' },
                slots: { slotN: 'Save {n}', title: 'Saved Games', newTitle: 'Choose a Slot for the New Game', empty: 'Empty slot', load: 'LOAD', start: 'START', del: 'DELETE', close: 'CLOSE', info: '{stage} · Bank: {bal}', fin: '🏆 Completed · Free play', overwriteT: 'OVERWRITE SAVE?', overwrite: 'The game in <b>{name}</b> will be deleted and a new game will start.', delT: 'DELETE SAVE?', delTxt: '<b>{name}</b> will be deleted permanently.', yesDel: 'YES, DELETE', yesNew: 'YES, NEW GAME' },
                name: { title: 'Your Player Name', hint: 'This name appears on your profile and the leaderboard. You can change it later in your profile.', cancel: 'CANCEL', ok: 'CONTINUE', def: 'Bearista' },
                top: { map: '🗺', mapT: ' MAP', shop: '🛠', shopT: ' WORKSHOP', menu: '🏠', menuT: ' MENU' },
                ctl: { bet: 'BET', bank: 'BANK', spin: 'SPIN', auto: 'AUTO' },
                goal: {
                    buyNext: '⏳ {short} · {price}', buyFinal: '🏆 FINALE · {price}', buyTM: '⏳ TIME MACHINE · {price}',
                    lockedTip: 'When your bank shows {at} beans you can buy the next branch ({place}) for {price} beans. The rest stays in your bank.',
                    lockedTipFinal: 'When your bank shows {at} beans you can buy out SyruppoLab for {price} beans and save the town!',
                    readyTip: 'Ready! You can buy the next branch ({place}) for {price} beans.',
                    free: '🏆 TOWN SAVED · Free play',
                    phaseTip: 'Checkpoint: {at} beans ({pct}). Reach it for a +{r} bean reward!',
                    phaseGot: 'Checkpoint reward collected ✓'
                },
                buy: {
                    t: 'BUY {short}?', txt: '<b>{price}</b> beans will be paid from your bank for <b>{place}</b>. The remaining <b>{left}</b> beans stay in your bank.<br>You can’t return to this stage.', ok: 'BUY',
                    tF: 'BUY OUT SYRUPPOLAB?', txtF: 'You will pay <b>{price}</b> beans to buy out SyruppoLab. The remaining <b>{left}</b> beans stay in your bank and you can keep playing freely.', okF: 'BUY & SAVE THE TOWN!',
                    txtTM: 'You’ll pay <b>{price}</b> beans to buy SyruppoLab. Then you’ll board Grandpa Brew’s <b>time machine</b> for a coffee adventure across every era of history! (Left: <b>{left}</b>)', okTM: 'BUY AND TRAVEL IN TIME! ⏳'
                },
                intro: {
                    btn: 'START ☕',
                    saga: '⏳ <b>{era}</b> · {years}<br><b>Bank: {bal}</b> · Goal: reach <b>{at}</b> and send the time machine to the next chapter for <b>{price}</b> beans. Extra beans go to your <b>Time Treasure</b>.<br><br>✨ <b>Era power · {buff}:</b> {buffD}. (This era only.)<br>☕ Your loyalty card comes along too. <b>{left}</b> chapters to the finale!',
                    eraInfo: '<b>{era}</b> (chapters {a}–{b})<br>✨ <b>{buff}:</b> {buffD}.<br>This power works only in this era’s chapters and only in your favour!',
                    1: '<b>Bank: {bal} beans.</b> Goal: see <b>{at}</b> beans in your bank and open the second branch for <b>{price}</b>.<br><br>🛠 Spend your winnings in the <b>Workshop</b> to upgrade your symbols permanently. How much you invest is up to you!',
                    2: 'Our second branch is on Matcha Street! <b>Bank: {bal}</b> · Goal: <b>{at}</b>.<br><br>🍵 SyruppoLab sneaks <b>Matcha</b> onto the reels, but we are real baristas! <b>All matchas on screen turn into one and the same coffee symbol</b>. Matcha never breaks a line, it only adds wins.<br>⚔️ Every matcha you convert fills the <b>Matcha War</b> meter: 15 matchas = <b>Coffee Victory</b>, 10× your bet!<br>🥛 <b>Pitcher</b> (reels 1-3-5) is a <b>joker</b>; 3 Pitchers on screen = <b>Latte Art Bonus</b>!',
                    3: 'It’s festival time on Bakery Square! <b>Bank: {bal}</b> · Goal: <b>{at}</b>.<br><br>🧁 <b>Oven Cupcakes</b> land on the reels. Each one heats the oven; at <b>{full} cupcakes</b> the <b>CAKE RAIN</b> begins: for {spins} free spins cupcakes become <b>JOKERS</b> and land often!',
                    4: 'Harvest Hill, where we grow our own beans! <b>Bank: {bal}</b> · Goal: <b>{at}</b>.<br><br>🌾 <b>Coffee Sacks</b> pay anywhere on screen: 3 sacks = 2× bet, 4 = 6×, 5 = 20×, 6 = 60×, 7+ = 150×!',
                    5: 'SyruppoLab’s Syrup Castle! <b>Bank: {bal}</b> · Goal: see <b>{at}</b> in your bank and buy out SyruppoLab.<br><br><b>Recipe Book</b> and <b>Bearista</b> pay +50%, <b>BlueBird</b> +25%. Crack the walls (25% · 50% · 75%) for rewards.<br>☕ <b>Loyalty card:</b> collect stamps from the reels; every 10 stamps pick a free drink!'
                },
                map: { title: 'Town Map', play: '▶ PLAY', done: '✓ Completed', locked: '🔒 Locked', needs: 'Unlocks when your previous branch reaches {at}', story: '📖 Story', shop: '🛠 WORKSHOP', menu: '🏠 MENU', here: 'You are here', bank: 'Bank' },
                shop: { title: '🛠 Barista Workshop', bank: 'Bank', tabs: { symbol: '🍪 Symbols', skill: '⚡ Skills', special: '🍵 Special', late: '✨ Master', lever: '🎰 Lever' }, lockSpecial: '🔒 Some special upgrades unlock when you reach their stage.', lockLate: '🔒 Master upgrades unlock at stage 4.', lateInfo: '✨ Master upgrades: expensive but powerful end-game improvements.', max: 'MAX', maxed: '★ MAXED', foot: 'Upgrades are permanent and paid from your bank.', power: 'Workshop power: {have} / {total} levels', spinWait: 'You can’t shop while the reels are spinning.' },
                up: {
                    sym: { n: s => s + ' Multiplier', d: l => `Payouts ×${fx(1 + 0.06 * l)}` },
                    sk_scatter: { n: 'Book Inspiration', d: l => `Book chance ${fx(5 + 0.08 * l)}% per cell` },
                    sk_assist: { n: 'Combo Master', d: l => `${l * 2}% chance per spin to extend a line by 1 symbol` },
                    sk_free: { n: 'Long Break', d: l => `Free spins +${l}` },
                    sk_expand: { n: 'Notebook Power', d: l => `Expanding symbol chance in free spins +${fx(0.15 * l)}%` },
                    sk_cash: { n: 'Loyal Customers', d: l => `${2 * l}% of the bet back on empty spins` },
                    sp_pitcher: { n: 'Pitcher Chance', d: l => `Pitcher chance ${fx(7 + 0.5 * l)}% (reels 1-3-5)` },
                    sp_latte: { n: 'Latte Art Bonus', d: l => `3 Pitcher bonus: ${fx(2 + 0.4 * l)}× bet` },
                    sp_foam: { n: 'Master Conversion', d: l => l ? `Matchas turn into more valuable coffees (+${35 * l}% bias)` : 'Matchas turn into a random coffee' },
                    sp_matcha: { n: 'Matcha Hunter', d: l => `Convertible matcha chance ${5 + l}% (every reel)` },
                    sp_oven: { n: 'Big Oven', d: l => `Cake Rain needs ${Engine.OVEN_FULL - l} cupcakes` },
                    sp_rain: { n: 'Extra Cream', d: l => `Cake Rain lasts ${Engine.OVEN_SPINS + 2 * l} spins` },
                    sp_bag: { n: 'Rich Harvest', d: l => `Sack payouts ×${fx(1 + 0.25 * l)}` },
                    sp_bagrate: { n: 'Fertile Soil', d: l => `Sack chance ${fx(3.5 + 0.5 * l)}%` },
                    lx_pay: { n: 'Master Barista', d: l => `All line wins +${4 * l}%` },
                    lx_book: { n: 'Lucky Book', d: l => `Book (Wild) chance +${fx(1.5 * l)}%` },
                    lx_free: { n: 'Extra Break', d: l => `+${l} extra free spins` },
                    lx_expand: { n: 'Notebook Master', d: l => `Expanding symbol payout +${5 * l}%` },
                    lx_stamp: { n: 'Stamp Master', d: l => `Stamp chance ${fx(1.2 + 0.2 * l)}% (Finale)` },
                    lx_reel6: { n: '6th Reel', d: l => l ? 'Reels: 6 (6 of a kind = super prize)' : 'Reels: 5' }
                },
                msg: {
                    welcome: 'Spin the reels and brew some specialty coffee!', spinning: 'The reels are spinning...', freeSpinning: 'Free spin in progress...', rainSpinning: '🧁 Cake Rain! Cupcakes are JOKERS...',
                    americanoSpin: '☕ Americano ×2 active! Spinning...', brewed: 'Specialty coffee brewed.', win: '🏆 WIN: +{v}', beans: 'BEANS!',
                    expand: '📖 {n} REELS +{v}', expandTitle: '📖 EXPANDING SYMBOL: {s}!', foam: '🍵🥛 MATCHA LATTE ×{v}', latte: '🥛 LATTE ART +{v}', harvest: '🌾 HARVEST ×{n} +{v}',
                    cash: '☕ Loyal customers +{v}', americano: '☕ AMERICANO ×2', stamps: '🎟 +{n} STAMP', cupcakes: '🧁 +{n} CUPCAKE', matchaHint: '', convert: '☕ {n} MATCHA TURNED INTO REAL COFFEE: {s}!',
                    matchaAlone: 'Specialty coffee brewed.', tease: '📖📖 Two Recipe Books! Will the third one land...?', retrig: '📖 {n} RECIPE BOOKS! +{n} FREE SPINS!',
                    betLock: 'You can’t change the bet during Auto Spin or Free Spins!', autoLock: 'You can’t toggle Auto Spin during Free Spins!', autoOn: 'Auto Spin on.', autoOff: 'Auto Spin off.',
                    rainStart: '🧁 OVEN FULL! CAKE RAIN: cupcakes are JOKERS for {n} spins!', saved: 'Game saved.'
                },
                banner: { fs: 'FREE SPINS! Left:', exp: 'Expanding symbol:', rain: 'CAKE RAIN! Left:', rainInfo: 'Cupcakes are JOKERS 🧁', badgeFs: 'FREE SPIN', badgeRain: 'CAKE RAIN', mult: '⚡ TOTAL MULTIPLIER ×{v}' },
                tier: t => t > 0 ? `⭐ TIER ${t} · +${t * 4}% WINS` : '⭐ TIER 0',
                nb: { title: 'BARISTA NOTEBOOK!', found: '3 Recipe Books found! The notebook is opening...', picking: 'The notebook is choosing today’s symbol...', result: 'Expanding symbol: <b>{s}</b>! {n} Free Spins begin{f}.<br><small>If {min}+ {s} land on screen, it fills the reels.</small>', filtre: ' (☕ Filter Coffee)', extra: '(+{k} extra book bonus)', start: 'START FREE SPINS 🚀', cover: 'BARISTA<br>NOTEBOOK', backTop: 'TODAY’S', back: 'Special Recipe' },
                oven: { title: 'OVEN', tip: 'Each cupcake heats the oven. When full, Cake Rain begins!' },
                loy: { title: 'LOYALTY CARD', tip: 'Loyalty card: a free drink every 10 stamps', full: 'LOYALTY CARD FULL!', pick: 'Choose your free drink:', empty: 'Pick a drink when the card is full',
                       filtreB: '☕ Filter: next FS 20', americanoB: '☕ Americano ×2 · {n} spins', latteB: '🥛 Latte: Wild +{n}%', maxed: 'Can be chosen at most {n} times',
                       drinks: { filtre: ['Filter Coffee', 'Your next free spins will be <b>20</b>.'], americano: ['Americano', '<b>×2</b> on your next <b>10 spins</b>.'], latte: ['Latte', 'Wild (Recipe Book) chance <b>+10%</b> for this stage.'] },
                       ready: '{d} is ready!', said: { filtre: 'Your next free spin bonus will last 20 spins.', americano: 'Your wins are ×2 for the next 10 spins!', latte: 'Recipe Books now land more often (+10%).' } },
                bust: { rescue: 'Whoops, your bank is empty, kiddo! I brought you <b>{v}</b> beans from my reserve. (Once per chapter.)', t: 'YOUR BANK IS EMPTY!', txt: 'You’re out of beans! Every 6 hours you play, <b>{v}</b> beans are gifted to your bank. Time until the next gift:', video: '🎬 WATCH VIDEO (+{v})', wait: '⏳ WAIT', waitMsg: 'Your next gift arrives in {t}. Watch a video in the Shop to get beans right away.' },
                gift: { got: '6-hour gift: +{v} beans added to your bank! ☕', video: '🎬 Video watched: +{v} beans!' },
                bigwin: ['BIG WIN!', 'MEGA WIN!', 'EPIC WIN!'], bigwinTap: 'tap to continue',
                fsdone: { t: 'FREE SPINS OVER!', txt: 'Your total win', mult: 'Total multiplier ×{v}', ok: 'CONTINUE ☕' },
                done: { cont: 'BACK TO THE REELS', shop: '🛠 WORKSHOP' },
                tut: { spin: 'Press <b>SPIN</b> to spin and progress', book: 'Press the <b>BOOK</b> button for detailed info', ok: 'GOT IT' },
                info: {
                    title: '📖 Recipe Book', ok: 'GOT IT', paysT: '💎 Symbol Payouts (line bet × value)',
                    rulesT: '🎯 20 Paylines & Rules',
                    pages: { era: 'Era Power', rules: 'Rules', book: 'Recipe Book', high: 'High Symbols', low: 'Coffee Symbols', special: 'This Branch Only', lines: 'Paylines', keys: 'Buttons' },
                    eraNote: 'Every era of history has its own power; it ends with the era and the next one begins. The era shop sells looks from that age.',
                    bookTxt: 'The Recipe Book is both <b>Wild</b> (substitutes for every symbol) and <b>Scatter</b>: it pays anywhere on the screen.<br>• <b>3 Books</b> = <b>{n} Free Spins</b>.<br>• <b>Every book above 3 adds +1 Free Spin</b> (4 books = {n}+1, 5 books = {n}+2…).<br>• The book opens, its pages flip fast and an <b>expanding symbol</b> is picked. If it lands often enough during free spins it fills its reels top to bottom and pays on every line.',
                    linesTxt: 'Wins are counted left to right on <b>{n} paylines</b>. Only the highest win per line is paid; wins on different lines are added together.',
                    rules: (E, s) => `Matching symbols on active lines from left to right pay. Values are multiplied by the <b>line bet (bet ÷ 20)</b>; the paytable shows them in beans for your current bet. The <b>Recipe Book</b> is both Wild and Scatter: 3 Recipe Books = <b>${E.freeSpins} Free Spins</b>, and each book above 3 adds <b>+1 Free Spin</b>. If 3+ Books land again during free spins, <b>that many</b> free spins are added.<br><b>Expanding symbol:</b> if the notebook’s symbol lands at least <b>2</b> (high symbols) or <b>3</b> (others) times during free spins, it fills its reels and pays on <b>all 20 lines</b>.<br><b>Bet tier:</b> raising your bet (every 3 steps, up to 5 tiers) adds +4% to wins and slightly raises the Book chance.` + (E.reels === 6 ? '<br><b>6th reel active:</b> 6 of a kind pays 2.5× the 5-of-a-kind prize.' : ''),
                    keysT: '🎮 Buttons & Functions',
                    keys: [
                        ['SPIN', 'Spins the reels. The bet is taken from your bank. On PC the <b>Space</b> key spins too.'],
                        ['AUTO', 'Turns auto spin on/off. The bet is locked while it’s on.'],
                        ['− / +', 'Moves your bet down/up the stage’s bet ladder. Higher bets = faster but riskier.'],
                        ['BOOK', 'Opens this page: rules, paytable, paylines and all buttons. Browse pages with ◀ ▶ (arrow keys on PC).'],
                        ['🎰 LEVER', 'A slot lever bought in Workshop › Lever sits to the right of the machine; tap it to spin.'],
                        ['⭐ TIER', 'The badge at the top-left of the reels shows your bet tier and win bonus.'],
                        ['🎯 GOAL BAR', 'Shows your bank versus the goal. 🎁 checkpoints give rewards. At the goal the <b>🏪 branch button</b> on the right unlocks and you buy the next branch; leftover beans stay in your bank.'],
                        ['🗺 MAP', 'Opens the town map. The game is saved automatically.'],
                        ['🛠 WORKSHOP', 'Spend bank beans to upgrade symbols and skills permanently.'],
                        ['🏠 MENU', 'Back to the main menu. Your progress is saved; use “Continue” to resume.'],
                        ['🔊', 'Turns sound and music on/off.'],
                        ['FREE SPIN COUNTER', 'Shows the spins left during Free Spins and Cake Rain.'],
                        ['⚡ MULTIPLIER BEAN', 'Sometimes a multiplier bean strikes the reels with lightning (×2 – ×100). If that spin wins, the win is multiplied. In free spins multipliers add up (max ×25) and multiply every following win.'],
                        ['🎉 BIG WIN', 'Wins of 15× your bet show a Big Win, 40× Mega and 100× Epic celebration. Tap to speed it up.'],
                        ['🛒 SHOP · GIFT', 'Every 6 hours you play, 1,000 beans are added to your bank. Watch an ad in the Shop any time for +1,000 beans.']
                    ],
                    specialT: '🍵 Matcha → Coffee & 🥛 Pitcher (from stage 2)',
                    pitcher: (E) => `Reels 1, 3, 5.<br>Substitutes for other symbols on lines.<br>3 on screen = <b>Latte Art Bonus: ${fx(E.latteMult)}× bet</b>`,
                    matcha: (E) => `Can land on any reel.<br><b>All matchas on screen turn into one random coffee symbol</b> and are evaluated as that symbol. It never breaks a line.<br>On stage 2 every 15 matchas = <b>Coffee Victory</b> (10× bet).`,
                    specialNote: 'Matcha is SyruppoLab’s drink; we turn it into real coffee every time. No penalty, only bonus!',
                    ovenT: '🧁 Oven & Cake Rain (stage 3)', oven: (E) => `Each <b>Oven Cupcake</b> adds 1 to the oven meter. At <b>${E.ovenFull}</b> cupcakes: <b>Cake Rain</b>, ${E.ovenSpins} free spins where cupcakes land often and are <b>JOKERS</b>.`,
                    bagT: '🌾 Harvest (stage 4)', bag: (E) => `<b>Coffee Sacks</b> pay anywhere (× bet): 3 → 2×, 4 → 6×, 5 → 20×, 6 → 60×, 7+ → 150×${E.bagMult > 1 ? ' (Workshop ×' + fx(E.bagMult) + ')' : ''}.`,
                    loyT: '☕ Loyalty Card (Finale)', loy: '<b>Stamps</b> rarely land on the reels (no line pay). Every <b>10 stamps</b> pick a free drink:<br>• <b>Filter Coffee:</b> your next free spins will be 20.<br>• <b>Americano:</b> ×2 on the next 10 spins.<br>• <b>Latte:</b> Wild chance +10% for this stage (max twice).'
                },
                phase: {
                    1: [['cozybear', 'BlueBird', 'The queue keeps growing, Bearista! We’re halfway there, visit the workshop too!']],
                    2: [['barista', 'Bearista', 'We turn every matcha into real coffee! SyruppoLab’s shop is empty...']],
                    3: [['bakingbear', 'Baker Bear', 'The ovens are warming up, the festival crowd is ours!']],
                    4: [['cozybear', 'BlueBird', 'The sacks are filling up! SyruppoLab can’t corner the beans!']],
                    5: [['barista', 'Bearista', 'The outer walls of Syrup Castle are cracking! Keep going!'], ['cozybear', 'BlueBird', 'The gates are shaking... I can smell syrup inside!'], ['book', 'SyruppoLab Boss', 'Impossible! A handful of bears breaking my castle?!']]
                },
                phaseReward: '  🎁 +{v} beans!',
                newStage: { 4: ['cozybear', 'BlueBird', 'The wind blows hard on this hill; don’t neglect your Workshop upgrades!'], 5: ['barista', 'Bearista', 'The finale is tough! Power up in the Workshop before you challenge SyruppoLab.'] },
                reel6Said: 'The 6th reel is installed! 6 of a kind now pays a super prize.',
                finalDone: 'You saved the town! Keep playing freely as long as you like.'
            }
        };
        function fx(v) { const s = (Math.round(v * 100) / 100).toString(); return CUR_LANG() === 'en' ? s : s.replace('.', ','); }
        let _lang = 'tr';
        function CUR_LANG() { return _lang; }
        function L() { return I18N[_lang]; }
        function tf(str, vars) { return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] !== undefined) ? vars[k] : m); }
        function symName(id) { return L().sym[id] || id; }
        function stageName(n) { return L().stage[n].name; }
        function upName(u) { const d = L().up; return u.group === 'symbol' ? d.sym.n(symName(u.sym)) : d[u.id].n; }
        function upDesc(u, l) { const d = L().up; return u.group === 'symbol' ? d.sym.d(l) : d[u.id].d(l); }

        /* Statik metinler: data-i18n="yol.anahtar" (textContent) / data-i18n-html (innerHTML) */
        function getPath(o, path) { return path.split('.').reduce((a, k) => (a ? a[k] : undefined), o); }
        function applyStaticI18n() {
            document.documentElement.lang = L().htmlLang;
            document.querySelectorAll('[data-i18n]').forEach(el => { const v = getPath(L(), el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
            document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = getPath(L(), el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
        }
