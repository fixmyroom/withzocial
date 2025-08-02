import { db } from "./public/firebase-config.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const map = L.map("map").setView([20.5937, 78.9629], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let tempMarker;
map.on("click", (e) => {
  if (tempMarker) map.removeLayer(tempMarker);
  tempMarker = L.marker(e.latlng).addTo(map);
  document.getElementById("lat").value = e.latlng.lat;
  document.getElementById("lng").value = e.latlng.lng;
});

window.saveProvider = async function () {
  const provider = {
    type: document.getElementById("type").value,
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    rating: Number(document.getElementById("rating").value) || 0,
    available: document.getElementById("available").value === "true",
    lat: Number(document.getElementById("lat").value),
    lng: Number(document.getElementById("lng").value)
  };
  await addDoc(collection(db, "providers"), provider);
  alert("✅ Provider saved!");
};

function renderProviders() {
  const list = document.getElementById("providersList");
  list.innerHTML = "";
  const search = document.getElementById("searchBox").value.toLowerCase();

  onSnapshot(collection(db, "providers"), (snapshot) => {
    list.innerHTML = "";
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d.name.toLowerCase().includes(search)) {
        const div = document.createElement("div");
        div.classList.add("provider");
        div.innerHTML = `
          <h3>${d.name}</h3>
          <p>${d.type} • ${d.price}</p>
          <p>⭐ ${d.rating || "N/A"} | ${d.available ? "🟢 Available" : "🔴 Unavailable"}</p>
          <p>📍 ${d.address}</p>
        `;
        list.appendChild(div);
      }
    });
  });
}
window.renderProviders = renderProviders;
renderProviders();
