// ===============================
// FixMyRoom - Worker Dashboard
// ===============================

let map;
let userMarker;

// Init map
function initMap() {
  map = L.map('map').setView([27.7, 85.3], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

// Track worker location
function trackWorkerLocation(userId) {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Update marker
      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
      } else {
        userMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "worker-marker",
            html: "👷",
            iconSize: [30, 30]
          })
        }).addTo(map).bindPopup("📍 You are here");
      }

      map.setView([lat, lng], 14);

      // Update Firestore
      db.collection("users").doc(userId).set({
        location: { lat, lng, updated: Date.now() }
      }, { merge: true });
    });
  }
}

// Save worker profile
function saveWorkerProfile() {
  const user = firebase.auth().currentUser;
  if (!user) return;

  const name = document.getElementById("workerName").value;
  const phone = document.getElementById("workerPhone").value;
  const price = document.getElementById("workerPrice").value;

  db.collection("users").doc(user.uid).set({
    name, phone, price
  }, { merge: true }).then(() => {
    alert("✅ Profile updated!");
  });
}

// Load requests for this worker
function loadRequests(role) {
  const requestsList = document.getElementById("requestsList");
  db.collection("requests")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      requestsList.innerHTML = "";
      let hasRequests = false;

      snapshot.forEach(doc => {
        const req = doc.data();

        // Show only requests for this role
        if (req.serviceType !== role) return;

        hasRequests = true;
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <p><b>👤 ${req.customerName}</b> (${req.customerPhone})</p>
          <p>${req.details}</p>
          <button class="btn btn-primary" onclick="acceptRequest('${doc.id}')">✅ Accept</button>
          <button class="btn btn-danger" onclick="rejectRequest('${doc.id}')">❌ Reject</button>
        `;
        requestsList.appendChild(div);
      });

      if (!hasRequests) {
        requestsList.innerHTML = "<p>No requests yet.</p>";
      }
    });
}

// Accept request
function acceptRequest(id) {
  db.collection("requests").doc(id).update({
    status: "accepted"
  }).then(() => {
    alert("🎉 You accepted this request!");
  });
}

// Reject request
function rejectRequest(id) {
  db.collection("requests").doc(id).update({
    status: "rejected"
  }).then(() => {
    alert("❌ You rejected this request.");
  });
}

// ===============================
// Init
// ===============================
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    db.collection("users").doc(user.uid).get().then(doc => {
      const data = doc.data();
      const role = data?.role || "worker";

      initMap();
      trackWorkerLocation(user.uid);
      loadRequests(role);

      // Pre-fill profile
      if (data) {
        document.getElementById("workerName").value = data.name || "";
        document.getElementById("workerPhone").value = data.phone || "";
        document.getElementById("workerPrice").value = data.price || "";
      }
    });
  } else {
    window.location.href = "login.html";
  }
});
