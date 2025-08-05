import { auth, db } from "../firebase-config.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

window.confirmYes = async () => {
  const workerId = localStorage.getItem("selectedWorker");
  if (!workerId) return alert("No worker selected");

  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  try {
    await addDoc(collection(db, "requests"), {
      customerId: user.uid,
      workerId,
      status: "pending",
      timestamp: new Date().toISOString()
    });
    alert("✅ Request sent!");
    document.getElementById("confirmBox").style.display = "none";
  } catch (e) {
    alert("❌ Error: " + e.message);
  }
};

window.confirmNo = () => {
  document.getElementById("confirmBox").style.display = "none";
};
