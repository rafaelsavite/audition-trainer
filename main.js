let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let feedback = document.getElementById("feedback");

let barraWidth = 400;
let bolinhaWidth = 30;
let duration = 0;

let inputEnabled = true; // Controla se o espaço pode ser usado nesta rodada
let spacePressedThisRound = false; // Garante que só aperte uma vez
let perfectCount = 0;

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  inputEnabled = true;
  perfectCount = 0;
  updateUIState();

  intervalId = setInterval(() => {
    // Alterna se o espaço estará ativado ou não
    inputEnabled = !inputEnabled;
    spacePressedThisRound = false; // Permite novo espaço a cada rodada
    updateUIState();

    synth.triggerAttackRelease("C2", "8n");
    zona.style.animation = "pulse 0.4s ease";
    setTimeout(() => (zona.style.animation = "none"), 400);

    animateBolinha();
  }, duration);
}

function updateUIState() {
  barra.style.opacity = inputEnabled ? "1" : "0.6";
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

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && inputEnabled && !spacePressedThisRound) {
    spacePressedThisRound = true; // Bloqueia outros espaços nessa rodada

    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
    const zonaStart = 280;
    const zonaWidth = 70;
    const zonaCenter = zonaStart + zonaWidth / 2;

    const diff = Math.abs(bolinhaCenter - zonaCenter);

    let result;

    if (diff < 15) {
      result = "💯 PERFECT";
      perfectCount++;
      feedback.textContent = `${result} x${perfectCount}`;
    } else if (diff < 35) {
      result = "🔥 GREAT";
      perfectCount = 0;
      feedback.textContent = result;
    } else if (diff < 55) {
      result = "😐 COOL";
      perfectCount = 0;
      feedback.textContent = result;
    } else if (diff < 80) {
      result = "❌ BAD";
      perfectCount = 0;
      feedback.textContent = result;
    } else {
      result = "💀 MISS";
      perfectCount = 0;
      feedback.textContent = result;
    }
  }
});

document.getElementById("startBtn").addEventListener("click", startTraining);
