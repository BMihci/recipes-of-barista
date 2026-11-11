# Recipes of Barista — Sunucu Ayarları

## 1) Veritabanı kuralları (ÜCRETSİZ, hemen yap)
Firebase konsolu → Firestore Database → **Rules** → içeriği sil → bu klasördeki `firestore.rules` dosyasını yapıştır → **Yayınla**.
Bu kurallar skor tablosuna gelen uçuk sıçramaları, çok sık yazmayı ve geçersiz alanları reddeder.

## 2) Sunucu doğrulaması (isteğe bağlı, Blaze planı)
Skorları oyuncunun buluttaki kayıtlarıyla karşılaştırıp sahte olanları düzelten Cloud Function `functions/` klasöründe hazır.
Firebase'in **Blaze (kullandıkça öde)** planı gerekir; küçük bir oyun için aylık ücretsiz kotada kalır.
```
npm install -g firebase-tools
firebase login
cd functions && npm install && cd ..
firebase deploy --only functions,firestore:rules
```
Doğrulanan skorlar skor tablosunda ✓ ile görünür.

## 3) Kapalı uygulamaya bildirim (ileride)
Oyun şu an hatırlatmaları uygulama açıkken / arka plandayken ve Android'de yüklü uygulamada tarayıcının arka plan kontrolüyle gösteriyor.
Uygulama tamamen kapalıyken garanti bildirim için Firebase Cloud Messaging + zamanlanmış bir Cloud Function gerekir (Blaze planı); istersen birlikte ekleriz.


## v6.0 (Zaman Yolculuğu Sagası) güncellemesi
- Skor artık `bölüm × 1 milyar + Zaman Hazinesi (milyon)` olarak tek alanda (`best`) tutuluyor.
- `firestore.rules` (yeni artış sınırı) ve `functions/index.js` (yeni doğrulama) değişti: ikisini de yeniden yayınla:
  `firebase deploy --only firestore:rules,functions`
- İstersen Firestore konsolundan eski `leaderboard` belgelerini sil; oyuncular oyuna girince yeni skorları kendiliğinden yazılır.

## v7.0 (Filtre Kahve) güncellemesi — Arkadaş daveti
- `firestore.rules` dosyasına iki yeni koleksiyon eklendi: `invites` (kodun sahibi) ve `redemptions` (her hesap bir kez kod kullanır).
  Blaze planı gerekmez; sadece kuralları yeniden yayınla: Firebase konsolu → Firestore → Rules → yapıştır → **Yayınla**
  (ya da `firebase deploy --only firestore:rules`).
- Kurallar şunları engeller: kendi kodunu kullanmak, ikinci kez kod kullanmak, var olmayan kodu kullanmak, başkasının adına kayıt yazmak.
- Davet eden kişi en fazla **10 arkadaş** için çekirdek ödülü alır (oyun içinde sınırlı), Dost seti 1/3/5 arkadaşta açılır.
- Hesap silindiğinde oyun `invites/{kod}` ve `redemptions/{uid}` belgelerini de siler.
- Firestore ilk sorguda **dizin (index)** isteyebilir: `redemptions` için `inviter` alanında tek alanlı dizin otomatik vardır; konsolda hata linki çıkarsa linke tıklayıp oluştur.
- Sahte hesapla davet istismarına karşı ek önlem istersen (ör. yalnızca Google ile girişte davet), kurala
  `&& request.auth.token.firebase.sign_in_provider == 'google.com'` satırını `redemptions` → `create` koşuluna ekleyebilirsin.

## Android (Google Play) için Firebase ayarı
Oyun Android'de WebView içinde çalıştığından Google ile giriş **yerel (native)** yapılmalıdır. Adımlar `android_project/PLAY_STORE_REHBERI.md` içinde (SHA-1 parmak izi, `google-services.json`).
Ayrıca Firebase konsolu → Authentication → Settings → **Authorized domains** listesinde `localhost` bulunduğundan emin ol (Capacitor uygulaması `https://localhost` adresinden çalışır).
