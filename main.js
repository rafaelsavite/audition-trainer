let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let barraWidth = barra.offsetWidth;
let bolinhaWidth = bolinha.offsetWidth;
let duration = 0;

// Criando a barra vermelha dinamicamente dentro da barra principal
let redBar = document.getElementById("barra-vermelha");
if (!redBar) {
  redBar = document.createElement("div");
  redBar.id = "barra-vermelha";
  redBar.style.position = "absolute";
  redBar.style.top = "0";
  redBar.style.left = "0";
  redBar.style.height = "100%";
  redBar.style.width = "0%";
  redBar.style.background = "red";
  redBar.style.borderRadius = "15px 0 0 15px";
  redBar.style.zIndex = "3";
  barra.appendChild(redBar);
}

let redWidthPercent = 0;
let animationRunning = false;

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;
  barraWidth = barra.offsetWidth;
  bolinhaWidth = bolinha.offsetWidth;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  // Reinicia barra vermelha
  redWidthPercent = 0;

  // Começa a animação da barra vermelha
  if (!animationRunning) {
    animationRunning = true;
    animateRedBar();
  }

  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n");

    // Reinicia a animação para forçar o restart da pulsação
    zona.style.animation = "none";
    void zona.offsetWidth; // reflow

    const batidaDuracaoSegundos = 60 / bpm;
    zona.style.animation = `pulse ${batidaDuracaoSegundos}s ease`;

    setTimeout(() => zona.style.animation = "none", batidaDuracaoSegundos * 1000);

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

function animateRedBar() {
  // Cresce a barra vermelha proporcionalmente ao BPM e dura um ciclo completo igual a duração de uma batida
  const fps = 60;
  const intervalMs = 1000 / fps;
  const totalSteps = duration / intervalMs;
  const incrementPerStep = 75 / totalSteps; // 75% largura máxima da barra vermelha

  function step() {
    redWidthPercent += incrementPerStep;
    if (redWidthPercent > 75) {
      redWidthPercent = 0; // reinicia barra
    }
    redBar.style.width = redWidthPercent + "%";
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
    const zonaCenter = barraWidth * 0.75;
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
