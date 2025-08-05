import { db } from "../firebase-config.js";
import { collection, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Render helper
function renderTable(ref, tableId, fields, type) {
  const table = document.getElementById(tableId);
  onSnapshot(collection(db, ref), (snap) => {
    table.innerHTML = `<tr>${fields.map(f => `<th>${f}</th>`).join("")}<th>Action</th></tr>`;
    snap.forEach(d => {
      const data = d.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        ${fields.map(f => `<td>${data[f] || ""}</td>`).join("")}
        <td><button onclick="deleteItem('${ref}','${d.id}')">🗑️ Delete</button></td>
      `;
      table.appendChild(row);
    });
  });
}

// Attach tables
renderTable("users", "usersTable", ["name", "email", "phone"]);
renderTable("workers", "workersTable", ["name", "skill", "phone"]);
renderTable("stores", "storesTable", ["name", "category", "phone"]);
renderTable("requests", "reqsTable", ["customerId", "workerId", "status"]);

// Delete item
window.deleteItem = async (col, id) => {
  if (confirm("⚠️ Delete this record?")) {
    await deleteDoc(doc(db, col, id));
    alert("✅ Deleted");
  }
};
