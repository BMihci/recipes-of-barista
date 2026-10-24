import re, io
SRC = 'template_v3_delivered.html'
t = open(SRC, encoding='utf-8').read()

def rep(old, new, count=1):
    global t
    assert old in t, 'MISSING: ' + old[:90]
    t = t.replace(old, new, count)

BEAN = '<img class="bean-ic" data-sym="coffeebag" alt="">'

# ---------- CSS ----------
rep("        footer.foot {", open('v4/extra.css', encoding='utf-8').read() + "\n        footer.foot {")

# ---------- HTML: üst bar ----------
rep("""<span id="hud-wallet" class="wallet-chip" onclick="openShop()" title="Atölye çekirdeği — Barista Atölyesi'ni aç">🫘 <span id="hud-wallet-val">0</span></span>""",
    f"""<span id="hud-wallet" class="wallet-chip" onclick="openShop()" title="Atölye çekirdeği — Barista Atölyesi'ni aç">{BEAN} <span id="hud-wallet-val">0</span></span>""")
rep("""<button class="btn btn-sm btn-green" onclick="cashOut()">💰<span class="tx"> CASH OUT</span></button>""",
    """<button id="cashout-btn" class="btn btn-sm btn-green" onclick="askCashOut()">💰<span class="tx"> CASH OUT</span></button>""")
rep("""<button class="btn btn-sm btn-soft" onclick="returnToMenu()">🏠<span class="tx"> MENÜ</span></button>""",
    """<button class="btn btn-sm btn-soft" onclick="askMenu()">🏠<span class="tx"> MENÜ</span></button>""")
rep("""🛠 BARİSTA ATÖLYESİ (🫘 <span id="menu-wallet">0</span>)""", f"""🛠 BARİSTA ATÖLYESİ ({BEAN} <span id="menu-wallet">0</span>)""")

# ---------- HTML: eski hikâye ekranları → animasyonlu hikâye oynatıcı ----------
i0 = t.index('            <!-- 2. HİKAYE (çizgi roman) -->')
i1 = t.index('            <!-- 3. SLOT -->')
story = """            <!-- 2. HİKÂYE (animasyonlu çizgi roman) -->
            <section id="screen-story" class="screen">
                <div class="story">
                    <div class="comic-head">
                        <h2 class="comic-title" id="st-title">HİKÂYE</h2>
                        <span class="comic-issue" id="st-issue">SAYI #1</span>
                    </div>
                    <div class="st-stage" id="st-stage" onclick="StoryPlayer.tap()" title="Devam etmek için dokun"></div>
                    <div class="st-narr" id="st-narr"></div>
                    <div class="st-nav">
                        <div class="st-dots" id="st-dots"></div>
                        <div style="display:flex;gap:10px">
                            <button class="st-btn" id="st-skip" onclick="StoryPlayer.skip()">ATLA ⏭</button>
                            <button class="st-btn next" id="st-next" onclick="StoryPlayer.next()">İLERİ ▶</button>
                        </div>
                    </div>
                    <div id="st-cta" class="hidden"></div>
                </div>
            </section>

"""
t = t[:i0] + story + t[i1:]

# ---------- HTML: hedef çubuğu + sadakat kartı ----------
rep("""                <div id="goal-bar" class="pill">
                    <span class="gt" id="goal-title">🎯 BÖLÜM 1</span>
                    <div class="track"><div class="fill" id="goal-fill"></div></div>
                    <span class="gn" id="goal-num">0 / 100.000</span>
                </div>
""", """                <div id="goal-bar" class="pill">
                    <span class="gt" id="goal-title">🎯 BÖLÜM 1</span>
                    <div class="trackwrap">
                        <div class="track"><div class="fill" id="goal-fill"></div></div>
                        <div id="goal-marks"></div>
                    </div>
                    <span class="gp" id="goal-pct">%0</span>
                    <span class="gn" id="goal-num">0 / 100.000</span>
                </div>

                <div id="loyalty" title="Sadakat kartı: her 10 damgada ücretsiz içecek">
                    <div class="lc-head"><img data-sym="stamp" alt=""><span>SADAKAT KARTI</span></div>
                    <div class="slots" id="lc-slots"></div>
                    <span class="lc-count" id="lc-count">0/10</span>
                    <div id="lc-buffs"></div>
                </div>
""")

# ---------- HTML: modallar ----------
rep("""            <div id="pay-special" class="rule-box hidden">""", """            <div id="pay-loyalty" class="rule-box hidden">
                <h4>☕ Sadakat Kartı (Bölüm 3)</h4>
                <p>Makaralarda nadiren <b>Damga</b> sembolü çıkar (hat ödemez). Ekrandaki her damga karta işlenir; <b>10 damgada</b> ücretsiz içeceğini seçersin:<br>
                • <b>Filtre Kahve:</b> sonraki free spin'lerin 20 tane olur.<br>
                • <b>Americano:</b> sonraki 10 çevirimde ×2 çarpan.<br>
                • <b>Latte:</b> Wild (Reçete Kitabı) ihtimali bu bölüm boyunca +%10 (en fazla 2 kez).</p>
            </div>
            <div id="pay-special" class="rule-box hidden">""")
rep("""<p>Kahve çekirdeklerin tükendi ve SyrupressoLab kasabayı ele geçirdi... 🏛️💸<br><b>Atölye çekirdeklerin duruyor (🫘 <span id="go-wallet">0</span>).</b> Güçlenip tekrar dene!</p>""",
    f"""<p>Kahve çekirdeklerin tükendi ve SyruppoLab kasabayı ele geçirdi... 🏛️💸<br><b>Atölye çekirdeklerin duruyor ({BEAN} <span id="go-wallet">0</span>).</b> Güçlenip tekrar dene!</p>""")
rep("""<div class="wallet-chip" style="cursor:default">🫘 <span id="chapters-wallet">0</span> Atölye çekirdeği</div>""",
    f"""<div class="wallet-chip" style="cursor:default">{BEAN} <span id="chapters-wallet">0</span> Atölye çekirdeği</div>""")
rep("""<span class="wallet-chip" style="cursor:default">🫘 <span id="shop-wallet">0</span></span>""",
    f"""<span class="wallet-chip" style="cursor:default">{BEAN} <span id="shop-wallet">0</span></span>""")
rep("""    <div id="dialog-toast">""", """    <div id="modal-drink" class="modal">
        <div class="panel">
            <div class="modal-art"><img data-sym="stamp" alt=""></div>
            <h3 class="good-title">SADAKAT KARTI DOLDU!</h3>
            <p>Ücretsiz içeceğini seç:</p>
            <div class="drinks" id="drink-list"></div>
        </div>
    </div>

    <div id="modal-confirm" class="modal">
        <div class="panel">
            <div class="modal-art" id="cf-art"></div>
            <h3 id="cf-title" class="bad-title">UYARI</h3>
            <p id="cf-text"></p>
            <div class="row">
                <button class="btn btn-soft" onclick="closeModal('modal-confirm')">VAZGEÇ</button>
                <button class="btn" id="cf-ok">ONAYLA</button>
            </div>
        </div>
    </div>

    <div id="dialog-toast">""")

# ---------- JS ----------
j0 = t.index("        /* =====================================================\n           OYUN VERİSİ")
j1 = t.index("        /* =====================================================\n           KLAVYE (PC)")
parts = ''.join(open('v4/' + f, encoding='utf-8').read().rstrip('\n') + '\n\n' for f in ['part_data.js', 'part_3d.js', 'part_story.js', 'part_main.js'])
t = t[:j0] + parts + t[j1:]

# ses kapatınca hikâye müziği de dursun
rep("""                muteBtn.innerText = '🔇';
                stopCasinoMusic();
                stopBonusMusic();""", """                muteBtn.innerText = '🔇';
                stopCasinoMusic();
                stopBonusMusic();
                if (typeof StoryMusic !== 'undefined') StoryMusic.stop(true);""")
rep("""                muteBtn.innerText = '🔊';
                if (document.body.dataset.mode !== 'game') return;""", """                muteBtn.innerText = '🔊';
                if (document.body.dataset.screen === 'screen-story') { StoryMusic.start(StoryPlayer.theme() || 'cozy'); return; }
                if (document.body.dataset.mode !== 'game') return;""")

# genel isim değişiklikleri (kalan metinlerde)
t = t.replace('SyrupressoLab', 'SyruppoLab').replace('SYRUPRESSOLAB', 'SYRUPPOLAB').replace('Bubukuş', 'MaviKuş')

open('template.html', 'w', encoding='utf-8').write(t)
print('ok', len(t.splitlines()), 'lines')
for bad in ['🫘', 'Bubukuş', 'Syrupresso', 'SYRUPRESSO', 'screen-intro']:
    if bad in t: print('LEFTOVER', bad, t.count(bad))
