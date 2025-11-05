const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Watch cellStatus documents for low label batch time and send notification.
// This is an example; calculation assumes PK & PH present in PartCatalog.
exports.notifyLowLabelBatch = functions.firestore
  .document("artifacts/{appId}/public/data/cellStatus/{cellName}")
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    const appId = context.params.appId;
    if (!after || !after.currentPartNumber || !after.currentLabelBatch) return null;

    const partRef = admin.firestore().doc(`artifacts/${appId}/public/data/partCatalog/${after.currentPartNumber}`);
    const partSnap = await partRef.get();
    if (!partSnap.exists) return null;
    const part = partSnap.data();
    const ph = part.phStd || 0;
    const pk = part.pk || 0;
    if (!ph || !pk) return null;

    const hoursRemaining = (after.currentLabelBatch * pk) / ph;
    // send notification if within 1 hour
    if (hoursRemaining <= 1) {
      // implement actual notification sending (FCM, Slack, etc.)
      console.log(`Notify: ${context.params.cellName} has ${hoursRemaining} hours remaining.`);
      // Example: push a field to cellStatus.notifications or send FCM via tokens stored in a separate collection.
      return admin.firestore().collection(`artifacts/${appId}/public/data/cellStatus/${context.params.cellName}/notifications`).add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: "LOW_LABEL_BATCH",
        hoursRemaining,
        currentLabelBatch: after.currentLabelBatch
      });
    }
    return null;
  });
