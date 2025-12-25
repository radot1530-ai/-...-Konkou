
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAgvH0CpF6tGISpfLw3JWJCT2beBG28wAM",
    authDomain: "kaylakay-cdf64.firebaseapp.com",
    databaseURL:"https://kaylakay-cdf64-default-rtdb.firebaseio.com/",
    projectId: "kaylakay-cdf64",
    storageBucket: "kaylakay-cdf64.firebasestorage.app",
    messagingSenderId: "663099511740",
    appId: "1:663099511740:web:aeb6bddccee9666ff791b9",
    measurementId: "G-JF9PNTTTG4"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



/* 🔹 HTML */
const liste = document.getElementById("liste");

/* 🔹 PREVENT DOUBLE VOTE */
const dejaVote = localStorage.getItem("vote_konkou");

/* 🔹 DB REF */
const concoursRef = ref(db, "concours");

/* 🔹 LOAD DATA */
onValue(concoursRef, (snapshot) => {
  liste.innerHTML = "";

  if (!snapshot.exists()) {
    liste.innerHTML = "❌ Pa gen okenn done pou vote.";
    return;
  }

  snapshot.forEach((child) => {
    const id = child.key;
    const d = child.val();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h4>${d.nom || "Anonim"}</h4>
      <p>${(d.texte || "").substring(0, 120)}...</p>
      <button ${dejaVote ? "disabled" : ""}>
        👍 Vote (${d.votes || 0})
      </button>
    `;

    card.querySelector("button").onclick = () => {
      if (dejaVote) return;

      runTransaction(
        ref(db, "concours/" + id + "/votes"),
        (v) => (v || 0) + 1
      );

      localStorage.setItem("vote_konkou", "ok");
      location.reload();
    };

    liste.appendChild(card);
  });
});
