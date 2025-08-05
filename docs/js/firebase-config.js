// ================================
// ✅ Firebase configuration for FixMyRoom
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyC7D-JCIAJdsecrluDKEFKr7XBeOb3RkO4",
  authDomain: "fixmyroom-7a518.firebaseapp.com",
  projectId: "fixmyroom-7a518",
  storageBucket: "fixmyroom-7a518.appspot.com", // ✅ corrected domain
  messagingSenderId: "128618384581",
  appId: "1:128618384581:web:2560232e41345b39d974ac"
};

// ✅ Initialize Firebase (Compat SDK)
firebase.initializeApp(firebaseConfig);

// ✅ Global references
const db = firebase.firestore();   // Firestore
const auth = firebase.auth();      // Authentication
const storage = firebase.storage(); // Storage (optional, used by Store)
