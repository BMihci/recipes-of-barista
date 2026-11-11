# Google Play mağaza belgeleri: listeleme metinleri (9 dil), uygulama içi ürünler, veri güvenliği, içerik derecelendirmesi
# Kullanım: python3 legal/make_store.py  → out/play_store/
import os, json, csv
OUT = 'out/play_store'; os.makedirs(OUT + '/listing', exist_ok=True)
WEB = 'https://recipes-of-barista.netlify.app'; MAIL = 'omermihci94@gmail.com'

L = {
'tr-TR': dict(
 title='Recipes of Barista: Kahve Slot',
 short='Sevimli ayılarla kahve kokulu slot macerası: çizgi roman ve zaman yolculuğu!',
 full="""☕ Recipes of Barista – 3D Deluxe, slot makinesi mekanikleriyle ilerleyen kısa ve sevimli bir kahve macerası!

Bearista, Mavi Kuş ve Fırıncı Ayı'nın küçük kafesi, şurup kokulu dev zincir SyruppoLab'a karşı ayakta kalmaya çalışıyor. Çarkları çevir, çekirdek biriktir, yeni şubeler aç ve kasabayı kurtar. Sonra Kahve Dede'nin zaman makinesine atla: Antik Mısır'dan caz çağı New York'una 100 bölümlük bir zaman yolculuğu seni bekliyor!

🎰 5 makaralı, 20 çizgili 3D slot – free spin, genişleyen semboller, Matcha Savaşı, Kek Yağmuru, Hasat ödemeleri ve sadakat kartı
📚 Marvel tarzı çizgi roman sayfalarıyla anlatılan hikâye ve tam sayfa kapaklar
⏳ 9 tarihî dönem, her dönemin kendine has gücü ve kostümleri
👴 Kahve Dede'nin cezvesinden yağan çarpanlar (×100'e kadar!)
🛠 Atölyede sembollerini ve yeteneklerini kalıcı olarak güçlendir
🏅 Rozetler, koleksiyon albümü, günlük ödüller, görevler ve dünya sıralaması
🎨 Çerçeve, şapka, fincan ve kol görünümleri
🤝 Arkadaşını davet et, birlikte ödül kazanın
🌍 9 dil · çevrimdışı oynanabilir · bulut kaydı

Önemli: Bu oyun yalnızca yetişkinler (18+) içindir ve eğlence amaçlıdır. Gerçek para ile kumar içermez; gerçek para veya ödül kazanma imkânı sunmaz. Oyun içi çekirdek satın alınamaz ve gerçek bir değeri yoktur. Sosyal casino oyunlarındaki başarı, gerçek para ile oynanan kumarda başarı anlamına gelmez. Satın alınabilen öğeler yalnızca görünümlerdir ve olasılıkları değiştirmez.

Gizlilik: """ + WEB + """/privacy.html
Kullanım koşulları: """ + WEB + "/terms.html",
 notes='9 dil desteği (İbranice, Japonca, Korece, Çince dahil), ödüllü video, premium görünümler, Destekçi Paketi ve arkadaş daveti!'),
'en-US': dict(
 title='Recipes of Barista: Cafe Slots',
 short='A cozy coffee slot adventure with cute bears, comic stories and time travel!',
 full="""☕ Recipes of Barista – 3D Deluxe is a short, cozy coffee adventure driven by slot machine mechanics!

Bearista, Bluebird and Baking Bear's little café is fighting to survive against SyruppoLab, a giant syrup-soaked chain. Spin the reels, collect beans, open new branches and save the town. Then hop into Grandpa Coffee's time machine for a 100-chapter journey from Ancient Egypt to Jazz Age New York!

🎰 5-reel, 20-line 3D slots – free spins, expanding symbols, Matcha Wars, Cake Rain, Harvest pays and a loyalty card
📚 A story told in Marvel-style comic pages with full-page covers
⏳ 9 historical eras, each with its own power and costumes
👴 Multipliers poured from Grandpa Coffee's pot (up to ×100!)
🛠 Permanently upgrade your symbols and skills in the Workshop
🏅 Badges, a collection album, daily rewards, quests and a world leaderboard
🎨 Frame, hat, cup and lever looks
🤝 Invite friends and earn rewards together
🌍 9 languages · plays offline · cloud save

Important: This game is intended for adults (18+) and for entertainment purposes only. It does not offer real-money gambling or an opportunity to win real money or prizes. In-game beans cannot be purchased and have no real-world value. Practice or success at social casino gaming does not imply future success at real-money gambling. Purchasable items are cosmetic only and never change the odds.

Privacy: """ + WEB + """/privacy.html
Terms: """ + WEB + "/terms.html",
 notes='9 languages (including Hebrew, Japanese, Korean and Chinese), rewarded videos, premium looks, the Supporter Pack and friend invites!'),
'de-DE': dict(
 title='Recipes of Barista: Café-Slots',
 short='Gemütliches Kaffee-Slot-Abenteuer mit süßen Bären, Comic-Story und Zeitreise!',
 full="""☕ Recipes of Barista – 3D Deluxe ist ein kurzes, gemütliches Kaffeeabenteuer mit Slotmaschinen-Mechanik!

Das kleine Café von Bearista, Blauvogel und Bäckerbär kämpft gegen SyruppoLab, eine riesige sirupgetränkte Kette. Dreh die Walzen, sammle Bohnen, eröffne neue Filialen und rette die Stadt. Danach geht es mit Opa Brühs Zeitmaschine auf eine Reise durch 100 Kapitel – vom alten Ägypten bis ins New York der Jazz-Ära!

🎰 3D-Slots mit 5 Walzen und 20 Linien – Freispiele, expandierende Symbole, Matcha-Krieg, Kuchenregen, Ernte-Gewinne und Treuekarte
📚 Story in Comicseiten im Marvel-Stil
⏳ 9 historische Epochen mit eigenen Kräften und Kostümen
👴 Multiplikatoren aus Opa Brühs Kanne (bis ×100!)
🛠 Werkstatt-Upgrades, Abzeichen, Sammelalbum, tägliche Belohnungen und Bestenliste
🤝 Freunde einladen · 🌍 9 Sprachen · offline spielbar

Wichtig: Dieses Spiel ist nur für Erwachsene (18+) und dient ausschließlich der Unterhaltung. Es bietet kein Echtgeld-Glücksspiel und keine Möglichkeit, echtes Geld oder Preise zu gewinnen. Bohnen können nicht gekauft werden und haben keinen realen Wert. Erfolg bei Social-Casino-Spielen bedeutet keinen Erfolg bei Echtgeld-Glücksspielen. Kaufbare Inhalte sind rein kosmetisch.

Datenschutz: """ + WEB + "/privacy.html?lang=de",
 notes='9 Sprachen, Belohnungsvideos, Premium-Looks, Unterstützerpaket und Freundeseinladungen!'),
'es-ES': dict(
 title='Recipes of Barista: Café Slots',
 short='Aventura de tragaperras cafetera con osos, cómics y viajes en el tiempo',
 full="""☕ Recipes of Barista – 3D Deluxe es una aventura cafetera corta y acogedora con mecánicas de tragaperras.

El pequeño café de Bearista, Pajarito Azul y Oso Panadero lucha contra SyruppoLab, una cadena gigante empapada en sirope. Gira los rodillos, junta granos, abre nuevas sucursales y salva el pueblo. Después, súbete a la máquina del tiempo del Abuelo Café para un viaje de 100 capítulos, ¡del Antiguo Egipto a la Nueva York del jazz!

🎰 Tragaperras 3D de 5 rodillos y 20 líneas: giros gratis, símbolos expansivos, Guerra del Matcha, Lluvia de Pasteles, cosechas y tarjeta de fidelidad
📚 Historia en páginas de cómic estilo Marvel
⏳ 9 épocas históricas con poderes y trajes propios
👴 Multiplicadores de la cafetera del Abuelo Café (¡hasta ×100!)
🛠 Mejoras del taller, insignias, álbum, recompensas diarias y clasificación mundial
🤝 Invita a amigos · 🌍 9 idiomas · se juega sin conexión

Importante: este juego es solo para adultos (18+) y con fines de entretenimiento. No ofrece apuestas con dinero real ni la posibilidad de ganar dinero o premios reales. Los granos no se pueden comprar y no tienen valor real. El éxito en juegos de casino social no implica éxito en apuestas con dinero real. Los artículos de pago son solo estéticos.

Privacidad: """ + WEB + "/privacy.html?lang=es",
 notes='¡9 idiomas, vídeos con recompensa, looks premium, Pack de Apoyo e invitaciones a amigos!'),
'pt-BR': dict(
 title='Recipes of Barista: Café Slots',
 short='Caça-níqueis com café, ursinhos fofos, quadrinhos e viagem no tempo!',
 full="""☕ Recipes of Barista – 3D Deluxe é uma aventura curtinha e aconchegante movida por mecânicas de caça-níqueis!

O cafezinho de Bearista, Passarinho Azul e Urso Padeiro luta contra a SyruppoLab, uma rede gigante encharcada de xarope. Gire os rolos, junte grãos, abra novas filiais e salve a vila. Depois, entre na máquina do tempo do Vovô Café para uma jornada de 100 capítulos, do Egito Antigo à Nova York da Era do Jazz!

🎰 Caça-níqueis 3D de 5 rolos e 20 linhas: giros grátis, símbolos expansivos, Guerra do Matcha, Chuva de Bolos, colheitas e cartão fidelidade
📚 História em páginas de quadrinhos estilo Marvel
⏳ 9 épocas históricas com poderes e figurinos próprios
👴 Multiplicadores do bule do Vovô Café (até ×100!)
🛠 Melhorias na oficina, emblemas, álbum, recompensas diárias e ranking mundial
🤝 Convide amigos · 🌍 9 idiomas · joga offline

Importante: este jogo é apenas para adultos (18+) e para entretenimento. Não oferece apostas com dinheiro real nem a chance de ganhar dinheiro ou prêmios reais. Os grãos não podem ser comprados e não têm valor real. Sucesso em jogos de cassino social não significa sucesso em apostas com dinheiro real. Itens pagos são apenas cosméticos.

Privacidade: """ + WEB + "/privacy.html?lang=pt",
 notes='9 idiomas, vídeos com recompensa, visuais premium, Pacote Apoiador e convites para amigos!'),
'iw-IL': dict(
 title='Recipes of Barista: סלוט קפה',
 short='הרפתקת סלוט קפה חמימה עם דובונים, סיפור קומיקס ומסע בזמן!',
 full="""☕ ‏Recipes of Barista – 3D Deluxe היא הרפתקת קפה קצרה וחמימה המבוססת על מכניקת מכונות מזל!

בית הקפה הקטן של Bearista, ציפור כחולה והדוב האופה נאבק ברשת הענקית SyruppoLab, הספוגה בסירופ. סובבו את הגלגלים, אספו פולים, פתחו סניפים חדשים והצילו את העיירה. אחר כך קפצו למכונת הזמן של סבא קפה למסע של 100 פרקים – ממצרים העתיקה ועד ניו יורק של עידן הג׳אז!

🎰 סלוט תלת־ממדי עם 5 גלגלים ו־20 שורות: סיבובים חינם, סמלים מתרחבים, מלחמת המאצ׳ה, גשם עוגות, קציר וכרטיס נאמנות
📚 סיפור בעמודי קומיקס בסגנון מארוול
⏳ ‏9 תקופות היסטוריות, לכל אחת כוח ותלבושות משלה
👴 מכפילים מהקנקן של סבא קפה (עד ×100!)
🛠 שדרוגים בסדנה, תגים, אלבום, פרסים יומיים ודירוג עולמי
🤝 הזמנת חברים · 🌍 ‏9 שפות · משחק גם בלי אינטרנט

חשוב: המשחק מיועד למבוגרים בלבד (18+) ולמטרות בידור. אין בו הימורים בכסף אמיתי ואין אפשרות לזכות בכסף או בפרסים אמיתיים. לא ניתן לקנות פולים ואין להם ערך אמיתי. הצלחה במשחקי קזינו חברתיים אינה מעידה על הצלחה בהימורים בכסף אמיתי. פריטים בתשלום הם קוסמטיים בלבד.

פרטיות: """ + WEB + "/privacy.html?lang=he",
 notes='‏9 שפות (כולל עברית!), סרטוני פרס, מראות פרימיום, חבילת תומכים והזמנת חברים!'),
'ja-JP': dict(
 title='レシピ・オブ・バリスタ：カフェスロット',
 short='かわいいクマたちとコーヒーの香るスロット冒険！コミック風ストーリーと時間旅行',
 full="""☕ レシピ・オブ・バリスタ 3Dデラックスは、スロットマシンの仕組みで進む、短くてほっこりしたコーヒーの冒険です！

Bearista、アオイトリ、パン屋のクマの小さなカフェが、シロップまみれの巨大チェーンSyruppoLabに立ち向かいます。リールを回して豆を集め、新しいお店を開いて町を救おう。そのあとはコーヒーじいちゃんのタイムマシンで、古代エジプトからジャズエイジのニューヨークまで全100章の時間旅行へ！

🎰 5リール・20ラインの3Dスロット：フリースピン、拡張シンボル、抹茶ウォーズ、ケーキの雨、収穫配当、ポイントカード
📚 アメコミ風のコミックページで描かれるストーリー
⏳ それぞれの力と衣装を持つ9つの時代
👴 コーヒーじいちゃんのポットから降る倍率（最大×100！）
🛠 工房での強化、バッジ、アルバム、デイリーボーナス、世界ランキング
🤝 友だち招待 · 🌍 9言語 · オフラインでも遊べる

ご注意：本ゲームは成人（18歳以上）向けの娯楽専用ゲームです。実際のお金を賭けるギャンブルはなく、現金や賞品を獲得することはできません。ゲーム内の「豆」は購入できず、現実の価値はありません。ソーシャルカジノでの成功は、実際のギャンブルでの成功を意味しません。購入できるのは見た目アイテムのみで、確率は変わりません。

プライバシー：""" + WEB + "/privacy.html?lang=ja",
 notes='9言語に対応（日本語・韓国語・中国語・ヘブライ語を追加）、リワード動画、プレミアム見た目、サポーターパック、友だち招待！'),
'ko-KR': dict(
 title='레시피 오브 바리스타: 카페 슬롯',
 short='귀여운 곰들과 함께하는 커피 향 슬롯 모험! 만화 스토리와 시간 여행',
 full="""☕ 레시피 오브 바리스타 3D 디럭스는 슬롯머신 방식으로 진행되는 짧고 포근한 커피 모험이에요!

Bearista, 파랑새, 빵집 곰의 작은 카페가 시럽 범벅 거대 체인 SyruppoLab에 맞서요. 릴을 돌려 원두를 모으고, 새 가게를 열어 마을을 구하세요. 그다음엔 커피 할아버지의 타임머신을 타고 고대 이집트부터 재즈 시대 뉴욕까지 100장의 시간 여행을 떠나요!

🎰 5릴·20라인 3D 슬롯: 무료 스핀, 확장 심볼, 말차 전쟁, 케이크 비, 수확 지급, 적립 카드
📚 마블 스타일 만화 페이지로 펼쳐지는 스토리
⏳ 고유한 힘과 의상을 가진 9개의 역사 시대
👴 커피 할아버지의 주전자에서 쏟아지는 배율 (최대 ×100!)
🛠 공방 강화, 배지, 앨범, 출석 보상, 세계 순위
🤝 친구 초대 · 🌍 9개 언어 · 오프라인 플레이

중요: 이 게임은 성인(18세 이상)을 위한 오락용 게임입니다. 실제 돈을 거는 도박이 아니며 현금이나 경품을 받을 수 없습니다. 게임 속 ‘원두’는 구매할 수 없고 실제 가치가 없습니다. 소셜 카지노 게임에서의 성공이 실제 도박에서의 성공을 의미하지 않습니다. 구매 가능한 아이템은 외형뿐이며 확률을 바꾸지 않습니다.

개인정보: """ + WEB + "/privacy.html?lang=ko",
 notes='9개 언어(한국어·일본어·중국어·히브리어 추가), 보상형 영상, 프리미엄 외형, 서포터 팩, 친구 초대!'),
'zh-CN': dict(
 title='咖啡师食谱：咖啡馆老虎机',
 short='和可爱小熊一起的咖啡老虎机冒险！漫画故事与时空旅行',
 full="""☕ 咖啡师食谱 3D豪华版是一款以老虎机玩法推进的温馨咖啡小冒险！

Bearista、小蓝鸟和烘焙熊的小咖啡馆正在对抗满是糖浆的巨型连锁店SyruppoLab。转动转轴、收集咖啡豆、开新分店，拯救小镇。然后坐上咖啡爷爷的时光机，从古埃及到爵士时代的纽约，展开100章的时空之旅！

🎰 5转轴20线3D老虎机：免费旋转、扩展图案、抹茶大战、蛋糕雨、丰收奖金和集点卡
📚 漫威风格漫画页讲述的故事
⏳ 9个历史时代，各有专属力量和服装
👴 咖啡爷爷的咖啡壶洒下倍率（最高×100！）
🛠 工坊升级、徽章、图鉴、每日奖励和世界排行榜
🤝 邀请好友 · 🌍 9种语言 · 可离线游玩

重要提示：本游戏仅供成年人（18岁及以上）娱乐。不涉及真钱赌博，也无法赢取真钱或奖品。游戏中的“咖啡豆”无法购买，没有任何现实价值。在社交博彩游戏中的成功并不代表在真钱赌博中也会成功。可购买的物品仅为外观，不会改变概率。

隐私政策：""" + WEB + "/privacy.html?lang=zh",
 notes='支持9种语言（新增中文、日语、韩语和希伯来语）、激励视频、高级外观、支持者礼包和好友邀请！'),
}
# Play sınırları: başlık ≤30, kısa açıklama ≤80, tam açıklama ≤4000, sürüm notu ≤500
for k, v in L.items():
    assert len(v['title']) <= 30, (k, len(v['title']), v['title'])
    assert len(v['short']) <= 80, (k, len(v['short']))
    assert len(v['full']) <= 4000, (k, len(v['full']))
    assert len(v['notes']) <= 500, k
    with open(f'{OUT}/listing/{k}.txt', 'w', encoding='utf-8') as f:
        f.write(f"UYGULAMA ADI ({len(v['title'])}/30):\n{v['title']}\n\nKISA AÇIKLAMA ({len(v['short'])}/80):\n{v['short']}\n\nTAM AÇIKLAMA ({len(v['full'])}/4000):\n{v['full']}\n\nSÜRÜM NOTU 7.0.0 ({len(v['notes'])}/500):\n{v['notes']}\n")

# Uygulama içi ürünler (Monetize → Products → In-app products). Tümü tek seferlik (managed, tüketilmeyen).
ERA = [('egypt', 'Antik Mısır', 'Ancient Egypt'), ('greece', 'Antik Yunan', 'Ancient Greece'), ('viking', 'Viking Çağı', 'Viking Age'), ('rome', 'Roma İmparatorluğu', 'Roman Empire'),
       ('ottoman', 'Osmanlı İmparatorluğu', 'Ottoman Empire'), ('victorian', 'Viktorya Dönemi İngiltere', 'Victorian Britain'), ('france', 'Aydınlanma Fransası', 'Enlightenment France'),
       ('italy', 'Rönesans İtalyası', 'Renaissance Italy'), ('jazz', 'Caz Çağı New York', 'Jazz Age New York')]
P = [('supporter_pack', 'Destekçi Paketi', 'Supporter Pack', 'Reklamsız video ödülleri ve özel Destekçi seti (çerçeve, taç, fincan).', 'Ad-free video rewards and the exclusive Supporter set (frame, crown, cup).', '49.99'),
     ('set_zaman', 'Zaman Bekçisi Seti', 'Time Keeper Set', 'Zaman Bekçisi çerçevesi, pilot gözlüğü ve kum saati fincanı. Yalnızca görünüm.', 'Time Keeper frame, pilot goggles and hourglass cup. Cosmetic only.', '29.99'),
     ('cups_gold', 'Altın Fincan Koleksiyonu', 'Golden Cup Collection', '9 dönemin altın çarpan fincanları. Yalnızca görünüm.', 'Golden multiplier cups from all 9 eras. Cosmetic only.', '29.99'),
     ('levers_all', 'Kol Koleksiyonu', 'Lever Collection', 'Makine için 5 slot kolu. Yalnızca görünüm.', 'All 5 slot levers for the machine. Cosmetic only.', '9.99')]
P += [(f'set_{k}', f'{tr} Seti', f'{en} Set', f'{tr} dönemine ait çerçeve, şapka ve fincan. Yalnızca görünüm.', f'Frame, hat and cup from the {en} era. Cosmetic only.', '29.99') for k, tr, en in ERA]
with open(f'{OUT}/uygulama_ici_urunler.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f); w.writerow(['Product ID', 'Tür', 'Ad (TR)', 'Name (EN)', 'Açıklama (TR)', 'Description (EN)', 'Fiyat (TRY)'])
    for r in P: w.writerow([r[0], 'Tek seferlik (managed)', r[1], r[2], r[3], r[4], r[5]])
    for r in P: assert len(r[1]) <= 55 and len(r[2]) <= 55 and len(r[3]) <= 200
print('listing ok', len(L), 'dil,', len(P), 'ürün')
import shutil
for f in os.listdir('legal/store_docs'): shutil.copy('legal/store_docs/' + f, f'{OUT}/{f}')
shutil.copy('android_src/PLAY_STORE_REHBERI.md', f'{OUT}/PLAY_STORE_REHBERI.md')
for a, b in [('out/store/play_icon_512.png', 'play_icon_512.png')]:
    if os.path.exists(a): shutil.copy(a, f'{OUT}/{b}')
print('store docs ok')
