// Firebase v9 Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7D-JCIAJdsecrluDKEFKr7XBeOb3RkO4",
  authDomain: "fixmyroom-7a518.firebaseapp.com",
  projectId: "fixmyroom-7a518",
  storageBucket: "fixmyroom-7a518.appspot.com",
  messagingSenderId: "128618384581",
  appId: "1:128618384581:web:2560232e41345b39d974ac"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
