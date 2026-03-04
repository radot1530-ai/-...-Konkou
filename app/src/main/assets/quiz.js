// NS4 v4.1 PRO SYSTEM - EXAM SHEET + CORRECTION + SHARE + UX/SOUND    

/* ========= UX SOUND SYSTEM ========= */    
const SFX = {    
  good: new Audio("son/Lazarre Patrice - Repons kòrèk 2026-02-22 19_39"),    
  bad: new Audio("son/enkòrèk"),    
  next: new Audio("son/Lazarre Patrice - Repons kòrèk (1)"),    
  win: new Audio("son/Victory_Sound_Effect(48k)")    
};    
Object.values(SFX).forEach(s => s.volume = 0.5);    

function playSound(name){    
  const s = SFX[name];    
  if(!s) return;    
  s.currentTime = 0;    
  s.play().catch(()=>{});    
}    

function vibrate(pattern){    
  if(navigator.vibrate) navigator.vibrate(pattern);    
}    

/* =================================== */    

export function startQuiz(subject, allQuestions){    

const subjectData = allQuestions[subject];    
if(!subjectData) return;    

document.getElementById("subjects").style.display="none";    
document.getElementById("quizArea").style.display="block";    

const levels = ["niveau1","niveau2","niveau3","niveau4","niveau5","niveau6", "niveau7", "niveau8","niveau9","niveau10"];    

let currentLevel = null;    
let mode = null; // lesson | exam | final    
let questions = [];    
let score = 0;    

/**************** STORAGE ****************/    
function getProgress(){ return JSON.parse(localStorage.getItem("ns4_progress")||"{}"); }    
function saveProgress(data){ localStorage.setItem("ns4_progress",JSON.stringify(data)); }    
function ensureSubject(progress){ if(!progress[subject]) progress[subject] = {}; return progress; }    
function addPoints(pts){ let total=parseInt(localStorage.getItem("ns4_points")||"0"); total+=pts; localStorage.setItem("ns4_points",total); }    

/****************  MENU ****************/    
loadLevelMenu();    

function loadLevelMenu(){    
  const progress = getProgress();    
  const box=document.getElementById("answers");    
  document.getElementById("quizTitle").innerText="Chwazi Nivo";   
  document.getElementById("question").innerText="";    
  box.innerHTML="";    

  // LEVELS    
  levels.forEach((lvl,index)=>{    
    const btn=document.createElement("button");    
    btn.className="levelBtn";    
    let unlocked = true;    
    if(index>0){ const prev=levels[index-1]; unlocked = progress[subject]?.[prev]?.examPassed === true; }    
    if(!unlocked){ btn.innerHTML=`🔒 ${lvl.toUpperCase()}`; btn.classList.add("locked"); btn.disabled=true; }    
    else { btn.innerText=lvl.toUpperCase(); btn.onclick=()=>startLesson(lvl); }    
    box.appendChild(btn);    
  });    

  // FINAL EXAM    
  const finalBtn=document.createElement("button");    
  finalBtn.className="finalBtn";    
  let canFinal = levels.every(l => progress[subject]?.[l]?.examPassed);    
  if(!canFinal){ finalBtn.innerHTML="🔒 FINAL EXAM"; finalBtn.classList.add("locked"); finalBtn.disabled=true; }    
  else { finalBtn.innerText="FINAL EXAM"; finalBtn.onclick=startFinalExam; }    
  box.appendChild(finalBtn);    
}    

/**************** LESSON ****************/    
function startLesson(level){    
  currentLevel=level;    
  mode="lesson";    
  score=0;    
  questions = subjectData.levels[level].questions || [];    
  if(!questions.length) return;    
  showQuestion(0);    
}    

function finishLesson(){    
  const percent=Math.round((score/questions.length)*100);    
  if(percent<80){ showResult(`Ou fè ${percent}% ❌ (Minimum 80%)`); return; }    
  let progress=ensureSubject(getProgress());    
  const alreadyPassed=progress[subject][currentLevel]?.lessonPassed;    
  progress[subject][currentLevel]={ ...progress[subject][currentLevel], lessonPassed:true };    
  saveProgress(progress);    

  playSound("win"); vibrate([100,50,100]);    
  if(!alreadyPassed){ addPoints(5); showResult("🎉 Premye fwa ou pase nivo sa +5 pts"); }    
  else{ showResult("✔️ Nivo deja valide (0 pts)"); }    

  // EXAM SHEET    
  startExamSheet(currentLevel);    
}    

/**************** EXAM SHEET ****************/    
function startExamSheet(level){    
  mode="exam";    
  score=0;    
  questions = subjectData.levels[level].exam || [];    
  if(!questions.length) return;    

  const box=document.getElementById("answers");    
  box.innerHTML="";    
  document.getElementById("quizTitle").innerText=`EXAM ${level.toUpperCase()}`;    

  // SHOW ALL QUESTIONS AT ONCE    
  questions.forEach((q,i)=>{    
    const qDiv=document.createElement("div");    
    qDiv.className="examQuestion";    
    qDiv.innerHTML=`<p><strong>${i+1}) ${q.q}</strong></p>`;    
    q.a.forEach(ans=>{    
      const input=document.createElement(q.type==="checkbox"?"input":"input");    
      input.type=q.type==="checkbox"?"checkbox":"radio";    
      input.name="q"+i;    
      input.value=ans;    
      const label=document.createElement("label");    
      label.style.display="block";    
      label.appendChild(input);    
      label.append(" "+ans);    
      qDiv.appendChild(label);    
    });    
    box.appendChild(qDiv);    
  });    

  const submitBtn=document.createElement("button");    
  submitBtn.innerText="Soumèt Egzamen";    
  submitBtn.className="nextBtn";    
  submitBtn.onclick=()=>finishExamSheet(level);    
  box.appendChild(submitBtn);    
}    

/**************** FINISH EXAM SHEET ****************/    
function finishExamSheet(level){    
  const box=document.getElementById("answers");    
  const userAnswers=[];    
  const qDivs=box.querySelectorAll(".examQuestion");    
  qDivs.forEach((qDiv,i)=>{    
    const inputs=qDiv.querySelectorAll("input");    
    const ansSelected=[];    
    inputs.forEach(inp=>{ if(inp.checked) ansSelected.push(inp.value); });    
    userAnswers.push(ansSelected);    
  });    

  score=0;    
  questions.forEach((q,i)=>{    
    const correct=(Array.isArray(q.correct)?q.correct:[q.correct]);    
    const selected=userAnswers[i];    
    const isCorrect=correct.every(c=>selected.includes(q.a[c])) && correct.length===selected.length;    
    if(isCorrect) score++;    
  });    

  const percent=Math.round((score/questions.length)*100);    
  let progress=ensureSubject(getProgress());    

  // Si pi piti pase 70%, pa pase nivo swivan
  const passedExam = percent>=70;    
  progress[subject][level]={ ...progress[subject][level], examPassed: passedExam };    
  saveProgress(progress);    

  playSound("win"); vibrate([120,50,120]);    
  showExamResult(level,userAnswers, percent, passedExam);    
}    

/**************** SHOW EXAM RESULT ****************/    
function showExamResult(level,userAnswers, percent, passedExam){    
  const box=document.getElementById("answers");    
  box.innerHTML="";    
  document.getElementById("quizTitle").innerText=`Rezilta Egzamen: ${percent}%`;    

  // SHOW CORRECTION    
  questions.forEach((q,i)=>{    
    const div=document.createElement("div");    
    const userAns=userAnswers[i].join(", ") || "Pa reponn";    
    const correctAns=(Array.isArray(q.correct)?q.correct:[q.correct]).map(c=>q.a[c]).join(", ");    
    div.innerHTML=`<p><strong>${i+1}) ${q.q}</strong><br>Ou: ${userAns}<br>Repons kòrèk: ${correctAns}</p>`;    
    box.appendChild(div);    
  });    

  // Feedback sou egzamen    
  const feedback=document.createElement("p");    
  feedback.style.fontWeight="bold";    
  feedback.style.fontSize="18px";    
  feedback.innerText=passedExam ? "🎉 Ou pase egzamen an ✅" : "❌ Ou pa rive 70%, ou pap ka pase nan nivo swivan";    
  box.appendChild(feedback);    

  // OPTION: SHARE BUTTON    
  const shareBtn=document.createElement("button");    
  shareBtn.innerText="Pataje App / Kesyon yo";    
  shareBtn.className="nextBtn";    
  shareBtn.onclick=()=>{    
    if(navigator.share){    
      navigator.share({title:"NS4 Quiz",text:"Gade kesyon ak egzamen yo!",url:window.location.href}).catch(()=>{});    
    }else{    
      alert("Kopye lyen sa a pou pataje: "+window.location.href);    
    }    
  };    
  box.appendChild(shareBtn);    

  // SHOW LEVEL MENU    
  const menuBtn=document.createElement("button");    
  menuBtn.innerText="Retounen nan Nivo";    
  menuBtn.className="nextBtn";    
  menuBtn.onclick=()=>loadLevelMenu();    
  box.appendChild(menuBtn);    
}    

/**************** FINAL EXAM SHEET ****************/    
function startFinalExam(){    
  mode="final"; score=0;    
  questions = subjectData.final_exam?.slice(0,20) || [];    
  if(!questions.length) return;    
  const box=document.getElementById("answers");    
  box.innerHTML="";    
  document.getElementById("quizTitle").innerText="FINAL EXAM";    

  questions.forEach((q,i)=>{    
    const qDiv=document.createElement("div");    
    qDiv.className="examQuestion";    
    qDiv.innerHTML=`<p><strong>${i+1}) ${q.q}</strong></p>`;    
    q.a.forEach(ans=>{    
      const input=document.createElement(q.type==="checkbox"?"input":"input");    
      input.type=q.type==="checkbox"?"checkbox":"radio";    
      input.name="f"+i;    
      input.value=ans;    
      const label=document.createElement("label");    
      label.style.display="block";    
      label.appendChild(input);    
      label.append(" "+ans);    
      qDiv.appendChild(label);    
    });    
    box.appendChild(qDiv);    
  });    

  const submitBtn=document.createElement("button");    
  submitBtn.innerText="Soumèt FINAL";    
  submitBtn.className="nextBtn";    
  submitBtn.onclick=()=>finishFinalSheet();    
  box.appendChild(submitBtn);    
}    

function finishFinalSheet(){    
  const box=document.getElementById("answers");    
  const userAnswers=[];    
  const qDivs=box.querySelectorAll(".examQuestion");    
  qDivs.forEach((qDiv,i)=>{    
    const inputs=qDiv.querySelectorAll("input");    
    const ansSelected=[];    
    inputs.forEach(inp=>{ if(inp.checked) ansSelected.push(inp.value); });    
    userAnswers.push(ansSelected);    
  });    

  score=0;    
  questions.forEach((q,i)=>{    
    const correct=(Array.isArray(q.correct)?q.correct:[q.correct]);    
    const selected=userAnswers[i];    
    const isCorrect=correct.every(c=>selected.includes(q.a[c])) && correct.length===selected.length;    
    if(isCorrect) score++;    
  });    

  playSound("win"); vibrate([120,50,120]);    

  // SHOW FINAL RESULT    
  const percent=Math.round((score/questions.length)*100);    
  const boxEl=document.getElementById("answers");    
  boxEl.innerHTML="";    
  document.getElementById("quizTitle").innerText=`🏆 FINAL RESULT: ${percent}%`;    

  questions.forEach((q,i)=>{    
    const div=document.createElement("div");    
    const userAns=userAnswers[i].join(", ") || "Pa reponn";    
    const correctAns=(Array.isArray(q.correct)?q.correct:[q.correct]).map(c=>q.a[c]).join(", ");    
    div.innerHTML=`<p><strong>${i+1}) ${q.q}</strong><br>Ou: ${userAns}<br>Repons kòrèk: ${correctAns}</p>`;    
    boxEl.appendChild(div);    
  });    

  const shareBtn=document.createElement("button");    
  shareBtn.innerText="Pataje App / Kesyon yo";    
  shareBtn.className="nextBtn";    
  shareBtn.onclick=()=>{    
    if(navigator.share){ navigator.share({title:"NS4 Quiz",text:"Gade kesyon ak egzamen yo!",url:window.location.href}).catch(()=>{}); }    
    else{ alert("Kopye lyen sa a pou pataje: "+window.location.href); }    
  };    
  boxEl.appendChild(shareBtn);    

  const menuBtn=document.createElement("button");    
  menuBtn.innerText="Retounen nan Nivo";    
  menuBtn.className="nextBtn";    
  menuBtn.onclick=()=>loadLevelMenu();    
  boxEl.appendChild(menuBtn);    
}    

/**************** OLD QUIZ SYSTEM - SINGLE QUESTION FOR LESSONS ****************/    
function showQuestion(index){    
  const q=questions[index];    
  playSound("next");    
  document.getElementById("quizTitle").innerText=`${mode.toUpperCase()} - ${index+1}/${questions.length}`;    
  document.getElementById("question").innerText=q.q;    
  const box=document.getElementById("answers");    
  box.innerHTML="";    
  const correctAnswer=q.a[q.correct];    

  // pou chak repons
  q.a.forEach(ans=>createAnswerBtn(box, ans, correctAnswer, q));    

  const nextBtn=document.createElement("button");    
  nextBtn.innerText=(index===questions.length-1)?"Fini":"Suivant";    
  nextBtn.className="nextBtn"; nextBtn.style.display="none";    
  nextBtn.onclick=()=>{    
    vibrate(30);    
    if(index<questions.length-1) showQuestion(index+1);    
    else { if(mode==="lesson") finishLesson(); else if(mode==="exam") finishExam(); else finishFinal(); }    
  };    
  box.appendChild(nextBtn);    
}    

/**************** ANSWERS SINGLE CHOICE LESSON AVEC EXPLICATION ****************/    
function createAnswerBtn(box, text, correctAnswer, q){    
  const btn = document.createElement("button");    
  btn.innerText = text; 
  btn.className = "answerBtn";    

  // Div pou eksplikasyon
  const explanationDiv = document.createElement("div");
  explanationDiv.style.marginTop = "10px";
  explanationDiv.style.fontStyle = "italic";
  explanationDiv.style.color = "black";
  explanationDiv.style.display = "none"; // kache jiskaske itilizatè chwazi
  if(q.explanation) explanationDiv.innerText = q.explanation;
  box.appendChild(explanationDiv);

  btn.onclick = () => {    
    const allBtns = box.querySelectorAll(".answerBtn");    
    allBtns.forEach(b => { 
      b.disabled = true; 
      b.classList.add("disabled"); 
      if(b.innerText === correctAnswer) b.classList.add("correct"); 
      if(b === btn && text !== correctAnswer) b.classList.add("wrong"); 
    });    

    if(text === correctAnswer){ 
      score++; 
      playSound("good"); 
      vibrate(70); 
    } else { 
      playSound("bad"); 
      vibrate([60,40,60]); 
    }    

    // Montre eksplikasyon an
    if(q.explanation) explanationDiv.style.display = "block";

    const nextBtn = box.querySelector(".nextBtn");    
    setTimeout(() => nextBtn.style.display = "block", 500);    
  };    

  box.appendChild(btn);    
}    

/**************** RESULT ****************/    
function showResult(text){    
  document.getElementById("answers").innerHTML="";    
  document.getElementById("question").innerText=text;    
}}
