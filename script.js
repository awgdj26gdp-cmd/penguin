console.log("script.js loaded ✅");
// Pomodoro Pet - safer & cleaner version

(() => {
  // ===== DOM取得（見つからなければここで終了） =====
  const timeEl = document.getElementById("time");
  const petEl = document.getElementById("petMsg");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const resetBtn = document.getElementById("reset");

  if (!timeEl || !petEl || !startBtn || !stopBtn || !resetBtn) {
    console.error("必要なDOM要素が見つかりません（idを確認してください）");
    return; // これ以上進むと落ちるので止める
  }

  // ===== 定数 =====
  const POMODORO_SECONDS = 25 * 60;

  // ===== 状態 =====
  let remaining = POMODORO_SECONDS;

  // setIntervalのズレを減らすために「終了予定時刻」を持つ
  let endAtMs = null; // nullなら停止中
  let timerId = null;

  // ===== 見た目状態（CSS用） =====
  function setPetState(state) {
    document.body.classList.remove("is-idle", "is-focus", "is-done");
    document.body.classList.add(state);
  }

  // ===== 表示用 =====
  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function setButtons({ running }) {
    startBtn.disabled = running;
    stopBtn.disabled = !running;
  }

  function render() {
    timeEl.textContent = format(remaining);

    const running = endAtMs !== null;

    if (!running && remaining === POMODORO_SECONDS) {
      // 初期状態
      petEl.textContent = "まってるよ";
      setPetState("is-idle");
    } else if (running) {
      // 集中中
      petEl.textContent = "みまもり中…";
      setPetState("is-focus");
    } else if (!running && remaining === 0) {
      // 完了
      petEl.textContent = "おつかれさま！";
      setPetState("is-done");
    } else {
      // 途中で止めた
      petEl.textContent = "ひとやすみしよ";
      setPetState("is-idle");
    }

    setButtons({ running });
  }

  // ===== タイマー制御 =====
  function tick() {
    if (endAtMs === null) return;

    const now = Date.now();
    const secLeft = Math.ceil((endAtMs - now) / 1000);
    remaining = Math.max(0, secLeft);

    if (remaining === 0) {
      stop(); // 自動停止
      return;
    }

    render();
  }

  function st
