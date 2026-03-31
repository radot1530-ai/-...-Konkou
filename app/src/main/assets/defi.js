const SFX = {
    good: new Audio("/son/Lazarre Patrice - Repons kòrèk 2026-02-22 19_39"),
    bad: new Audio("/son/enkòrèk"),
    next: new Audio("/son/Lazarre Patrice - Repons kòrèk (1)"),
    win: new Audio("/son/Victory_Sound_Effect(48k)")
};
Object.values(SFX).forEach(s => s.volume = 0.5);
function playSound(name){ const s=SFX[name]; if(!s) return; s.currentTime=0; s.play().catch(()=>{});}
function vibrate(pattern){ if(navigator.vibrate) navigator.vibrate(pattern);}

/**************** DATA CHALLENGES (default si GitHub pa disponib) ****************/
let weeklyChallenges = {
    1: [
        { q: "Ki derive de f(x)=x²?", a: ["2x","x","x²","2"], correct:0 },
        { q: "Ki entègral de ∫2x dx?", a: ["x² + C","2x + C","x + C","x²/2 + C"], correct:0 },
        { q: "Ki valè f'(x) si f(x)=3x³?", a: ["9x²","3x²","x³","6x²"], correct:0 },
        { q: "Ki valè f(2) si f(x)=x²+1?", a: ["5","4","3","6"], correct:0 },
        { q: "Ki derivée de sin(x)?", a: ["cos(x)","sin(x)","-sin(x)","-cos(x)"], correct:0 }
    ],
    2: [],3:[],4:[],5:[],6:[],7:[]
};

/**************** STORAGE ****************/
function getWeeklyProgress(){ 
    return JSON.parse(localStorage.getItem("ns4_weekly")||'{"currentDay":1,"done":[],"points":0,"weekStart":'+Date.now()+'}');
}
function saveWeeklyProgress(data){ localStorage.setItem("ns4_weekly", JSON.stringify(data));}

/**************** SHUFFLE ****************/
function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}
function shuffleWeeklyChallenges(){
    Object.keys(weeklyChallenges).forEach(day=> shuffleArray(weeklyChallenges[day]));
}

/**************** LOAD CHALLENGES FROM GITHUB ****************/
async function loadChallengesFromGitHub() {
    const githubURL = "https://raw.githubusercontent.com/radot1530-ai/GlobalPlisHt/main/kesyon.json"; 
    // chanje ak repo ou
    try{
        const res = await fetch(githubURL);
        if(!res.ok) throw new Error("Pa kapab jwenn kesyon sou GitHub");
        const data = await res.json();
        weeklyChallenges = data;
        localStorage.setItem("ns4_weekly_backup", JSON.stringify(data));
        shuffleWeeklyChallenges();
        console.log("✅ Kesyon chaje depi GitHub ak melanje");
    } catch(e){
        console.warn("❌ GitHub pa disponib, sèvi ak backup lokal si genyen");
        const backup = localStorage.getItem("ns4_weekly_backup");
        if(backup){ weeklyChallenges = JSON.parse(backup); shuffleWeeklyChallenges(); console.log("⚠️ Sèvi ak backup lokal ak melanj"); }
        else { console.error("❌ Pa gen kesyon backup. Sèvi ak kesyon default"); }
    }
}

/**************** WEEK RESET ****************/
function checkWeekReset(){
    const progress = getWeeklyProgress();
    const now = Date.now();
    const sevenDays = 7*24*60*60*1000;
    if(progress.weekStart && now - progress.weekStart >= sevenDays){
        progress.currentDay = 1;
        progress.done = [];
        progress.weekStart = Date.now();
        saveWeeklyProgress(progress);
        shuffleWeeklyChallenges();
        alert("Nouvo defi semèn nan disponib!");
    }
}

/**************** WEEK TIMER ****************/
function updateWeekCountdown(){
    const progress = getWeeklyProgress();
    if(!progress.weekStart) progress.weekStart = Date.now();
    const now = Date.now();
    const sevenDays = 7*24*60*60*1000;
    const diff = Math.max(0, progress.weekStart + sevenDays - now);
    const days = Math.floor(diff/(24*60*60*1000));
    const hours = Math.floor((diff%(24*60*60*1000))/(60*60*1000));
    const minutes = Math.floor((diff%(60*60*1000))/(60*1000));
    const seconds = Math.floor((diff%(60*1000))/1000);
    document.getElementById("weekTimer").innerText = `Tan rete pou nouvo semèn: ${days}j ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(updateWeekCountdown,1000);

/**************** GENERATE DAY BUTTONS ****************/
function loadDaysMenu(){
    const daysBox = document.getElementById("daysBtn");
    daysBox.innerHTML = "";
    const progress = getWeeklyProgress();
    for(let i=1;i<=7;i++){
        const btn = document.createElement("button");
        btn.className="subjectBtn";
        const left = document.createElement("div");
        left.className="subjectLeft";
        const logo = document.createElement("div");
        logo.className="subjectLogo"; logo.innerText=i;
        const name = document.createElement("div");
        name.className="subjectName"; name.innerText=`Jou ${i}`;
        left.appendChild(logo); left.appendChild(name);
        const right = document.createElement("div");
        right.className="subjectRight";
        if(progress.done.includes(i)){ const percent=document.createElement("div"); percent.className="subjectPercent"; percent.innerText="✅"; right.appendChild(percent);}
        btn.appendChild(left); btn.appendChild(right);
        btn.disabled = i > progress.currentDay; if(btn.disabled) btn.classList.add("locked");
        btn.onclick = ()=>startDay(i);
        daysBox.appendChild(btn);
    }
}

/**************** START DAY ****************/
async function updateOnlinePoints(points){ /* pou Firebase si ou vle */ }

function startDay(day){
    document.getElementById("subjects").style.display="none";
    document.getElementById("quizArea").style.display="block";
    const progress = getWeeklyProgress();
    const questions = weeklyChallenges[day];
    let score=0, qIndex=0, timerId;

    function showQuestion(){
        const q = questions[qIndex];
        const box = document.getElementById("answers"); box.innerHTML="";
        const qDiv = document.createElement("div"); qDiv.className="examQuestion";
        qDiv.innerHTML=`<p><strong>${qIndex+1}) ${q.q}</strong></p>`;
        let timeLeft=10; const timerEl=document.getElementById("timer"); timerEl.innerText=`Tan rete: ${timeLeft}s`;
        clearInterval(timerId);
        timerId=setInterval(()=>{
            timeLeft--; timerEl.innerText=`Tan rete: ${timeLeft}s`;
            if(timeLeft<=0){ clearInterval(timerId); vibrate([50,30,50]); qIndex++; if(qIndex<questions.length) showQuestion(); else finishDay(); }
        },1000);
        q.a.forEach((ans, idx)=>{
            const btn=document.createElement("button"); btn.className="answerBtn"; btn.innerText=ans;
            btn.onclick=()=>{
                clearInterval(timerId);
                box.querySelectorAll(".answerBtn").forEach(b=>b.classList.add("disabled"));
                if(idx===q.correct){ btn.classList.add("correct"); playSound("good"); vibrate(100); score++; }
                else{ btn.classList.add("wrong"); playSound("bad"); vibrate([50,30,50]); box.querySelectorAll(".answerBtn")[q.correct].classList.add("correct"); }
                qIndex++; setTimeout(()=>{ if(qIndex<questions.length) showQuestion(); else finishDay(); },800);
            };
            qDiv.appendChild(btn);
        });
        box.appendChild(qDiv);
    }

    function finishDay(){
        const box=document.getElementById("answers"); box.innerHTML=`<p style="font-weight:bold">Ou reponn ${score}/${questions.length} kòrèk.</p>`;
        const ptsEarned=score===questions.length?10:0;
        const progress=getWeeklyProgress();
        if(ptsEarned>0 && day===progress.currentDay){
            progress.points+=ptsEarned; progress.done.push(day); progress.currentDay++;
            updateOnlinePoints(ptsEarned); saveWeeklyProgress(progress);
            playSound("win"); vibrate([100,50,100]);
            box.innerHTML+=`<p>🎉 Ou pase defi Jou ${day}! +10 pts</p>`;
        } else if(ptsEarned===0){
            playSound("bad"); vibrate([60,40,60]);
            box.innerHTML+=`<p>❌ Ou pa pase Jou ${day}, ou dwe reponn kòrèk tout kesyon pou avanse.</p>`;
        }
        const menuBtn=document.createElement("button"); menuBtn.innerText="Retounen nan Meni"; menuBtn.className="nextBtn";
        menuBtn.onclick=()=>{
            document.getElementById("subjects").style.display="block";
            document.getElementById("quizArea").style.display="none";
            loadDaysMenu();
        };
        box.appendChild(menuBtn); document.getElementById("timer").innerText="";
    }

    showQuestion();
}

/**************** LOAD ALL ****************/
loadChallengesFromGitHub().then(()=>loadDaysMenu());