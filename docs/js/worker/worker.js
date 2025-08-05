import { auth, db } from "../firebase-config.js";
import { doc, setDoc, onSnapshot, query, where, collection, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

let currentWorkerId = null;

// Wait for user auth
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  currentWorkerId = user.uid;

  // Start GPS tracking
  startLocationUpdates(user);

  // Listen for requests
  const reqRef = query(collection(db, "requests"), where("workerId", "==", user.uid));
  onSnapshot(reqRef, (snap) => {
    const list = document.getElementById("reqList");
    list.innerHTML = "";
    snap.forEach(docSnap => {
      const req = docSnap.data();
      const div = document.createElement("div");
      div.className = "req";
      div.innerHTML = `
        🧑‍💼 Customer: ${req.customerId}<br>
        Status: ${req.status}<br>
        <button class="accept" onclick="acceptReq('${docSnap.id}')">✔️ Accept</button>
        <button class="reject" onclick="rejectReq('${docSnap.id}')">❌ Reject</button>
      `;
      list.appendChild(div);
    });
  });
});

// Update worker location every 10s
function startLocationUpdates(user) {
  if (!navigator.geolocation) {
    alert("❌ Geolocation not supported.");
    return;
  }

  setInterval(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      await setDoc(doc(db, "workers", user.uid), {
        name: user.displayName || "Worker",
        skill: "General", // we can make this editable later
        availability: "Available",
        location: { lat: latitude, lng: longitude },
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
  }, 10000); // 10 seconds
}

// Accept / Reject request
window.acceptReq = async (reqId) => {
  await updateDoc(doc(db, "requests", reqId), { status: "accepted" });
  alert("✅ Request accepted!");
};

window.rejectReq = async (reqId) => {
  await updateDoc(doc(db, "requests", reqId), { status: "rejected" });
  alert("❌ Request rejected!");
};
