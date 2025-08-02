import { db } from "./firebase-config.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Initialize map
const map = L.map("map").setView([28.3949, 84.1240], 7);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const markers = {};
const providerRef = collection(db, "providers");
const providersList = document.getElementById("providerList");
const loadingMsg = document.getElementById("loadingMsg");

// Real-time Firestore listener
onSnapshot(providerRef, (snapshot) => {
  if (loadingMsg) loadingMsg.remove();
  providersList.innerHTML = "";

  if (snapshot.empty) {
    providersList.innerHTML = "<p>No providers found 🚫</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;

    // Remove old marker
    if (markers[id]) map.removeLayer(markers[id]);

    // Add marker
    const marker = L.marker([data.lat, data.lng]).addTo(map);
    marker.bindPopup(`
      <b>${data.name}</b><br>
      ${data.type} • ${data.price}<br>
      ⭐ ${data.rating ?? "No rating"}<br>
      ${data.available ? "✅ Available" : "❌ Not available"}<br>
      📍 ${data.address}<br>
      📞 <a href="tel:${data.phone}">${data.phone}</a>
    `);
    markers[id] = marker;

    // Sidebar card
    const div = document.createElement("div");
    div.classList.add("provider");
    div.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.type} • ${data.price}</p>
      <p>⭐ ${data.rating ?? "No rating"} | ${data.available ? "✅ Available" : "❌ Not available"}</p>
      <p>📍 ${data.address}</p>
      <p>📞 ${data.phone}</p>
    `;

    // On click focus map
    div.onclick = () => {
      marker.openPopup();
      map.setView([data.lat, data.lng], 13);
    };

    providersList.appendChild(div);
  });
});
