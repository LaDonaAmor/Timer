// elements
const hoursDisplay = document.getElementById("hours");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const inputHours = document.getElementById("input-hours");
const inputMinutes = document.getElementById("input-minutes");
const inputSeconds = document.getElementById("input-seconds");
const setButton = document.getElementById("set-time-btn");

const playButton = document.querySelector(".play");
const pauseButton = document.querySelector(".pause");
const stopButton = document.querySelector(".stop");

const circle = document.querySelector(".progress-ring__circle");

// circle geometry
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

// initialize dasharray and offset (important)
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

// state
let totalSeconds = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isPaused = false;

// helper: set progress percent (0..100)
function setProgress(percent) {
  // clamp percent
  percent = Math.max(0, Math.min(100, Number(percent) || 0));
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = String(offset);
}

// helper: update text display
function updateDisplay() {
  const hrs = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  hoursDisplay.textContent = String(hrs).padStart(2, "0");
  minutesDisplay.textContent = String(mins).padStart(2, "0");
  secondsDisplay.textContent = String(secs).padStart(2, "0");
}

// set action
setButton.addEventListener("click", () => {
  const h = Math.max(0, parseInt(inputHours.value, 10) || 0);
  const m = Math.max(0, parseInt(inputMinutes.value, 10) || 0);
  const s = Math.max(0, parseInt(inputSeconds.value, 10) || 0);
  totalSeconds = h * 3600 + m * 60 + s;
  remainingSeconds = totalSeconds;

  // initialize UI
  updateDisplay();
  setProgress(0);

  // clear any running timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
  }
});

// play / start
playButton.addEventListener("click", () => {
  // if nothing set, do nothing
  if (!totalSeconds || totalSeconds <= 0) return;

  // if already running, ignore
  if (timerInterval && !isPaused) return;

  isPaused = false;

  // ensure remainingSeconds is set (if it's at zero but totalSeconds > 0, reset)
  if (remainingSeconds <= 0) remainingSeconds = totalSeconds;

  // clear old interval if any
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    if (!isPaused && remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();

      // avoid division by zero
      if (totalSeconds > 0) {
        const percent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        setProgress(percent);
      } else {
        setProgress(0);
      }
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      // finalize UI
      updateDisplay();
      setProgress(100);
      // notify user
      try { new Audio().play().catch(()=>{}); } catch(e){}
      alert("⏰ Time's up!");
    }
  }, 1000);
});

// pause
pauseButton.addEventListener("click", () => {
  if (!timerInterval) return;
  isPaused = !isPaused; // toggle pause/resume on same button if desired
  // optional: change pause button icon here
});

// stop / reset
stopButton.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  // reset remaining seconds to total and UI
  remainingSeconds = totalSeconds;
  updateDisplay();
  setProgress(0);
  isPaused = false;
});
