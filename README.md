# Recipes of Barista – 3D Deluxe

Slot makinesi mekanikleriyle ilerleyen kısa ve sevimli bir kahve macerası. Tek dosya HTML oyun (Three.js r128).

**Bu commit: sürüm 6.2.0** · Geliştirici: Limited Education

## Oynamak
`recipes_of_barista_3d_deluxe.html` dosyasını indirip tarayıcıda aç. Tüm görseller, yazı tipleri ve three.js dosyanın içindedir; internet olmadan da çalışır (bulut kaydı ve sıralama hariç).

## Diğer sürümler
Her V7 öncesi sürüm kendi dalında durur: `surum/v4.0`, `surum/v5.3`, `surum/v5.4`, `surum/v5.5.1`, `surum/v6.1.0`, `surum/v6.2.0`. GitHub'da dal seçicisinden (main yazan menü) sürümü seç ve `recipes_of_barista_3d_deluxe.html` dosyasını indir. `main` dalının geçmişinde de her sürüm ayrı bir commit olarak görünür. Değişiklikler: [CHANGELOG.md](CHANGELOG.md).

## Kaynaktan derleme
```
python3 v5/assemble5.py      # v5/ kaynaklarını template.html'de birleştirir
python3 build.py             # görselleri/fontları gömer, küçültür → out/recipes_of_barista_3d_deluxe.html
```
Gerekenler: Python 3 + Pillow, Node.js + esbuild (`minify.js` içindeki esbuild yolunu kendi kurulumuna göre düzenle). Bulut kaydı için kök klasöre `firebase_config.json` koyulur (depoda yok; yoksa bulut özellikleri kapalı derlenir).

| Klasör/dosya | İçerik |
|---|---|
| `v5/` | Oyun kaynakları (arayüz, 3D sahne, hikâye, mağaza, ses…) |
| `engine.js` | Slot motoru ve oyun matematiği |
| `template_v4_final.html` | Temel HTML iskeleti |
| `sym/`, `bg_*.jpg`, `fonts/` | Görseller ve yazı tipleri |
