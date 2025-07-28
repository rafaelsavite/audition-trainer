let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let barraWidth = 500;
let bolinhaWidth = 30;
let startTime = 0;
let duration = 0;

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  // Piscar no BPM
  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n");
    zona.style.animation = "pulse 0.4s ease";
    setTimeout(() => zona.style.animation = "none", 400);
    startTime = performance.now();
    animateBolinha();
  }, duration);
}

function animateBolinha() {
  const start = performance.now();

  function frame(now) {
    let elapsed = now - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    const x = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${x}px`;

    if (percent < 1) {
      animationFrameId = requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const bolinhaCenter = bolinha.offsetLeft + bolinha.offsetWidth / 2;
    const zonaCenter = barra.offsetWidth * 0.75; // mesma referência da bolinha
    const diff = Math.abs(bolinhaCenter - zonaCenter);

    let result;
    if (diff < 10) result = "💯 PERFECT";
    else if (diff < 25) result = "🔥 GREAT";
    else if (diff < 45) result = "😐 COOL";
    else if (diff < 65) result = "❌ BAD";
    else result = "💀 MISS";

    document.getElementById("feedback").textContent = result;
  }
});
