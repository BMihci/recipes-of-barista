import asyncio, sys
from playwright.async_api import async_playwright
LG=sys.argv[1]; OUT='/home/claude/work/out/play_store/screenshots'
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
        ctx=await b.new_context(viewport={'width':360,'height':640},device_scale_factor=3,locale=LG); pg=await ctx.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        await pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('file:','data:','blob:')) else r.abort())
        E=pg.evaluate
        async def idle(ms=30000):
            for _ in range(ms//300):
                if not await E("!!gameState.isSpinning"): break
                await pg.wait_for_timeout(300)
        await pg.goto('file:///home/claude/work/out/recipes_of_barista_3d_deluxe.html'); await pg.wait_for_timeout(1500)
        await E(f"Settings.legal=9; document.querySelectorAll('.lg-wrap').forEach(e=>e.remove()); setLang('{LG}'); Settings.seenVer=APP_VERSION.num; Settings.turbo=true; Profile.seenDede=true; Profile.daily={{streak:1,last:dayStr(0)}}; Profile.nick='Bearista'; ALL_MODALS.forEach(closeModal); 0")
        await E("Game.slot=0; Game.save=newSave('Bearista'); Game.save.stage=2; for(let i=1;i<=2;i++)Game.save.seen['stage'+i]=true; Game.save.tut=true; loadIntoState(Game.save); gameState.balance*=30; persist(); continueSlot(0); 0")
        await pg.wait_for_timeout(1500); await E("mapClick(2)"); await pg.wait_for_timeout(3000); await E("ALL_MODALS.forEach(closeModal)"); await pg.wait_for_timeout(600)
        for i in range(12):
            await E("spinReels()"); await pg.wait_for_timeout(400); await idle(); await pg.wait_for_timeout(700)
            w = await E("(gameState.lastWin||0)>0 || /\\+/.test(document.getElementById('message')?.textContent||'')")
            await E("ALL_MODALS.forEach(closeModal)")
            if w and i>=2: break
        await pg.wait_for_timeout(3500); await E("achQueue.length=0; const t=document.getElementById('ach-toast'); if(t) t.style.display='none'")
        await pg.screenshot(path=f'{OUT}/{LG}_1_game.jpg'); await E("const t=document.getElementById('ach-toast'); if(t) t.style.display=''")
        await E("Cinema.play('s2', ()=>{})"); await pg.wait_for_timeout(8000)
        await pg.screenshot(path=f'{OUT}/{LG}_2_comic.jpg')
        await E("ALL_MODALS.forEach(closeModal); document.querySelectorAll('.cin-wrap,.comic-wrap,#cinema').forEach(e=>e.remove&&e.style&&(e.style.display='none'))")
        await pg.goto('file:///home/claude/work/out/recipes_of_barista_3d_deluxe.html'); await pg.wait_for_timeout(1500)
        await E(f"Settings.legal=9; document.querySelectorAll('.lg-wrap').forEach(e=>e.remove()); setLang('{LG}'); ALL_MODALS.forEach(closeModal); continueSlot(0); 0")
        await pg.wait_for_timeout(2000)
        await pg.screenshot(path=f'{OUT}/{LG}_3_map.jpg')
        await E("openHub('looks')"); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=f'{OUT}/{LG}_4_looks.jpg'); await E("ALL_MODALS.forEach(closeModal)")
        await E("openStore()"); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=f'{OUT}/{LG}_5_store.jpg'); await E("ALL_MODALS.forEach(closeModal)")
        await E("switchScreen('screen-menu'); renderMenu()"); await pg.wait_for_timeout(900)
        await pg.screenshot(path=f'{OUT}/{LG}_6_menu.jpg')
        print(LG,'errs',errs[:4]); await b.close()
asyncio.run(run())
