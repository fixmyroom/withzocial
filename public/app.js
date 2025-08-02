// app.js
import { auth, provider, signInWithPopup, signOut } from "./firebase-config.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const providerFormContainer = document.getElementById("providerFormContainer");

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.email);
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    // Show form only for admin
    if (user.email === "zocialnepal@gmail.com") {
      providerFormContainer.style.display = "block";
    }
  } else {
    console.log("No user logged in");
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    providerFormContainer.style.display = "none";
  }
});

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(console.error);
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).catch(console.error);
});
