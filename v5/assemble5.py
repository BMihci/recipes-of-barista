import re
SRC = 'template_v4_final.html'
t = open(SRC, encoding='utf-8').read()

def rep(old, new, count=1):
    global t
    assert old in t, 'MISSING: ' + old[:90]
    t = t.replace(old, new, count)

# ---------- yazı tipleri: Türkçe (latin-ext) destekli ----------
rep('<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@700&family=Fredoka:wght@400;500;600;700&family=Nunito:wght@500;600;700;800&display=swap" rel="stylesheet">',
    '<style>/*__FONTS__*/</style>')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', '<script>/*__THREE__*/</script>')
t = re.sub(r'\s*<link rel="preconnect"[^>]*>', '', t)
rep('<meta name="viewport"', '<meta name="apple-mobile-web-app-capable" content="yes">\n    <meta name="mobile-web-app-capable" content="yes">\n    <meta name="viewport"')
head_end = t.index('<body')
head = t[:head_end]
head = head.replace("'Fredoka'", "'Baloo 2'").replace("'Comic Neue'", "'Patrick Hand'")
# Patrick Hand tek kalınlıkta: anlatım kutusunu biraz büyüt
head = head.replace("        footer.foot {", open('v5/v5.css', encoding='utf-8').read() + "\n        .st-narr { font-size: 1.12rem !important; font-weight: 400 !important; }\n        .narr, #dialog-toast span { font-weight: 400 !important; font-size: 1rem; }\n        footer.foot {", 1)
t = head + t[head_end:]

# ---------- gövde ----------
b0 = t.index('<body')
b1 = t.index('    <script>\n/*__ENGINE__*/')
t = t[:b0] + open('v5/body.html', encoding='utf-8').read() + '\n' + t[b1:]

# ---------- betikler ----------
j0 = t.index("        /* =====================================================\n           OYUN VERİSİ")
j1 = t.index("    </script>\n</body>")
parts = ''.join(open('v5/' + f, encoding='utf-8').read().rstrip('\n') + '\n\n' for f in ['i18n.js', 'i18n_meta.js', 'data.js', 'meta.js', 'cosm.js', 'notify.js', 'cloud.js', '3d.js', 'story_head.js', 'story_body.js', 'main.js', 'dede_svg.js', 'dede.js'])
boot = """        /* =====================================================
           KLAVYE (PC): Boşluk = Spin
           ===================================================== */
        document.addEventListener('keydown', (e) => {
            if (e.code !== 'Space') return;
            if (document.body.dataset.mode !== 'game') return;
            if (document.querySelector('.modal.open')) return;
            if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
            e.preventDefault();
            spinReels();
        });
        /* sayfa kapanırken / arka plana geçerken kaydet */
        window.addEventListener('pagehide', () => { if (Game.save && !gameState.isSpinning) persist(); });
        document.addEventListener('visibilitychange', () => { if (document.hidden && Game.save && !gameState.isSpinning) persist(); });

        /* =====================================================
           BAŞLAT
           ===================================================== */
        if (Settings.muted) toggleMute();
        setMuteIcon();
        document.body.classList.toggle('lowfx', lowFx());
        updateTurboUI();
        PWA.init();
        Cloud.init();
        Dede.mount();
        applyA11y();
        applyTheme();
        setTimeout(() => showNews(false), 900);
        if (Settings.notif) Notify.plan();
        setInterval(() => { if (typeof checkDailyGift === 'function') checkDailyGift(); }, 30000);
        renderMenu();
        const preloadPromise = preloadAssets()
            .then(() => (document.fonts && document.fonts.ready) ? document.fonts.ready.catch(() => {}) : null)
            .then(() => { for (const k in texCache) delete texCache[k]; buildPayTable(); });
"""
t = t[:j0] + parts + boot + t[j1:]

# ses: müzik ve efekt ayrı kanal (Ayarlar)
a0 = t.index('        /* =====================================================\n           SES (değişmedi)')
a1 = t.index('        /* =====================================================\n           DİL DESTEĞİ (TR / EN)')
t = t[:a0] + open('v5/audio.js', encoding='utf-8').read() + t[a1:]

open('template.html', 'w', encoding='utf-8').write(t)
print('ok', len(t.splitlines()))
for bad in ['Fredoka', 'Comic Neue', 'SyrupressoLab', 'Bubukuş', 'workshopEarn', 'cashOut', 'openHighScores']:
    if bad in t: print('LEFTOVER', bad, t.count(bad))
