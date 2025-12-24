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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const liste = document.getElementById("liste");

form.addEventListener("submit", e => {
  e.preventDefault();

  const texteValue = texte.value.trim();
  const mots = texteValue.split(/\s+/).length;

  if (mots < 300 || mots > 800) {
    msg.textContent = "❌ Redaksyon an dwe 300–800 mo.";
    return;
  }

  push(ref(db, "concours/participants"), {
    nom: nom.value,
    age: age.value,
    titre: titre.value,
    texte: texteValue,
    statut: "paiement_en_attente",
    paiement: {
      montant: 150,
      numero: mcNumber.value,
      transactionId: mcCode.value,
      valide: false
    },
    date: Date.now()
  });

  msg.textContent = "✅ Peman an soumèt. Admin ap verifye MonCash.";
  form.reset();
});
onValue(ref(db, "concours/participants"), snap => {
  liste.innerHTML = "";
  snap.forEach(s => {
    const d = s.val();
    if (d.statut === "valide") {
      liste.innerHTML += `
        <div class="card">
          <h4>${d.titre}</h4>
          <small>${d.nom}</small>
        </div>
      `;
    }
  });
});
