// ===========================
// Auth Logic
// ===========================

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCred => {
      console.log("✅ Logged in:", userCred.user.email);
      window.location.href = "role.html"; // after login → choose role
    })
    .catch(err => {
      alert("❌ " + err.message);
    });
}

// Signup
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      console.log("🆕 User created:", userCred.user.email);

      // Save default user in Firestore
      db.collection("users").doc(userCred.user.uid).set({
        email: userCred.user.email,
        role: "customer", // default role
        createdAt: Date.now()
      });

      alert("✅ Account created!");
      window.location.href = "role.html";
    })
    .catch(err => {
      alert("❌ " + err.message);
    });
}

// Google Sign-in
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      console.log("✅ Google login:", user.email);

      // Save to Firestore if new
      db.collection("users").doc(user.uid).set({
        email: user.email,
        role: "customer",
        createdAt: Date.now()
      }, { merge: true });

      window.location.href = "role.html";
    })
    .catch(err => {
      alert("❌ " + err.message);
    });
}

// Auto redirect if already logged in
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location.href = "role.html";
  }
});
