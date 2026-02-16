// Pomodoro Pet - robust version (buttons always wired)

document.addEventListener("DOMContentLoaded", () => {
  console.log("script.v6.js loaded ✅");

  const timeEl = document.getElementById("time");
  const petEl = document.getElementById("petMsg");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const resetBtn = document.getElementById("reset");

  // どれか欠けてたら、ここで止めて分かるようにする
  const missing = [];
  if (!timeEl) missing.push("#time");
  if (!petEl) missing.push("#petMsg");
  if (!startBtn) missing.push("#start");
  if (!stopBtn) missing.push("#stop");
  if (!resetBtn) missing.push("#reset");

  if (missing.length) {
    console.error("DOMが見つからない:", missing.join(", "));
    alert("HTMLのidが合ってないかも: " + missing.join(", "));
    return;
  }

  const POMODORO_SECONDS = 25 * 60;
  let remaining = POMODORO_SECONDS;

  let timerId = null;
  let endAtMs = null; // 動作中は数値、停止中はnull

  function setPetState(state) {
    document.body.classList.remove("is-idle", "is-focus", "is-done");
    document.body.classList.add(state);
  }

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function setButtons(running) {
    startBtn.disabled = running;
    stopBtn.disabled = !running;
  }

  function render() {
    timeEl.textContent = format(remaining);

    const running = endAtMs !== null;

    if (!running && remaining === POMODORO_SECONDS) {
      petEl.textContent = "まってるよ";
      setPetState("is-idle");
    } else if (running) {
      petEl.textContent = "みまもり中…";
      setPetState("is-focus");
    } else if (!running && remaining === 0) {
      petEl.textContent = "おつかれさま！";
      setPetState("is-done");
    } else {
      petEl.textContent = "ひとやすみしよ";
      setPetState("is-idle");
    }

    setButtons(running);
  }

  function tick() {
    if (endAtMs === null) return;

    const now = Date.now();
    const secLeft = Math.ceil((endAtMs - now) / 1000);
    remaining = Math.max(0, secLeft);

    if (remaining === 0) {
      stop();
      return;
    }
    render();
  }

  function start() {
    console.log("start clicked");
    if (endAtMs !== null) return;

    if (remaining === 0) remaining = POMODORO_SECONDS;

    endAtMs = Date.now() + remaining * 1000;
    setButtons(true);
    render();

    // 念のため二重起動防止
    if (timerId) clearInterval(timerId);
    timerId = setInterval(tick, 250);
  }

  function stop() {
    console.log("stop clicked");
    if (endAtMs === null) return;

    endAtMs = null;
    if (timerId) clearInterval(timerId);
    timerId = null;

    render();
  }

  function reset() {
    console.log("reset clicked");
    stop();
    remaining = POMODORO_SECONDS;
    render();
  }

  // クリックが確実に拾えてるか確認しやすいようにログつき
  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
  resetBtn.addEventListener("click", reset);

  render();
});
