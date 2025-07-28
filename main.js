let bpm = 120;
let beatInterval;
let bolinha;
let containerWidth = 500;
let lastBeatTime = 0;
let currentX = 0;

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  const intervalMs = 60000 / bpm;

  const synth = new Tone.MembraneSynth().toDestination();
  Tone.start();
  clearInterval(beatInterval);

  bolinha = document.getElementById("bolinha");

  currentX = 0;
  bolinha.style.left = "0px";

  beatInterval = setInterval(() => {
    lastBeatTime = performance.now();
    currentX = 0;
    animateBolinha(intervalMs);
    synth.triggerAttackRelease("C2", "8n");
  }, intervalMs);
}

function animateBolinha(duration) {
  const start = performance.now();

  function move(timestamp) {
    let elapsed = timestamp - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    const x = percent * (containerWidth - 20);
    currentX = x;
    bolinha.style.left = `${x}px`;

    if (percent < 1) requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const center = (containerWidth - 20) / 2;
    const diff = Math.abs(currentX - center);

    let feedback = "";
    if (diff < 5) feedback = "💯 PERFECT";
    else if (diff < 15) feedback = "🔥 GREAT";
    else if (diff < 30) feedback = "😐 COOL";
    else if (diff < 50) feedback = "❌ BAD";
    else feedback = "💀 MISS";

    document.getElementById("feedback").textContent = feedback;
  }
});
