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
