// === DSA Mate (localStorage-only) ===
// NOTE: runner uses eval() to execute JS snippets for demo test cases only.
// Do NOT run untrusted code in eval() in production.

const LS_KEY = "dsamate_data_v1";
let store = {
  users: [],           // for leaderboard (simple local)
  questions: [],       // question objects
  solutions: {},       // saved solutions by user (username optional)
};

// --- sample data init ---
function sampleInit(){
  if(getStore().questions.length) return;
  const samples = [
    {id:1,title:"Reverse an Array - sum example",topic:"Array",difficulty:"Easy",desc:"Return sum of array (demo).",hint:"Use loop or reduce",testIn:"[1,2,3]",testOut:"6",solved:false,created:Date.now()},
    {id:2,title:"Find Max",topic:"Array",difficulty:"Easy",desc:"Return maximum value",hint:"track max",testIn:"[4,2,9,1]",testOut:"9",solved:false,created:Date.now()},
    {id:3,title:"Binary Search (index)",topic:"Searching",difficulty:"Medium",desc:"Return index of target or -1 (demo)",hint:"use left/right pointers",testIn:"[1,3,5,7]|5",testOut:"2",solved:false,created:Date.now()},
    {id:4,title:"Merge Two Sorted",topic:"Sorting",difficulty:"Hard",desc:"(demo) join arrays and sort",hint:"concat and sort",testIn:"[1,4]|[2,3]",testOut:"[1,2,3,4]",solved:false,created:Date.now()}
  ];
  store.questions = samples;
  saveStore();
}
function saveStore(){ localStorage.setItem(LS_KEY, JSON.stringify(store)); }
function getStore(){ 
  const raw = localStorage.getItem(LS_KEY);
  if(raw) store = JSON.parse(raw);
  return store;
}
function resetStore(){ localStorage.removeItem(LS_KEY); store={users:[],questions:[],solutions:{}}; sampleInit(); renderAll(); }

// init
getStore();
sampleInit();

// --- UI refs
const qList = document.getElementById("questionList");
const topicFilter = document.getElementById("topicFilter");
const diffFilter = document.getElementById("diffFilter");
const searchBox = document.getElementById("searchBox");
const dailyTargets = document.getElementById("dailyTargets");
const leaderboardEl = document.getElementById("leaderboard");
const progressSummary = document.getElementById("progressSummary");
const weakArea = document.getElementById("weakArea");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const darkToggle = document.getElementById("darkToggle");

const details = document.getElementById("details");
const qTitle = document.getElementById("qTitle");
const qTopicBadge = document.getElementById("qTopicBadge");
const qDiffBadge = document.getElementById("qDiffBadge");
const qDesc = document.getElementById("qDesc");
const qStatusBadge = document.getElementById("qStatusBadge");
const hintBtn = document.getElementById("hintBtn");
const markSolvedBtn = document.getElementById("markSolvedBtn");
const startTimerBtn = document.getElementById("startTimerBtn");
const clearTimerBtn = document.getElementById("clearTimerBtn");
const timerLabel = document.getElementById("timerLabel");
const codeEditor = document.getElementById("codeEditor");
const runBtn = document.getElementById("runBtn");
const runTestBtn = document.getElementById("runTestBtn");
const stdinBox = document.getElementById("stdinBox");
const outputBox = document.getElementById("outputBox");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const newTitle = document.getElementById("newTitle");
const newTopic = document.getElementById("newTopic");
const newDiff = document.getElementById("newDiff");
const newDesc = document.getElementById("newDesc");
const newTestIn = document.getElementById("newTestIn");
const newTestOut = document.getElementById("newTestOut");
const startQBtn = document.getElementById("startTimerBtn");
const clearQBtn = document.getElementById("clearTimerBtn");
const saveSolutionBtn = document.getElementById("saveSolutionBtn");
const shuffleTargets = document.getElementById("shuffleTargets");
const resetFilters = document.getElementById("resetFilters");

// state
let selectedQ = null;
let timerId = null;
let timeLeft = 0;
let currentUser = "guest";

// === helpers ===
function uniqueTopics(){
  const t = new Set(store.questions.map(q=>q.topic));
  return ["All",...Array.from(t)];
}
function renderFilters(){
  topicFilter.innerHTML = "";
  uniqueTopics().forEach(t=>{
    const opt = document.createElement("option"); opt.value = t; opt.textContent = t;
    topicFilter.appendChild(opt);
  });
}
function filterQuestions(){
  const topic = topicFilter.value || "All";
  const diff = diffFilter.value || "All";
  const q = searchBox.value.trim().toLowerCase();
  return store.questions.filter(item=>{
    if(topic!=="All" && item.topic!==topic) return false;
    if(diff!=="All" && item.difficulty!==diff) return false;
    if(q && !item.title.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b)=>b.created - a.created);
}

// render list
function renderList(){
  qList.innerHTML = "";
  const list = filterQuestions();
  list.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = `<div>
      <strong>${item.title}</strong><br>
      <small style="color:#666">${item.topic} • ${item.difficulty}</small>
      </div>
      <div>
      <button data-id="${item.id}" class="openBtn">${item.solved? "✔":"Open"}</button>
      </div>`;
    qList.appendChild(li);
  });

  // add click listeners
  document.querySelectorAll(".openBtn").forEach(b=>{
    b.addEventListener("click",e=>{
      const id = Number(e.target.dataset.id);
      openQuestion(id);
    });
  });
}

// open question details
function openQuestion(id){
  selectedQ = store.questions.find(x=>x.id===id);
  if(!selectedQ) return;
  details.style.display = "block";
  qTitle.textContent = selectedQ.title;
  qTopicBadge.textContent = selectedQ.topic;
  qDiffBadge.textContent = selectedQ.difficulty;
  qDesc.textContent = selectedQ.desc || "(no description)";
  qStatusBadge.textContent = selectedQ.solved ? "Solved" : "Pending";
  qStatusBadge.style.background = selectedQ.solved ? "#ecfdf5" : "#fff7ed";
  codeEditor.value = store.solutions[selectedQ.id] || "// write JS code that returns the result to match expected output\n";
  outputBox.textContent = "";
  detectWeakArea();
  loadProgressSummary();
}

// add question
addQuestionBtn.addEventListener("click",()=>{
  const t = newTitle.value.trim();
  if(!t) return alert("Add a title");
  const q = {
    id: Date.now(),
    title: t,
    topic: newTopic.value.trim()||"General",
    difficulty: newDiff.value,
    desc: newDesc.value,
    hint: "",
    testIn: newTestIn.value.trim(),
    testOut: newTestOut.value.trim(),
    solved: false,
    created: Date.now()
  };
  store.questions.push(q);
  saveStore(); renderFilters(); renderList(); loadDailyTargets(); clearAddInputs();
});

// clear add inputs
function clearAddInputs(){
  newTitle.value="";newTopic.value="";newDesc.value="";newTestIn.value="";newTestOut.value="";
}

// run code (simple JS eval) - demo only
runBtn.addEventListener("click", ()=>{
  const code = codeEditor.value;
  let std = stdinBox.value.trim();
  try{
    // provide `input` variable if provided
    const fn = new Function("input", code + "\nreturn (typeof result !== 'undefined')? result : undefined;");
    const out = fn(std? JSON.parseSafe(std) : undefined);
    outputBox.textContent = typeof out === "object"? JSON.stringify(out): String(out);
  } catch(e){ outputBox.textContent = "Error: "+ e.message;}
});

// helper: safe JSON parse fallback
JSON.parseSafe = function(s){ try{ return JSON.parse(s);}catch(e){ return s; }};

// run test case (compare with stored expected)
runTestBtn.addEventListener("click", ()=>{
  if(!selectedQ) return alert("Open a question first");
  const code = codeEditor.value;
  try{
    const fn = new Function("input", code + "\nreturn (typeof result !== 'undefined')? result : undefined;");
    const inVal = selectedQ.testIn? JSON.parseSafe(selectedQ.testIn) : undefined;
    const outVal = selectedQ.testOut;
    const got = fn(inVal);
    const gotStr = (typeof got === "object")? JSON.stringify(got): String(got);
    if(String(outVal).trim() === gotStr.trim()){
      outputBox.textContent = "✅ Test Passed: "+gotStr;
      markSolvedLocal();
    } else {
      outputBox.textContent = `❌ Test Failed\nExpected: ${outVal}\nGot: ${gotStr}`;
    }
  } catch(err){
    outputBox.textContent = "Error: "+err.message;
  }
});

// save solution
saveSolutionBtn.addEventListener("click", ()=>{
  if(!selectedQ) return alert("Open a question");
  store.solutions[selectedQ.id] = codeEditor.value;
  saveStore();
  alert("Solution saved locally");
});

// mark solved
markSolvedBtn.addEventListener("click", markSolvedLocal);
function markSolvedLocal(){
  if(!selectedQ) return;
  selectedQ.solved = true;
  saveStore(); renderList(); openQuestion(selectedQ.id); updateLeaderboard();
}

// progress summary
function loadProgressSummary(){
  const total = store.questions.length;
  const solved = store.questions.filter(q=>q.solved).length;
  const byTopic = {};
  store.questions.forEach(q=>{
    if(!byTopic[q.topic]) byTopic[q.topic] = {total:0,solved:0};
    byTopic[q.topic].total++;
    if(q.solved) byTopic[q.topic].solved++;
  });
  let html = `<p>Total: ${total} • Solved: ${solved}</p>`;
  for(const t in byTopic){
    const obj = byTopic[t];
    html += `<p>${t}: ${obj.solved}/${obj.total} (${((obj.solved/obj.total)*100||0).toFixed(0)}%)</p>`;
  }
  progressSummary.innerHTML = html;
  detectWeakArea();
}

// weak area detection
function detectWeakArea(){
  const stats = {};
  store.questions.forEach(q=>{
    if(!stats[q.topic]) stats[q.topic] = {total:0,solved:0};
    stats[q.topic].total++;
    if(q.solved) stats[q.topic].solved++;
  });
  let weakest = null; let minPerc = 101;
  for(const k in stats){
    const p = (stats[k].solved/stats[k].total)*100;
    if(p < minPerc){ minPerc = p; weakest=k; }
  }
  weakArea.textContent = weakest ? `${weakest} — ${minPerc.toFixed(0)}% complete` : "No topics yet";
}

// daily targets (3 unsolved)
function loadDailyTargets(){
  const unsolved = store.questions.filter(q=>!q.solved);
  dailyTargets.innerHTML = "";
  unsolved.slice(0,3).forEach(q=>{
    const li = document.createElement("li"); li.textContent = q.title + " ("+q.difficulty+")"; dailyTargets.appendChild(li);
  });
}

// shuffle targets
shuffleTargets.addEventListener("click", ()=>{ 
  const uns = store.questions.filter(q=>!q.solved); 
  for(let i=uns.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[uns[i],uns[j]]=[uns[j],uns[i]]}
  dailyTargets.innerHTML="";uns.slice(0,3).forEach(q=>{const li=document.createElement("li");li.textContent=q.title;dailyTargets.appendChild(li)})
});

// leaderboard (based on solved count)
function updateLeaderboard(){
  const users = {}; // local simple leaderboard: guest only => based on solved
  users[currentUser] = store.questions.filter(q=>q.solved).length;
  leaderboardEl.innerHTML = "";
  Object.entries(users).sort((a,b)=>b[1]-a[1]).forEach(entry=>{
    const li = document.createElement("li"); li.textContent = `${entry[0]} — ${entry[1]} solved`; leaderboardEl.appendChild(li);
  });
}

// export / import
exportBtn.addEventListener("click", ()=>{
  const data = JSON.stringify(store, null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="dsamate_backup.json"; a.click(); URL.revokeObjectURL(url);
});
importBtn.addEventListener("click", ()=> importFile.click());
importFile.addEventListener("change",(e)=>{
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader(); reader.onload = function(ev){
    try{
      const obj = JSON.parse(ev.target.result);
      if(Array.isArray(obj.questions) || obj.questions) {
        store = obj; saveStore(); renderAll(); alert("Imported!");
      } else alert("Invalid file");
    }catch(err){alert("Invalid JSON")}
  }; reader.readAsText(f);
});

// dark mode
darkToggle.addEventListener("click", ()=>{
  document.documentElement.classList.toggle("dark");
});

// timer (simple)
startTimerBtn.addEventListener("click", ()=>{
  if(!selectedQ) return alert("Open a question");
  timeLeft = 10*60; // 10 minutes example
  clearInterval(timerId);
  timerId = setInterval(()=>{ timeLeft--; updateTimer(); if(timeLeft<=0){clearInterval(timerId); alert("Timer finished");}},1000);
});
clearTimerBtn.addEventListener("click", ()=>{ clearInterval(timerId); timerLabel.textContent=""; });

// update timer label
function updateTimer(){
  const m = Math.floor(timeLeft/60); const s = timeLeft%60;
  timerLabel.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// hint (simple)
hintBtn.addEventListener("click", ()=>{
  if(!selectedQ) return alert("Open a question");
  alert(selectedQ.hint || "No hint available. Check description.");
});

// report
reportBtn.addEventListener("click", ()=>{ alert("Reported. (Demo)"); });

// reset filters
resetFilters.addEventListener("click", ()=>{ topicFilter.value="All"; diffFilter.value="All"; searchBox.value=""; renderList(); });

// run/test notes: helper JSON parse safe
// initialize UI rendering
function renderAll(){
  getStore(); renderFilters(); renderList(); loadDailyTargets(); loadProgressSummary(); updateLeaderboard();
}
function renderFilters(){ renderFilters = null; /* shadow fix */ }
renderFilters = function(){ // redefine to use current store
  topicFilter.innerHTML=""; uniqueTopics().forEach(t=>{ const o = document.createElement("option"); o.value=t; o.textContent=t; topicFilter.appendChild(o);});
}
renderAll();

// attach simple event listeners
topicFilter.addEventListener("change", renderList);
diffFilter.addEventListener("change", renderList);
searchBox.addEventListener("input", renderList);

// helper to re-render list
function renderList(){ 
  getStore(); renderFilters(); 
  const list = filterQuestions();
  qList.innerHTML=""; 
  list.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = `<div><strong>${item.title}</strong><br><small style="color:#666">${item.topic} • ${item.difficulty}</small></div>
                    <div><button data-id="${item.id}" class="openBtn">${item.solved? "✔":"Open"}</button></div>`;
    qList.appendChild(li);
  });
  document.querySelectorAll(".openBtn").forEach(b=>b.addEventListener("click", (e)=>openQuestion(Number(e.target.dataset.id))));
  loadDailyTargets(); loadProgressSummary(); updateLeaderboard();
}

// expose reset option if needed
window.resetStore = resetStore;
