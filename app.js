
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
    projectId: "kaylakay-cdf64",
    storageBucket: "kaylakay-cdf64.firebasestorage.app",
    messagingSenderId: "663099511740",
    appId: "1:663099511740:web:aeb6bddccee9666ff791b9",
    measurementId: "G-JF9PNTTTG4"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const liste = document.getElementById("liste");
const votedKey = "deja_vote_concours";

// 🔹 AFFICHAGE REDAKSYON YO
onValue(ref(db, "concours/participants"), snap => {
  liste.innerHTML = "";

  snap.forEach(item => {
    const d = item.val();

    // 🔸 Montre sèlman 200 premiers caractères
    const extrait = d.texte.substring(0, 200) + "...";

    const dejaVote = localStorage.getItem(votedKey) === item.key;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h4>${d.titre}</h4>
      <p><strong>${d.nom}</strong></p>
      <p>${extrait}</p>
      <button class="${dejaVote ? "voted" : ""}">
        ${dejaVote ? "✔️ Vote enregistré" : "👍 Voter"}
      </button>
    `;

    const btn = div.querySelector("button");

    if (!dejaVote) {
      btn.onclick = () => voter(item.key, btn);
    } else {
      btn.disabled = true;
    }

    liste.appendChild(div);
  });
});

// 🔹 FONCTION VOTE
function voter(id, btn) {
  if (localStorage.getItem(votedKey)) {
    alert("❌ Ou deja vote sou telefòn sa");
    return;
  }

  runTransaction(
    ref(db, "concours/participants/" + id + "/votes"),
    v => (v || 0) + 1
  );

  localStorage.setItem(votedKey, id);
  btn.textContent = "✔️ Vote enregistré";
  btn.classList.add("voted");
  btn.disabled = true;
    }
