// Variáveis iniciais
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

// Criar efeitos globais
const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.3 }).toDestination();
const distortion = new Tone.Distortion(0.3).toDestination();

// SINTETIZADORES COMBINADOS POR RESULTADO

// PERFECT - synth + ruído branco para impacto
const perfectSynth = new Tone.MonoSynth({
  oscillator: { type: "sawtooth" },
  envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
  filterEnvelope: { attack: 0.001, decay: 0.2, baseFrequency: 1200, octaves: 3 }
});
const perfectNoise = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
});
// conectar ao efeito
perfectSynth.chain(distortion, reverb);
perfectNoise.chain(distortion, reverb);

function playPerfect() {
  perfectSynth.triggerAttackRelease("C5", "16n");
  perfectNoise.triggerAttackRelease("16n");
}

// GREAT - synth suave com reverb
const greatSynth = new Tone.MonoSynth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.15 },
  filterEnvelope: { attack: 0.002, decay: 0.25, baseFrequency: 800, octaves: 2 }
});
greatSynth.chain(reverb);

function playGreat() {
  greatSynth.triggerAttackRelease("E4", "16n");
}

// COOL - synth mais simples, sem ruído
const coolSynth = new Tone.MembraneSynth({
  pitchDecay: 0.1,
  octaves: 5,
  oscillator: { type: "triangle" },
  envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 }
}).toDestination();

function playCool() {
  coolSynth.triggerAttackRelease("G3", "16n");
}

// BAD - synth com timbre mais áspero e distorção leve
const badSynth = new Tone.MonoSynth({
  oscillator: { type: "square" },
  envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.2 },
  filterEnvelope: { attack: 0.01, decay: 0.3, baseFrequency: 400, octaves: 1 }
});
badSynth.chain(distortion);

function playBad() {
  badSynth.triggerAttackRelease("D3", "16n");
}

// MISS - som curto, baixo e com ruído escuro
const missSynth = new Tone.MonoSynth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.3 },
  filterEnvelope: { attack: 0.01, decay: 0.5, baseFrequency: 200, octaves: 1 }
});
const missNoise = new Tone.NoiseSynth({
  noise: { type: "brown" },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0 }
});
missSynth.chain(distortion);
missNoise.chain(distortion);

function playMiss() {
  missSynth.triggerAttackRelease("A2", "8n");
  missNoise.triggerAttackRelease("16n");
}

// Função para iniciar o treino
function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  intervalId = setInterval(() => {
    // Pode usar o som da batida padrão
    perfectSynth.triggerAttackRelease("C2", "8n");
    zona.style.animation = "pulse 0.4s ease";
    setTimeout(() => zona.style.animation = "none", 400);
    startTime = performance.now();
    animateBolinha();
  }, duration);
}

// Função para animar bolinha
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

// Evento para iniciar treino
document.getElementById("startBtn").addEventListener("click", startTraining);

// Evento para detectar espaço e tocar sons com impacto conforme resultado
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
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

    document.getElementById("feedback").textContent = result;

    // Tocar som baseado no resultado
    switch(result) {
      case "💯 PERFECT":
        playPerfect();
        break;
      case "🔥 GREAT":
        playGreat();
        break;
      case "😐 COOL":
        playCool();
        break;
      case "❌ BAD":
        playBad();
        break;
      case "💀 MISS":
        playMiss();
        break;
    }
  }
});
