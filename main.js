let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let feedback = document.getElementById("feedback");

let barraWidth = 400;
let bolinhaWidth = 30;
let startTime = 0;
let duration = 0;

let isActive = true; // controla se a rodada está ativa ou em pausa
let perfectCount = 0; // contador de perfects seguidos

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  isActive = true;
  perfectCount = 0;
  updateUIState();

  intervalId = setInterval(() => {
    // alterna estado a cada batida
    isActive = !isActive;
    updateUIState();

    if (isActive) {
      synth.triggerAttackRelease("C2", "8n");
      zona.style.animation = "pulse 0.4s ease";
      setTimeout(() => (zona.style.animation = "none"), 400);
      startTime = performance.now();
      animateBolinha();
    } else {
      // pode colocar algo para indicar pausa se quiser
      cancelAnimationFrame(animationFrameId); // para a bolinha
      bolinha.style.left = "0px"; // reset posição bolinha
      feedback.textContent = ""; // limpa feedback
    }
  }, duration);
}

function updateUIState() {
  if (isActive) {
    barra.style.opacity = "1";
  } else {
    barra.style.opacity = "0.6";
  }
}

function animateBolinha() {
  const start = performance.now();

  function frame(now) {
    let elapsed = now - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    const x = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${x}px`;

    if (percent < 1 && isActive) {
      animationFrameId = requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// Evento para checar tecla espaço
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && isActive) {
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
