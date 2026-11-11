#!/usr/bin/env bash
# Recipes of Barista — Android projesini kurar (macOS / Linux)
# Gerekli: Node.js 22+, Android Studio (Otter 2025.2 veya yenisi), JDK 21
set -e
cd "$(dirname "$0")"
echo "1/4  Paketler kuruluyor…"
npm install
echo "2/4  Android projesi oluşturuluyor…"
[ -d android ] || npx cap add android
echo "3/4  Simgeler ve açılış ekranı…"
npm run icons || echo "  (simge üretimi atlandı — Android Studio > Image Asset ile de yapabilirsin)"
echo "4/4  Ayarlar uygulanıyor ve eşitleniyor…"
npm run sync
echo
echo "Bitti! Android Studio'yu açmak için:  npm run open"
echo "İmzalı AAB: Android Studio > Build > Generate Signed App Bundle (rehber: PLAY_STORE_REHBERI.md, Adım 5)"
