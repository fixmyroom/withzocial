import { db } from "../firebase-config.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Init Map (dark theme tiles)
const map = L.map('map').setView([27.7172, 85.3240], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
}).addTo(map);

const markers = {};

// Workers live
const workerRef = collection(db, "workers");
onSnapshot(workerRef, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    const data = change.doc.data();
    const id = change.doc.id;

    if (!data.location) return;

    if (change.type === "added" || change.type === "modified") {
      if (markers[id]) map.removeLayer(markers[id]);

      markers[id] = L.marker([data.location.lat, data.location.lng])
        .addTo(map)
        .bindPopup(`
          <b>${data.name}</b><br>
          🧑‍🔧 ${data.skill}<br>
          ⭐ ${data.rating || 0}<br>
          <button onclick="startBooking('${id}','${data.name}')">📩 Request</button>
        `);
    }
    if (change.type === "removed") {
      if (markers[id]) map.removeLayer(markers[id]);
    }
  });
});

// Stores live
const storeRef = collection(db, "stores");
onSnapshot(storeRef, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    const data = change.doc.data();
    const id = change.doc.id;

    if (!data.location) return;

    if (change.type === "added" || change.type === "modified") {
      if (markers[id]) map.removeLayer(markers[id]);

      markers[id] = L.marker([data.location.lat, data.location.lng], { icon: storeIcon() })
        .addTo(map)
        .bindPopup(`
          <b>${data.name}</b><br>
          🏪 ${data.category}<br>
          📞 ${data.phone || 'N/A'}
        `);
    }
    if (change.type === "removed") {
      if (markers[id]) map.removeLayer(markers[id]);
    }
  });
});

function storeIcon() {
  return L.icon({
    iconUrl: 'img/store.png',
    iconSize: [32, 32],
  });
}

// Expose booking start
window.startBooking = (workerId, workerName) => {
  localStorage.setItem("selectedWorker", workerId);
  document.getElementById("confirmText").innerText = `📩 Book ${workerName}?`;
  document.getElementById("confirmBox").style.display = "block";
};
