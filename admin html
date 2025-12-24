// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
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
    appId: "1:663099511740:web:5db3589db9bd323df791b9",
    measurementId: "G-WLH8VJCEC8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

const db = getDatabase(app);
const paiement = document.getElementById("paiement");
const attente = document.getElementById("attente");
const valide = document.getElementById("valide");
const elimine = document.getElementById("elimine");

onValue(ref(db, "concours/participants"), snap => {
  attente.innerHTML = valide.innerHTML = elimine.innerHTML = "";

  snap.forEach(s => {
    const d = s.val();
    const id = s.key;

    const card = `
      <div class="card">
        <h4>${d.titre}</h4>
        <small>${d.nom} (${d.age})</small><br>
        <button class="blue" onclick="set('${id}','valide')">Valide</button>
        <button class="red" onclick="set('${id}','elimine')">Élimine</button>
      </div>
    `;

    if (d.statut === "en_attente") attente.innerHTML += card;
    if (d.statut === "valide") valide.innerHTML += card;
    if (d.statut === "elimine") elimine.innerHTML += card;
    if (d.statut === "paiement_en_attente") {
  paiement.innerHTML += `
    <div class="card">
      <h4>${d.titre}</h4>
      <p>${d.nom}</p>
      <p>📱 ${d.paiement.numero}</p>
      <p>🧾 ${d.paiement.transactionId}</p>

      <button class="blue"
        onclick="validerPaiement('${id}')">
        Valider Peman
      </button>
    </div>
  `;
};
  });
});

window.set = (id, statut) => {
  update(ref(db, "concours/participants/" + id), { statut });
};
window.validerPaiement = id => {
  update(ref(db, "concours/participants/" + id), {
    statut: "en_attente",
    "paiement/valide": true
  });
};
