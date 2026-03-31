// 🔥 FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "kaylakay-cdf64.firebaseapp.com",
    databaseURL: "https://kaylakay-cdf64-default-rtdb.firebaseio.com/",
    projectId: "kaylakay-cdf64",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/*************************
UPDATE SYSTEM
*************************/
const CURRENT_VERSION = "1.1.0";

async function checkUpdate() {
    try {
        const snap = await db.ref("app_updates").once("value");
        if (!snap.exists()) return;

        const data = snap.val();

        if (data.latest_version !== CURRENT_VERSION) {
            showUpdatePopup(data.latest_version, data.apk_link);
        }

    } catch (err) {
        console.error(err);
    }
}

function showUpdatePopup(version, link) {

    // Evite double popup
    if (document.getElementById("updatePopup")) return;

    const popup = document.createElement("div");
    popup.id = "updatePopup";

    popup.innerHTML = `
        <div class="update-content">
            <h2>📢 Nouvo vèsyon disponib!</h2>
            <p>Vèsyon ${version} disponib pou telechajman.</p>
            <button id="updateBtn">Telechaje kounye a</button>
            <button id="laterBtn">Fè li pita</button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("updateBtn").onclick = () => {
        window.open(link, "_blank");
    };

    document.getElementById("laterBtn").onclick = () => {
        popup.remove();
    };
}

/*************************
AUTO START
*************************/
window.addEventListener("load", () => {
    showGuide();
    checkUpdate();
});

function logout() {
    const user = JSON.parse(localStorage.getItem("ns4_user"));
    if (!user) return;

    // Chache itilizatè nan Firebase
    db.ref("users_pending")
      .orderByChild("pseudo")
      .equalTo(user.pseudo)
      .once("value")
      .then(snap => {
          if (snap.exists()) {
              const key = Object.keys(snap.val())[0];
              db.ref(`users_pending/${key}`).update({ isConnected: false });
          }
      });


    // Retire nan localStorage
    localStorage.removeItem("ns4_user");

    // Redireksyon
    location = "login.html";
}



// Verify user
const user = JSON.parse(localStorage.getItem("ns4_user"));

if(!user){
  window.location = "signup.html";
}else{
  document.getElementById("welcome").innerText =
    "Byenvini " + user.pseudo + " 👋";
}

// Navigation
function go(page){
  window.location = page;
}

/*************************
GUIDE POPUP (ONBOARDING)
*************************/

const steps = [
    {
        title: "👋 Byenveni",
        text: "App sa ap ede ou prepare pou BAC la pa etap. Chak ti efò konte!"
    },
    {
        title: "📝 Modèl Egzamen",
        text: "Revize ak ansyen sijè yo pou w abitye ak fòm egzamen an. Pa bliye, pratike regilyèman."
    },
    {
        title: "🧠 Quiz",
        text: "Teste tèt ou chak jou. Ti kesyon yo pral amelyore memwa ak konpreyansyon w."
    },
    {
        title: "🔥 Défi Semèn nan",
        text: "Chwazi yon defi pou chak semèn. Li ap pouse ou fè plis travay san prese."
    },
    {
        title: "📚 Leson & Vokabilè",
        text: "Aprann nouvo mo ak konsèp fasil. Eseye mete yo an pratik nan egzèsis yo."
    },
    {
        title: "📐 Fòmil",
        text: "Revize fòmil yo chak jou, menm si ou poko metrize yo tout. Pratik ap pote progresyon."
    },
    {
        title: "🏆 Siksè",
        text: "Pa tann pèfeksyon pou kòmanse. Travay chak jou + disiplin ap mennen w pi pre objektif ou."
    }
];
let currentStep = 0;

/*************************
GUIDE POPUP (ONBOARDING)
*************************/

function showGuide() {
    if (localStorage.getItem("guide_seen")) return;
    createGuidePopup();
}

function createGuidePopup() {

    // Evite double popup
    if (document.getElementById("guidePopup")) return;

    const popup = document.createElement("div");
    popup.id = "guidePopup";

    popup.innerHTML = `
        <div class="guide-content">
            <h2 id="guideTitle"></h2>
            <p id="guideText"></p>
            <button id="nextBtn">Swivan ➡️</button>
        </div>
    `;

    document.body.appendChild(popup);

    renderGuideStep();

    document.getElementById("nextBtn").onclick = nextGuideStep;
}

function renderGuideStep() {
    const title = document.getElementById("guideTitle");
    const text = document.getElementById("guideText");

    if (!title || !text) return;

    title.innerText = steps[currentStep].title;
    text.innerText = steps[currentStep].text;

    document.getElementById("nextBtn").innerText =
        currentStep === steps.length - 1 ? "Fini ✔" : "Swivan ➡️";
}

function nextGuideStep() {
    currentStep++;

    if (currentStep >= steps.length) {

        localStorage.setItem("guide_seen", "true");

        const popup = document.getElementById("guidePopup");
        if (popup) popup.remove();

        // 🔥 Apre guide fini → montre update
        checkUpdate();

        return;
    }

    renderGuideStep();
}

/*************************
AUTO START
*************************/
window.addEventListener("load", () => {

    showGuide();

    // Si guide deja fèt → montre update dirèk
    if (localStorage.getItem("guide_seen")) {
        checkUpdate();
    }

});