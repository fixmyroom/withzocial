// ===============================
// FixMyRoom - Booking Logic
// ===============================

// Submit a service request
function submitRequest() {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("❌ Please login first!");
    return;
  }

  const serviceType = document.getElementById("serviceType").value;
  const requestDetails = document.getElementById("requestDetails").value.trim();

  if (!serviceType || !requestDetails) {
    alert("⚠️ Please select a service and enter details!");
    return;
  }

  // Get customer profile for name + phone
  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists) {
      alert("❌ Profile not found. Please update your profile.");
      return;
    }

    const profile = doc.data();
    const location = profile.location || null;

    // Save request
    db.collection("requests").add({
      customerId: user.uid,
      customerName: profile.name || "Unnamed",
      customerPhone: profile.phone || "N/A",
      serviceType,
      details: requestDetails,
      location,
      status: "pending",
      createdAt: Date.now()
    }).then(() => {
      alert("✅ Request sent! Please wait for a worker to respond.");
      document.getElementById("requestDetails").value = "";
    }).catch(err => {
      console.error("Request failed:", err);
      alert("❌ Failed to submit request.");
    });
  });
}

// ===============================
// Worker Notifications
// ===============================
// (This is passive - workers will see only relevant requests in their dashboard.)
db.collection("requests")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const data = change.doc.data();
        console.log("📩 New request:", data.serviceType, data.details);
        // In worker.html, we will filter requests by role
      }
    });
  });
