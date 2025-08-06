// ===============================
// ✅ FixMyRoom - Admin Panel (MODULAR SDK)
// ===============================
import { auth, db } from './firebase.js';
import { showAlert } from './utils.js';

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import {
  collection, doc, updateDoc, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ✅ Firestore References
const usersRef = collection(db, "users");
const requestsRef = collection(db, "requests");
const storesRef = collection(db, "stores");

// ✅ Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadUsers();
    loadRequests();
    loadStores();
  }
});

// ===============================
// ✅ Users table
// ===============================
function loadUsers() {
  const table = document.querySelector("#usersTable tbody");
  table.innerHTML = "";

  onSnapshot(usersRef, (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach(docSnap => {
      const u = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${u.name || "N/A"}</td>
        <td>${u.role || "N/A"}</td>
        <td>${u.phone || "N/A"}</td>
        <td>${u.isPremium ? "⭐ Yes" : "❌ No"}</td>
        <td>
          <button onclick="togglePremium('${docSnap.id}', ${u.isPremium})">
            ${u.isPremium ? "Remove Premium" : "Set Premium"}
          </button>
        </td>
      `;
      table.appendChild(row);
    });
  });
}

// ✅ Toggle premium status
window.togglePremium = async function (uid, currentStatus) {
  try {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, {
      isPremium: !currentStatus
    });
    showAlert("Premium status updated", "success");
  } catch (err) {
    showAlert(err.message, "error");
  }
};

// ===============================
// ✅ Requests table
// ===============================
function loadRequests() {
  const table = document.querySelector("#requestsTable tbody");
  table.innerHTML = "";

  const q = query(requestsRef, orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach(docSnap => {
      const r = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${r.name}</td>
        <td>${r.phone}</td>
        <td>${r.details}</td>
        <td>${new Date(r.createdAt).toLocaleString()}</td>
      `;

      table.appendChild(row);
    });
  });
}

// ===============================
// ✅ Stores table
// ===============================
function loadStores() {
  const table = document.querySelector("#storesTable tbody");
  table.innerHTML = "";

  onSnapshot(storesRef, (snapshot) => {
    table.innerHTML = "";
    snapshot.forEach(docSnap => {
      const s = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${s.name || "N/A"}</td>
        <td>${s.phone || "N/A"}</td>
        <td>${s.desc || ""}</td>
      `;

      table.appendChild(row);
    });
  });
}
