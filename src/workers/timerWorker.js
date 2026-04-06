let isRunning = false;

self.onmessage = function (event) {
  if (isRunning) return;

  const state = event.data;
  const { activeTask, secondsRemaining } = state;

  if (!activeTask) return;

  isRunning = true;

  const endDate = activeTask.startDate + secondsRemaining * 1000;

  function tick() {
    const countDownSeconds = Math.max(
      0,
      Math.ceil((endDate - Date.now()) / 1000),
    );

    self.postMessage(countDownSeconds);

    if (countDownSeconds > 0) {
      setTimeout(tick, 1000);
    }
  }

  tick();
};
