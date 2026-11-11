// Recipes of Barista — Android projesini Play Store için ayarlar.
// 'npx cap add android' sonrasında ve her 'npm run sync' öncesinde çalışır. Birden fazla çalıştırmak güvenlidir.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'app_config.json'), 'utf8'));
const A = path.join(ROOT, 'android');
const log = m => console.log('  ✓ ' + m), warn = m => console.log('  ! ' + m);

// 1) www/index.html: AdMob ödüllü reklam kimliğini oyuna ver
const idx = path.join(ROOT, 'www', 'index.html');
if (fs.existsSync(idx)) {
  let h = fs.readFileSync(idx, 'utf8').replace(/<script id="rob-config">[\s\S]*?<\/script>/, '');
  const tag = `<script id="rob-config">window.ROB_CONFIG=${JSON.stringify(Object.assign({ admobRewarded: cfg.admobRewarded || '' }, typeof cfg.testAds === 'boolean' ? { testAds: cfg.testAds } : {}))};</script>`;
  h = h.replace(/<head>/i, '<head>' + tag);
  fs.writeFileSync(idx, h); log('www/index.html → ROB_CONFIG');
} else warn('www/index.html yok (oyunun HTML dosyasını www/index.html olarak koy)');

if (!fs.existsSync(A)) { warn('android/ klasörü yok — önce: npx cap add android'); process.exit(0); }

// 2) AndroidManifest: AdMob uygulama kimliği, reklam kimliği izni, yalnızca dikey ekran
const man = path.join(A, 'app/src/main/AndroidManifest.xml');
let m = fs.readFileSync(man, 'utf8');
m = m.replace(/\s*<meta-data android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"[^>]*\/>/g, '');
m = m.replace(/<application([^>]*)>/, `<application$1>\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${cfg.admobAppId}"/>`);
const perms = ['android.permission.INTERNET', 'com.google.android.gms.permission.AD_ID', 'com.android.vending.BILLING'];
perms.forEach(p => { if (!m.includes(`"${p}"`)) m = m.replace(/<application/, `<uses-permission android:name="${p}" />\n    <application`); });
if (!/android:screenOrientation=/.test(m)) m = m.replace(/<activity([^>]*?)android:name="\.MainActivity"/, '<activity$1android:screenOrientation="portrait" android:name=".MainActivity"');
fs.writeFileSync(man, m); log('AndroidManifest.xml (AdMob APPLICATION_ID, AD_ID, BILLING, dikey)');

// 3) SDK sürümleri (Play: yeni uygulamalar ve güncellemeler targetSdk 36)
const vg = path.join(A, 'variables.gradle');
if (fs.existsSync(vg)) {
  let v = fs.readFileSync(vg, 'utf8');
  v = v.replace(/minSdkVersion\s*=\s*\d+/, `minSdkVersion = ${cfg.minSdk}`)
       .replace(/compileSdkVersion\s*=\s*\d+/, `compileSdkVersion = ${cfg.compileSdk}`)
       .replace(/targetSdkVersion\s*=\s*\d+/, `targetSdkVersion = ${cfg.targetSdk}`);
  fs.writeFileSync(vg, v); log(`variables.gradle (min ${cfg.minSdk}, compile ${cfg.compileSdk}, target ${cfg.targetSdk})`);
}

// 4) Sürüm kodu / adı
const bg = path.join(A, 'app/build.gradle');
let b = fs.readFileSync(bg, 'utf8');
b = b.replace(/versionCode\s+\d+/, `versionCode ${cfg.versionCode}`).replace(/versionName\s+"[^"]*"/, `versionName "${cfg.versionName}"`);
fs.writeFileSync(bg, b); log(`app/build.gradle (versionCode ${cfg.versionCode}, versionName ${cfg.versionName})`);

// 5) Firebase yerel Google girişi: google-services.json varsa kopyala
const gs = path.join(ROOT, 'google-services.json');
if (fs.existsSync(gs)) { fs.copyFileSync(gs, path.join(A, 'app/google-services.json')); log('google-services.json kopyalandı'); }
else warn('google-services.json yok → Google ile giriş Android\'de çalışmaz (rehber: Adım 6). E-posta ile giriş çalışır.');

// 6) Uygulama adı (strings.xml)
const sx = path.join(A, 'app/src/main/res/values/strings.xml');
if (fs.existsSync(sx)) {
  let s = fs.readFileSync(sx, 'utf8').replace(/(<string name="app_name">)[^<]*/, '$1Recipes of Barista').replace(/(<string name="title_activity_main">)[^<]*/, '$1Recipes of Barista');
  fs.writeFileSync(sx, s); log('strings.xml');
}
if (cfg.admobAppId.startsWith('ca-app-pub-3940256099942544')) warn('AdMob TEST kimlikleri kullanılıyor — yayından önce app_config.json içine kendi kimliklerini yaz.');
console.log('Hazır.');
