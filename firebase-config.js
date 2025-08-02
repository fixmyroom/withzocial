// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7D-JCIAJdsecrluDKEFKr7XBeOb3RkO4",  // Your new API key
  authDomain: "fixmyroom-7a518.firebaseapp.com",
  projectId: "fixmyroom-7a518",
  storageBucket: "fixmyroom-7a518.appspot.com",
  messagingSenderId: "128618384581",
  appId: "1:128618384581:web:2560232e41345b39d974ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
