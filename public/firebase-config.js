// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7D-JCIAJdsecrluDKEFKr7XBeOb3RkO4",
  authDomain: "fixmyroom-7a518.firebaseapp.com",
  projectId: "fixmyroom-7a518",
  storageBucket: "fixmyroom-7a518.firebasestorage.app",
  messagingSenderId: "128618384581",
  appId: "1:128618384581:web:2560232e41345b39d974ac"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, signOut };
