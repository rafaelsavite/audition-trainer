// Variáveis iniciais e elementos DOM
let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let barraWidth = 400;
let bolinhaWidth = 30;
let startTime = 0;
let duration = 0;

let roundActive = true; // Controla se a rodada está ativa (tecla funciona)
let perfectStreak = 0; // Contador de perfects seguidos

// Criando sintetizadores para sons de feedback
const synthPerfect = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 1 }
}).toDestination();

const synthGreat = new Tone.MembraneSynth({
  pitchDecay: 0.07,
  octaves: 8,
  oscillator: { type: "triangle" },
  envelope: { attack: 0.002, decay: 0.12, sustain: 0, release: 1 }
}).toDestination();

const synthCool = new Tone.MembraneSynth({
  pitchDecay: 0.1,
  octaves: 5,
  oscillator: { type: "triangle" },
  envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 1 }
}).toDestination();

const synthBad = new Tone.MembraneSynth({
  pitchDecay: 0.2,
  octaves: 3,
  oscillator: { type: "square" },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 1 }
}).toDestination();

const synthMiss = new Tone.MembraneSynth({
  pitchDecay: 0.3,
  octaves: 2,
  oscillator: { type: "sawtooth" },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 1 }
}).toDestination();

// Função que inicia o treino
function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  roundActive = true;
  perfectStreak = 0; // Reseta streak quando começa treino

  intervalId = setInterval(() => {
    synthPerfect.triggerAttackRelease("C2", "8n");
    zona.style.animation = "pulse 0.4s ease";
    setTimeout(() => zona.style.animation = "none", 400);
    startTime = performance.now();
    animateBolinha();

    roundActive = !roundActive;

    if (roundActive) {
      barra.style.opacity = "1";
      zona.style.opacity = "1";
      bolinha.style.opacity = "1";
    } else {
      barra.style.opacity = "0.7";
      zona.style.opacity = "0.7";
      bolinha.style.opacity = "0.7";
    }
  }, duration);
}

// Função que anima a bolinha
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

// Evento para iniciar o treino
document.getElementById("startBtn").addEventListener("click", startTraining);

// Evento para detectar tecla espaço e dar feedback
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && roundActive) {
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
    const zonaStart = 280;
    const zonaWidth = 70;
    const zonaCenter = zonaStart + zonaWidth / 2;

    const diff = Math.abs(bolinhaCenter - zonaCenter);

    let result;

    if (diff < 15) result = "💯 PERFECT";
    else if (diff < 35) result = "🔥 GREAT";
    else if (diff < 55) result = "😐 COOL";
    else if (diff < 80) result = "❌ BAD";
    else result = "💀 MISS";

    // Atualiza o contador de perfects seguidos
    if (result === "💯 PERFECT") {
      perfectStreak++;
    } else {
      perfectStreak = 0; // Reseta se não for perfect
    }

    // Monta texto do feedback, adicionando o contador se streak > 1
    let feedbackText = result;
    if (perfectStreak > 1) {
      feedbackText += ` x${perfectStreak}`;
    }

    document.getElementById("feedback").textContent = feedbackText;

    // Toca som conforme resultado
    switch(result) {
      case "💯 PERFECT":
        synthPerfect.triggerAttackRelease("C4", "16n");
        break;
      case "🔥 GREAT":
        synthGreat.triggerAttackRelease("E4", "16n");
        break;
      case "😐 COOL":
        synthCool.triggerAttackRelease("G3", "16n");
        break;
      case "❌ BAD":
        synthBad.triggerAttackRelease("D3", "16n");
        break;
      case "💀 MISS":
        synthMiss.triggerAttackRelease("A2", "16n");
        break;
    }
  }
});
