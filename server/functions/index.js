/* Recipes of Barista — sunucu tarafı skor doğrulama (Firebase Cloud Functions, Blaze planı gerekir)
   v6 (Zaman Yolculuğu Sagası): skor = ulaşılan bölüm × 1 milyar + Zaman Hazinesi (milyon çekirdek).
   Skor tablosuna her yazımda oyuncunun buluttaki kayıtlarıyla karşılaştırılır; kayıtlardan hesaplanan
   skordan büyükse düzeltilir, tutarlıysa "verified" işaretlenir. */
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

function slotScore(s) {
  if (!s || s.tainted) return 0;
  const ch = s.finished ? 101 : Math.min(100, Math.max(1, s.stage || 1));
  const treasure = (s.treasure || 0) + (s.finished ? (s.peak || 0) : 0);
  if (treasure > 1e15) return 0;
  return ch * 1e9 + Math.min(999999999, Math.floor(treasure / 1e6));
}

exports.verifyScore = onDocumentWritten({ document: 'leaderboard/{uid}', region: 'europe-west1' }, async (event) => {
  const after = event.data.after.exists ? event.data.after.data() : null;
  if (!after) return;
  const snap = await db.doc(`users/${event.params.uid}`).get();
  let top = 0, spins = 0;
  if (snap.exists) {
    let d = {};
    try { d = JSON.parse(snap.data().data || '{}'); } catch (e) {}
    (d.slots || []).forEach(s => { top = Math.max(top, slotScore(s)); });
    spins = (d.profile && d.profile.stats && d.profile.stats.spins) || 0;
  }
  const fix = {};
  if ((after.best || 0) > top) fix.best = top;
  if (after.bestStory) fix.bestStory = 0;
  if (after.bestGambler) fix.bestGambler = 0;
  // her bölüm en az ~25 spin ister; daha azıyla gelen ilerleme şüphelidir
  const ch = Math.floor((after.best || 0) / 1e9);
  const suspicious = ch > 5 && spins < ch * 25;
  const verified = !('best' in fix) && !suspicious;
  if (Object.keys(fix).length || after.verified !== verified) {
    await event.data.after.ref.update({ ...fix, verified });
  }
});
