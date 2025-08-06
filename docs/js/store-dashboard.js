import { auth, db, storage } from './firebase-config.js';
import {
  doc, setDoc, getDoc, collection, addDoc, getDocs, deleteDoc, orderBy, query
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const storesRef = collection(db, "stores");

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadStore(user.uid);
    loadProducts(user.uid);
  }
});

document.getElementById("saveStore").onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const data = {
    name: document.getElementById("storeName").value,
    phone: document.getElementById("storePhone").value,
    desc: document.getElementById("storeDesc").value,
    updatedAt: Date.now()
  };

  await setDoc(doc(db, "stores", user.uid), data, { merge: true });
  alert("✅ Store profile saved");
};

document.getElementById("addProduct").onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const file = document.getElementById("productPhoto").files[0];

  if (!name || !price || !file) {
    alert("❌ Please fill all product fields!");
    return;
  }

  const fileRef = ref(storage, `products/${user.uid}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  const productRef = collection(db, "stores", user.uid, "products");
  await addDoc(productRef, {
    name, price, photo: url,
    createdAt: Date.now()
  });

  alert("✅ Product added!");
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productPhoto").value = "";
  loadProducts(user.uid);
};

async function loadStore(uid) {
  const docSnap = await getDoc(doc(db, "stores", uid));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("storeName").value = data.name || "";
    document.getElementById("storePhone").value = data.phone || "";
    document.getElementById("storeDesc").value = data.desc || "";
  }
}

async function loadProducts(uid) {
  const gallery = document.getElementById("catalogGallery");
  gallery.innerHTML = "";
  const q = query(collection(db, "stores", uid, "products"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.photo}" alt="${p.name}" />
      <p><b>${p.name}</b><br>Rs. ${p.price}</p>
      <button class="danger" data-id="${docSnap.id}">🗑 Delete</button>
    `;
    gallery.appendChild(div);
  });

  document.querySelectorAll('.danger').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute("data-id");
      deleteProduct(uid, id);
    });
  });
}

async function deleteProduct(uid, productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  await deleteDoc(doc(db, "stores", uid, "products", productId));
  alert("🗑 Product deleted!");
  loadProducts(uid);
}

document.querySelector("button[onclick='logout()']").onclick = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
