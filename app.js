// app.js
import { db, auth } from "./firebase-config.js";
import { 
  collection, addDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { 
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const providerFormContainer = document.getElementById("providerFormContainer");
const providerForm = document.getElementById("providerForm");

// --- AUTH LOGIC --- //

// Quick option: Google login (1-click)
const provider = new GoogleAuthProvider();

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    providerFormContainer.style.display = "block";
  } else {
    console.log("No user logged in");
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    providerFormContainer.style.display = "none";
  }
});

// --- PROVIDER FORM --- //
if (providerForm) {
  providerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(providerForm);
    const providerData = {
      name: formData.get("name"),
      type: formData.get("type"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      price: formData.get("price"),
      lat: parseFloat(formData.get("lat")),
      lng: parseFloat(formData.get("lng")),
      rating: 0,
      available: true,
      createdAt: serverTimestamp(),
      userId: auth.currentUser ? auth.currentUser.uid : null
    };

    try {
      await addDoc(collection(db, "providers"), providerData);
      alert("Provider added successfully!");
      providerForm.reset();
    } catch (error) {
      console.error("Error adding provider:", error.message);
      alert("Error: " + error.message);
    }
  });
}
