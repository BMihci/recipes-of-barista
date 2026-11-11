# Recipes of Barista – 3D Deluxe

Slot makinesi mekanikleriyle ilerleyen kısa ve sevimli bir kahve macerası. Tek dosya HTML oyun (Three.js r128) · Geliştirici: Limited Education

**Bu commit: sürüm 7.0.0 “Filtre Kahve”** — 9 dil, ödüllü video, kozmetik mağaza, arkadaş daveti, Google Play'e hazır Android projesi.

## Oynamak
`recipes_of_barista_3d_deluxe.html` dosyasını indirip tarayıcıda aç. Tüm görseller, yazı tipleri ve three.js dosyanın içindedir; internet olmadan da çalışır (bulut kaydı, sıralama ve davet hariç).

## Diğer sürümler
Her sürüm kendi dalında durur: `surum/v4.0`, `surum/v5.3`, `surum/v5.4`, `surum/v5.5.1`, `surum/v6.1.0`, `surum/v6.2.0`, `surum/v7.0.0`. Dal menüsünden sürümü seçip HTML dosyasını indirebilirsin. Değişiklikler: [CHANGELOG.md](CHANGELOG.md).

## Kaynaktan derleme
```
python3 v5/assemble5.py
python3 build.py
```
Gerekenler: Python 3 + Pillow, Node.js + esbuild (`npm i esbuild`). Çıktılar `out/` klasörüne: oyun, web (Netlify) paketi, Android projesi, Play Store belgeleri. Ayrıntı: [CLAUDE.md](CLAUDE.md).

## Android / Google Play
`android_src/PLAY_STORE_REHBERI.md` — hesap açmaktan yayına kadar adım adım.
