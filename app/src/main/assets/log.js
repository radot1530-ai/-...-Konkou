/*************************
FIREBASE
*************************/
const firebaseConfig = {
  apiKey: "AIzaSyAgvH0CpF6tGISpfLw3JWJCT2beBG28wAM",
  authDomain: "kaylakay-cdf64.firebaseapp.com",
  databaseURL: "https://kaylakay-cdf64-default-rtdb.firebaseio.com/",
  projectId: "kaylakay-cdf64",
  storageBucket: "kaylakay-cdf64.appspot.com",
  messagingSenderId: "663099511740",
  appId: "1:663099511740:web:aeb6bddccee9666ff791b9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/*************************
HELPERS
*************************/
function val(id) {
    return document.getElementById(id).value.trim();
}

function status(msg, color) {
    const s = document.getElementById("status");
    s.innerText = msg;
    s.style.color = color;
}

/*************************
LOGIN
*************************/
async function login() {

    const pseudo = val("pseudo");
    const email = val("contact");
    const password = val("password");

    if (!pseudo || !email || !password) {
        status("Ranpli tout chan yo ❌", "red");
        return;
    }

    try {

        const snap = await db.ref("users_pending")
            .orderByChild("pseudo")
            .equalTo(pseudo)
            .once("value");

        if (!snap.exists()) {
            status("Kont sa pa egziste ❌", "red");
            return;
        }

        const users = snap.val();
        const key = Object.keys(users)[0];
        const user = users[key];

        if (user.email !== email || user.password !== password) {
            status("Email oswa modpas pa kòrèk ❌", "red");
            return;
        }

        if (!user.verified) {
            status("Kont ou an poko valide ⏳", "orange");
            return;
        }

        // 🔥 NOUVO SISTÈM (MAX 2)
        const userRef = db.ref(`users_pending/${key}`);

        const snapUser = await userRef.once("value");
        const data = snapUser.val();

        let connections = data.connections || 0;

        if (connections >= 1) {
            status("Kont sa deja itilize sou 2 aparèy ❌", "red");
            return;
        }

        // ➕ Ajoute koneksyon
        await userRef.update({
            connections: connections + 1
        });

        // 🔥 AUTO DECONNECT (ANDROID)
        userRef.onDisconnect().update({
            connections: connections
        });

        // Save user + key
        localStorage.setItem("ns4_user", JSON.stringify({
            ...user,
            key: key
        }));

        status("Login reyisi ✔", "green");

        setTimeout(() => {
            location = "home.html";
        }, 800);

    } catch (err) {
        console.error(err);
        status("Gen yon erè ❌", "red");
    }
}

/*************************
EVENT FORM
*************************/
document
    .getElementById("loginForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();
        login();
    });