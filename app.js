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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("concoursForm");
  const msg = document.getElementById("msg");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const texte = document.getElementById("texte").value.trim();
    const mots = texte.split(/\s+/).length;

    if (mots < 300 || mots > 800) {
      msg.textContent = "❌ 300–800 mo obligatwa";
      return;
    }

    push(ref(db, "concours/participants"), {
      nom: document.getElementById("nom").value,
      age: document.getElementById("age").value,
      titre: document.getElementById("titre").value,
      texte,
      statut: "attente_validation",
      date: Date.now()
    });

    msg.textContent = "✅ Soumèt avèk siksè";
    form.reset();
  });
});

