// ===============================
// FixMyRoom - Admin Panel
// ===============================

const usersRef = db.collection("users");
const requestsRef = db.collection("requests");
const storesRef = db.collection("stores");

// Auth check
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadUsers();
    loadRequests();
    loadStores();
  }
});

// ===============================
// Users table
// ===============================
function loadUsers() {
  const table = document.querySelector("#usersTable tbody");
  table.innerHTML = "";

  usersRef.onSnapshot(snapshot => {
    table.innerHTML = "";
    snapshot.forEach(doc => {
      const u = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${u.name || "N/A"}</td>
        <td>${u.role || "N/A"}</td>
        <td>${u.phone || "N/A"}</td>
        <td>${u.isPremium ? "⭐ Yes" : "❌ No"}</td>
        <td>
          <button onclick="togglePremium('${doc.id}', ${u.isPremium})">
            ${u.isPremium ? "Remove Premium" : "Set Premium"}
          </button>
        </td>
      `;

      table.appendChild(row);
    });
  });
}

function togglePremium(uid, currentStatus) {
  usersRef.doc(uid).update({
    isPremium: !currentStatus
  }).then(() => {
    alert("✅ Premium status updated");
  });
}

// ===============================
// Requests table
// ===============================
function loadRequests() {
  const table = document.querySelector("#requestsTable tbody");
  table.innerHTML = "";

  requestsRef.orderBy("createdAt", "desc").onSnapshot(snapshot => {
    table.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
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
// Stores table
// ===============================
function loadStores() {
  const table = document.querySelector("#storesTable tbody");
  table.innerHTML = "";

  storesRef.onSnapshot(snapshot => {
    table.innerHTML = "";
    snapshot.forEach(doc => {
      const s = doc.data();
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
