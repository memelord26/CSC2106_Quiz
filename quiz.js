// quiz.js — core engine. No edits needed here.

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];

let activeQuestions = [];
let current = 0, score = 0, answered = false;
let topicScores = {};

// per-question shuffle state
let _shuffledOpts = [];
let _shuffledAns  = null;   // number | number[]
let _matchDescs   = [];     // shuffled description texts for "match" questions

// ── Type detection ────────────────────────────────────────────────────────────
// type: "match"  → matching dropdowns
// type: "input"  → free-text / number entry
// Array ans      → multi-select checkboxes   (legacy: no type field needed)
// number ans     → single-select             (legacy: no type field needed)
function getType(q) {
  if (q.type === 'match')  return 'match';
  if (q.type === 'input')  return 'input';
  if (Array.isArray(q.ans)) return 'multi';
  return 'single';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTopicKey(t) { return t.split(':')[0].trim(); }

function getUniqueTopics(pool) {
  const seen = new Set();
  return pool.reduce((acc, q) => {
    if (!seen.has(q.topic)) { seen.add(q.topic); acc.push(q.topic); }
    return acc;
  }, []);
}

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(opts, ans) {
  const ansArr = Array.isArray(ans) ? ans : [ans];
  const paired = opts.map((text, i) => ({ text, orig: i }));
  const shuffled = fisherYates(paired);
  const newAns = Array.isArray(ans)
    ? shuffled.reduce((acc, p, i) => { if (ansArr.includes(p.orig)) acc.push(i); return acc; }, [])
    : shuffled.findIndex(p => p.orig === ans);
  return { opts: shuffled.map(p => p.text), ans: newAns };
}

// ── Topic selection ───────────────────────────────────────────────────────────
function showTopicSelect() {
  const allQ = window.__QUIZ_QUESTIONS__ || [];
  document.getElementById('progressBar').style.width = '0%';
  const topics = getUniqueTopics(allQ);

  const topicButtons = topics.map(t => {
    const count = allQ.filter(q => q.topic === t).length;
    const safe  = t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `<button class="topic-select-btn" onclick="window.__startQuiz__('${safe}')">
      ${t}<span style="float:right;color:#666;font-size:0.8rem;">${count}q</span>
    </button>`;
  }).join('');

  document.getElementById('quizBody').innerHTML = `
    <div class="topic-select">
      <p class="topic-select-label">Choose a topic to practise, or test yourself on everything</p>
      <button class="topic-select-btn all-btn" onclick="window.__startQuiz__('__all__')">
        ⚡ All Topics
        <span style="float:right;color:#a78bfa88;font-size:0.8rem;">${allQ.length}q</span>
      </button>
      ${topicButtons}
    </div>`;
}

window.__startQuiz__ = function(topic) {
  const allQ = window.__QUIZ_QUESTIONS__ || [];
  const pool = topic === '__all__' ? [...allQ] : allQ.filter(q => q.topic === topic);
  activeQuestions = fisherYates(pool);
  topicScores = {};
  activeQuestions.forEach(q => {
    const k = getTopicKey(q.topic);
    if (!topicScores[k]) topicScores[k] = { correct: 0, total: 0 };
    topicScores[k].total++;
  });
  current = 0; score = 0; answered = false;
  render();
};

// ── Master render ─────────────────────────────────────────────────────────────
function render() {
  const q   = activeQuestions[current];
  const pct = (current / activeQuestions.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  answered = false;
  const type = getType(q);
  if      (type === 'match') renderMatch(q);
  else if (type === 'input') renderInput(q);
  else                       renderChoice(q);
}

const nextLabel = () =>
  current === activeQuestions.length - 1 ? '🎉 See Results' : 'Next Question →';

function questionHeader(q, badge) {
  return `
    <div class="topic-badge">${q.topic}</div>
    <div class="question-num">Question ${current + 1} of ${activeQuestions.length}</div>
    <div class="question-text">${q.q}</div>
    ${badge || ''}`;
}

// ── SINGLE / MULTI render ─────────────────────────────────────────────────────
function renderChoice(q) {
  const type = getType(q);
  const sh   = shuffleOptions(q.opts, q.ans);
  _shuffledOpts = sh.opts;
  _shuffledAns  = sh.ans;
  const multi = type === 'multi';
  const badge = multi ? '<span class="type-badge multi-badge">☑ Select all that apply</span>' : '';

  document.getElementById('quizBody').innerHTML = `
    ${questionHeader(q, badge)}
    <div class="options" id="options">
      ${_shuffledOpts.map((o, i) =>
        `<button class="option-btn" onclick="window.__choose__(${i})" id="opt${i}">
          <span class="letter">${multi ? '☐' : String.fromCharCode(65 + i)}</span>${o}
        </button>`
      ).join('')}
    </div>
    <div class="feedback" id="feedback"></div>
    ${multi ? `<button class="submit-btn" id="submitBtn" onclick="window.__submitMulti__()">Submit Answer</button>` : ''}
    <button class="next-btn" id="nextBtn" onclick="window.__next__()">${nextLabel()}</button>`;
}

window.__choose__ = function(i) {
  const q = activeQuestions[current];
  if (getType(q) === 'multi') {
    const btn = document.getElementById('opt' + i);
    const sel = btn.classList.toggle('selected');
    btn.querySelector('.letter').textContent = sel ? '☑' : '☐';
    return;
  }
  if (answered) return;
  answered = true;
  const fb = document.getElementById('feedback');
  const tk = getTopicKey(q.topic);
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  if (i === _shuffledAns) {
    document.getElementById('opt' + i).classList.add('correct');
    fb.className = 'feedback correct';
    fb.innerHTML = '✅ Correct! ' + q.exp;
    score++; topicScores[tk].correct++;
  } else {
    document.getElementById('opt' + i).classList.add('wrong');
    document.getElementById('opt' + _shuffledAns).classList.add('reveal');
    fb.className = 'feedback wrong';
    fb.innerHTML = '❌ Not quite. ' + q.exp;
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
};

window.__submitMulti__ = function() {
  if (answered) return;
  answered = true;
  const q       = activeQuestions[current];
  const correct = new Set(_shuffledAns);
  const fb      = document.getElementById('feedback');
  const tk      = getTopicKey(q.topic);
  const selected = new Set(
    [...document.querySelectorAll('.option-btn.selected')]
      .map(b => parseInt(b.id.replace('opt', '')))
  );
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  document.getElementById('submitBtn').disabled = true;
  let allRight = true;
  for (let i = 0; i < _shuffledOpts.length; i++) {
    const btn = document.getElementById('opt' + i);
    btn.querySelector('.letter').textContent = correct.has(i) ? '☑' : '☐';
    if (correct.has(i) && selected.has(i))   btn.classList.add('correct');
    else if (!correct.has(i) && selected.has(i)) { btn.classList.add('wrong');  allRight = false; }
    else if (correct.has(i) && !selected.has(i)) { btn.classList.add('reveal'); allRight = false; }
  }
  if (allRight) {
    fb.className = 'feedback correct'; fb.innerHTML = '✅ Correct! ' + q.exp;
    score++; topicScores[tk].correct++;
  } else {
    fb.className = 'feedback wrong'; fb.innerHTML = '❌ Not quite. ' + q.exp;
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
};

// ── MATCH render ──────────────────────────────────────────────────────────────
function renderMatch(q) {
  // Shuffle the descriptions and remember order for evaluation
  _matchDescs = fisherYates(q.pairs.map(p => p.match));
  const nums  = _matchDescs.map((_, i) => i + 1);

  const leftRows = q.pairs.map((p, i) => {
    const opts = nums.map(n => `<option value="${n}">${n}</option>`).join('');
    return `<div class="match-row">
      <select class="match-select" id="msel${i}">
        <option value="">—</option>
        ${opts}
      </select>
      <span class="match-term">${p.term}</span>
    </div>`;
  }).join('');

  const rightRows = _matchDescs.map((d, i) =>
    `<div class="match-desc-row"><span class="match-num">${i + 1}.</span><span>${d}</span></div>`
  ).join('');

  document.getElementById('quizBody').innerHTML = `
    ${questionHeader(q, '<span class="type-badge match-badge">🔗 Match each term</span>')}
    <div class="match-container">
      <div class="match-left">${leftRows}</div>
      <div class="match-right">${rightRows}</div>
    </div>
    <div class="feedback" id="feedback"></div>
    <button class="submit-btn" id="submitBtn" onclick="window.__submitMatch__()">Submit Answer</button>
    <button class="next-btn" id="nextBtn" onclick="window.__next__()">${nextLabel()}</button>`;
}

window.__submitMatch__ = function() {
  if (answered) return;
  answered = true;
  const q  = activeQuestions[current];
  const fb = document.getElementById('feedback');
  const tk = getTopicKey(q.topic);
  document.getElementById('submitBtn').disabled = true;

  let allRight = true;
  q.pairs.forEach((p, i) => {
    const sel     = document.getElementById('msel' + i);
    const chosen  = parseInt(sel.value);                        // 1-based number user picked
    const correct = _matchDescs.indexOf(p.match) + 1;          // 1-based correct number
    sel.disabled = true;
    if (chosen === correct) {
      sel.classList.add('match-correct');
    } else {
      sel.classList.add('match-wrong');
      // show correct answer as tooltip-style label
      const row = sel.closest('.match-row');
      row.insertAdjacentHTML('beforeend',
        `<span class="match-hint">→ ${correct}</span>`);
      allRight = false;
    }
  });

  if (allRight) {
    fb.className = 'feedback correct'; fb.innerHTML = '✅ All matched correctly! ' + q.exp;
    score++; topicScores[tk].correct++;
  } else {
    fb.className = 'feedback wrong'; fb.innerHTML = '❌ Not quite. ' + q.exp;
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
};

// ── INPUT render ──────────────────────────────────────────────────────────────
function renderInput(q) {
  document.getElementById('quizBody').innerHTML = `
    ${questionHeader(q, '<span class="type-badge input-badge">✏️ Type your answer</span>')}
    <div class="input-wrap">
      <input type="text" id="ansInput" class="ans-input" placeholder="Your answer…"
             onkeydown="if(event.key==='Enter') window.__submitInput__()"/>
    </div>
    <div class="feedback" id="feedback"></div>
    <button class="submit-btn" id="submitBtn" onclick="window.__submitInput__()">Submit Answer</button>
    <button class="next-btn" id="nextBtn" onclick="window.__next__()">${nextLabel()}</button>`;
  document.getElementById('ansInput').focus();
}

window.__submitInput__ = function() {
  if (answered) return;
  const input = document.getElementById('ansInput');
  if (!input.value.trim()) return;
  answered = true;
  const q      = activeQuestions[current];
  const fb     = document.getElementById('feedback');
  const tk     = getTopicKey(q.topic);
  const valid  = Array.isArray(q.ans) ? q.ans : [q.ans];
  const given  = input.value.trim().toLowerCase();
  const isRight = valid.some(a => a.toString().trim().toLowerCase() === given);
  input.disabled = true;
  document.getElementById('submitBtn').disabled = true;
  if (isRight) {
    input.classList.add('input-correct');
    fb.className = 'feedback correct'; fb.innerHTML = '✅ Correct! ' + q.exp;
    score++; topicScores[tk].correct++;
  } else {
    input.classList.add('input-wrong');
    const display = valid.join(' or ');
    fb.className = 'feedback wrong';
    fb.innerHTML = `❌ Not quite. The correct answer is <strong>${display}</strong>. ${q.exp}`;
  }
  fb.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
};

// ── Next / Results ────────────────────────────────────────────────────────────
window.__next__ = function() {
  current++;
  if (current >= activeQuestions.length) showResults();
  else render();
};

function showResults() {
  document.getElementById('progressBar').style.width = '100%';
  const pct   = Math.round((score / activeQuestions.length) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📖';
  const msg   = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort!' : 'Keep reviewing!';
  const breakdown = Object.entries(topicScores).map(([k, v]) =>
    `<div class="topic-score">
       <span class="ts-name">${k}</span>
       <span class="ts-val">${v.correct}/${v.total}</span>
     </div>`
  ).join('');
  document.getElementById('quizBody').innerHTML = `
    <div class="score-card">
      <h2>${emoji} Quiz Complete!</h2>
      <div class="score-big">${pct}%</div>
      <div class="score-label">${msg} You got ${score} out of ${activeQuestions.length} correct.</div>
      <div class="stats-row">
        <div class="stat-box"><div class="sv">${score}</div><div class="sl">Correct</div></div>
        <div class="stat-box"><div class="sv">${activeQuestions.length - score}</div><div class="sl">Incorrect</div></div>
        <div class="stat-box"><div class="sv">${pct}%</div><div class="sl">Score</div></div>
      </div>
      <div class="score-breakdown">
        <h3>📊 BREAKDOWN BY TOPIC</h3>
        ${breakdown}
      </div>
      <button class="restart-btn" onclick="window.__showTopicSelect__()">← Back to Topics</button>
    </div>`;
}

window.__showTopicSelect__ = showTopicSelect;
requestAnimationFrame(() => showTopicSelect());
