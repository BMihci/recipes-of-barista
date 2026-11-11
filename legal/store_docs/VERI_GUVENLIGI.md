# Veri Güvenliği formu (Play Console › Uygulama içeriği › Veri güvenliği)

Bu cevaplar oyunun 7.0.0 sürümüne ve kullandığı SDK'lara (Firebase Authentication, Cloud Firestore, Google Mobile Ads/AdMob + UMP, Google Play Faturalandırma) göre hazırlandı.
Kaynak: Google'ın AdMob için yayımladığı veri beyanı rehberi — https://developers.google.com/admob/android/privacy/play-data-disclosure

## Genel sorular
| Soru | Cevap |
|---|---|
| Uygulamanız gerekli kullanıcı veri türlerinden herhangi birini topluyor veya paylaşıyor mu? | **Evet** |
| Toplanan tüm kullanıcı verileri aktarım sırasında şifreleniyor mu? | **Evet** (HTTPS/TLS) |
| Kullanıcıların verilerinin silinmesini isteyebileceği bir yol sağlıyor musunuz? | **Evet** – uygulama içinde (Profil › Hesabımı sil) ve web: `https://recipes-of-barista.netlify.app/delete-account.html` |
| Hesap oluşturma | Kullanıcılar hesap oluşturabilir (isteğe bağlı): **E-posta/şifre** ve **Google ile giriş** |

## Veri türleri

| Kategori › Tür | Toplanıyor | Paylaşılıyor | İsteğe bağlı mı | Geçici mi | Amaçlar |
|---|---|---|---|---|---|
| Kişisel bilgiler › **E-posta adresi** | Evet | Hayır | İsteğe bağlı (yalnızca giriş yapılırsa) | Hayır | Uygulama işlevselliği, Hesap yönetimi |
| Kişisel bilgiler › **Ad** | Evet | Hayır | İsteğe bağlı (Google girişi adı / takma ad) | Hayır | Uygulama işlevselliği, Hesap yönetimi |
| Kişisel bilgiler › **Kullanıcı kimlikleri** | Evet | Hayır | İsteğe bağlı | Hayır | Uygulama işlevselliği, Hesap yönetimi, Sahtekârlığı önleme/güvenlik (davet sistemi) |
| Fotoğraflar ve videolar › **Fotoğraflar** | Evet | Hayır | İsteğe bağlı (kullanıcının seçtiği profil resmi) | Hayır | Uygulama işlevselliği, Kişiselleştirme |
| Finansal bilgiler › **Satın alma geçmişi** | Evet | Hayır | İsteğe bağlı (yalnızca satın alma yapılırsa) | Hayır | Uygulama işlevselliği |
| Uygulama etkinliği › **Uygulama etkileşimleri** | Evet | **Evet** (AdMob) | Zorunlu değil* | Hayır | Uygulama işlevselliği (bulut kaydı, skor), Analiz, Reklam veya pazarlama, Sahtekârlığı önleme |
| Uygulama etkinliği › **Kullanıcı tarafından oluşturulan diğer içerik** (takma ad) | Evet | Hayır | İsteğe bağlı | Hayır | Uygulama işlevselliği |
| Konum › **Yaklaşık konum** (IP'den, AdMob) | Evet | **Evet** | Zorunlu değil* | Hayır | Reklam veya pazarlama, Sahtekârlığı önleme, Analiz |
| Uygulama bilgileri ve performansı › **Teşhis** (AdMob) | Evet | **Evet** | Zorunlu değil* | Hayır | Analiz, Sahtekârlığı önleme |
| Cihaz veya diğer kimlikler › **Cihaz veya diğer kimlikler** (Reklam kimliği, App Set ID) | Evet | **Evet** | Zorunlu değil* | Hayır | Reklam veya pazarlama, Analiz, Sahtekârlığı önleme |

\* Reklam verileri yalnızca kullanıcı **isteğe bağlı ödüllü videoyu** izlediğinde/SDK başlatıldığında işlenir. Form “kullanıcı bu veri toplamayı seçebilir mi” diye sorarsa: AdMob SDK uygulama açılışında başlatıldığı için **Hayır (zorunlu)** seçmek daha güvenli bir beyandır.

**Toplanmayanlar:** Hassas konum, kişiler, mesajlar, ses, takvim, sağlık, finansal hesap/kart bilgileri (ödemeyi Google Play işler), web tarama geçmişi, yüklü uygulamalar.

## Kısa özet (mağazada görünecek)
- Üçüncü taraflarla paylaşılan veriler: Konum, Uygulama etkinliği, Uygulama bilgileri ve performansı, Cihaz veya diğer kimlikler
- Toplanan veriler: Kişisel bilgiler, Fotoğraflar, Finansal bilgiler, Uygulama etkinliği, Konum, Uygulama bilgileri ve performansı, Cihaz veya diğer kimlikler
- Veriler aktarım sırasında şifrelenir · Veri silme talep edilebilir
