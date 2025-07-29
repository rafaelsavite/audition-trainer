// Variáveis iniciais
let bpm = 120; // Batidas por minuto iniciais
let intervalId; // ID do intervalo para controle do loop
let animationFrameId; // ID da animação da bolinha
let bolinha = document.getElementById("bolinha"); // Elemento bolinha
let zona = document.getElementById("zona-perfect"); // Elemento zona perfect
let barra = document.getElementById("barra"); // Elemento barra principal
let barraWidth = 400; // Largura total da barra (px)
let bolinhaWidth = 30; // Largura da bolinha (px)
let startTime = 0; // Tempo início da animação
let duration = 0; // Duração de cada batida em ms

// Criar sintetizadores para cada tipo de resultado
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

// Função para iniciar o treino
function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value); // Pega bpm do input
  duration = 60000 / bpm; // Converte bpm para duração em milissegundos

  Tone.start(); // Inicializa o Tone.js para garantir som

  clearInterval(intervalId); // Para intervalo anterior
  cancelAnimationFrame(animationFrameId); // Para animação anterior

  // Inicia o loop das batidas
  intervalId = setInterval(() => {
    synthPerfect.triggerAttackRelease("C2", "8n"); // Toca som da batida
    zona.style.animation = "pulse 0.4s ease"; // Animação pulse na zona perfect
    setTimeout(() => zona.style.animation = "none", 400); // Remove animação para reiniciar no próximo ciclo
    startTime = performance.now(); // Registra tempo atual
    animateBolinha(); // Inicia animação da bolinha
  }, duration);
}

// Função que anima a bolinha da esquerda para direita na barra
function animateBolinha() {
  const start = performance.now(); // Marca início da animação

  // Função chamada a cada frame (~60fps)
  function frame(now) {
    let elapsed = now - start; // Tempo decorrido
    let percent = elapsed / duration; // Progresso da animação (0 a 1)
    if (percent > 1) percent = 1; // Limita a 100%

    const x = percent * (barraWidth - bolinhaWidth); // Calcula posição horizontal
    bolinha.style.left = `${x}px`; // Atualiza posição da bolinha

    if (percent < 1) {
      animationFrameId = requestAnimationFrame(frame); // Continua animando
    }
  }

  requestAnimationFrame(frame); // Começa animação
}

// Evento que inicia o treino ao clicar no botão
document.getElementById("startBtn").addEventListener("click", startTraining);

// Evento que detecta tecla pressionada para checar timing e tocar sons
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { // Se for barra de espaço
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2; // Centro da bolinha
    const zonaStart = 280; // Left da barra azul (px)
    const zonaWidth = 70; // Largura da barra azul (px)
    const zonaCenter = zonaStart + zonaWidth / 2; // Centro da zona perfect

    const diff = Math.abs(bolinhaCenter - zonaCenter); // Diferença entre bolinha e zona

    let result; // Variável resultado

    // Avalia precisão baseado na distância
    if (diff < 15) result = "💯 PERFECT";
    else if (diff < 35) result = "🔥 GREAT";
    else if (diff < 55) result = "😐 COOL";
    else if (diff < 80) result = "❌ BAD";
    else result = "💀 MISS";

    document.getElementById("feedback").textContent = result; // Mostra resultado

    // Tocar som correspondente
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
