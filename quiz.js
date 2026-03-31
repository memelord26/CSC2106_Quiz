// quiz.js — Vue 3 IoT Quiz App (CDN ESM, no build step)
import { createApp, ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'

// ── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'iotQuizState'

// ── Helpers ──────────────────────────────────────────────────────────────────
function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleOptions(opts, ans) {
  const ansArr = Array.isArray(ans) ? ans : [ans]
  const paired = opts.map((text, i) => ({ text, orig: i }))
  const shuffled = fisherYates(paired)
  const newAns = Array.isArray(ans)
    ? shuffled.reduce((acc, p, i) => { if (ansArr.includes(p.orig)) acc.push(i); return acc }, [])
    : shuffled.findIndex(p => p.orig === ans)
  return { opts: shuffled.map(p => p.text), ans: newAns }
}

function getType(q) {
  if (q.type === 'match') return 'match'
  if (q.type === 'input') return 'input'
  if (Array.isArray(q.ans)) return 'multi'
  return 'single'
}

function getTopicKey(t) { return t.split(':')[0].trim() }

function saveState(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch (_) {}
}
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null } catch (_) { return null }
}
function clearState() {
  try { localStorage.removeItem(STORAGE_KEY) } catch (_) {}
}

// ── App ──────────────────────────────────────────────────────────────────────
const App = {
  setup() {
    // ── Core state ─────────────────────────────────────────────────────────
    const screen = ref('loading')       // loading | topic | quiz | results | review
    const errorMsg = ref('')
    const allQuestions = ref([])
    const activeQuestions = ref([])
    const current = ref(0)
    const score = ref(0)
    const answered = ref(false)
    const topicScores = reactive({})
    const userAnswers = ref([])

    // Per-question shuffle state
    const shuffledOpts = ref([])
    const shuffledAns = ref(null)
    const matchDescs = ref([])

    // Match validation
    const matchSelections = ref([])

    // Multi-select tracking
    const multiSelected = ref(new Set())

    // Input state
    const inputValue = ref('')

    // Nav expand/collapse
    const showNav = ref(false)

    // Review state
    const reviewPage = ref(0)

    // Shortcut overlay
    const showShortcuts = ref(false)

    // Resume state
    const savedState = ref(null)

    // ── Computed ────────────────────────────────────────────────────────────
    const currentQuestion = computed(() => activeQuestions.value[current.value])
    const questionType = computed(() => currentQuestion.value ? getType(currentQuestion.value) : null)
    const isLastQuestion = computed(() => current.value === activeQuestions.value.length - 1)
    const resultPct = computed(() => activeQuestions.value.length ? Math.round((score.value / activeQuestions.value.length) * 100) : 0)
    const resultMsg = computed(() => resultPct.value >= 80 ? 'Excellent work!' : resultPct.value >= 60 ? 'Good effort!' : 'Keep reviewing!')
    const resultIcon = computed(() => resultPct.value >= 80 ? 'fa-solid fa-trophy' : resultPct.value >= 60 ? 'fa-solid fa-thumbs-up' : 'fa-solid fa-book')

    // Topics list
    const topics = computed(() => {
      const seen = new Set()
      return allQuestions.value.reduce((acc, q) => {
        if (!seen.has(q.topic)) { seen.add(q.topic); acc.push(q.topic) }
        return acc
      }, [])
    })

    // Topic breakdown
    const topicBreakdown = computed(() => Object.entries(topicScores))

    // Nav pill summary counts — single pass
    const navSummary = computed(() => {
      const total = activeQuestions.value.length
      const { correct, wrong } = userAnswers.value.reduce(
        (acc, a) => { a.isCorrect ? acc.correct++ : acc.wrong++; return acc },
        { correct: 0, wrong: 0 }
      )
      return { total, correct, wrong, pending: Math.max(0, total - correct - wrong) }
    })

    // Match validation — computed
    const matchDuplicates = computed(() => {
      const vals = matchSelections.value.filter(v => v !== '')
      const counts = {}
      vals.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
      return new Set(Object.keys(counts).filter(k => counts[k] > 1))
    })
    const matchValid = computed(() => {
      if (!currentQuestion.value || questionType.value !== 'match') return false
      const pairs = currentQuestion.value.pairs
      if (matchSelections.value.length !== pairs.length) return false
      if (matchSelections.value.some(v => v === '')) return false
      return matchDuplicates.value.size === 0
    })
    const matchStatusText = computed(() => {
      if (!currentQuestion.value || questionType.value !== 'match') return ''
      const pairs = currentQuestion.value.pairs
      const filled = matchSelections.value.filter(v => v !== '').length
      if (filled === 0) return ''
      if (matchDuplicates.value.size > 0) return 'Duplicate selections detected'
      if (filled < pairs.length) return `${filled} of ${pairs.length} matched`
      return 'All matched — ready to submit'
    })

    // Review: current review question data
    const reviewQuestion = computed(() => {
      if (reviewPage.value < 0 || reviewPage.value >= activeQuestions.value.length) return null
      return activeQuestions.value[reviewPage.value]
    })
    const reviewAnswer = computed(() => {
      return userAnswers.value.find(a => a.qIdx === reviewPage.value) || null
    })

    // ── Persistence ────────────────────────────────────────────────────────
    function persistState() {
      if (screen.value !== 'quiz') return
      saveState({
        activeQuestions: activeQuestions.value,
        current: current.value,
        score: score.value,
        topicScores: { ...topicScores },
        userAnswers: userAnswers.value,
      })
    }

    // ── Bootstrap ──────────────────────────────────────────────────────────
    async function loadTopics() {
      screen.value = 'loading'
      errorMsg.value = ''
      try {
        const manifest = await fetch('topics/index.json').then(r => r.json())
        const topicFiles = await Promise.all(
          manifest.topics.map(slug => fetch(`topics/${slug}.json`).then(r => r.json()))
        )
        allQuestions.value = topicFiles.flatMap(file =>
          file.questions.map(q => ({ ...q, topic: file.topic }))
        )
      } catch (err) {
        errorMsg.value = err.message
        screen.value = 'loading'
        return
      }

      const saved = loadState()
      if (saved) {
        savedState.value = saved
      }
      screen.value = 'topic'
    }

    // ── Quiz lifecycle ─────────────────────────────────────────────────────
    function startQuiz(topic) {
      clearState()
      const pool = topic === '__all__' ? [...allQuestions.value] : allQuestions.value.filter(q => q.topic === topic)
      activeQuestions.value = fisherYates(pool)

      // Reset topicScores reactively
      Object.keys(topicScores).forEach(k => delete topicScores[k])
      activeQuestions.value.forEach(q => {
        const k = getTopicKey(q.topic)
        if (!topicScores[k]) topicScores[k] = { correct: 0, total: 0 }
        topicScores[k].total++
      })

      current.value = 0
      score.value = 0
      answered.value = false
      userAnswers.value = []
      savedState.value = null
      showNav.value = false
      screen.value = 'quiz'
      prepareQuestion()
    }

    function resumeQuiz() {
      const state = savedState.value
      if (!state) return
      activeQuestions.value = state.activeQuestions
      current.value = state.current
      score.value = state.score

      Object.keys(topicScores).forEach(k => delete topicScores[k])
      Object.entries(state.topicScores).forEach(([k, v]) => { topicScores[k] = v })

      userAnswers.value = state.userAnswers || []
      answered.value = false
      savedState.value = null
      screen.value = 'quiz'
      prepareQuestion()
    }

    function discardSaved() {
      clearState()
      savedState.value = null
    }

    function focusInput() {
      // Double nextTick: first for Vue to process state changes, second for DOM render
      nextTick(() => nextTick(() => {
        const inp = document.querySelector('.ans-input')
        if (inp) { inp.focus(); inp.classList.add('autofocused') }
      }))
    }

    function prepareQuestion() {
      const q = activeQuestions.value[current.value]
      if (!q) return
      const type = getType(q)

      // Always re-shuffle — fresh order every time you land on a question
      if (type === 'single' || type === 'multi') {
        const sh = shuffleOptions(q.opts, q.ans)
        shuffledOpts.value = sh.opts
        shuffledAns.value = sh.ans
        multiSelected.value = new Set()
      } else if (type === 'match') {
        matchDescs.value = fisherYates(q.pairs.map(p => p.match))
        matchSelections.value = q.pairs.map(() => '')
      } else if (type === 'input') {
        inputValue.value = ''
      }

      // Mark as answered if the user already submitted this question this session
      answered.value = !!userAnswers.value.find(a => a.qIdx === current.value)

      if (type === 'input' && !answered.value) focusInput()
    }

    function topicCount(topic) {
      return allQuestions.value.filter(q => q.topic === topic).length
    }

    // ── Single choice ──────────────────────────────────────────────────────
    function chooseSingle(idx) {
      if (answered.value) return
      answered.value = true
      const q = currentQuestion.value
      const tk = getTopicKey(q.topic)
      const isRight = idx === shuffledAns.value
      if (isRight) { score.value++; topicScores[tk].correct++ }
      userAnswers.value.push({
        qIdx: current.value,
        isCorrect: isRight,
        givenIdx: idx,                  // store raw index for reliable optionClass lookup
        givenLabel: shuffledOpts.value[idx],
        correctLabel: shuffledOpts.value[Array.isArray(shuffledAns.value) ? shuffledAns.value[0] : shuffledAns.value],
      })
      persistState()
    }

    // ── Multi choice ───────────────────────────────────────────────────────
    function toggleMulti(idx) {
      if (answered.value) return
      const s = new Set(multiSelected.value)
      if (s.has(idx)) s.delete(idx)
      else s.add(idx)
      multiSelected.value = s
    }

    function submitMulti() {
      if (answered.value) return
      answered.value = true
      const q = currentQuestion.value
      const tk = getTopicKey(q.topic)
      const correct = new Set(shuffledAns.value)
      const selected = multiSelected.value
      let allRight = true
      for (let i = 0; i < shuffledOpts.value.length; i++) {
        if (correct.has(i) && !selected.has(i)) allRight = false
        if (!correct.has(i) && selected.has(i)) allRight = false
      }
      if (allRight) { score.value++; topicScores[tk].correct++ }
      const correctLabels = [...correct].map(i => shuffledOpts.value[i]).join(', ')
      const givenLabels = selected.size ? [...selected].map(i => shuffledOpts.value[i]).join(', ') : '(none)'
      userAnswers.value.push({
        qIdx: current.value,
        isCorrect: allRight,
        givenLabel: givenLabels,
        correctLabel: correctLabels,
      })
      persistState()
    }

    // ── Match ──────────────────────────────────────────────────────────────
    function submitMatch() {
      if (answered.value || !matchValid.value) return
      answered.value = true
      const q = currentQuestion.value
      const tk = getTopicKey(q.topic)
      let allRight = true
      const givenParts = []
      const correctParts = []
      const pairResults = []
      q.pairs.forEach((p, i) => {
        const chosen = parseInt(matchSelections.value[i])
        const correct = matchDescs.value.indexOf(p.match) + 1
        const pairOk = chosen === correct
        givenParts.push(`${p.term} \u2192 ${chosen || '?'}`)
        correctParts.push(`${p.term} \u2192 ${correct}`)
        pairResults.push(pairOk)
        if (!pairOk) allRight = false
      })
      if (allRight) { score.value++; topicScores[tk].correct++ }
      // Store correct numbers at submit-time so hints survive re-shuffle on revisit
      const correctNums = q.pairs.map(p => matchDescs.value.indexOf(p.match) + 1)
      userAnswers.value.push({
        qIdx: current.value,
        isCorrect: allRight,
        givenLabel: givenParts.join('; '),
        correctLabel: correctParts.join('; '),
        pairResults,
        correctNums,
      })
      persistState()
    }

    function matchCorrectNum(pairIdx) {
      if (!answered.value) return null
      const ua = userAnswers.value.find(a => a.qIdx === current.value)
      if (ua && ua.correctNums) return ua.correctNums[pairIdx]
      // Fallback: derive from current matchDescs (only valid immediately after submit)
      const q = currentQuestion.value
      return matchDescs.value.indexOf(q.pairs[pairIdx].match) + 1
    }

    function isMatchCorrect(pairIdx) {
      if (!answered.value) return null
      const ua = userAnswers.value.find(a => a.qIdx === current.value)
      if (!ua || !ua.pairResults) return null
      return ua.pairResults[pairIdx] ?? null
    }

    // ── Input ──────────────────────────────────────────────────────────────
    function submitInput() {
      if (answered.value || !inputValue.value.trim()) return
      answered.value = true
      const q = currentQuestion.value
      const tk = getTopicKey(q.topic)
      const valid = Array.isArray(q.ans) ? q.ans : [q.ans]
      const given = inputValue.value.trim().toLowerCase()
      const isRight = valid.some(a => a.toString().trim().toLowerCase() === given)
      if (isRight) { score.value++; topicScores[tk].correct++ }
      userAnswers.value.push({
        qIdx: current.value,
        isCorrect: isRight,
        givenLabel: inputValue.value.trim(),
        correctLabel: valid.join(' / '),
      })
      persistState()
    }

    // ── Navigation ─────────────────────────────────────────────────────────
    function jumpToQuestion(idx) {
      if (idx < 0 || idx >= activeQuestions.value.length) return
      current.value = idx
      showNav.value = false   // auto-collapse after picking a question
      prepareQuestion()
    }

    function nextQuestion() {
      const next = current.value + 1
      if (next >= activeQuestions.value.length) {
        clearState()
        screen.value = 'results'
      } else {
        jumpToQuestion(next)
      }
    }

    function goToResults() {
      screen.value = 'results'
    }

    function goToReview() {
      reviewPage.value = 0
      screen.value = 'review'
    }

    function goToTopics() {
      screen.value = 'topic'
    }

    function setReviewPage(idx) {
      reviewPage.value = idx
    }

    function reviewPrev() {
      if (reviewPage.value > 0) reviewPage.value--
    }

    function reviewNext() {
      if (reviewPage.value < activeQuestions.value.length - 1) reviewPage.value++
    }

    // ── Quiz nav dot class ─────────────────────────────────────────────────
    function quizNavDotClass(idx) {
      const ua = userAnswers.value.find(a => a.qIdx === idx)
      let cls = 'qdot'
      if (idx === current.value) cls += ' qdot-active'
      if (!ua) cls += ' qdot-pending'
      else if (ua.isCorrect) cls += ' qdot-correct'
      else cls += ' qdot-wrong'
      return cls
    }

    // ── Review dot class ───────────────────────────────────────────────────
    function dotClass(idx) {
      const ua = userAnswers.value.find(a => a.qIdx === idx)
      let cls = 'rdot'
      if (!ua) cls += ' rdot-skipped'
      else if (ua.isCorrect) cls += ' rdot-correct'
      else cls += ' rdot-wrong'
      if (idx === reviewPage.value) cls += ' rdot-active'
      return cls
    }

    // ── Feedback helpers for template ──────────────────────────────────────
    const feedbackCorrect = computed(() => {
      if (!answered.value) return false
      const ua = userAnswers.value.find(a => a.qIdx === current.value)
      return ua ? ua.isCorrect : false
    })

    // For single choice: classify button state
    function optionClass(idx) {
      let cls = 'option-btn'
      const type = questionType.value
      if (type === 'multi') {
        if (multiSelected.value.has(idx)) cls += ' selected'
        if (answered.value) {
          const correct = new Set(shuffledAns.value)
          if (correct.has(idx) && multiSelected.value.has(idx)) cls += ' correct'
          else if (!correct.has(idx) && multiSelected.value.has(idx)) cls += ' wrong'
          else if (correct.has(idx) && !multiSelected.value.has(idx)) cls += ' reveal'
        }
      } else if (type === 'single' && answered.value) {
        const ua = userAnswers.value.find(a => a.qIdx === current.value)
        if (ua) {
          if (idx === shuffledAns.value && ua.isCorrect) cls += ' correct'
          else if (idx === shuffledAns.value && !ua.isCorrect) cls += ' reveal'
          else if (idx === ua.givenIdx && !ua.isCorrect) cls += ' wrong'
        }
      }
      return cls
    }

    function letterLabel(idx) {
      const type = questionType.value
      if (type === 'multi') {
        if (answered.value) {
          const correct = new Set(shuffledAns.value)
          return correct.has(idx) ? '\u2611' : '\u2610'
        }
        return multiSelected.value.has(idx) ? '\u2611' : '\u2610'
      }
      return String.fromCharCode(65 + idx)
    }

    // ── Keyboard handler ───────────────────────────────────────────────────
    function onKeydown(e) {
      // Skip if typing in input/select (but allow Enter to submit in input fields)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && screen.value === 'quiz' && questionType.value === 'input') {
          submitInput()
        }
        return
      }

      // ? — toggle shortcut overlay
      if (e.key === '?') {
        showShortcuts.value = !showShortcuts.value
        return
      }

      // Escape — close overlay, or back from review to results
      if (e.key === 'Escape') {
        if (showShortcuts.value) { showShortcuts.value = false; return }
        if (screen.value === 'review') { screen.value = 'results'; return }
        return
      }

      // Review screen arrow keys
      if (screen.value === 'review') {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); reviewPrev(); return }
        if (e.key === 'ArrowRight') { e.preventDefault(); reviewNext(); return }
        return
      }

      // Quiz screen
      if (screen.value !== 'quiz') return

      // Arrow keys — navigate between questions
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        jumpToQuestion(current.value - 1)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (answered.value) {
          // On last question, go to results; otherwise jump forward
          if (current.value === activeQuestions.value.length - 1) nextQuestion()
          else jumpToQuestion(current.value + 1)
        }
        return
      }

      // Enter — submit or advance
      if (e.key === 'Enter') {
        if (answered.value) { nextQuestion(); return }
        if (questionType.value === 'multi') { submitMulti(); return }
        if (questionType.value === 'match') { submitMatch(); return }
        if (questionType.value === 'input') { submitInput(); return }
        return
      }

      // Number/letter keys — select option
      if (answered.value) return
      const type = questionType.value
      if (type !== 'single' && type !== 'multi') return

      let idx = -1
      if (e.key >= '1' && e.key <= '9') {
        idx = parseInt(e.key) - 1
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        idx = e.key.toUpperCase().charCodeAt(0) - 65
      }

      if (idx >= 0 && idx < shuffledOpts.value.length) {
        if (type === 'single') chooseSingle(idx)
        else toggleMulti(idx)
      }
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────
    onMounted(() => {
      document.addEventListener('keydown', onKeydown)
      loadTopics()
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', onKeydown)
    })

    // ── Return ─────────────────────────────────────────────────────────────
    return {
      // State
      screen, errorMsg, allQuestions, activeQuestions, current, score, answered,
      topicScores, userAnswers, shuffledOpts, shuffledAns, matchDescs,
      matchSelections, multiSelected, inputValue, reviewPage, showShortcuts, savedState,
      showNav,
      // Computed
      currentQuestion, questionType, isLastQuestion,
      resultPct, resultMsg, resultIcon, topics, topicBreakdown, navSummary,
      matchDuplicates, matchValid, matchStatusText,
      reviewQuestion, reviewAnswer, feedbackCorrect,
      // Methods
      loadTopics, startQuiz, resumeQuiz, discardSaved, chooseSingle, toggleMulti, submitMulti,
      submitMatch, matchCorrectNum, isMatchCorrect, submitInput,
      nextQuestion, jumpToQuestion, goToResults, goToReview, goToTopics,
      setReviewPage, reviewPrev, reviewNext,
      dotClass, quizNavDotClass, optionClass, letterLabel, topicCount,
    }
  },

  template: /* html */ `
<div class="quiz-container">
  <!-- Header -->
  <div class="header">
    <h1><i class="fa-solid fa-bolt"></i> IoT Quiz</h1>
    <p>Test your knowledge of IoT communication protocols</p>
  </div>

  <!-- Quiz question navigator — collapsible pill -->
  <div v-if="screen === 'quiz'" class="qnav-wrap">
    <!-- Pill toggle button -->
    <button class="qnav-pill" @click="showNav = !showNav" :class="{ open: showNav }">
      <span class="qnav-pill-pos">Q{{ current + 1 }} <span class="qnav-pill-sep">/</span> {{ activeQuestions.length }}</span>
      <span class="qnav-pill-dots">
        <span v-if="navSummary.correct > 0" class="qnav-pip pip-correct" :style="{ width: (navSummary.correct / navSummary.total * 48) + 'px' }"></span>
        <span v-if="navSummary.wrong > 0"   class="qnav-pip pip-wrong"   :style="{ width: (navSummary.wrong   / navSummary.total * 48) + 'px' }"></span>
        <span v-if="navSummary.pending > 0" class="qnav-pip pip-pending" :style="{ width: (navSummary.pending / navSummary.total * 48) + 'px' }"></span>
      </span>
      <i class="fa-solid fa-chevron-down qnav-chevron"></i>
    </button>

    <!-- Expanded dot grid -->
    <div v-if="showNav" class="qnav-grid">
      <button v-for="(q, idx) in activeQuestions" :key="idx"
        :class="quizNavDotClass(idx)"
        :title="'Question ' + (idx + 1)"
        @click="jumpToQuestion(idx)">{{ idx + 1 }}</button>
    </div>
  </div>

  <!-- ═══════════════════ LOADING SCREEN ═══════════════════ -->
  <div v-if="screen === 'loading' && !errorMsg" class="loading">
    <i class="fa-solid fa-spinner fa-spin"></i> Loading questions...
  </div>
  <div v-if="screen === 'loading' && errorMsg" class="error-msg">
    <i class="fa-solid fa-circle-xmark"></i> Failed to load questions. Make sure you are serving this via a web server.
    <small>{{ errorMsg }}</small>
    <button class="retry-btn" @click="loadTopics"><i class="fa-solid fa-rotate-right"></i> Retry</button>
  </div>

  <!-- ═══════════════════ TOPIC SELECT ═══════════════════ -->
  <div v-if="screen === 'topic'">
    <!-- Resume banner -->
    <div v-if="savedState" class="resume-banner">
      <p>You have a quiz in progress (Question {{ savedState.current + 1 }} of {{ savedState.activeQuestions.length }}). Resume where you left off?</p>
      <button class="resume-btn" @click="resumeQuiz"><i class="fa-solid fa-play"></i> Resume Quiz</button>
      <button class="discard-btn" @click="discardSaved"><i class="fa-solid fa-rotate-left"></i> Start Fresh</button>
    </div>

    <div class="topic-select">
      <p class="topic-select-label">Choose a topic to practise, or test yourself on everything</p>
      <button class="topic-select-btn all-btn" @click="startQuiz('__all__')">
        <span><i class="fa-solid fa-bolt"></i> All Topics</span>
        <span class="topic-count">{{ allQuestions.length }}q</span>
      </button>
      <button v-for="t in topics" :key="t" class="topic-select-btn" @click="startQuiz(t)">
        <span>{{ t }}</span>
        <span class="topic-count">{{ topicCount(t) }}q</span>
      </button>
    </div>
  </div>

  <!-- ═══════════════════ QUIZ SCREEN ═══════════════════ -->
  <div v-if="screen === 'quiz' && currentQuestion">
    <!-- Question chrome -->
    <div class="topic-badge">{{ currentQuestion.topic }}</div>
    <div class="question-num">Question {{ current + 1 }} of {{ activeQuestions.length }}</div>
    <div class="question-text">{{ currentQuestion.q }}</div>

    <!-- Type badge -->
    <span v-if="questionType === 'multi'" class="type-badge multi-badge">
      <i class="fa-solid fa-square-check"></i> Select all that apply
    </span>
    <span v-if="questionType === 'match'" class="type-badge match-badge">
      <i class="fa-solid fa-link"></i> Match each term
    </span>
    <span v-if="questionType === 'input'" class="type-badge input-badge">
      <i class="fa-solid fa-pencil"></i> Type your answer
    </span>

    <!-- ─── SINGLE / MULTI OPTIONS ─── -->
    <div v-if="questionType === 'single' || questionType === 'multi'" class="options">
      <button v-for="(opt, idx) in shuffledOpts" :key="idx"
        :class="optionClass(idx)"
        :disabled="answered && (questionType === 'single' || questionType === 'multi')"
        @click="questionType === 'single' ? chooseSingle(idx) : toggleMulti(idx)">
        <span class="letter">{{ letterLabel(idx) }}</span>{{ opt }}
      </button>
    </div>

    <!-- ─── MATCH LAYOUT ─── -->
    <div v-if="questionType === 'match'">
      <div class="match-container">
        <div class="match-left">
          <div v-for="(pair, i) in currentQuestion.pairs" :key="i" class="match-row">
            <select class="match-select"
              :class="{
                'match-duplicate': !answered && matchDuplicates.has(matchSelections[i]),
                'match-correct': answered && isMatchCorrect(i),
                'match-wrong': answered && isMatchCorrect(i) === false
              }"
              :disabled="answered"
              v-model="matchSelections[i]">
              <option value="">\u2014</option>
              <option v-for="n in currentQuestion.pairs.length" :key="n" :value="String(n)">{{ n }}</option>
            </select>
            <span class="match-term">{{ pair.term }}</span>
            <span v-if="answered && !isMatchCorrect(i)" class="match-hint">\u2192 {{ matchCorrectNum(i) }}</span>
          </div>
        </div>
        <div class="match-right">
          <div v-for="(desc, i) in matchDescs" :key="i" class="match-desc-row">
            <span class="match-num">{{ i + 1 }}.</span>
            <span>{{ desc }}</span>
          </div>
        </div>
      </div>
      <!-- v-show keeps height reserved so card doesn't shift when status appears/disappears -->
      <div v-show="!answered && matchStatusText" class="match-status" :class="{ valid: matchValid, invalid: !matchValid }">
        {{ matchStatusText }}
      </div>
    </div>

    <!-- ─── INPUT ─── -->
    <div v-if="questionType === 'input'" class="input-wrap">
      <input type="text" class="ans-input" placeholder="Your answer..."
        v-model="inputValue" :disabled="answered"
        :class="{ 'input-correct': answered && feedbackCorrect, 'input-wrong': answered && !feedbackCorrect }"
        @keydown.enter="submitInput" />
    </div>

    <!-- feedback: visibility:hidden keeps full layout space reserved, no card jump -->
    <div class="feedback" :class="feedbackCorrect ? 'correct' : 'wrong'"
      :style="{ visibility: answered ? 'visible' : 'hidden' }">
      <template v-if="feedbackCorrect">
        <i class="fa-solid fa-circle-check"></i> Correct! {{ currentQuestion.exp }}
      </template>
      <template v-else>
        <i class="fa-solid fa-circle-xmark"></i> Not quite.
        <template v-if="questionType === 'input'">
          The correct answer is <strong>{{ (Array.isArray(currentQuestion.ans) ? currentQuestion.ans : [currentQuestion.ans]).join(' or ') }}</strong>.
        </template>
        {{ currentQuestion.exp }}
      </template>
    </div>

    <!-- Submit (multi / match / input) -->
    <button v-if="questionType === 'multi' && !answered" class="submit-btn" @click="submitMulti">
      <i class="fa-solid fa-paper-plane"></i> Submit Answer
    </button>
    <button v-if="questionType === 'match' && !answered" class="submit-btn"
      :disabled="!matchValid" @click="submitMatch">
      <i class="fa-solid fa-paper-plane"></i> Submit Answer
    </button>
    <button v-if="questionType === 'input' && !answered" class="submit-btn" @click="submitInput">
      <i class="fa-solid fa-paper-plane"></i> Submit Answer
    </button>

    <!-- Next -->
    <button v-if="answered" class="next-btn" @click="nextQuestion">
      <template v-if="isLastQuestion"><i class="fa-solid fa-flag-checkered"></i> See Results</template>
      <template v-else>Next Question <i class="fa-solid fa-arrow-right"></i></template>
    </button>

    <!-- Shortcut strip -->
    <div class="shortcut-strip">
      <button @click="showShortcuts = true">
        <i class="fa-solid fa-keyboard"></i> Press <kbd>?</kbd> for shortcuts
      </button>
    </div>
  </div>

  <!-- ═══════════════════ RESULTS SCREEN ═══════════════════ -->
  <div v-if="screen === 'results'">
    <div class="score-card">
      <h2><i :class="resultIcon"></i> Quiz Complete!</h2>
      <div class="score-big">{{ resultPct }}%</div>
      <div class="score-label">{{ resultMsg }} You got {{ score }} out of {{ activeQuestions.length }} correct.</div>
      <div class="stats-row">
        <div class="stat-box correct-stat"><div class="sv">{{ score }}</div><div class="sl">Correct</div></div>
        <div class="stat-box wrong-stat"><div class="sv">{{ activeQuestions.length - score }}</div><div class="sl">Incorrect</div></div>
        <div class="stat-box"><div class="sv">{{ resultPct }}%</div><div class="sl">Score</div></div>
      </div>
      <div class="score-breakdown">
        <h3><i class="fa-solid fa-chart-bar"></i> BREAKDOWN BY TOPIC</h3>
        <div v-for="([k, v]) in topicBreakdown" :key="k" class="topic-score">
          <span class="ts-name">{{ k }}</span>
          <span class="ts-val">{{ v.correct }}/{{ v.total }}</span>
        </div>
      </div>
      <button class="restart-btn" @click="goToReview">
        <i class="fa-solid fa-pen-to-square"></i> Review Answers
      </button>
      <button class="restart-btn" @click="goToTopics" style="margin-top:8px">
        <i class="fa-solid fa-arrow-left"></i> Back to Topics
      </button>
    </div>
  </div>

  <!-- ═══════════════════ REVIEW SCREEN ═══════════════════ -->
  <div v-if="screen === 'review'">
    <div class="review-header">
      <h2><i class="fa-solid fa-pen-to-square"></i> Answer Review</h2>
      <p>{{ userAnswers.length }} answered
        <template v-if="activeQuestions.length - userAnswers.length > 0">&middot; {{ activeQuestions.length - userAnswers.length }} skipped</template>
        &middot; {{ score }} correct
      </p>
    </div>

    <!-- Dot grid -->
    <div class="review-dots">
      <button v-for="(q, idx) in activeQuestions" :key="idx"
        :class="dotClass(idx)"
        @click="setReviewPage(idx)">
        {{ idx + 1 }}
      </button>
    </div>

    <!-- Detail panel -->
    <div v-if="reviewQuestion" class="review-detail-panel">
      <div class="review-nav-row">
        <button class="review-nav-btn" :disabled="reviewPage === 0" @click="reviewPrev">
          <i class="fa-solid fa-arrow-left"></i> Prev
        </button>
        <span class="review-page-num">{{ reviewPage + 1 }} / {{ activeQuestions.length }}</span>
        <button class="review-nav-btn" :disabled="reviewPage === activeQuestions.length - 1" @click="reviewNext">
          Next <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- Badge -->
      <template v-if="!reviewAnswer">
        <span class="review-badge skipped"><i class="fa-solid fa-forward-step"></i> Skipped</span>
      </template>
      <template v-else-if="reviewAnswer.isCorrect">
        <span class="review-badge correct"><i class="fa-solid fa-circle-check"></i> Correct</span>
      </template>
      <template v-else>
        <span class="review-badge wrong"><i class="fa-solid fa-circle-xmark"></i> Wrong</span>
      </template>

      <div class="review-meta">{{ reviewQuestion.topic }} &mdash; Q{{ reviewPage + 1 }}</div>
      <div class="review-q">{{ reviewQuestion.q }}</div>

      <template v-if="reviewAnswer">
        <div v-if="reviewAnswer.isCorrect" class="review-answer correct-answer">
          <i class="fa-solid fa-circle-check"></i> Your answer: {{ reviewAnswer.givenLabel }}
        </div>
        <template v-else>
          <div class="review-answer wrong-answer">
            <i class="fa-solid fa-circle-xmark"></i> Your answer: {{ reviewAnswer.givenLabel }}
          </div>
          <div class="review-answer correct-answer">
            <i class="fa-solid fa-circle-check"></i> Correct answer: {{ reviewAnswer.correctLabel }}
          </div>
        </template>
      </template>

      <div class="review-exp"><i class="fa-solid fa-lightbulb"></i> {{ reviewQuestion.exp }}</div>
    </div>

    <button class="review-back-btn" @click="goToResults">
      <i class="fa-solid fa-arrow-left"></i> Back to Results
    </button>
  </div>

  <!-- ═══════════════════ SHORTCUT OVERLAY ═══════════════════ -->
  <div v-if="showShortcuts" class="shortcut-overlay" @click.self="showShortcuts = false">
    <div class="shortcut-card">
      <h3><i class="fa-solid fa-keyboard"></i> Keyboard Shortcuts</h3>
      <div class="shortcut-columns">
        <div class="shortcut-section">
          <h4>Quiz</h4>
          <div class="shortcut-row"><kbd>A</kbd>-<kbd>Z</kbd> Select option</div>
          <div class="shortcut-row"><kbd>1</kbd>-<kbd>9</kbd> Select by number</div>
          <div class="shortcut-row"><kbd>Enter</kbd> Submit / Next</div>
          <div class="shortcut-row"><kbd>\u2190</kbd> Previous question</div>
          <div class="shortcut-row"><kbd>\u2192</kbd> Next (if answered)</div>
        </div>
        <div class="shortcut-section">
          <h4>Review</h4>
          <div class="shortcut-row"><kbd>\u2190</kbd> Previous question</div>
          <div class="shortcut-row"><kbd>\u2192</kbd> Next question</div>
          <div class="shortcut-row"><kbd>Esc</kbd> Back to results</div>
        </div>
      </div>
      <button class="shortcut-close" @click="showShortcuts = false">Close <kbd>?</kbd></button>
    </div>
  </div>
</div>
`
}

createApp(App).mount('#app')
