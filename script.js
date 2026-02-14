const timeEl = document.getElementById("time");
const petEl = document.getElementById("petMsg").textContent = "まってるよ";
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

function setPetState(state) {
  document.body.classList.remove("is-idle", "is-focus", "is-done");
  document.body.classList.add(state);
}


const POMODORO_SECONDS = 25 * 60;

let remaining = POMODORO_SECONDS;
let timerId = null;

function format(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function render() {
  timeEl.textContent = format(remaining);

  if (timerId === null && remaining === POMODORO_SECONDS) {
    petEl.textContent = "まってるよ";
  } else if (timerId !== null) {
    petEl.textContent = "みまもり中…";
  } else if (timerId === null && remaining === 0) {
    petEl.textContent = "おつかれさま！";
  } else {
    petEl.textContent = "ひとやすみしよ";
  }
}

function start() {
  if (timerId !== null) return;

  startBtn.disabled = true;
  stopBtn.disabled = false;

  timerId = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      stop(); // 止める
    }
    render();
  }, 1000);

  render();
}

function stop() {
  if (timerId === null) return;

  clearInterval(timerId);
  timerId = null;

  startBtn.disabled = false;
  stopBtn.disabled = true;

  render();
}

function reset() {
  stop();
  remaining = POMODORO_SECONDS;
  render();
}

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);

render();
