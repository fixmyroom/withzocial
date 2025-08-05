import { auth, db } from "../firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }
  window.currentUser = user;
});

window.saveStore = () => {
  const name = document.getElementById("storeName").value;
  const category = document.getElementById("storeCategory").value;
  const phone = document.getElementById("storePhone").value;

  if (!name || !category) {
    return alert("⚠️ Fill all details");
  }

  if (!navigator.geolocation) {
    alert("❌ Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    try {
      await setDoc(doc(db, "stores", window.currentUser.uid), {
        name,
        category,
        phone,
        location: { lat: latitude, lng: longitude },
        updatedAt: new Date().toISOString()
      }, { merge: true });

      alert("✅ Store saved & visible on customer map!");
    } catch (e) {
      alert("❌ Error: " + e.message);
    }
  });
};
