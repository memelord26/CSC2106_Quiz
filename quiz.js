// quiz.js — core engine

const STORAGE_KEY = 'iotQuizState';

// ── State ─────────────────────────────────────────────────────────────────────
let allQuestions    = [];   // flat pool of every question (topic field injected)
let activeQuestions = [];   // current quiz subset, shuffled
let current = 0, score = 0, answered = false;
let topicScores = {};
let userAnswers = [];       // [{qIdx, isCorrect, givenLabel, correctLabel}]

// per-question shuffle state (not persisted — regenerated on resume)
let _shuffledOpts = [];
let _shuffledAns  = null;   // number | number[]
let _matchDescs   = [];     // shuffled description texts for "match" questions

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function loadTopics() {
  document.getElementById('quizBody').innerHTML =
    '<p style="text-align:center;color:#888;padding:40px 0;">Loading questions…</p>';
  try {
    const manifest = await fetch('topics/index.json').then(r => r.json());
    const topicFiles = await Promise.all(
      manifest.topics.map(slug => fetch(`topics/${slug}.json`).then(r => r.json()))
    );
    allQuestions = topicFiles.flatMap(file =>
      file.questions.map(q => ({ ...q, topic: file.topic }))
    );
  } catch (err) {
    document.getElementById('quizBody').innerHTML =
      `<p style="text-align:center;color:#ef4444;padding:40px 0;">
        Failed to load questions. Make sure you are serving this via a web server.<br>
        <small>${err.message}</small>
      </p>`;
    return;
  }

  const saved = loadState();
  if (saved) {
    showTopicSelect(saved);
  } else {
    showTopicSelect();
  }
}

// ── Persistence ───────────────────────────────────────────────────────────────
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeQuestions,
      current,
      score,
      topicScores,
      userAnswers,
    }));
  } catch (_) { /* storage full or unavailable — silently ignore */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
}

// ── Type detection ────────────────────────────────────────────────────────────
function getType(q) {
  if (q.type === 'match')      return 'match';
  if (q.type === 'input')      return 'input';
  if (Array.isArray(q.ans))    return 'multi';
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
function showTopicSelect(savedState) {
  clearState();
  document.getElementById('progressBar').style.width = '0%';
  const topics = getUniqueTopics(allQuestions);

  const topicButtons = topics.map(t => {
    const count = allQuestions.filter(q => q.topic === t).length;
    return `<button class="topic-select-btn" data-topic="${encodeURIComponent(t)}">
      ${t}<span style="float:right;color:#666;font-size:0.8rem;">${count}q</span>
    </button>`;
  }).join('');

  const resumeBanner = savedState ? `
    <div class="resume-banner">
      <p>You have a quiz in progress (Question ${savedState.current + 1} of ${savedState.activeQuestions.length}). Resume where you left off?</p>
      <button class="resume-btn" id="resumeBtn">Resume Quiz</button>
      <button class="discard-btn" id="discardBtn">Start Fresh</button>
    </div>` : '';

  const container = document.getElementById('quizBody');
  container.innerHTML = `
    ${resumeBanner}
    <div class="topic-select" id="topicSelectList">
      <p class="topic-select-label">Choose a topic to practise, or test yourself on everything</p>
      <button class="topic-select-btn all-btn" data-topic="__all__">
        ⚡ All Topics
        <span style="float:right;color:#a78bfa88;font-size:0.8rem;">${allQuestions.length}q</span>
      </button>
      ${topicButtons}
    </div>`;

  document.getElementById('topicSelectList').addEventListener('click', e => {
    const btn = e.target.closest('[data-topic]');
    if (!btn) return;
    startQuiz(decodeURIComponent(btn.dataset.topic));
  });

  if (savedState) {
    document.getElementById('resumeBtn').addEventListener('click', () => resumeQuiz(savedState));
    document.getElementById('discardBtn').addEventListener('click', () => showTopicSelect());
  }
}

function startQuiz(topic) {
  const pool = topic === '__all__' ? [...allQuestions] : allQuestions.filter(q => q.topic === topic);
  activeQuestions = fisherYates(pool);
  topicScores = {};
  activeQuestions.forEach(q => {
    const k = getTopicKey(q.topic);
    if (!topicScores[k]) topicScores[k] = { correct: 0, total: 0 };
    topicScores[k].total++;
  });
  current = 0; score = 0; answered = false;
  userAnswers = [];
  render();
}

function resumeQuiz(state) {
  activeQuestions = state.activeQuestions;
  current         = state.current;
  score           = state.score;
  topicScores     = state.topicScores;
  userAnswers     = state.userAnswers || [];
  answered        = false;
  render();
}

// keep window reference for any external callers
window.__startQuiz__ = startQuiz;

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
  saveState();
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
        `<button class="option-btn" data-idx="${i}" id="opt${i}">
          <span class="letter">${multi ? '☐' : String.fromCharCode(65 + i)}</span>${o}
        </button>`
      ).join('')}
    </div>
    <div class="feedback" id="feedback"></div>
    ${multi ? `<button class="submit-btn" id="submitBtn">Submit Answer</button>` : ''}
    <button class="next-btn" id="nextBtn">${nextLabel()}</button>`;

  document.getElementById('options').addEventListener('click', e => {
    const btn = e.target.closest('.option-btn');
    if (!btn) return;
    choose(parseInt(btn.dataset.idx));
  });
  if (multi) document.getElementById('submitBtn').addEventListener('click', submitMulti);
  document.getElementById('nextBtn').addEventListener('click', next);
}

function choose(i) {
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
  const isRight = (i === _shuffledAns);
  if (isRight) {
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
  userAnswers.push({
    qIdx: current,
    isCorrect: isRight,
    givenLabel: _shuffledOpts[i],
    correctLabel: _shuffledOpts[Array.isArray(_shuffledAns) ? _shuffledAns[0] : _shuffledAns],
  });
  saveState();
}

function submitMulti() {
  if (answered) return;
  answered = true;
  const q       = activeQuestions[current];
  const correct = new Set(_shuffledAns);
  const fb      = document.getElementById('feedback');
  const tk      = getTopicKey(q.topic);
  const selected = new Set(
    [...document.querySelectorAll('.option-btn.selected')]
      .map(b => parseInt(b.dataset.idx))
  );
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  document.getElementById('submitBtn').disabled = true;
  let allRight = true;
  for (let i = 0; i < _shuffledOpts.length; i++) {
    const btn = document.getElementById('opt' + i);
    btn.querySelector('.letter').textContent = correct.has(i) ? '☑' : '☐';
    if (correct.has(i) && selected.has(i))        btn.classList.add('correct');
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
  const correctLabels = [...correct].map(i => _shuffledOpts[i]).join(', ');
  const givenLabels   = selected.size ? [...selected].map(i => _shuffledOpts[i]).join(', ') : '(none)';
  userAnswers.push({
    qIdx: current,
    isCorrect: allRight,
    givenLabel: givenLabels,
    correctLabel: correctLabels,
  });
  saveState();
}

// ── MATCH render ──────────────────────────────────────────────────────────────
function renderMatch(q) {
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
    <button class="submit-btn" id="submitBtn">Submit Answer</button>
    <button class="next-btn" id="nextBtn">${nextLabel()}</button>`;

  document.getElementById('submitBtn').addEventListener('click', submitMatch);
  document.getElementById('nextBtn').addEventListener('click', next);
}

function submitMatch() {
  if (answered) return;
  answered = true;
  const q  = activeQuestions[current];
  const fb = document.getElementById('feedback');
  const tk = getTopicKey(q.topic);
  document.getElementById('submitBtn').disabled = true;

  let allRight = true;
  const givenParts   = [];
  const correctParts = [];
  q.pairs.forEach((p, i) => {
    const sel     = document.getElementById('msel' + i);
    const chosen  = parseInt(sel.value);
    const correct = _matchDescs.indexOf(p.match) + 1;
    sel.disabled = true;
    givenParts.push(`${p.term} → ${chosen || '?'}`);
    correctParts.push(`${p.term} → ${correct}`);
    if (chosen === correct) {
      sel.classList.add('match-correct');
    } else {
      sel.classList.add('match-wrong');
      const row = sel.closest('.match-row');
      row.insertAdjacentHTML('beforeend', `<span class="match-hint">→ ${correct}</span>`);
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
  userAnswers.push({
    qIdx: current,
    isCorrect: allRight,
    givenLabel: givenParts.join('; '),
    correctLabel: correctParts.join('; '),
  });
  saveState();
}

// ── INPUT render ──────────────────────────────────────────────────────────────
function renderInput(q) {
  document.getElementById('quizBody').innerHTML = `
    ${questionHeader(q, '<span class="type-badge input-badge">✏️ Type your answer</span>')}
    <div class="input-wrap">
      <input type="text" id="ansInput" class="ans-input" placeholder="Your answer…"/>
    </div>
    <div class="feedback" id="feedback"></div>
    <button class="submit-btn" id="submitBtn">Submit Answer</button>
    <button class="next-btn" id="nextBtn">${nextLabel()}</button>`;

  const input = document.getElementById('ansInput');
  input.focus();
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submitInput(); });
  document.getElementById('submitBtn').addEventListener('click', submitInput);
  document.getElementById('nextBtn').addEventListener('click', next);
}

function submitInput() {
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
  userAnswers.push({
    qIdx: current,
    isCorrect: isRight,
    givenLabel: input.value.trim(),
    correctLabel: valid.join(' / '),
  });
  saveState();
}

// ── Next / Results ────────────────────────────────────────────────────────────
function next() {
  current++;
  if (current >= activeQuestions.length) showResults();
  else render();
}

function showResults() {
  clearState();
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
  const body = document.getElementById('quizBody');
  body.innerHTML = `
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
      <button class="restart-btn" id="reviewBtn">📝 Review Answers</button>
      <button class="restart-btn" id="backBtn" style="margin-top:8px">← Back to Topics</button>
    </div>`;
  document.getElementById('reviewBtn').addEventListener('click', showReview);
  document.getElementById('backBtn').addEventListener('click', showTopicSelect);
}

// ── Answer review ─────────────────────────────────────────────────────────────
function showReview() {
  const answeredCount = userAnswers.length;
  const skippedCount  = activeQuestions.length - answeredCount;

  const items = activeQuestions.map((q, i) => {
    const ua = userAnswers.find(a => a.qIdx === i);
    if (!ua) {
      return `<div class="review-item review-skipped">
        <span class="review-badge skipped">⏭ Skipped</span>
        <div class="review-meta">${q.topic} — Q${i + 1}</div>
        <div class="review-q">${q.q}</div>
      </div>`;
    }
    const cls = ua.isCorrect ? 'review-correct' : 'review-wrong';
    const badge = ua.isCorrect
      ? '<span class="review-badge correct">✅ Correct</span>'
      : '<span class="review-badge wrong">❌ Wrong</span>';
    const answerLines = ua.isCorrect
      ? `<div class="review-answer correct-answer">Your answer: ${ua.givenLabel}</div>`
      : `<div class="review-answer wrong-answer">Your answer: ${ua.givenLabel}</div>
         <div class="review-answer correct-answer">Correct answer: ${ua.correctLabel}</div>`;
    return `<div class="review-item ${cls}">
      ${badge}
      <div class="review-meta">${q.topic} — Q${i + 1}</div>
      <div class="review-q">${q.q}</div>
      ${answerLines}
      <div class="review-exp">${q.exp}</div>
    </div>`;
  }).join('');

  document.getElementById('quizBody').innerHTML = `
    <div class="review-header">
      <h2>📝 Answer Review</h2>
      <p>${answeredCount} answered · ${skippedCount > 0 ? skippedCount + ' skipped · ' : ''}${score} correct</p>
    </div>
    <div class="review-list">${items}</div>
    <button class="review-back-btn" id="reviewBackBtn">← Back to Results</button>`;

  document.getElementById('reviewBackBtn').addEventListener('click', showResults);
}

// ── Keyboard navigation ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Don't intercept when typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  const nextBtn   = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  // Enter — submit or advance
  if (e.key === 'Enter') {
    if (nextBtn && nextBtn.style.display !== 'none') {
      nextBtn.click(); return;
    }
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.click(); return;
    }
  }

  // Number keys 1–9 and letter keys A–Z — select an option
  const q = activeQuestions[current];
  if (!q || answered) return;
  const type = getType(q);

  let idx = -1;
  if (e.key >= '1' && e.key <= '9') {
    idx = parseInt(e.key) - 1;
  } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
    idx = e.key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, …
  }

  if (idx >= 0 && (type === 'single' || type === 'multi')) {
    const btn = document.getElementById('opt' + idx);
    if (btn && !btn.disabled) {
      btn.click();
    }
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
window.__showTopicSelect__ = showTopicSelect;
requestAnimationFrame(loadTopics);
