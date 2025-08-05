import { auth, db } from "../firebase-config.js";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Google Login
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUser(result.user);
    window.location.href = "role.html";
  } catch (error) {
    showError(error.message);
  }
});

// Email Login (simple demo — signup if not found)
document.getElementById("emailLogin")?.addEventListener("click", async () => {
  const email = prompt("Enter your email 📧:");
  const password = prompt("Enter a password 🔑:");

  try {
    let userCred;
    try {
      userCred = await signInWithEmailAndPassword(auth, email, password);
    } catch {
      userCred = await createUserWithEmailAndPassword(auth, email, password);
    }
    await saveUser(userCred.user);
    window.location.href = "role.html";
  } catch (error) {
    showError(error.message);
  }
});

// Save new user in Firestore
async function saveUser(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || "User",
      email: user.email,
      role: "unassigned",
      createdAt: new Date().toISOString()
    });
  }
}

function showError(msg) {
  document.getElementById("authMessage").innerText = msg;
}
