// ======================
// Store Dashboard Logic
// ======================

const auth = firebase.auth();
const usersRef = db.collection("users");
const storage = firebase.storage();

let currentUser;

// Check auth state
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;

  // Load store profile
  usersRef.doc(user.uid).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("storeName").value = data.name || "";
      document.getElementById("storePhone").value = data.phone || "";
      document.getElementById("storeAddress").value = data.address || "";
    }
  });

  loadCatalog();
});

// Save store profile
document.getElementById("saveStore").addEventListener("click", () => {
  const name = document.getElementById("storeName").value;
  const phone = document.getElementById("storePhone").value;
  const address = document.getElementById("storeAddress").value;

  if (!name || !phone || !address) {
    alert("⚠️ Please fill all store details");
    return;
  }

  usersRef.doc(currentUser.uid).set({
    name, phone, address,
    role: "store",
    updatedAt: Date.now()
  }, { merge: true })
  .then(() => {
    alert("✅ Store profile saved!");
  });
});

// Upload product to catalog
document.getElementById("uploadCatalog").addEventListener("click", () => {
  const file = document.getElementById("catalogPhoto").files[0];
  const name = document.getElementById("catalogName").value;
  const price = document.getElementById("catalogPrice").value;
  const desc = document.getElementById("catalogDesc").value;

  if (!file || !name || !price) {
    alert("⚠️ Please fill all product details & choose a photo");
    return;
  }

  const storageRef = storage.ref(`catalog/${currentUser.uid}/${Date.now()}_${file.name}`);
  storageRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      db.collection("catalog").add({
        storeId: currentUser.uid,
        name, price, desc,
        photoUrl: url,
        createdAt: Date.now()
      }).then(() => {
        alert("✅ Product uploaded!");
        loadCatalog();
      });
    });
  });
});

// Load catalog items
function loadCatalog() {
  const gallery = document.getElementById("catalogGallery");
  gallery.innerHTML = "";

  db.collection("catalog")
    .where("storeId", "==", currentUser.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      gallery.innerHTML = "";
      snapshot.forEach(doc => {
        const item = doc.data();
        const div = document.createElement("div");
        div.classList.add("catalog-item");
        div.innerHTML = `
          <img src="${item.photoUrl}" class="catalog-photo" alt="${item.name}">
          <p><b>${item.name}</b> - Rs. ${item.price}</p>
          <p>${item.desc || ""}</p>
        `;
        gallery.appendChild(div);
      });
    });
}
