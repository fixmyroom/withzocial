// js/firebase-config.js
// ================================
// ✅ Firebase configuration for FixMyRoom (MODULAR)
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC7D-JCIAJdsecrluDKEFKr7XBeOb3RkO4",
  authDomain: "fixmyroom-7a518.firebaseapp.com",
  projectId: "fixmyroom-7a518",
  storageBucket: "fixmyroom-7a518.appspot.com",
  messagingSenderId: "128618384581",
  appId: "1:128618384581:web:2560232e41345b39d974ac"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
