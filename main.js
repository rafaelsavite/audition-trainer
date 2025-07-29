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

// Função para iniciar o treino
function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value); // Pega bpm do input
  duration = 60000 / bpm; // Converte bpm para duração em milissegundos

  Tone.start(); // Inicializa o Tone.js para garantir som
  const synth = new Tone.MembraneSynth().toDestination(); // Cria sintetizador para batida

  clearInterval(intervalId); // Para intervalo anterior
  cancelAnimationFrame(animationFrameId); // Para animação anterior

  // Inicia o loop das batidas
  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n"); // Toca som da batida
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

// Evento que detecta tecla pressionada para checar timing
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { // Se for barra de espaço
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2; // Centro da bolinha
    const zonaStart = 280; // Left da barra azul (px)
    const zonaWidth = 190; // Largura da barra azul (px)
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
  }
});
