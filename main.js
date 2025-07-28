let beatInterval;
let lastBeatTime = 0;

function startTraining() {
  const bpmInput = document.getElementById("bpm");
  const bpm = parseInt(bpmInput.value) || 120;
  const intervalMs = 60000 / bpm;

  clearInterval(beatInterval);
  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  beatInterval = setInterval(() => {
    lastBeatTime = performance.now();
    synth.triggerAttackRelease("C2", "8n");
    flashBeat();
  }, intervalMs);
}

function flashBeat() {
  const bar = document.getElementById("beat-bar");
  bar.style.transform = "scale(3)";
  setTimeout(() => {
    bar.style.transform = "scale(1)";
  }, 100);
}

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const now = performance.now();
    const diff = Math.abs(now - lastBeatTime);

    let result;
    if (diff < 50) result = "?? PERFECT";
    else if (diff < 100) result = "?? GREAT";
    else if (diff < 180) result = "?? BAD";
    else result = "? MISS";

    document.getElementById("feedback").textContent = result;
  }
});
