# Hukuki sayfalar: privacy.html, terms.html, delete-account.html (+ app-ads.txt şablonu)
# Tam metin: Türkçe + İngilizce. Diğer diller: özet + "bağlayıcı metin İngilizcedir" notu.
# Kullanım: python3 legal/make_legal.py <hedef_klasör>
import sys, os, html
OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/web'
os.makedirs(OUT, exist_ok=True)
DEV = 'Limited Education'; MAIL = 'omermihci94@gmail.com'; APP = 'Recipes of Barista – 3D Deluxe'
PKG = 'com.limitededucation.recipesofbarista'
DATE = {'tr': '4 Kasım 2026', 'en': '4 November 2026'}
LANGS = [('tr', 'Türkçe'), ('en', 'English'), ('de', 'Deutsch'), ('es', 'Español'), ('pt', 'Português'), ('he', 'עברית'), ('ja', '日本語'), ('ko', '한국어'), ('zh', '简体中文')]
RTL = {'he'}

# ------------------------------------------------------------------ GİZLİLİK
PRIV = {
'tr': f"""
<h1>Gizlilik Politikası</h1>
<p class="meta"><b>{APP}</b> · Geliştirici (veri sorumlusu): <b>{DEV}</b> · İletişim: <a href="mailto:{MAIL}">{MAIL}</a> · Son güncelleme: {DATE['tr']}</p>
<p>Bu politika, {APP} (Android paket adı <code>{PKG}</code> ve web sürümü) oyununu oynarken hangi verilerin işlendiğini, neden işlendiğini ve haklarını açıklar. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve AB Genel Veri Koruma Tüzüğü (GDPR) esas alınmıştır.</p>
<h2>1. Oyun hakkında kısa bilgi</h2>
<p>Oyun yalnızca eğlence amaçlıdır ve <b>gerçek para ile kumar içermez</b>. Oyun içi “çekirdek” hiçbir şekilde satın alınamaz, nakde çevrilemez, devredilemez ve gerçek bir değeri yoktur. Oyun 18 yaş ve üzeri kullanıcılar içindir.</p>
<h2>2. İşlenen veriler</h2>
<table>
<tr><th>Veri</th><th>Ne zaman</th><th>Amaç</th><th>Hukuki dayanak</th></tr>
<tr><td>Oyun kayıtları, ayarlar, takma ad, profil resmi</td><td>Her zaman, <b>yalnızca cihazında</b></td><td>Oyunun çalışması</td><td>Sözleşmenin ifası</td></tr>
<tr><td>E-posta adresi, Google hesabı adı, kullanıcı kimliği (UID)</td><td>Yalnızca giriş yaparsan</td><td>Hesap ve bulut kaydı</td><td>Sözleşmenin ifası</td></tr>
<tr><td>Bulut kaydı (kayıtlar, rozetler, albüm, takma ad, profil resmi)</td><td>Giriş yaptıysan</td><td>Cihazlar arası devam</td><td>Sözleşmenin ifası</td></tr>
<tr><td>Skor tablosu satırı (takma ad, küçük profil resmi, skor)</td><td>Giriş yaptıysan</td><td>Herkese açık sıralama</td><td>Sözleşmenin ifası</td></tr>
<tr><td>Davet kodu ve davet kullanımı (davet eden ve edilenin UID'si, tarih)</td><td>Davet sistemini kullanırsan</td><td>Davet ödüllerini vermek, kötüye kullanımı önlemek</td><td>Sözleşmenin ifası / meşru menfaat</td></tr>
<tr><td>Satın alma bilgisi (ürün kimliği, satın alma jetonu, sipariş numarası)</td><td>Uygulama içi satın alma yaparsan</td><td>Ürünü teslim etmek ve geri yüklemek</td><td>Sözleşmenin ifası</td></tr>
<tr><td>Reklam kimliği, IP adresi, cihaz ve uygulama bilgisi, reklam etkileşimleri</td><td>Android'de ödüllü video izlersen</td><td>Ödüllü reklam göstermek, sahtekârlığı önlemek, (izin verdiysen) kişiselleştirme</td><td>Açık rıza (kişiselleştirilmiş reklam) / meşru menfaat</td></tr>
</table>
<p><b>Ödeme bilgilerin</b> (kart vb.) bize hiçbir zaman ulaşmaz; ödemeyi tamamen Google Play işler. Konum, kişi listesi, kamera, mikrofon veya fotoğraf galerine (yalnızca senin seçtiğin profil resmi hariç) erişilmez. Kendi analitik veya izleme aracımızı kullanmıyoruz.</p>
<h2>3. Hizmet sağlayıcılar (aktarım)</h2>
<ul>
<li><b>Google Firebase</b> (Authentication, Cloud Firestore) – hesap ve bulut kaydı. <a href="https://firebase.google.com/support/privacy">Firebase gizlilik</a></li>
<li><b>Google AdMob</b> ve <b>Google User Messaging Platform</b> – ödüllü reklamlar ve reklam izni. <a href="https://policies.google.com/technologies/partner-sites">Google'ın verileri nasıl kullandığı</a></li>
<li><b>Google Play Faturalandırma</b> – uygulama içi satın almalar. <a href="https://policies.google.com/privacy">Google Gizlilik Politikası</a></li>
<li><b>Netlify</b> – web sürümünün barındırılması (sunucu günlükleri: IP, tarayıcı bilgisi).</li>
</ul>
<p>Bu sağlayıcıların sunucuları Türkiye ve AB dışında (ör. ABD) bulunabilir. Aktarımlar, sağlayıcıların standart sözleşme maddeleri ve KVKK m. 9 kapsamındaki güvenceler çerçevesinde yapılır. Verilerini satmayız.</p>
<h2>4. Reklam izni</h2>
<p>AB, AEA, İngiltere ve İsviçre'de ilk açılışta Google'ın izin formu gösterilir. Kişiselleştirilmiş reklamlara izin vermezsen yalnızca kişiselleştirilmemiş reklamlar gösterilir. İznini istediğin zaman <b>Ayarlar → Hukuki ve Hesap → Reklam gizlilik seçenekleri</b> ile değiştirebilirsin. Android'de reklam kimliğini cihaz ayarlarından sıfırlayabilir veya silebilirsin. Destekçi Paketi sahiplerine reklam gösterilmez. Reklam izlemek her zaman isteğe bağlıdır.</p>
<h2>5. Saklama süresi</h2>
<p>Cihazdaki veriler sen silene kadar cihazında kalır. Hesap, bulut kaydı, skor ve davet kayıtları hesabını silene kadar saklanır; silme talebinden sonra en geç 30 gün içinde silinir. Satın alma kayıtları Google Play tarafından yasal süreler boyunca tutulur.</p>
<h2>6. Hakların</h2>
<p>KVKK m. 11 ve GDPR kapsamında verilerine erişme, düzeltme, silme, işlemeyi kısıtlama, itiraz etme, taşınabilirlik ve rızanı geri çekme hakların vardır. Talebini <a href="mailto:{MAIL}">{MAIL}</a> adresine gönderebilirsin; en geç 30 gün içinde yanıtlarız. Kişisel Verileri Koruma Kurulu'na veya bulunduğun ülkenin veri koruma otoritesine şikâyette bulunma hakkın saklıdır.</p>
<h2>7. Verilerini silme</h2>
<ul>
<li>Oyunda: <b>Profil → Hesabımı sil</b> (hesap, bulut kaydı, skor satırı, davet kodu).</li>
<li>Cihazdaki kayıtlar: <b>Ayarlar → Tüm verileri sil</b> veya uygulamayı kaldırmak.</li>
<li>Uygulama olmadan: <a href="delete-account.html">hesap silme sayfası</a>.</li>
</ul>
<h2>8. Çocuklar</h2>
<p>Oyun, slot makinesi mekaniği (simüle kumar) içerdiği için 18 yaş altına yönelik değildir ve ilk açılışta yaş onayı ister. 18 yaşından küçük birine ait veri işlediğimizi öğrenirsek bu verileri sileriz.</p>
<h2>9. Güvenlik</h2>
<p>Veriler aktarım sırasında HTTPS ile şifrelenir. Bulut verilerine yalnızca kendi hesabınla erişilebilir (Firestore güvenlik kuralları).</p>
<h2>10. Değişiklikler</h2>
<p>Bu politikayı güncelleyebiliriz. Önemli değişikliklerde oyunda bilgi verilir; güncel sürüm her zaman bu sayfadadır.</p>
""",
'en': f"""
<h1>Privacy Policy</h1>
<p class="meta"><b>{APP}</b> · Developer (data controller): <b>{DEV}</b> · Contact: <a href="mailto:{MAIL}">{MAIL}</a> · Last updated: {DATE['en']}</p>
<p>This policy explains what data is processed when you play {APP} (Android package <code>{PKG}</code> and the web version), why, and what your rights are. It is written to meet the EU General Data Protection Regulation (GDPR), the UK GDPR and the Turkish Personal Data Protection Law No. 6698 (KVKK).</p>
<h2>1. About the game</h2>
<p>The game is for entertainment only and <b>does not offer real-money gambling</b>. In-game “beans” can never be purchased, cashed out or transferred and have no real-world value. The game is intended for users aged 18 and over.</p>
<h2>2. Data we process</h2>
<table>
<tr><th>Data</th><th>When</th><th>Purpose</th><th>Legal basis</th></tr>
<tr><td>Game saves, settings, nickname, profile picture</td><td>Always, <b>on your device only</b></td><td>Running the game</td><td>Contract</td></tr>
<tr><td>E-mail address, Google account name, user ID (UID)</td><td>Only if you sign in</td><td>Account and cloud save</td><td>Contract</td></tr>
<tr><td>Cloud save (saves, badges, album, nickname, profile picture)</td><td>If signed in</td><td>Continue on any device</td><td>Contract</td></tr>
<tr><td>Leaderboard entry (nickname, small profile picture, score)</td><td>If signed in</td><td>Public ranking</td><td>Contract</td></tr>
<tr><td>Invite code and redemption (UIDs of inviter and invitee, date)</td><td>If you use invites</td><td>Granting invite rewards, preventing abuse</td><td>Contract / legitimate interest</td></tr>
<tr><td>Purchase data (product ID, purchase token, order ID)</td><td>If you make an in-app purchase</td><td>Delivering and restoring items</td><td>Contract</td></tr>
<tr><td>Advertising ID, IP address, device and app information, ad interactions</td><td>If you watch a rewarded video on Android</td><td>Serving rewarded ads, fraud prevention and (if you consent) personalisation</td><td>Consent (personalised ads) / legitimate interest</td></tr>
</table>
<p>Your <b>payment details</b> (cards etc.) never reach us; payments are handled entirely by Google Play. We do not access your location, contacts, camera, microphone or photo library (except a profile picture you pick yourself). We do not use our own analytics or tracking tools.</p>
<h2>3. Service providers (transfers)</h2>
<ul>
<li><b>Google Firebase</b> (Authentication, Cloud Firestore) – accounts and cloud save. <a href="https://firebase.google.com/support/privacy">Firebase privacy</a></li>
<li><b>Google AdMob</b> and <b>Google User Messaging Platform</b> – rewarded ads and ad consent. <a href="https://policies.google.com/technologies/partner-sites">How Google uses data</a></li>
<li><b>Google Play Billing</b> – in-app purchases. <a href="https://policies.google.com/privacy">Google Privacy Policy</a></li>
<li><b>Netlify</b> – hosting of the web version (server logs: IP, browser information).</li>
</ul>
<p>These providers may store data outside Turkey and the EEA (e.g. in the USA). Transfers rely on the providers' Standard Contractual Clauses and equivalent safeguards. We do not sell your data.</p>
<h2>4. Ad consent</h2>
<p>In the EU, EEA, UK and Switzerland, Google's consent form is shown on first launch. If you decline personalised ads, only non-personalised ads are shown. You can change your choice at any time under <b>Settings → Legal &amp; Account → Ad privacy options</b>, and reset or delete your advertising ID in your Android settings. Supporter Pack owners see no ads. Watching ads is always optional.</p>
<h2>5. Retention</h2>
<p>On-device data stays until you delete it. Account, cloud save, leaderboard and invite records are kept until you delete your account and are erased within 30 days of a deletion request. Purchase records are retained by Google Play as required by law.</p>
<h2>6. Your rights</h2>
<p>You have the right to access, rectify, erase, restrict, object to processing, data portability and to withdraw consent at any time. Send requests to <a href="mailto:{MAIL}">{MAIL}</a>; we answer within 30 days. You may also lodge a complaint with your local data protection authority (in Turkey: the Personal Data Protection Authority, KVKK).</p>
<h2>7. Deleting your data</h2>
<ul>
<li>In the game: <b>Profile → Delete my account</b> (account, cloud save, leaderboard entry, invite code).</li>
<li>On-device data: <b>Settings → Delete all data</b>, or uninstall the app.</li>
<li>Without the app: <a href="delete-account.html">account deletion page</a>.</li>
</ul>
<h2>8. Children</h2>
<p>Because the game contains slot machine mechanics (simulated gambling), it is not directed at anyone under 18 and asks for age confirmation on first launch. If we learn that we hold data of a person under 18, we delete it.</p>
<h2>9. Security</h2>
<p>Data is encrypted in transit (HTTPS). Cloud data can only be accessed with your own account (Firestore security rules).</p>
<h2>10. Changes</h2>
<p>We may update this policy. Significant changes are announced in the game; the current version is always on this page.</p>
""",
}
# Özet (diğer diller)
PRIV_SUM = {
'de': ('Datenschutzerklärung', 'Zusammenfassung. Rechtlich verbindlich ist die englische Fassung.', [
  'Reines Unterhaltungsspiel ohne Echtgeld-Glücksspiel; „Bohnen“ sind nicht käuflich und haben keinen realen Wert. Ab 18 Jahren.',
  'Ohne Konto bleiben Spielstände und Einstellungen nur auf deinem Gerät.',
  'Mit Anmeldung: E-Mail, Google-Name und Nutzer-ID (Firebase Authentication); Cloud-Spielstand und Bestenliste (Cloud Firestore).',
  'Einladungen: Einladungscode sowie Nutzer-IDs von Einladendem und Eingeladenem.',
  'Käufe über Google Play: wir erhalten nur Produkt-ID und Kaufbeleg, niemals Zahlungsdaten.',
  'Belohnungsvideos (Android) über Google AdMob: Werbe-ID, IP, Geräteinfos. In EU/UK wird eine Einwilligung abgefragt; änderbar unter Einstellungen → Rechtliches & Konto → Werbe-Datenschutzoptionen.',
  'Rechte: Auskunft, Berichtigung, Löschung, Widerspruch, Widerruf. Löschung im Spiel (Profil → Konto löschen) oder über delete-account.html. Antwort innerhalb von 30 Tagen.']),
'es': ('Política de privacidad', 'Resumen. La versión en inglés es la jurídicamente vinculante.', [
  'Juego solo de entretenimiento, sin apuestas con dinero real; los “granos” no se venden y no tienen valor real. Mayores de 18 años.',
  'Sin cuenta, tus partidas y ajustes solo se guardan en tu dispositivo.',
  'Con inicio de sesión: correo, nombre de Google e ID de usuario (Firebase Authentication); guardado en la nube y clasificación (Cloud Firestore).',
  'Invitaciones: código de invitación e IDs de usuario de quien invita y del invitado.',
  'Compras con Google Play: solo recibimos el ID del producto y el comprobante, nunca tus datos de pago.',
  'Vídeos con recompensa (Android) mediante Google AdMob: ID de publicidad, IP, datos del dispositivo. En la UE/Reino Unido se pide consentimiento; puedes cambiarlo en Ajustes → Legal y cuenta → Opciones de privacidad de anuncios.',
  'Derechos: acceso, rectificación, supresión, oposición y retirada del consentimiento. Elimina tu cuenta en el juego (Perfil → Eliminar cuenta) o en delete-account.html. Respondemos en 30 días.']),
'pt': ('Política de privacidade', 'Resumo. A versão em inglês é a juridicamente vinculativa.', [
  'Jogo apenas de entretenimento, sem apostas com dinheiro real; os “grãos” não são vendidos e não têm valor real. Para maiores de 18 anos.',
  'Sem conta, seus jogos salvos e configurações ficam apenas no seu aparelho.',
  'Com login: e-mail, nome do Google e ID de usuário (Firebase Authentication); salvamento na nuvem e ranking (Cloud Firestore).',
  'Convites: código de convite e IDs de quem convidou e de quem foi convidado.',
  'Compras pelo Google Play: recebemos apenas o ID do produto e o comprovante, nunca dados de pagamento.',
  'Vídeos com recompensa (Android) via Google AdMob: ID de publicidade, IP, dados do aparelho. Na UE/Reino Unido pedimos consentimento; altere em Configurações → Jurídico e conta → Opções de privacidade de anúncios.',
  'Direitos (LGPD/GDPR): acesso, correção, exclusão, oposição e revogação do consentimento. Exclua no jogo (Perfil → Excluir conta) ou em delete-account.html. Respondemos em até 30 dias.']),
'he': ('מדיניות פרטיות', 'תקציר. הנוסח המחייב הוא הנוסח באנגלית.', [
  'משחק לבידור בלבד, ללא הימורים בכסף אמיתי; „פולים” אינם נמכרים ואין להם ערך אמיתי. מגיל 18 ומעלה.',
  'ללא חשבון, השמירות וההגדרות נשמרות רק במכשיר שלך.',
  'עם התחברות: אימייל, שם חשבון Google ומזהה משתמש (Firebase Authentication); שמירה בענן וטבלת דירוג (Cloud Firestore).',
  'הזמנות: קוד הזמנה ומזהי המשתמש של המזמין והמוזמן.',
  'רכישות דרך Google Play: אנו מקבלים רק את מזהה המוצר ואישור הרכישה, לעולם לא פרטי תשלום.',
  'סרטוני פרס (Android) דרך Google AdMob: מזהה פרסום, IP, פרטי מכשיר. באיחוד האירופי/בריטניה מתבקשת הסכמה; ניתן לשנות בהגדרות ← משפטי וחשבון ← אפשרויות פרטיות בפרסומות.',
  'זכויות: עיון, תיקון, מחיקה, התנגדות וביטול הסכמה. מחיקה במשחק (פרופיל ← מחיקת חשבון) או בדף delete-account.html. מענה תוך 30 יום.']),
'ja': ('プライバシーポリシー', '概要です。法的拘束力を持つのは英語版です。', [
  '本ゲームは娯楽専用で、実際のお金を賭けるギャンブルはありません。「豆」は購入できず、現実の価値はありません。18歳以上の方が対象です。',
  'アカウントなしの場合、セーブと設定は端末内にのみ保存されます。',
  'ログイン時：メールアドレス、Googleアカウント名、ユーザーID（Firebase Authentication）、クラウドセーブとランキング（Cloud Firestore）。',
  '友だち招待：招待コードと、招待した人・された人のユーザーID。',
  'Google Playでの購入：受け取るのは商品IDと購入証明のみで、支払い情報は受け取りません。',
  'リワード動画（Android）はGoogle AdMobを利用：広告ID、IPアドレス、端末情報。EU・英国では同意を確認します。設定 → 規約とアカウント → 広告のプライバシー設定 から変更できます。',
  '権利：開示、訂正、削除、異議申立て、同意の撤回。ゲーム内（プロフィール → アカウントを削除）または delete-account.html で削除できます。30日以内に対応します。']),
'ko': ('개인정보 처리방침', '요약본입니다. 법적 효력은 영어 원문에 있습니다.', [
  '오락 전용 게임이며 실제 돈을 거는 도박은 없습니다. ‘원두’는 구매할 수 없고 실제 가치가 없습니다. 만 18세 이상 이용 가능합니다.',
  '계정이 없으면 저장 데이터와 설정은 기기에만 보관됩니다.',
  '로그인 시: 이메일, Google 계정 이름, 사용자 ID(Firebase Authentication), 클라우드 저장과 순위표(Cloud Firestore).',
  '친구 초대: 초대 코드와 초대한 사람·초대받은 사람의 사용자 ID.',
  'Google Play 구매: 상품 ID와 구매 증빙만 받으며 결제 정보는 받지 않습니다.',
  '보상형 영상(Android)은 Google AdMob 사용: 광고 ID, IP, 기기 정보. EU·영국에서는 동의를 요청하며 설정 → 약관 및 계정 → 광고 개인정보 옵션에서 바꿀 수 있습니다.',
  '권리: 열람, 정정, 삭제, 처리 정지, 동의 철회. 게임 내(프로필 → 계정 삭제) 또는 delete-account.html에서 삭제할 수 있습니다. 30일 이내에 답변합니다.']),
'zh': ('隐私政策', '摘要。具有法律约束力的是英文版本。', [
  '本游戏仅供娱乐，不涉及真钱赌博；“咖啡豆”无法购买，也没有任何现实价值。仅限18岁及以上用户。',
  '不登录时，存档和设置只保存在你的设备上。',
  '登录后：电子邮箱、Google账号名称和用户ID（Firebase Authentication）；云存档和排行榜（Cloud Firestore）。',
  '好友邀请：邀请码以及邀请人和被邀请人的用户ID。',
  'Google Play购买：我们只收到商品ID和购买凭证，绝不会收到支付信息。',
  '激励视频（Android）使用Google AdMob：广告ID、IP地址、设备信息。在欧盟/英国会征求同意，可在设置 → 法律与账号 → 广告隐私选项中更改。',
  '权利：查阅、更正、删除、反对处理、撤回同意。可在游戏内（个人资料 → 删除账号）或 delete-account.html 删除。我们将在30天内答复。']),
}

# ------------------------------------------------------------------ KULLANIM KOŞULLARI
TERMS = {
'tr': f"""
<h1>Kullanıcı Sözleşmesi (Kullanım Koşulları)</h1>
<p class="meta"><b>{APP}</b> · <b>{DEV}</b> · <a href="mailto:{MAIL}">{MAIL}</a> · Son güncelleme: {DATE['tr']}</p>
<p>Oyunu indirerek, açarak veya oynayarak bu koşulları kabul etmiş olursun. Kabul etmiyorsan lütfen oyunu kullanma.</p>
<h2>1. Yaş sınırı</h2>
<p>Oyunu yalnızca <b>18 yaş ve üzeri</b> kişiler kullanabilir. İlk açılışta yaşını onaylaman istenir.</p>
<h2>2. Gerçek para ile kumar yoktur</h2>
<p>Oyun, slot makinesi görünümlü bir <b>sosyal casino / eğlence</b> oyunudur. Gerçek para ile bahis oynanmaz, gerçek para veya ödül kazanılmaz. Oyundaki başarı, gerçek para ile oynanan kumarda başarı anlamına gelmez.</p>
<h2>3. Sanal para ve sanal eşyalar</h2>
<ul>
<li>“Çekirdek” oyun içi sanal puandır; <b>satın alınamaz</b>, nakde çevrilemez, iade edilemez, devredilemez ve hesaplar arasında aktarılamaz.</li>
<li>Satın alınabilen ürünler yalnızca <b>kozmetik görünümler</b> (çerçeve, şapka, fincan, kol) ve reklamsız ödül sağlayan <b>Destekçi Paketi</b>dir. Hiçbir ürün oyunun olasılıklarını veya kazançlarını değiştirmez.</li>
<li>Sanal eşyalar üzerinde sana sınırlı, kişisel, devredilemez bir kullanım lisansı verilir; mülkiyet hakkı vermez ve gerçek bir değeri yoktur.</li>
</ul>
<h2>4. Satın almalar ve iadeler</h2>
<p>Android uygulamasındaki satın almalar <b>Google Play</b> üzerinden yapılır ve Google Play Hizmet Şartları geçerlidir. Fiyatlar mağazada vergiler dahil gösterilir. İade talepleri Google Play iade politikasına göre değerlendirilir (<a href="https://support.google.com/googleplay/answer/2479637">Google Play iadeleri</a>). Satın alınan dijital içerik satın alma onayıyla birlikte anında teslim edildiğinden, yürürlükteki tüketici mevzuatının izin verdiği ölçüde cayma hakkı teslimle sona erer; bu, kanundan doğan haklarını ortadan kaldırmaz. Satın almalarını aynı Google hesabıyla <b>Ayarlar → Satın almaları geri yükle</b> ile geri yükleyebilirsin.</p>
<h2>5. Ödüllü reklamlar</h2>
<p>Reklam izlemek isteğe bağlıdır. Ödül yalnızca reklam tamamlandığında verilir. Reklamlar üçüncü taraf (Google AdMob) tarafından sunulur.</p>
<h2>6. Arkadaş daveti</h2>
<p>Her hesap yalnızca bir davet kodu kullanabilir ve kendi kodunu kullanamaz. Sahte hesaplar, otomasyon veya başka yollarla davet sistemini kötüye kullanmak yasaktır; bu durumda davet ödülleri geri alınabilir.</p>
<h2>7. Hesap ve davranış kuralları</h2>
<p>Takma adın ve profil resmin herkese açık skor tablosunda görünebilir; hakaret içeren, yanıltıcı, başkasının haklarını ihlal eden içerik kullanma. Hile, oyunu değiştirme, tersine mühendislik, sunuculara saldırı ve açıkların kötüye kullanılması yasaktır. Bu kurallara uyulmazsa skor kaydı silinebilir veya hesap kapatılabilir.</p>
<h2>8. Fikri mülkiyet</h2>
<p>Oyun, karakterler, görseller, müzikler ve kodlar {DEV}'a veya lisans verenlerine aittir. İzin verilen kişisel kullanım dışında çoğaltılamaz ve dağıtılamaz.</p>
<h2>9. Hizmetin değişmesi</h2>
<p>Oyunu güncelleyebilir, içerik ekleyip kaldırabilir veya hizmeti makul bir ön bildirimle sonlandırabiliriz. Çevrimiçi özellikler (bulut kaydı, skor tablosu, davetler) kesintisiz olacağı garanti edilmeden sunulur.</p>
<h2>10. Sorumluluğun sınırlandırılması</h2>
<p>Oyun “olduğu gibi” sunulur. Kanunun izin verdiği azami ölçüde, oyunun kullanımından doğan dolaylı zararlardan sorumlu değiliz. Bu hüküm kasıt, ağır ihmal ve tüketicinin kanundan doğan haklarını sınırlamaz.</p>
<h2>11. Sorumlu oyun</h2>
<p>Oyunu dengeli oynamanı öneririz. Kumar ile ilgili endişen varsa bir uzmana veya yerel destek hatlarına başvurabilirsin.</p>
<h2>12. Uygulanacak hukuk</h2>
<p>Bu sözleşmeye Türkiye Cumhuriyeti hukuku uygulanır. Tüketiciler, ikamet ettikleri ülkenin zorunlu tüketici koruma hükümlerinden ve Tüketici Hakem Heyetleri ile Tüketici Mahkemelerine başvuru haklarından yararlanmaya devam eder.</p>
<h2>13. İletişim</h2>
<p><a href="mailto:{MAIL}">{MAIL}</a> · Gizlilik için bkz. <a href="privacy.html">Gizlilik Politikası</a>.</p>
""",
'en': f"""
<h1>Terms of Use (User Agreement)</h1>
<p class="meta"><b>{APP}</b> · <b>{DEV}</b> · <a href="mailto:{MAIL}">{MAIL}</a> · Last updated: {DATE['en']}</p>
<p>By downloading, opening or playing the game you accept these terms. If you do not agree, please do not use the game.</p>
<h2>1. Age requirement</h2>
<p>The game may only be used by persons <b>aged 18 or over</b>. You are asked to confirm your age on first launch.</p>
<h2>2. No real-money gambling</h2>
<p>The game is a <b>social casino / entertainment</b> game with slot machine visuals. No real money is wagered and no real money or prizes can be won. Success in this game does not imply future success at real-money gambling.</p>
<h2>3. Virtual currency and items</h2>
<ul>
<li>“Beans” are in-game virtual points; they <b>cannot be purchased</b>, cashed out, refunded, transferred or moved between accounts.</li>
<li>The only purchasable products are <b>cosmetic looks</b> (frames, hats, cups, levers) and the <b>Supporter Pack</b>, which grants rewards without ads. No product changes the game's odds or payouts.</li>
<li>You receive a limited, personal, non-transferable licence to use virtual items; they confer no ownership and have no real-world value.</li>
</ul>
<h2>4. Purchases and refunds</h2>
<p>Purchases in the Android app are made through <b>Google Play</b> and are subject to the Google Play Terms of Service. Prices are shown in the store including applicable taxes. Refund requests are handled under Google Play's refund policy (<a href="https://support.google.com/googleplay/answer/2479637">Google Play refunds</a>). Because digital content is delivered immediately upon your purchase confirmation, any statutory right of withdrawal ends upon delivery to the extent permitted by applicable law; this does not affect your mandatory consumer rights. You can restore purchases on the same Google account via <b>Settings → Restore purchases</b>.</p>
<h2>5. Rewarded ads</h2>
<p>Watching ads is optional. Rewards are granted only after an ad has been completed. Ads are served by a third party (Google AdMob).</p>
<h2>6. Friend invites</h2>
<p>Each account may redeem only one invite code and cannot redeem its own code. Abusing the invite system through fake accounts, automation or other means is prohibited and invite rewards may be revoked.</p>
<h2>7. Accounts and conduct</h2>
<p>Your nickname and profile picture may appear on the public leaderboard; do not use offensive or misleading content or content that infringes the rights of others. Cheating, modifying the game, reverse engineering, attacking servers and exploiting bugs are prohibited. Violations may lead to removal of leaderboard entries or account closure.</p>
<h2>8. Intellectual property</h2>
<p>The game, characters, artwork, music and code belong to {DEV} or its licensors. They may not be copied or distributed beyond permitted personal use.</p>
<h2>9. Changes to the service</h2>
<p>We may update the game, add or remove content, or discontinue the service with reasonable notice. Online features (cloud save, leaderboard, invites) are provided without guarantee of uninterrupted availability.</p>
<h2>10. Limitation of liability</h2>
<p>The game is provided “as is”. To the maximum extent permitted by law we are not liable for indirect damages arising from its use. This does not limit liability for intent, gross negligence or your mandatory consumer rights.</p>
<h2>11. Responsible play</h2>
<p>Please play in moderation. If you are concerned about gambling, contact a professional or a local support service.</p>
<h2>12. Governing law</h2>
<p>These terms are governed by the laws of the Republic of Türkiye. Consumers retain the protection of the mandatory consumer laws of their country of residence and the right to bring claims before their local courts or consumer bodies.</p>
<h2>13. Contact</h2>
<p><a href="mailto:{MAIL}">{MAIL}</a> · For privacy see the <a href="privacy.html">Privacy Policy</a>.</p>
""",
}
TERMS_SUM = {
'de': ('Nutzungsbedingungen', 'Zusammenfassung. Rechtlich verbindlich ist die englische Fassung.', [
  'Nur ab 18 Jahren. Kein Echtgeld-Glücksspiel: kein Einsatz, kein Gewinn von Geld oder Preisen.',
  '„Bohnen“ sind nicht käuflich, nicht auszahlbar und nicht übertragbar.',
  'Kaufbar sind nur kosmetische Looks und das Unterstützerpaket; nichts verändert Chancen oder Auszahlungen.',
  'Käufe laufen über Google Play; Erstattungen nach den Richtlinien von Google Play. Wiederherstellen unter Einstellungen.',
  'Werbung ist freiwillig. Missbrauch von Einladungen, Cheats und Angriffe sind verboten.',
  'Es gilt türkisches Recht; zwingende Verbraucherrechte deines Wohnsitzlandes bleiben unberührt.']),
'es': ('Términos de uso', 'Resumen. La versión en inglés es la jurídicamente vinculante.', [
  'Solo para mayores de 18 años. Sin apuestas con dinero real: no se apuesta ni se gana dinero ni premios.',
  'Los “granos” no se pueden comprar, canjear ni transferir.',
  'Solo se venden looks cosméticos y el Pack de Apoyo; nada cambia las probabilidades ni los pagos.',
  'Las compras se hacen por Google Play; reembolsos según su política. Restaura compras desde Ajustes.',
  'Los anuncios son opcionales. Se prohíbe abusar de las invitaciones, hacer trampas o atacar los servidores.',
  'Se aplica la ley turca, sin perjuicio de los derechos obligatorios de consumidor de tu país.']),
'pt': ('Termos de uso', 'Resumo. A versão em inglês é a juridicamente vinculativa.', [
  'Apenas para maiores de 18 anos. Sem apostas com dinheiro real: não se aposta nem se ganha dinheiro ou prêmios.',
  'Os “grãos” não podem ser comprados, resgatados nem transferidos.',
  'Só são vendidos visuais cosméticos e o Pacote Apoiador; nada altera chances ou pagamentos.',
  'Compras pelo Google Play; reembolsos conforme a política do Google Play. Restaure compras nas Configurações.',
  'Anúncios são opcionais. É proibido abusar de convites, trapacear ou atacar servidores.',
  'Aplica-se a lei turca, sem prejuízo dos direitos obrigatórios do consumidor no seu país (incl. CDC).']),
'he': ('תנאי שימוש', 'תקציר. הנוסח המחייב הוא הנוסח באנגלית.', [
  'מגיל 18 ומעלה בלבד. אין הימורים בכסף אמיתי: לא מהמרים ולא זוכים בכסף או בפרסים.',
  '„פולים” אינם ניתנים לרכישה, לפדיון או להעברה.',
  'נמכרים רק מראות קוסמטיים וחבילת התומכים; דבר אינו משנה סיכויים או תשלומים.',
  'רכישות דרך Google Play; החזרים לפי מדיניות Google Play. שחזור רכישות בהגדרות.',
  'צפייה בפרסומות היא רשות. אסור לנצל לרעה הזמנות, לרמות או לתקוף שרתים.',
  'חל הדין הטורקי, מבלי לגרוע מזכויות הצרכן הקוגנטיות במדינתך.']),
'ja': ('利用規約', '概要です。法的拘束力を持つのは英語版です。', [
  '18歳以上の方のみ利用できます。実際のお金を賭けるギャンブルはなく、お金や賞品を獲得することはできません。',
  '「豆」は購入・換金・譲渡できません。',
  '販売するのは見た目アイテムとサポーターパックのみで、確率や配当は一切変わりません。',
  '購入はGoogle Playを通じて行われ、返金はGoogle Playのポリシーに従います。設定から購入を復元できます。',
  '広告の視聴は任意です。招待の不正利用、チート、サーバーへの攻撃は禁止です。',
  'トルコ法が適用されます。お住まいの国の強行的な消費者保護規定は影響を受けません。']),
'ko': ('이용약관', '요약본입니다. 법적 효력은 영어 원문에 있습니다.', [
  '만 18세 이상만 이용할 수 있습니다. 실제 돈을 거는 도박이 아니며 돈이나 경품을 받을 수 없습니다.',
  '‘원두’는 구매·환전·양도할 수 없습니다.',
  '판매 상품은 외형 아이템과 서포터 팩뿐이며 확률이나 지급은 바뀌지 않습니다.',
  '구매는 Google Play를 통해 이루어지며 환불은 Google Play 정책을 따릅니다. 설정에서 구매를 복원할 수 있습니다.',
  '광고 시청은 선택입니다. 초대 악용, 치트, 서버 공격은 금지됩니다.',
  '튀르키예 법이 적용되며, 거주 국가의 강행적 소비자 보호 규정은 영향을 받지 않습니다.']),
'zh': ('用户协议', '摘要。具有法律约束力的是英文版本。', [
  '仅限18岁及以上用户。不涉及真钱赌博：不能下注真钱，也不能赢取金钱或奖品。',
  '“咖啡豆”不能购买、兑现或转让。',
  '仅出售外观道具和支持者礼包，不会改变任何概率或奖金。',
  '购买通过Google Play进行，退款按Google Play政策处理。可在设置中恢复购买。',
  '观看广告完全自愿。禁止滥用邀请、作弊或攻击服务器。',
  '适用土耳其法律，但不影响你所在国家强制性的消费者保护规定。']),
}

# ------------------------------------------------------------------ HESAP SİLME
DEL = {
'tr': f"""
<h1>Hesap ve Veri Silme</h1>
<p class="meta"><b>{APP}</b> · Geliştirici: <b>{DEV}</b></p>
<h2>Oyunun içinden (önerilen)</h2>
<ol><li>Oyunu aç ve hesabınla giriş yap.</li><li>Ana menüde profil kartına dokun.</li><li><b>Hesabımı sil</b> düğmesine bas ve onayla.</li></ol>
<h2>Uygulamaya erişimin yoksa</h2>
<p><a href="mailto:{MAIL}?subject=Recipes%20of%20Barista%20-%20Hesap%20silme">{MAIL}</a> adresine, hesabında kullandığın e-posta adresinden “Hesap silme” konulu bir e-posta gönder. Kimliğini doğruladıktan sonra en geç <b>30 gün</b> içinde silme işlemini tamamlar ve sana bildiririz.</p>
<h2>Silinen veriler</h2>
<ul><li>Hesap (e-posta, Google adı, kullanıcı kimliği)</li><li>Bulut kayıtları, rozetler, albüm, takma ad ve profil resmi</li><li>Skor tablosu satırı</li><li>Davet kodun ve davet kullanım kaydın</li></ul>
<h2>Saklanan veriler</h2>
<ul><li>Cihazındaki yerel kayıtlar (uygulamayı kaldırarak veya Ayarlar → Tüm verileri sil ile silebilirsin).</li><li>Satın alma kayıtları Google Play tarafından yasal yükümlülükler gereği tutulur; satın aldığın ürünler aynı Google hesabıyla geri yüklenebilir.</li></ul>
""",
'en': f"""
<h1>Account and Data Deletion</h1>
<p class="meta"><b>{APP}</b> · Developer: <b>{DEV}</b></p>
<h2>From inside the game (recommended)</h2>
<ol><li>Open the game and sign in with your account.</li><li>Tap the profile card on the main menu.</li><li>Press <b>Delete my account</b> and confirm.</li></ol>
<h2>If you can't access the app</h2>
<p>Send an e-mail with the subject “Account deletion” to <a href="mailto:{MAIL}?subject=Recipes%20of%20Barista%20-%20Account%20deletion">{MAIL}</a> from the e-mail address used for your account. After verifying your identity we complete the deletion within <b>30 days</b> and let you know.</p>
<h2>Data that is deleted</h2>
<ul><li>Account (e-mail, Google name, user ID)</li><li>Cloud saves, badges, album, nickname and profile picture</li><li>Leaderboard entry</li><li>Your invite code and invite redemption record</li></ul>
<h2>Data that is kept</h2>
<ul><li>Local saves on your device (remove them by uninstalling or via Settings → Delete all data).</li><li>Purchase records are retained by Google Play as required by law; purchased items can be restored with the same Google account.</li></ul>
""",
}
DEL_SUM = {
'de': ('Konto- und Datenlöschung', 'Im Spiel: Profilkarte im Hauptmenü → „Mein Konto löschen“. Ohne App: E-Mail mit Betreff „Account deletion“ an ' + MAIL + ' – Löschung innerhalb von 30 Tagen (Konto, Cloud-Spielstände, Bestenliste, Einladungsdaten).'),
'es': ('Eliminación de cuenta y datos', 'En el juego: tarjeta de perfil del menú → “Eliminar mi cuenta”. Sin la app: envía un correo con el asunto “Account deletion” a ' + MAIL + ' – se elimina en 30 días (cuenta, guardado en la nube, clasificación, invitaciones).'),
'pt': ('Exclusão de conta e dados', 'No jogo: cartão de perfil do menu → “Excluir minha conta”. Sem o app: envie um e-mail com o assunto “Account deletion” para ' + MAIL + ' – exclusão em até 30 dias (conta, nuvem, ranking, convites).'),
'he': ('מחיקת חשבון ונתונים', 'במשחק: כרטיס הפרופיל בתפריט הראשי ← „מחיקת החשבון”. ללא האפליקציה: שלחו אימייל עם הנושא “Account deletion” אל ' + MAIL + ' – המחיקה תושלם תוך 30 יום (חשבון, שמירות ענן, דירוג, הזמנות).'),
'ja': ('アカウントとデータの削除', 'ゲーム内：メインメニューのプロフィールカード →「アカウントを削除」。アプリが使えない場合：件名「Account deletion」で ' + MAIL + ' へメールしてください。30日以内に削除します（アカウント、クラウドセーブ、ランキング、招待データ）。'),
'ko': ('계정 및 데이터 삭제', '게임 내: 메인 메뉴의 프로필 카드 → ‘계정 삭제’. 앱을 쓸 수 없다면: 제목 “Account deletion”으로 ' + MAIL + '에 메일을 보내 주세요. 30일 이내에 삭제합니다(계정, 클라우드 저장, 순위표, 초대 정보).'),
'zh': ('删除账号和数据', '游戏内：主菜单的个人资料卡 →「删除账号」。无法使用应用时：以“Account deletion”为主题发送邮件至 ' + MAIL + '，我们将在30天内删除（账号、云存档、排行榜、邀请数据）。'),
}

CSS = """body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans','Noto Sans Hebrew','Noto Sans JP','Noto Sans KR','Noto Sans SC',sans-serif;max-width:820px;margin:0 auto;padding:16px 16px 60px;line-height:1.65;color:#3b2a1d;background:#FBF4E8}
h1{color:#6B4226;font-size:1.6em;margin:.4em 0}h2{color:#8A5530;margin-top:26px;font-size:1.2em}a{color:#8A5530}.meta{font-size:.92em;color:#6d5847}
nav{display:flex;flex-wrap:wrap;gap:6px;position:sticky;top:0;background:#FBF4E8;padding:8px 0;border-bottom:2px dashed #E3CBA4}
nav a{padding:4px 10px;border-radius:999px;background:#F1E0C3;text-decoration:none;font-size:.9em}nav a.on{background:#6B4226;color:#fff}
table{border-collapse:collapse;width:100%;font-size:.9em;display:block;overflow-x:auto}td,th{border:1px solid #E3CBA4;padding:6px 8px;vertical-align:top;text-align:start}th{background:#F1E0C3}
section{display:none}section.on{display:block}.note{background:#FFF6D8;border:1px solid #EBC96A;padding:8px 12px;border-radius:8px}
.docs{margin:10px 0;font-size:.9em}code{background:#F1E0C3;padding:0 4px;border-radius:4px}"""
TITLES = {'privacy': ('Gizlilik Politikası', 'Privacy Policy'), 'terms': ('Kullanıcı Sözleşmesi', 'Terms of Use'), 'delete-account': ('Hesap Silme', 'Account Deletion')}

def page(key, full, summ):
    secs = []
    for lg, nm in LANGS:
        d = ' dir="rtl"' if lg in RTL else ''
        if lg in full: body = full[lg]
        else:
            s = summ[lg]
            if key == 'delete-account':
                body = f"<h1>{html.escape(s[0])}</h1><p>{html.escape(s[1])}</p><p class='note'>English: <a href='?lang=en'>full text</a></p>"
            else:
                body = f"<h1>{html.escape(s[0])}</h1><p class='note'>{html.escape(s[1])} <a href='?lang=en'>English</a></p><ul>" + ''.join(f'<li>{html.escape(x)}</li>' for x in s[2]) + f"</ul><p>{DEV} · <a href='mailto:{MAIL}'>{MAIL}</a></p>"
        secs.append(f'<section id="l-{lg}" lang="{lg}"{d}>{body}</section>')
    nav = ''.join(f'<a href="?lang={lg}" data-l="{lg}">{nm}</a>' for lg, nm in LANGS)
    docs = ' · '.join(f'<a href="{k}.html" class="dl">{TITLES[k][1]}</a>' for k in TITLES)
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{APP} – {TITLES[key][1]} / {TITLES[key][0]}</title><meta name="robots" content="index,follow">
<style>{CSS}</style></head><body>
<nav>{nav}</nav><div class="docs">{docs}</div>
{''.join(secs)}
<script>(function(){{var L=['tr','en','de','es','pt','he','ja','ko','zh'],q=(new URLSearchParams(location.search).get('lang')||'').slice(0,2),n=(navigator.language||'en').slice(0,2),l=L.indexOf(q)>=0?q:(L.indexOf(n)>=0?n:'en');
var s=document.getElementById('l-'+l);s.classList.add('on');document.documentElement.lang=l;
document.querySelectorAll('nav a').forEach(function(a){{if(a.dataset.l===l)a.classList.add('on')}});
document.querySelectorAll('a.dl').forEach(function(a){{a.href=a.getAttribute('href')+'?lang='+l}});}})();</script>
<noscript><style>section{{display:block}}</style></noscript>
</body></html>"""

open(f'{OUT}/privacy.html', 'w', encoding='utf-8').write(page('privacy', PRIV, PRIV_SUM))
open(f'{OUT}/terms.html', 'w', encoding='utf-8').write(page('terms', TERMS, TERMS_SUM))
open(f'{OUT}/delete-account.html', 'w', encoding='utf-8').write(page('delete-account', DEL, DEL_SUM))
# AdMob app-ads.txt: AdMob hesabı açılınca pub-XXXXXXXXXXXXXXXX kısmını kendi yayıncı kimliğinle değiştir
if not os.path.exists(f'{OUT}/app-ads.txt'):
    open(f'{OUT}/app-ads.txt', 'w').write('# AdMob yayıncı kimliğini yaz / replace with your AdMob publisher ID\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n')
print('legal ok')
