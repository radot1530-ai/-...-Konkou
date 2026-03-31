// ===============================
// NS4 INTRO CONTROLLER FINAL
// ===============================

// Slide index
let current = 0;

// Elements
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("nextBtn");

// ===============================
// UPDATE UI
// ===============================
function updateUI(){
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === current);
  });

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === current);
  });

  // Change button text
  if(current === slides.length - 1){
    nextBtn.textContent = "Kòmanse";
  }else{
    nextBtn.textContent = "Avanse";
  }
}

// ===============================
// FINISH INTRO (SMART REDIRECT)
// ===============================
function finishIntro(){
  // Mark intro seen
  localStorage.setItem("introSeen", "true");

  // Check user
  const user = localStorage.getItem("ns4_user");

  if(user){
    window.location = "home.html";   // user deja enskri
  }else{
    window.location = "signup.html"; // bezwen signup
  }
}

// ===============================
// NEXT BUTTON
// ===============================
nextBtn.addEventListener("click", () => {
  if(current < slides.length - 1){
    current++;
    updateUI();
  }else{
    finishIntro();
  }
});

// ===============================
// AUTO SKIP INTRO IF ALREADY SEEN
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  if(localStorage.getItem("introSeen") === "true"){

    const user = localStorage.getItem("ns4_user");

    if(user){
      window.location = "home.html";
    }else{
      window.location = "signup.html";
    }

  }else{
    updateUI(); // first launch
  }
});

// ===============================
// DEV TOOL (OPTIONAL)
// Uncomment pou reset intro pandan dev
// localStorage.clear();
// ===============================