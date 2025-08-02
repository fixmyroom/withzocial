// user.js
import { db } from "./firebase-config.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Initialize map (center on Nepal)
const map = L.map("map").setView([28.3949, 84.1240], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const markers = {};
const providerRef = collection(db, "providers");
const providersList = document.getElementById("providersList");
const loadingMsg = document.getElementById("loadingMsg");

// 🔴 Real-time listener for providers
onSnapshot(providerRef, (snapshot) => {
  // Clear loading text
  if (loadingMsg) loadingMsg.remove();

  // Reset list each time snapshot updates
  providersList.innerHTML = "<h2>Providers</h2>";

  if (snapshot.empty) {
    providersList.innerHTML += "<p>No providers found 🚫</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;

    // Remove old marker if exists
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

    // Click list → focus marker
    div.onclick = () => {
      marker.openPopup();
      map.setView([data.lat, data.lng], 13);
    };

    providersList.appendChild(div);
  });
});
