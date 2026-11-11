import base64, json, glob, os, sys
from PIL import Image
def b64(path, mime): return f"data:{mime};base64," + base64.b64encode(open(path,'rb').read()).decode()
# --- görseller: derleme önbelleğinde WebP'ye sıkıştırılır (kaynaklar değişmez) ---
CACHE = 'build_cache'; os.makedirs(CACHE, exist_ok=True)
def webp(src, q, key):
    dst = f'{CACHE}/{key}.webp'
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        im = Image.open(src); im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
        im.save(dst, 'WEBP', quality=q, method=6)
    return dst
def symsrc(f):
    png = f[:-5] + '.png'
    return webp(png, 84, 'sym_' + os.path.basename(f)[:-5]) if os.path.exists(png) else f
sym = {os.path.basename(f)[:-5]: b64(symsrc(f), 'image/webp') for f in sorted(glob.glob('sym/*.webp'))}
assets = {'sym': sym, 'bgMenu': b64(webp('bg_a.jpg', 72, 'bg_a72'), 'image/webp'), 'bgGame': b64(webp('bg_b.jpg', 72, 'bg_b72'), 'image/webp')}
js = "const ASSETS = " + json.dumps(assets) + ";"
# gömülü yazı tipleri (Türkçe karakterli alt küme) — internet gerekmez
FONTS = [('Baloo 2', 'baloo2', '400 800'), ('Bangers', 'bangers', '400'), ('Patrick Hand', 'patrick', '400'), ('Nunito', 'nunito', '200 1000')]
fonts_css = ''.join(f"@font-face{{font-family:'{fam}';src:url({b64('fonts/'+fn+'.woff2','font/woff2')}) format('woff2');font-weight:{w};font-style:normal;font-display:swap}}" for fam, fn, w in FONTS)
fb = 'null'
if os.path.exists('firebase_config.json'):
    fb = json.dumps(json.load(open('firebase_config.json')))
tpl = open('template.html', encoding='utf-8').read()
base = (tpl.replace('/*__ASSETS__*/', js)
           .replace('/*__ENGINE__*/', open('engine.js', encoding='utf-8').read())
           .replace('/*__FONTS__*/', fonts_css)
           .replace('/*__FBCONFIG__*/null', fb)
           .replace("/*__VERSION__*/{ num: '0', name: { tr: '', en: '' }, notes: { tr: [], en: [] } }", json.dumps({k: v for k, v in json.load(open('version.json', encoding='utf-8')).items() if k != 'codenames'}, ensure_ascii=False)))
assert '/*__VERSION__*/' not in base
assert '/*__FBCONFIG__*/' not in base
# --- küçültme (esbuild): kod ve stiller ---
import subprocess
open(f'{CACHE}/raw.html', 'w', encoding='utf-8').write(base)
print(subprocess.run(['node', 'minify.js', f'{CACHE}/raw.html', f'{CACHE}/min.html'], capture_output=True, text=True, check=True).stdout.strip())
base = open(f'{CACHE}/min.html', encoding='utf-8').read()
os.makedirs('out', exist_ok=True)
three = open('vendor_three_r128.min.js', encoding='utf-8').read()
html = base.replace('/*__THREE__*/', three)
open('out/recipes_of_barista_3d_deluxe.html','w',encoding='utf-8').write(html)
# test sürümü: gerçek three.js yerine 2B önizleme
open('out/test.html','w',encoding='utf-8').write(base.replace('/*__THREE__*/', open('stub.js', encoding='utf-8').read()))
# web (PWA) klasörü: index.html + manifest + service worker + simgeler
W = 'out/web'; os.makedirs(W, exist_ok=True)
open(W + '/index.html', 'w', encoding='utf-8').write(html)
from PIL import ImageDraw
src = Image.open('sym/barista.png').convert('RGBA'); src = src.crop(src.getbbox())
def make_icon(S):
    bg = Image.new('RGBA', (S, S)); d = ImageDraw.Draw(bg)
    for r in range(S // 2 * 3 // 2, 0, -2):
        q = r / (S * 0.75); d.ellipse((S/2-r, S*0.42-r, S/2+r, S*0.42+r), fill=(int(255-40*q), int(214-70*q), int(140-70*q), 255))
    w = S; h = int(src.height * w / src.width)
    bg.alpha_composite(src.resize((w, h), Image.LANCZOS), (0, S - h))
    return bg.convert('RGB')
for s in (192, 512): make_icon(s).quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(f'{W}/icon-{s}.png', optimize=True)
make_icon(180).save(f'{W}/apple-touch-icon.png')
shots = []
for i, n in enumerate(['2game', '3map', '4album', '1menu']):
    pth = f'out/store/phone_tr_{n}.png'
    if os.path.exists(pth):
        Image.open(pth).convert('RGB').resize((540, 960), Image.LANCZOS).save(f'{W}/shot{i+1}.jpg', quality=82)
        shots.append({"src": f"shot{i+1}.jpg", "sizes": "540x960", "type": "image/jpeg", "form_factor": "narrow"})
json.dump({"id": "/", "name": "Recipes of Barista – 3D Deluxe", "short_name": "Barista", "description": "Kahve kokulu sevimli bir slot macerası: 5 şube, hikâye, Kahve Dede'nin çarpanları, free spin ve koleksiyon albümü.",
           "categories": ["games", "entertainment"], "screenshots": shots,
           "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
           "background_color": "#FBEFD8", "theme_color": "#6B4226", "lang": "tr",
           "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]},
          open(W + '/manifest.webmanifest', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
ver = str(int(os.path.getmtime('template.html')))
open(W + '/sw.js', 'w', encoding='utf-8').write(f"""// Çevrimdışı önbellek: oyun tek dosya, ilk açılıştan sonra internetsiz çalışır
const C = 'rob-v{ver}';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
// hatırlatmalar: tarayıcı izin verdikçe (yüklü uygulamada) arka planda kontrol edilir
async function remind() {{
  try {{
    const c = await caches.open('rob-meta'); const r = await c.match('/__reminders'); if (!r) return;
    const d = await r.json(); const now = Date.now(); let ch = false;
    for (const x of d.list) {{ if (!x.sent && x.at <= now && now - x.at < 12 * 3600e3) {{ await self.registration.showNotification(x.title, {{ body: x.body, icon: d.icon, badge: d.icon, tag: 'rob-' + x.id }}); x.sent = true; ch = true; }} }}
    if (ch) await c.put('/__reminders', new Response(JSON.stringify(d)));
  }} catch (e) {{}}
}}
self.addEventListener('periodicsync', e => {{ if (e.tag === 'rob-reminders') e.waitUntil(remind()); }});
self.addEventListener('notificationclick', e => {{
  e.notification.close();
  e.waitUntil(clients.matchAll({{ type: 'window', includeUncontrolled: true }}).then(l => l.length ? l[0].focus() : clients.openWindow('./')));
}});
self.addEventListener('fetch', e => {{
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Firebase vb. dış istekler önbelleğe alınmaz
  e.respondWith(fetch(e.request).then(r => {{ const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }}).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
}});
""")
print(round(len(html)/1e6,2),'MB', 'fb' if fb!='null' else 'no-fb')
# hukuki sayfalar (gizlilik, kullanım koşulları, hesap silme) + app-ads.txt şablonu
subprocess.run([sys.executable, 'legal/make_legal.py', W], check=True)
# --- Android (Capacitor) projesi: android_src + oyun (www) + simge/açılış kaynakları ---
import shutil
AP = 'out/android_project'
if os.path.isdir(AP): shutil.rmtree(AP)
shutil.copytree('android_src', AP)
os.makedirs(AP + '/www', exist_ok=True)
open(AP + '/www/index.html', 'w', encoding='utf-8').write(html)
for f in ('privacy.html', 'terms.html', 'delete-account.html'): shutil.copy(f'{W}/{f}', f'{AP}/www/{f}')
os.makedirs(AP + '/resources', exist_ok=True)
make_icon(1024).save(AP + '/resources/icon-only.png')
fg = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0)); ic = src.resize((640, int(src.height * 640 / src.width)), Image.LANCZOS)
fg.alpha_composite(ic, ((1024 - ic.width) // 2, (1024 - ic.height) // 2 + 40)); fg.save(AP + '/resources/icon-foreground.png')
Image.new('RGB', (1024, 1024), (251, 239, 216)).save(AP + '/resources/icon-background.png')
sp = Image.new('RGB', (2732, 2732), (251, 239, 216)); ic = src.resize((900, int(src.height * 900 / src.width)), Image.LANCZOS)
sp.paste(ic, ((2732 - ic.width) // 2, (2732 - ic.height) // 2), ic); sp.save(AP + '/resources/splash.png'); sp.save(AP + '/resources/splash-dark.png')
print('android project ok')
subprocess.run([sys.executable, 'legal/make_store.py'], check=True)
