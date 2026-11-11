import asyncio
from playwright.async_api import async_playwright
W='/home/claude/work'
T={'tr-TR':('Kahve kokulu sevimli bir slot macerası','100 BÖLÜM • ZAMAN YOLCULUĞU • ÇİZGİ ROMAN'),
'en-US':('A cozy coffee slot adventure','100 CHAPTERS • TIME TRAVEL • COMIC STORY'),
'de-DE':('Ein gemütliches Kaffee-Slot-Abenteuer','100 KAPITEL • ZEITREISE • COMIC'),
'es-ES':('Una acogedora aventura cafetera','100 CAPÍTULOS • VIAJE EN EL TIEMPO • CÓMIC'),
'pt-BR':('Uma aventura aconchegante com café','100 CAPÍTULOS • VIAGEM NO TEMPO • QUADRINHOS'),
'iw-IL':('הרפתקת סלוט קפה חמימה','100 פרקים • מסע בזמן • קומיקס'),
'ja-JP':('コーヒー香るほっこりスロット冒険','全100章 • 時間旅行 • コミック'),
'ko-KR':('커피 향 가득 포근한 슬롯 모험','100장 • 시간 여행 • 만화 스토리'),
'zh-CN':('温馨的咖啡老虎机冒险','100章 • 时空旅行 • 漫画故事')}
HTML='''<html><head><style>
@font-face{font-family:B;src:url(file://%(W)s/fonts/baloo2.woff2)}
body{margin:0;width:1024px;height:500px;overflow:hidden;position:relative;font-family:B,'Noto Sans CJK JP','Noto Sans Hebrew',sans-serif}
.bg{position:absolute;inset:-20px;background:url(file://%(W)s/bg_a.jpg) center/cover;filter:blur(5px) brightness(1.08) saturate(.9)}
.veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(251,239,216,.95) 0,rgba(251,239,216,.85) 45%%,rgba(251,239,216,.15) 75%%)}
.t{position:absolute;left:56px;top:70px;font-size:96px;line-height:.98;font-weight:800;color:#6B4226;text-shadow:0 4px 0 #fff}
.s{position:absolute;left:58px;top:300px;font-size:28px;font-weight:700;color:#8A5530;white-space:nowrap}
.c{position:absolute;left:56px;top:370px;background:linear-gradient(#F3A63B,#D9822B);color:#fff;font-size:21px;font-weight:800;padding:8px 20px;border-radius:999px;box-shadow:0 4px 0 #A55D17;letter-spacing:.5px}
img{position:absolute;filter:drop-shadow(0 6px 8px rgba(80,40,10,.25))}
</style></head><body dir="ltr"><div class="bg"></div><div class="veil"></div>
<img src="file://%(W)s/sym/barista.png" style="right:170px;bottom:-10px;height:330px">
<img src="file://%(W)s/sym/cozybear.png" style="right:10px;bottom:-6px;height:250px">
<img src="file://%(W)s/sym/bakingbear.png" style="right:345px;bottom:-14px;height:170px">
<img src="file://%(W)s/sym/goldenbean.png" style="right:120px;top:40px;height:90px;transform:rotate(-15deg)">
<img src="file://%(W)s/sym/book.png" style="right:330px;top:30px;height:120px;transform:rotate(8deg)">
<div class="t">Recipes of<br>Barista</div><div class="s" %(dir)s>%(s)s</div><div class="c" %(dir)s>%(c)s</div></body></html>'''
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1024,'height':500})
        for k,(s,c) in T.items():
            open('/tmp/claude-0/fg.html','w').write(HTML%{'W':W,'s':s,'c':c,'dir':'dir="rtl"' if k=='iw-IL' else ''})
            await pg.goto('file:///tmp/claude-0/fg.html'); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'{W}/out/play_store/feature_graphic/{k}.png')
        await b.close()
asyncio.run(run())
