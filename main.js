// Variáveis iniciais e elementos DOM
let bpm = 120; // Batidas por minuto
let intervalId; // Para controlar o setInterval principal
let animationFrameId; // Para controlar a animação da bolinha
let bolinha = document.getElementById("bolinha"); // Elemento da bolinha
let zona = document.getElementById("zona-perfect"); // Elemento da zona perfeita
let barra = document.getElementById("barra"); // Container da barra
let barraWidth = 400; // Largura total da barra em px
let bolinhaWidth = 30; // Largura da bolinha em px
let startTime = 0; // Tempo inicial da animação da bolinha
let duration = 0; // Duração de uma batida em ms

let roundActive = true; // Controla se a rodada está ativa (true) ou em modo espera (false)

// Criando sintetizadores para sons de feedback de cada resultado
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
  bpm = parseInt(document.getElementById("bpm").value); // Pega o bpm do input
  duration = 60000 / bpm; // Calcula duração de uma batida (ms)

  Tone.start(); // Inicializa o áudio

  clearInterval(intervalId); // Limpa intervalo anterior
  cancelAnimationFrame(animationFrameId); // Cancela animação anterior

  roundActive = true; // Começa com rodada ativa

  // Intervalo que dispara a batida e anima a bolinha conforme o bpm
  intervalId = setInterval(() => {
    // Toca som da batida (sempre)
    synthPerfect.triggerAttackRelease("C2", "8n");

    // Animação visual da zona perfeita
    zona.style.animation = "pulse 0.4s ease";
    setTimeout(() => zona.style.animation = "none", 400);

    // Inicia animação da bolinha
    startTime = performance.now();
    animateBolinha();

    // Alterna entre rodada ativa e pausa a cada batida
    roundActive = !roundActive;

    // Muda a opacidade da barra, zona e bolinha para indicar modo ativo ou pausa
    // Você pode alterar aqui o valor da opacidade para ajustar o efeito visual
    if (roundActive) {
      barra.style.opacity = "1"; // Totalmente visível (rodada ativa)
      zona.style.opacity = "1";
      bolinha.style.opacity = "1";
    } else {
      barra.style.opacity = "0.6"; // 60% visível (modo pausa)
      zona.style.opacity = "0.6";
      bolinha.style.opacity = "0.6";
    }
  }, duration);
}

// Função que anima a bolinha da esquerda para direita na barra
function animateBolinha() {
  const start = performance.now();

  function frame(now) {
    let elapsed = now - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    // Calcula a posição horizontal da bolinha na barra
    const x = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${x}px`;

    if (percent < 1) {
      animationFrameId = requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

// Evento para iniciar o treino no clique do botão
document.getElementById("startBtn").addEventListener("click", startTraining);

// Evento para detectar a tecla espaço
document.addEventListener("keydown", (e) => {
  // Só executa se rodada estiver ativa (roundActive == true)
  if (e.code === "Space" && roundActive) {
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;

    // Ajuste da zona azul - 70% para direita, largura 70px (você pode ajustar aqui também)
    const zonaStart = 280;
    const zonaWidth = 70;
    const zonaCenter = zonaStart + zonaWidth / 2;

    const diff = Math.abs(bolinhaCenter - zonaCenter);

    let result;

    // Define o feedback de acordo com a proximidade da bolinha com a zona perfeita
    if (diff < 15) result = "💯 PERFECT";
    else if (diff < 35) result = "🔥 GREAT";
    else if (diff < 55) result = "😐 COOL";
    else if (diff < 80) result = "❌ BAD";
    else result = "💀 MISS";

    // Exibe o feedback na tela
    document.getElementById("feedback").textContent = result;

    // Toca som de acordo com o resultado
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
