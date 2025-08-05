const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Auto delete worker profiles after 8 hours
exports.cleanupWorkers = functions.pubsub.schedule("every 60 minutes").onRun(async context => {
  const now = admin.firestore.Timestamp.now();
  const snapshot = await db.collection("workers").where("expiresAt", "<", now).get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  return null;
});
