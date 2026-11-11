# Recipes of Barista 7.0.0 “Filtre Kahve” — Google Play Yayın Rehberi

Paket adı: **com.limitededucation.recipesofbarista** · Geliştirici adı: **Limited Education** · İletişim: omermihci94@gmail.com
Web sitesi (gizlilik, koşullar, hesap silme, app-ads.txt): **https://recipes-of-barista.netlify.app**

> Hesap açma, kimlik doğrulama, ödeme ve imzalama adımlarını **sen** yaparsın; bu klasördeki her şey hazır. Kimlikleri (AdMob, Firebase) yalnızca `app_config.json` ve `google-services.json` dosyalarına yazman yeterli.

---

## Klasörde neler var?

| Dosya | Ne işe yarar |
|---|---|
| `www/index.html` | Oyunun kendisi (tek dosya) + `privacy.html`, `terms.html`, `delete-account.html` |
| `package.json`, `capacitor.config.json` | Capacitor 8 Android kabuğu ve eklentiler (AdMob, Google Play Faturalandırma, Paylaş, Firebase Google girişi) |
| `app_config.json` | **AdMob kimlikleri** ve sürüm (versionCode 70000 / 7.0.0) |
| `scripts/patch-android.js` | AndroidManifest, SDK 36, sürüm, AdMob kimliği gibi ayarları otomatik yapar |
| `kurulum.sh` / `kurulum.bat` | Tek komutla kurulum (macOS-Linux / Windows) |
| `resources/` | Uygulama simgesi ve açılış ekranı kaynakları |
| `../play_store/` | Mağaza metinleri (9 dil), ekran görüntüleri, öne çıkan görsel, simge, ürün listesi, Veri Güvenliği ve İçerik Derecelendirmesi cevapları |

---

## Adım 1 — Google Play Console hesabı (bir kez, 25 $)

1. https://play.google.com/console adresine Google hesabınla gir → **Kişisel** ya da **Kuruluş** hesabı seç.
   - “Limited Education” bir şirketse **Kuruluş** seç (D-U-N-S numarası gerekir, ücretsiz alınır ama birkaç gün sürebilir).
   - Şirket değilse **Kişisel** hesap aç; geliştirici adı olarak yine “Limited Education” yazabilirsin, ancak kimliğin yasal adınla doğrulanır.
2. 25 $ kayıt ücretini öde, **kimlik doğrulamasını** (kimlik kartı/pasaport) ve telefon doğrulamasını tamamla.
3. **Ödeme profili** (Payments profile) oluştur — uygulama içi satış için zorunludur. Banka hesabını ve vergi bilgilerini gir.
   - ⚠️ Uygulama içi satış yapan geliştiricilerin **adresi mağazada herkese açık** gösterilir. Ev adresini göstermek istemiyorsan bir iş adresi kullan.
4. Kişisel hesaplar (Kasım 2023 sonrası açılanlar) için kural: üretime çıkmadan önce **en az 12 test kullanıcısıyla 14 gün boyunca kapalı test** zorunlu (Adım 10).

## Adım 2 — AdMob (ödüllü video) hesabı

1. https://admob.google.com → aynı Google hesabıyla kaydol, ödeme ve vergi bilgilerini doldur.
2. **Uygulamalar → Uygulama ekle → Android** → “Henüz yayında değil” seç → ad: *Recipes of Barista*.
3. Oluşan **Uygulama kimliği**ni kopyala (biçim: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`).
4. **Reklam birimleri → Ödüllü (Rewarded)** → ad: *Video Hediye* → ödül: 1 / “beans” → oluştur. **Reklam birimi kimliğini** kopyala (biçim: `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ`).
5. `app_config.json` dosyasını aç:
   ```json
   "admobAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
   "admobRewarded": "ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ",
   ```
6. **Gizlilik ve mesajlaşma → GDPR**: “GDPR mesajı oluştur” → uygulamayı seç → yayınla. (Oyun bu formu AB/İngiltere'de ilk açılışta otomatik gösterir; Ayarlar › Hukuki ve Hesap › *Reklam gizlilik seçenekleri* ile tekrar açılır.)
7. **app-ads.txt**: AdMob → Uygulamalar → app-ads.txt bölümündeki satırı kopyala → web sitesindeki `app-ads.txt` dosyasına (Netlify klasörü `web/app-ads.txt`) yaz ve yeniden yayınla. Play listesinde “Web sitesi” alanına aynı alan adını gir.

> **Test reklamları:** Kimlikleri girmeden derlersen reklam izleme yerlerinde (Mağaza › Reklam izle ve “Kasan boşaldı” penceresi) **Google'ın resmi AdMob test reklamı** çıkar; reklam yüklenemezse oyunun kendi 15 sn'lik **TEST REKLAMI** ekranı gösterilir (web sürümünde de bu ekran görünür). Gerçek kimlikleri yazınca test reklamları kendiliğinden kapanır. Kimlik girdikten sonra da test reklamı görmek istersen `app_config.json` içine `"testAds": true` ekle — yayından önce sil. Web'de denemek için adrese `?testads=1` (kapatmak için `?testads=0`) ekleyebilirsin.
> Kendi reklamlarına **asla kendin tıklama**; test ederken AdMob'a cihazını “test cihazı” olarak ekle.

## Adım 3 — Bilgisayarı hazırla

- **Node.js 22+** → https://nodejs.org
- **Android Studio** (Otter 2025.2 veya yenisi) → https://developer.android.com/studio — kurulumda Android SDK 36 ve JDK 21 gelir.
- Bu klasörü bilgisayarına kopyala.

## Adım 4 — Projeyi kur

```
macOS / Linux:   ./kurulum.sh
Windows:         kurulum.bat   (çift tıkla)
```
Betik sırasıyla: `npm install` → `npx cap add android` → simge/açılış ekranı üretimi → ayarları uygula (`scripts/patch-android.js`) → `npx cap sync android`.

Sonra `npm run open` ile Android Studio'da aç. Bir telefonu USB ile bağlayıp ▶ (Run) ile deneyebilirsin.

**Oyunu güncellediğinde:** yeni `index.html` dosyasını `www/` içine koy → `npm run sync`. AdMob kimliğini değiştirdiğinde de `npm run sync`.

## Adım 5 — İmzalı App Bundle (AAB)

1. Android Studio → **Build → Generate Signed App Bundle or APK → Android App Bundle**.
2. **Create new…** ile bir *upload key* (yükleme anahtarı) oluştur: dosyayı (`upload-keystore.jks`) ve şifreleri **güvenli bir yere yedekle** — kaybedersen güncelleme yükleyemezsin (Google'dan sıfırlama istemek gerekir).
3. *release* seç → **Create**. Çıktı: `android/app/release/app-release.aab`.
4. Play Console ilk yüklemede **Play Uygulama İmzalama**'yı (Play App Signing) açar; kabul et.
5. Sonraki sürümlerde `app_config.json` içindeki `versionCode`'u artır (ör. 70001) ve `versionName`'i güncelle.

## Adım 6 — Firebase: Android'de Google ile giriş

Oyun Android'de Google girişini yerel (native) yapar. E-posta ile giriş bu adım olmadan da çalışır.

1. https://console.firebase.google.com → **recipes-of-barista** projesi → ⚙ Proje ayarları → **Uygulama ekle → Android**.
2. Paket adı: `com.limitededucation.recipesofbarista`.
3. **SHA-1 parmak izleri** ekle (üçü de):
   - Hata ayıklama: Android Studio → sağdaki Gradle → `app > Tasks > android > signingReport` (veya `cd android && ./gradlew signingReport`).
   - Yükleme anahtarı: aynı rapor, *release* satırı.
   - **Play uygulama imzalama anahtarı**: Play Console → uygulaman → Test et ve yayınla → **Uygulama bütünlüğü → Uygulama imzalama** → “SHA-1 sertifika parmak izi”.
4. `google-services.json` dosyasını indir → bu klasörün köküne koy → `npm run sync` (betik `android/app/` içine kopyalar).
5. Firebase → Authentication → Sign-in method → **Google**'ın açık olduğundan emin ol. Authentication → Settings → Authorized domains listesinde `localhost` olsun.
6. Firestore kurallarını güncelle (davet sistemi): `server/firestore.rules` → Firebase konsolu → Firestore → Rules → yapıştır → Yayınla. (Ayrıntı: `server/KURULUM.md`.)

## Adım 7 — Play Console'da uygulamayı oluştur

**Tüm uygulamalar → Uygulama oluştur**
- Uygulama adı: `Recipes of Barista: Kahve Slot` (diğer diller `play_store/listing/` içinde)
- Varsayılan dil: **Türkçe – tr-TR**
- Uygulama mı oyun mu: **Oyun** · Ücretsiz mi ücretli mi: **Ücretsiz**
- Beyanlar: Geliştirici Program Politikaları ✔, ABD ihracat yasaları ✔

## Adım 8 — Uygulama içeriği (Politika › Uygulama içeriği)

| Bölüm | Cevap |
|---|---|
| Gizlilik politikası | `https://recipes-of-barista.netlify.app/privacy.html` |
| Reklamlar | **Evet, uygulamam reklam içeriyor** (yalnızca isteğe bağlı ödüllü video) |
| Uygulama erişimi | **Tüm işlevler özel erişim gerektirmeden kullanılabilir** (giriş isteğe bağlı) |
| İçerik derecelendirmesi | `play_store/ICERIK_DERECELENDIRME.md` cevaplarıyla IARC anketini doldur |
| Hedef kitle ve içerik | Yaş grubu: **yalnızca 18 ve üzeri** · Çocuklara hitap ediyor mu: **Hayır** |
| Veri güvenliği | `play_store/VERI_GUVENLIGI.md` cevapları · Hesap silme URL'si: `https://recipes-of-barista.netlify.app/delete-account.html` |
| Devlet uygulaması / Finansal özellikler / Sağlık | Hayır / Hiçbiri / Hayır |
| Haber uygulaması | Hayır |
| Reklam kimliği (Advertising ID) | **Evet, kullanıyor** → amaç: *Reklam veya pazarlama* |

> **Simüle kumar politikası:** Oyunun mağaza açıklamasında “gerçek para ile kumar yok, gerçek ödül yok, 18+” uyarısı zaten var (bkz. listeleme dosyaları). Oyun içinde de ilk açılışta yaş onayı ve kullanım koşulları gösterilir. Çekirdek satılmaz; satılan her şey kozmetiktir — bu, Play'in “ganimet kutusu / gerçek para” kurallarıyla uyumu kolaylaştırır.

## Adım 9 — Mağaza girişi (Büyüme › Mağaza varlığı › Ana mağaza girişi)

- Metinler: `play_store/listing/tr-TR.txt` (ad, kısa açıklama, tam açıklama). **Çeviri ekle** ile diğer 8 dili de yapıştır (İbranice'nin Play kodu `iw-IL`).
- Uygulama simgesi: `play_store/play_icon_512.png` (512×512)
- Öne çıkan görsel (1024×500): `play_store/feature_graphic/<dil>.png` — her dil için ayrı
- Telefon ekran görüntüleri: `play_store/screenshots/<dil>_*.jpg` (1080×1920, her dil için 6 adet)
- Kategori: **Oyun → Casino** · Etiketler: Kumarhane, Gündelik, Hikâye
- İletişim: e-posta `omermihci94@gmail.com`, web sitesi `https://recipes-of-barista.netlify.app`

## Adım 10 — Test → Yayın

1. **Dahili test** (Test et ve yayınla → Test → Dahili test): AAB'yi yükle, kendini test kullanıcısı olarak ekle, telefondan indir ve dene.
2. **Uygulama içi ürünler** (Para kazanma → Ürünler → Uygulama içi ürünler): AAB yüklendikten sonra açılır. `play_store/uygulama_ici_urunler.csv` dosyasındaki **13 ürünü** aynı *Product ID*'lerle oluştur (ID'ler oyunun içinde sabittir, değiştirme). Fiyat: TRY → “Diğer ülkeler için fiyatları otomatik dönüştür”. Durum: **Etkin**.
   - Test satın alma: Ayarlar → **Lisans testi** listesine kendi Gmail'ini ekle → gerçek para çekilmeden satın alma denenir.
3. **Kapalı test** (kişisel hesaplar için zorunlu): en az **12 kişiyi** e-posta listesine ekle, katılım bağlantısını gönder. Testçiler **14 gün kesintisiz** katılmış olmalı. Beta testçilere oyun içi kod: **BETA-BARISTA-2026** (Ayarlar › Test kodu → Beta Tester seti).
4. 14 gün dolunca Kontrol paneli → **Üretime erişim başvurusu** → soruları cevapla (test sırasında neyi düzelttin vb.).
5. Onaydan sonra **Üretim** → yeni sürüm → AAB → sürüm notları (`listing/*.txt` en altta) → **kademeli yayın** (%20 ile başla) → incelemeye gönder. İlk inceleme birkaç gün sürebilir.

## Adım 11 — Yayından sonra

- AdMob → uygulamayı Play mağazasındaki girişine **bağla** (Uygulama ayarları → Mağaza ekle).
- app-ads.txt'nin AdMob'da “doğrulandı” göründüğünü kontrol et (24 saate kadar sürebilir).
- Play Console → **Android vitals** ve **Kullanıcı yorumları**'nı takip et.
- Güncelleme: oyunu derle → `www/index.html` → `app_config.json` versionCode +1 → `npm run sync` → yeni AAB.

---

### Sık karşılaşılan sorunlar

| Sorun | Çözüm |
|---|---|
| `npm install` peer-dependency hatası | `npm install --legacy-peer-deps` |
| Reklam gelmiyor | Yeni AdMob birimleri birkaç saat boş dönebilir; oyun bu durumda 5 sn'lik kendi “sponsor arası”nı gösterir ve ödülü yine verir. |
| “Ürün bulunamadı” | Ürünler **Etkin** mi, Product ID'ler birebir aynı mı, uygulama Play'den (dahili test) mi yüklendi? |
| Google girişi “10:” hatası | SHA-1 parmak izlerinden biri eksik (özellikle Play imzalama anahtarı). |
| Tablette yatay ekran | Android 16 büyük ekranlarda yön kilidini yok sayar; oyun yatay/masaüstü yerleşimini destekler. |
| Hedef API uyarısı | `app_config.json` → targetSdk 36 (Ağustos 2026'dan beri yeni uygulamalar için zorunlu). |
