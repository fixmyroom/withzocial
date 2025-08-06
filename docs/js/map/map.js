// ===============================
// FixMyRoom - Map + Firestore
// ===============================

// Initialize Leaflet map
const map = L.map('map').setView([27.7, 85.3], 13); // Kathmandu default
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Store markers
let markers = {};
let userMarker;

// Toast helper
function showToast(message) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#333";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Role emojis
function getRoleEmoji(role, isPremium) {
  let emoji = "👤";
  if (role === "painter") emoji = "🎨";
  if (role === "plumber") emoji = "🔧";
  if (role === "electrician") emoji = "⚡";
  if (role === "store") emoji = "🏬";
  if (isPremium) emoji = "⭐ " + emoji;
  return emoji;
}

// ===============================
// Live GPS tracking (customer)
// ===============================
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    // Show customer on map
    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
    } else {
      userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "customer-marker",
          html: "🧑",
          iconSize: [30, 30]
        })
      }).addTo(map).bindPopup("📍 You are here");
    }

    map.setView([lat, lng], 14);

    // Update Firestore
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection("users").doc(user.uid).set({
        location: { lat, lng, updated: Date.now() }
      }, { merge: true });
    }
  });
}

// ===============================
// Load workers + stores
// ===============================
db.collection("users")
  .orderBy("isPremium", "desc")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const id = change.doc.id;
      const data = change.doc.data();

      // 📌 Skip if no location
      if (!data.location) return;

      // 📌 Require phone number
      if (!data.phone || data.phone.trim() === "") {
        if (change.type !== "removed") {
          showToast(`⚠️ ${data.name || "This user"} is hidden (no phone set).`);
        }
        return; // don’t show users without phone
      }

      // Handle removed users
      if (change.type === "removed") {
        if (markers[id]) {
          map.removeLayer(markers[id]);
          delete markers[id];
        }
        return;
      }

      // Popup content with Request button
      const popupContent = `
        <b>${getRoleEmoji(data.role, data.isPremium)} ${data.name || "Unnamed"}</b><br>
        📞 ${data.phone}<br>
        💰 Price: ${data.price || "Not set"}<br>
        <button onclick="openRequest('${id}','${data.role || 'worker'}','${data.name || ''}')">📩 Request</button>
      `;

      if (markers[id]) {
        markers[id].setLatLng([data.location.lat, data.location.lng])
                   .bindPopup(popupContent)
                   .options.role = data.role; // store role for filtering
      } else {
        markers[id] = L.marker([data.location.lat, data.location.lng], { role: data.role })
                       .addTo(map)
                       .bindPopup(popupContent);
      }
    });

    // Apply filter after every update
    applyFilters();
  });

// ===============================
// Search + Role Filter + Auto Zoom
// ===============================
function applyFilters() {
  const searchVal = document.getElementById("searchInput") 
    ? document.getElementById("searchInput").value.toLowerCase()
    : "";
  const roleVal = document.getElementById("roleFilter") 
    ? document.getElementById("roleFilter").value 
    : "all";

  const visibleMarkers = [];

  for (const id in markers) {
    const marker = markers[id];
    const popup = marker.getPopup().getContent().toLowerCase();
    const markerRole = marker.options.role || "";

    const matchSearch = popup.includes(searchVal);
    const matchRole = (roleVal === "all" || roleVal === markerRole);

    if (matchSearch && matchRole) {
      marker.addTo(map);
      visibleMarkers.push(marker.getLatLng());
    } else {
      map.removeLayer(marker);
    }
  }

  // Always include customer marker if present
  if (userMarker) {
    visibleMarkers.push(userMarker.getLatLng());
  }

  // 📌 Auto zoom logic
  if (visibleMarkers.length > 0) {
    const bounds = L.latLngBounds(visibleMarkers);
    map.fitBounds(bounds, { padding: [50, 50] });
  } else if (userMarker) {
    // Only customer visible
    map.setView(userMarker.getLatLng(), 15);
  } else {
    // Reset to default Kathmandu
    map.setView([27.7, 85.3], 13);
  }
}

// Hook search + dropdown
if (document.getElementById("searchInput")) {
  document.getElementById("searchInput").addEventListener("input", applyFilters);
}
if (document.getElementById("roleFilter")) {
  document.getElementById("roleFilter").addEventListener("change", applyFilters);
}

// ===============================
// Request Modal 📩
// ===============================
const requestModal = document.getElementById("requestModal");
const closeRequest = document.getElementById("closeRequest");
const requestForm = document.getElementById("requestForm");
const reqPhotoInput = document.getElementById("reqPhoto");

window.openRequest = function(targetId, targetType, targetName) {
  document.getElementById("targetId").value = targetId;
  document.getElementById("targetType").value = targetType;
  requestModal.style.display = "flex";
};

if (closeRequest) {
  closeRequest.onclick = () => requestModal.style.display = "none";
}
window.onclick = e => {
  if (e.target === requestModal) requestModal.style.display = "none";
};

if (requestForm) {
  requestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reqName").value;
    const phone = document.getElementById("reqPhone").value;
    const details = document.getElementById("reqDetails").value;
    const targetId = document.getElementById("targetId").value;
    const targetType = document.getElementById("targetType").value;
    const file = reqPhotoInput.files[0];

    if (!name || !phone || !details) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    let photoURL = "";
    if (file) {
      const storageRef = firebase.storage().ref("requests/" + Date.now() + "_" + file.name);
      await storageRef.put(file);
      photoURL = await storageRef.getDownloadURL();
    }

    db.collection("requests").add({
      name,
      phone,
      details,
      targetId,
      targetType,
      photoURL,
      createdAt: Date.now()
    }).then(() => {
      alert("✅ Request sent!");
      requestModal.style.display = "none";
      requestForm.reset();
    }).catch(err => {
      alert("❌ " + err.message);
    });
  });
}

// ===============================
// Painter Tool 🎨
// ===============================
const canvas = document.getElementById("colorCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let img = new Image();

  window.previewRoomImage = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  window.applyColor = function() {
    if (!img.src) return;
    ctx.drawImage(img, 0, 0);
    const color = document.getElementById("colorPicker").value;
    ctx.fillStyle = color + "99"; // semi-transparent overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
}

// ===============================
// Plumber Tool 📏
// ===============================
window.startMeasuring = function() {
  const video = document.getElementById("camera");
  if (!video) return;
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
  }).catch(err => {
    alert("❌ Camera access failed: " + err.message);
  });
};
