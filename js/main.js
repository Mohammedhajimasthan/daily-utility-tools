/* =========================
   THEME TOGGLE (GLOBAL)
========================= */
const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

if (toggle) {
  toggle.onclick = () => {
    const light = root.classList.toggle("light");
    localStorage.setItem("theme", light ? "light" : "dark");
  };

  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light");
  }
}

/* =========================
   SCROLL REVEAL (GLOBAL)
========================= */
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* =========================
   CALCULATOR
========================= */
function calculateExpression() {
  const input = document.getElementById("calcInput");
  const output = document.getElementById("calcResult");
  if (!input || !output) return;

  try {
    output.innerText = eval(input.value);
  } catch {
    output.innerText = "Invalid Expression";
  }
}

/* =========================
   PASSWORD GENERATOR
========================= */
function generatePassword() {
  const out = document.getElementById("passwordOutput");
  if (!out) return;

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%&";
  let pwd = "";
  for (let i = 0; i < 12; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  out.innerText = pwd;
}

/* =========================
   STOPWATCH
========================= */
let stopwatchTime = 0;
let stopwatchInterval = null;

function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    const el = document.getElementById("stopwatchTime");
    if (el) el.innerText = stopwatchTime;
  }, 1000);
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  const el = document.getElementById("stopwatchTime");
  if (el) el.innerText = 0;
}

/* =========================
   COUNTDOWN TIMER
========================= */
let timerInterval = null;

function startTimer() {
  const input = document.getElementById("timerSeconds");
  const out = document.getElementById("timerOutput");
  if (!input || !out) return;

  let seconds = parseInt(input.value, 10);
  if (isNaN(seconds) || seconds <= 0) {
    out.innerText = "Enter valid seconds";
    return;
  }

  clearInterval(timerInterval);
  out.innerText = seconds;

  timerInterval = setInterval(() => {
    seconds--;
    out.innerText = seconds;
    if (seconds <= 0) clearInterval(timerInterval);
  }, 1000);
}

/* =========================
   WORD COUNTER
========================= */
function countWords() {
  const text = document.getElementById("wordInput");
  const res = document.getElementById("wordResult");
  if (!text || !res) return;

  const value = text.value;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  res.innerText = `Words: ${words} | Characters: ${value.length}`;
}

/* =========================
   AGE CALCULATOR
========================= */
function calculateAge() {
  const dobInput = document.getElementById("dob");
  const out = document.getElementById("ageOutput");
  if (!dobInput || !out) return;

  const dob = new Date(dobInput.value);
  if (isNaN(dob.getTime())) {
    out.innerText = "Select valid date";
    return;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  out.innerText = `${age} Years`;
}

/* =========================
   BMI CALCULATOR
========================= */
function calculateBMI() {
  const w = document.getElementById("bmiWeight");
  const h = document.getElementById("bmiHeight");
  const out = document.getElementById("bmiOutput");
  if (!w || !h || !out) return;

  const weight = parseFloat(w.value);
  const height = parseFloat(h.value);

  if (weight <= 0 || height <= 0) {
    out.innerText = "Enter valid values";
    return;
  }

  const bmi = weight / (height * height);
  out.innerText = bmi.toFixed(2);
}

/* =========================
   UNIT CONVERTER (KM → M)
========================= */
function convertKmToM() {
  const km = document.getElementById("kmInput");
  const out = document.getElementById("kmOutput");
  if (!km || !out) return;

  const val = parseFloat(km.value);
  if (isNaN(val)) {
    out.innerText = "Enter valid number";
    return;
  }
  out.innerText = `${val * 1000} meters`;
}

/* =========================
   RANDOM NUMBER
========================= */
function generateRandom() {
  const minEl = document.getElementById("randMin");
  const maxEl = document.getElementById("randMax");
  const out = document.getElementById("randOutput");
  if (!minEl || !maxEl || !out) return;

  const min = parseInt(minEl.value, 10);
  const max = parseInt(maxEl.value, 10);

  if (isNaN(min) || isNaN(max) || min > max) {
    out.innerText = "Invalid range";
    return;
  }

  out.innerText =
    Math.floor(Math.random() * (max - min + 1)) + min;
}
