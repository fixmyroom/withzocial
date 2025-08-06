// ===============================
// FixMyRoom - Booking Logic (Modular SDK)
// ===============================

import {
  getFirestore, doc, getDoc, addDoc, collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { app } from "./firebase.js";
import { showAlert } from "./utils.js"; // ✅ Import showAlert

const db = getFirestore(app);
const auth = getAuth(app);

// ===============================
// Submit a service request
// ===============================
export async function submitRequest() {
  const user = auth.currentUser;
  if (!user) {
    showAlert("Please login first!", "error");
    return;
  }

  const serviceType = document.getElementById("serviceType").value;
  const requestDetails = document.getElementById("requestDetails").value.trim();

  if (!serviceType || !requestDetails) {
    showAlert("Please select a service and enter details!", "error");
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      showAlert("Profile not found. Please update your profile.", "error");
      return;
    }

    const profile = userDoc.data();
    const location = profile.location || null;

    await addDoc(collection(db, "requests"), {
      customerId: user.uid,
      customerName: profile.name || "Unnamed",
      customerPhone: profile.phone || "N/A",
      serviceType,
      details: requestDetails,
      location,
      status: "pending",
      createdAt: Date.now()
    });

    showAlert("Request sent! Please wait for a worker to respond.", "success");
    document.getElementById("requestDetails").value = "";
  } catch (err) {
    console.error("Request failed:", err);
    showAlert("Failed to submit request.", "error");
  }
}

// ===============================
// Worker Listener (For worker.html usage)
// ===============================
export function listenToRequests(callback) {
  const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        console.log("📩 New request:", data.serviceType, data.details);
        if (typeof callback === "function") {
          callback(data);
        }
      }
    });
  });
}
