// auth.js (modular version)

import { auth, db } from './firebase.js';
import { showAlert } from './utils.js';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Login
export async function login(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Logged in:", userCred.user.email);
    window.location.href = "role.html";
  } catch (err) {
    showAlert(err.message, "error");
  }
}

// Signup
export async function signup(email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("🆕 User created:", userCred.user.email);

    await setDoc(doc(db, "users", userCred.user.uid), {
      email: userCred.user.email,
      role: "customer", // default role
      createdAt: Date.now()
    });

    showAlert("Account created!", "success");
    window.location.href = "role.html";
  } catch (err) {
    showAlert(err.message, "error");
  }
}

// Google Login
export async function googleLogin() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Google login:", user.email);

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "customer",
      createdAt: Date.now()
    }, { merge: true });

    window.location.href = "role.html";
  } catch (err) {
    showAlert(err.message, "error");
  }
}

// Auto-redirect if logged in
export function checkAuthAndRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "role.html";
    }
  });
}
