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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const liste = document.getElementById("liste");

onValue(ref(db, "concours/participants"), snap => {
  liste.innerHTML = "";
  snap.forEach(item => {
    const d = item.val();
    liste.innerHTML += `
      <div class="card">
        <h4>${d.titre}</h4>
        <p>${d.nom} (${d.age} an)</p>
        <p>Statut: ${d.statut}</p>
        <button onclick="valider('${item.key}')">Valider</button>
        <button onclick="eliminer('${item.key}')">Éliminer</button>
      </div>
    `;
  });
});

window.valider = id =>
  update(ref(db, "concours/participants/" + id), { statut: "validé" });

window.eliminer = id =>
  update(ref(db, "concours/participants/" + id), { statut: "éliminé" });

