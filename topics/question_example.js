// topics/topic1.js
// ✏️ EDIT: Replace with your own questions.
//
// ── Question type reference ──────────────────────────────────────────────────
//
// SINGLE-ANSWER   (default — no type field needed)
//   ans: 2                        ← index of correct option (0-based)
//
// MULTI-SELECT    (no type field needed)
//   ans: [0, 2]                   ← array of ALL correct indices
//
// MATCHING        type: "match"
//   pairs: [ { term: "...", match: "..." }, ... ]
//   — descriptions on the right are auto-shuffled and numbered
//   — scoring is all-or-nothing
//
// INPUT           type: "input"
//   ans: "42"                     ← string (case-insensitive, trimmed)
//   ans: ["42", "forty-two"]      ← array = multiple accepted answers
//
// ─────────────────────────────────────────────────────────────────────────────

window.__QUIZ_QUESTIONS__ = window.__QUIZ_QUESTIONS__ || [];
window.__QUIZ_QUESTIONS__.push(

  // ── Single-answer ──────────────────────────────────────────────────────────
  {
    topic: "Topic 1: Example",
    q: "What is 2 + 2?",
    opts: ["3", "4", "5", "6"],
    ans: 1,
    exp: "2 + 2 equals 4."
  },

  // ── Multi-select ───────────────────────────────────────────────────────────
  {
    topic: "Topic 1: Example",
    q: "Which of the following are prime numbers?",
    opts: ["2", "4", "7", "9"],
    ans: [0, 2],
    exp: "2 and 7 are prime. 4 = 2×2 and 9 = 3×3."
  },

  // ── Matching ───────────────────────────────────────────────────────────────
  {
    topic: "Topic 1: Example",
    type: "match",
    q: "Match each system type to its most appropriate description.",
    pairs: [
      { term: "Real-time Systems",              match: "focus on time constraints" },
      { term: "Embedded Systems",               match: "not necessarily connected" },
      { term: "Cyber-Physical Systems",         match: "focus on interaction between physical and cyber systems" },
      { term: "Pervasive/Ubiquitous Computing", match: "focus on anytime/anywhere computing" },
    ],
    exp: "Real-time → time constraints; Embedded → not necessarily connected; Cyber-Physical → physical/cyber interaction; Pervasive → anytime/anywhere."
  },

  // ── Input (number) ─────────────────────────────────────────────────────────
  {
    topic: "Topic 1: Example",
    type: "input",
    q: "How many sides does a hexagon have?",
    ans: ["6", "six"],
    exp: "A hexagon has 6 sides."
  },

  // ── Input (text) ───────────────────────────────────────────────────────────
  {
    topic: "Topic 1: Example",
    type: "input",
    q: "What keyword in Python is used to define a function?",
    ans: "def",
    exp: "Python uses the 'def' keyword to define a function."
  },

);
