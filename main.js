let bpm = 120; // Define o número inicial de batidas por minuto (ritmo da música/treino)
let intervalId; // Guardará o ID do setInterval para poder parar o ciclo depois, evitando duplicação
let animationFrameId; // Guardará o ID do requestAnimationFrame para controlar a animação da bolinha
let bolinha = document.getElementById("bolinha"); // Seleciona o elemento HTML que representa a bolinha que se move na barra
let zona = document.getElementById("zona-perfect"); // Seleciona o elemento da "zona perfeita", onde o usuário deve apertar a tecla
let barra = document.getElementById("barra"); // Seleciona o container da barra onde a bolinha se movimenta
let barraWidth = 500; // Define a largura fixa da barra (em pixels) para cálculo da posição da bolinha
let bolinhaWidth = 30; // Define a largura fixa da bolinha para ajustar seu movimento e evitar que "ultrapasse" a barra
let startTime = 0; // Variável para registrar o momento que começa a animação da bolinha, usada para cálculo do progresso
let duration = 0; // Duração em milissegundos de cada batida (tempo que a bolinha leva para ir de um lado ao outro)

// Função que inicia o treino ao clicar no botão
function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value); // Pega o bpm digitado pelo usuário no input e converte para número inteiro
  duration = 60000 / bpm; // Calcula a duração de cada batida em milissegundos (60000 ms = 1 minuto / bpm)

  Tone.start(); // Inicializa a biblioteca Tone.js para garantir que o som pode ser reproduzido (necessário por causa de regras do navegador)
  const synth = new Tone.MembraneSynth().toDestination(); // Cria um sintetizador que gera sons tipo bateria, e conecta ao output (alto-falantes)

  clearInterval(intervalId); // Para o intervalo anterior para não acumular múltiplos loops se o treino for iniciado várias vezes
  cancelAnimationFrame(animationFrameId); // Para qualquer animação anterior da bolinha

  // Cria um intervalo que repete a cada 'duration' milissegundos para tocar a batida e animar a bolinha
  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n"); // Toca a nota C2 por um tempo de colcheia ("8n") para marcar a batida
    zona.style.animation = "pulse 0.4s ease"; // Aplica uma animação CSS para dar um efeito visual de batida na zona perfeita
    setTimeout(() => zona.style.animation = "none", 400); // Remove a animação depois de 400 ms para que ela possa ser aplicada novamente no próximo ciclo
    startTime = performance.now(); // Registra o tempo atual para sincronizar a animação da bolinha com a batida
    animateBolinha(); // Inicia a animação da bolinha para que ela se mova na barra durante a duração da batida
  }, duration);
}

// Função que faz a bolinha se mover da esquerda para a direita na barra sincronizada com o bpm
function animateBolinha() {
  const start = performance.now(); // Marca o momento inicial da animação para calcular seu progresso

  // Função interna que é chamada em cada frame de animação (~60 vezes por segundo)
  function frame(now) {
    let elapsed = now - start; // Tempo passado desde o início da animação
    let percent = elapsed / duration; // Progresso da animação em porcentagem (0 a 1)
    if (percent > 1) percent = 1; // Garante que o progresso não ultrapasse 100%

    const x = percent * (barraWidth - bolinhaWidth); // Calcula a posição horizontal atual da bolinha na barra, levando em conta seu tamanho
    bolinha.style.left = `${x}px`; // Atualiza a posição da bolinha no CSS, movendo-a para a direita conforme o tempo passa

    if (percent < 1) { // Enquanto a animação não terminou
      animationFrameId = requestAnimationFrame(frame); // Continua pedindo para atualizar a posição no próximo frame de animação
    }
  }

  requestAnimationFrame(frame); // Começa a animação pedindo para chamar a função frame no próximo repaint do navegador
}

// Evento para iniciar o treino quando o usuário clicar no botão "startBtn"
document.getElementById("startBtn").addEventListener("click", startTraining);

// Evento que escuta a tecla pressionada em todo o documento
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { // Se a tecla pressionada for a barra de espaço
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2; // Calcula o ponto central da bolinha na barra
    const zonaCenter = barraWidth * 0.75; // Define o ponto central da zona "perfect" como 75% da largura da barra
    const diff = Math.abs(bolinhaCenter - zonaCenter); // Calcula a distância entre o centro da bolinha e o centro da zona perfeita

    let result; // Variável que vai armazenar o resultado do timing baseado na proximidade da bolinha com a zona

    // Avalia a precisão do clique baseado na distância calculada
    if (diff < 15) result = "💯 PERFECT"; // Muito próximo, timing perfeito
    else if (diff < 35) result = "🔥 GREAT"; // Próximo, ótimo timing
    else if (diff < 55) result = "😐 COOL"; // Razoável, bom timing
    else if (diff < 80) result = "❌ BAD"; // Longe, timing ruim
    else result = "💀 MISS"; // Muito longe, erro (miss)

    document.getElementById("feedback").textContent = result; // Mostra o resultado para o usuário na tela
  }
});
