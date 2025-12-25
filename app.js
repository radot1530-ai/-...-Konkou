
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
const participantsRef = ref(db, "concours/participants");

onValue(participantsRef, (snapshot) => {
  liste.innerHTML = "";

  if (!snapshot.exists()) {
    liste.innerHTML = "❌ Aucun participant trouvé";
    return;
  }

  const data = snapshot.val();

  Object.keys(data).forEach(id => {
    const p = data[id];

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${p.titre}</h3>
      <p>${p.texte.substring(0, 80)}...</p>
      <p>Votes : <span id="v-${id}">${p.votes}</span></p>
      <button onclick="vote('${id}')">Voter</button>
      <hr>
    `;
    liste.appendChild(div);
  });
});

window.vote = function(id) {
  const voteRef = ref(db, `concours/participants/${id}/votes`);

  runTransaction(voteRef, (current) => {
    return (current || 0) + 1;
  });

  alert("✅ Vote enregistré");
};
