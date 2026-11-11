# Recipes of Barista – 3D Deluxe · çalışma notu

Tek dosya HTML slot/hikâye oyunu (Three.js r128). Geliştirici: Limited Education · Paket: `com.limitededucation.recipesofbarista`.

## Depolar ve sürüm akışı (Barış'ın talimatı)
- **Private repo** `BMihci/RecipesOfBaristaGuncel` → her zaman **en yeni** sürüm.
- **Public repo** `BMihci/recipes-of-barista` → her zaman **bir önceki** sürüm.
- Yeni bir sürüm çıkınca: yeni sürüm private repoya, private'ta duran önceki sürüm public repoya pushlanır.
- Her sürüm `main`'de tek commit + `surum/vX.Y.Z` dalı (ortam tag pushlamaya izin vermiyor).
- Commit yazarı: `BMihci <BMihci@users.noreply.github.com>` (gerçek e-posta herkese açık depoda kullanılmaz).

## Derleme
```
python3 v5/assemble5.py   # v5/ + lang/ → template.html
python3 build.py          # → out/recipes_of_barista_3d_deluxe.html, out/test.html, out/web/, out/android_project/, out/play_store/
```
Gerekenler: Python 3 + Pillow, Node + esbuild (`npm i esbuild`). Bulut için kökte `firebase_config.json` (depoda yok).
`out/test.html` THREE yerine `stub.js` kullanır (hızlı otomatik testler için).

## Yapı
| Yol | İçerik |
|---|---|
| `v5/` | Oyun kaynakları. `assemble5.py` dosya sırasını belirler. `lang/*.js` = de/es/pt/he/ja/ko/zh paketleri (TR/EN `i18n*.js` içinde). |
| `v5/platform.js` | Reklam (AdMob + test reklamları), Google Play satın alma, paylaşım |
| `v5/v7.js`, `v5/px_txt.js` | Premium mağaza, davet, hukuki onay; 9 dilde yeni metinler |
| `engine.js` | Slot motoru ve oyun matematiği (RTP, ödemeler) |
| `legal/` | Gizlilik / koşullar / hesap silme sayfaları ve Play Store belgeleri üreticileri |
| `android_src/` | Capacitor 8 Android kabuğu, kurulum betikleri, `PLAY_STORE_REHBERI.md` |
| `server/` | Firestore kuralları, Cloud Functions, `KURULUM.md` |
| `tools/sync_repo.py` | Çalışma klasörünü bir depo klasörüne kopyalar |

## Kurallar
- Çekirdek (oyun parası) asla gerçek parayla satılmaz; satılanlar kozmetik / reklamsızlık.
- Yeni metin = 9 dilin hepsi. İbranice sağdan sola; CJK düzenini telefon genişliğinde kontrol et.
- Her sürümde `version.json` (num, name 9 dil, notes 9 dil, history) güncellenir.
