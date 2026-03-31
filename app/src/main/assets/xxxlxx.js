// =================== NS4 BG MUSIC SYSTEM ===================
window.NS4_BG = window.NS4_BG || {};

// ---------------- 1️⃣ BG MUSIC SINGLETON ----------------
if (!window.NS4_BG.audio) {
    const audio = new Audio();
    audio.loop = true;            // 🔥 Boucle
    audio.volume = 0.4;
    window.NS4_BG.audio = audio;
}
const bgAudio = window.NS4_BG.audio;

// ---------------- 2️⃣ SETTINGS ----------------
window.NS4_BG.settings = window.NS4_BG.settings || JSON.parse(localStorage.getItem("ns4_settings") || "{}");
const settings = window.NS4_BG.settings;

// Default BG music
if (!settings.bgMusic) {
    settings.bgMusic = "file:///android_asset/son/Beautiful_Slow_Instrumental_-_music_for_studying,_background,_healing,_relax_-_relaxdaily_N°062(48k).mp3";       // Son prensipal default
    settings.bgMusicAuto = true;
    settings.soundOn = true;
    localStorage.setItem("ns4_settings", JSON.stringify(settings));
}

// ---------------- 3️⃣ AVAILABLE TRACKS ----------------
const BG_TRACKS = [
    "son/bg1.mp3",
    "son/bg2.mp3",
    "son/bg3.mp3"
];

// ---------------- 4️⃣ SET AUDIO SOURCE ----------------
if (!bgAudio.src || !BG_TRACKS.includes(settings.bgMusic)) {
    bgAudio.src = settings.bgMusic;
}

// ---------------- 5️⃣ RESTORE MUSIC POSITION ----------------
const savedTime = localStorage.getItem("ns4_music_time");
if (savedTime) bgAudio.currentTime = parseFloat(savedTime);

// ---------------- 6️⃣ START MUSIC ON FIRST ACTION ----------------
let bgStarted = false;
function startBgMusic() {
    if (bgStarted) return;
    bgStarted = true;
    if (settings.soundOn) {
        bgAudio.play().catch(() => console.log("Autoplay blocked"));
    }
}
document.addEventListener("click", startBgMusic, { once: true });
document.addEventListener("keydown", startBgMusic, { once: true });

// ---------------- 7️⃣ SAVE MUSIC POSITION ----------------
window.addEventListener("beforeunload", () => {
    localStorage.setItem("ns4_music_time", bgAudio.currentTime);
});

// ---------------- 8️⃣ PLAY / STOP / CHANGE TRACK ----------------
window.playBgMusic = () => {
    if (settings.soundOn) bgAudio.play().catch(() => {});
};
window.stopBgMusic = () => {
    bgAudio.pause();
    bgAudio.currentTime = 0;
};
window.setBgMusic = (src) => {
    if (!BG_TRACKS.includes(src)) return;
    bgAudio.src = src;
    settings.bgMusic = src;
    localStorage.setItem("ns4_settings", JSON.stringify(settings));
    if (settings.soundOn) bgAudio.play().catch(() => {});
};

// ---------------- 9️⃣ TOGGLE SOUND ----------------
window.toggleBgSound = (on) => {
    settings.soundOn = on;
    localStorage.setItem("ns4_settings", JSON.stringify(settings));
    if (!on) bgAudio.pause();
    else bgAudio.play().catch(()=>{});
};

console.log("NS4 BG Music system loaded ✔");