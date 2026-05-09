const timeDisplay = document.getElementById('timeDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsed = 0;
let running = false;
let lapCount = 0;

function formatTime(ms) {
  const total = Math.floor(ms);
  const hours = String(Math.floor(total / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((total % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((total % 60000) / 1000)).padStart(2, '0');
  const millis = String(total % 1000).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${millis}`;
}

function updateTime() {
  const now = performance.now();
  timeDisplay.textContent = formatTime(elapsed + (running ? now - startTime : 0));
  if (running) requestAnimationFrame(updateTime);
}

function startPause() {
  if (running) {
    elapsed += performance.now() - startTime;
    running = false;
    startPauseBtn.textContent = 'Start';
  } else {
    startTime = performance.now();
    running = true;
    startPauseBtn.textContent = 'Pause';
    requestAnimationFrame(updateTime);
  }
  lapBtn.disabled = !running && elapsed === 0;
  resetBtn.disabled = elapsed === 0 && !running;
}

function reset() {
  running = false;
  elapsed = 0;
  lapCount = 0;
  timeDisplay.textContent = '00:00:00.000';
  lapsList.innerHTML = '';
  startPauseBtn.textContent = 'Start';
  lapBtn.disabled = true;
  resetBtn.disabled = true;
}

function lap() {
  if (!running && elapsed === 0) return;
  lapCount += 1;
  const time = formatTime(elapsed + (running ? performance.now() - startTime : 0));
  const item = document.createElement('li');
  item.className = 'lap-item';
  item.textContent = `Lap ${lapCount}: ${time}`;
  lapsList.prepend(item);
}

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);
resetBtn.disabled = true;
lapBtn.disabled = true;
