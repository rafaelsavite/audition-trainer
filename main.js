// Seleciona os elementos da barra e bolinha
const barra = document.getElementById("barra");
const bolinha = document.getElementById("bolinha");
const zona = document.getElementById("zona");
const feedback = document.getElementById("feedback");

// Define tamanhos usados nos cálculos
const barraWidth = 400;
const bolinhaWidth = 20;
const zonaWidth = 70;
const zonaStart = barraWidth * 0.7; // Começa em 70% da barra

// Define tempo total de uma rodada (em milissegundos)
const tempoTotal = 2000;

// Controladores de rodada
let roundActive = true;
let perfectStreak = 0;

// Cria os sintetizadores de som para cada tipo de acerto
const synthPerfect = new Tone.Synth().toDestination();
const synthGreat = new Tone.Synth().toDestination();
const synthCool = new Tone.Synth().toDestination();
const synthBad = new Tone.Synth().toDestination();
const synthMiss = new Tone.Synth().toDestination();

// Controla as rodadas alternando entre ativa e "modo espera"
let rodadaCount = 0;

// Função principal que inicia o movimento da bolinha
function iniciarRodada() {
  roundActive = true;
  rodadaCount++;

  // Define estilo visual normal (opacidade 100%)
  barra.style.opacity = "1";
  bolinha.style.opacity = "1";
  zona.style.opacity = "1";

  // Remove qualquer animação anterior
  bolinha.style.transition = "none";
  bolinha.style.left = "0px";

  // Pequeno delay para iniciar a animação suavemente
  setTimeout(() => {
    bolinha.style.transition = `left ${tempoTotal}ms linear`;
    bolinha.style.left = barraWidth - bolinhaWidth + "px";
  }, 50);

  // Após o tempo de animação, entra no modo de pausa visual
  setTimeout(() => {
    roundActive = false;

    // Reduz opacidade para indicar "modo espera"
    barra.style.opacity = "0.7";
    bolinha.style.opacity = "0.7";
    zona.style.opacity = "0.7";

    // Espera 1 segundo e inicia próxima rodada
    setTimeout(() => {
      iniciarRodada();
    }, 1000);
  }, tempoTotal);
}

// Função que verifica o resultado ao pressionar espaço ou tocar
function checarResultado() {
  if (roundActive) {
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
    const zonaCenter = zonaStart + zonaWidth / 2;

    const diff = Math.abs(bolinhaCenter - zonaCenter);
    let result;

    // Define feedback baseado na distância da bolinha ao centro da zona
    if (diff < 5) result = "💯 PERFECT";
    else if (diff < 15) result = "🔥 GREAT";
    else if (diff < 85) result = "😐 COOL";
    else if (diff < 110) result = "❌ BAD";
    else result = "💀 MISS";

    // Conta streaks de perfects
    if (result === "💯 PERFECT") {
      perfectStreak++;
    } else {
      perfectStreak = 0;
    }

    let feedbackText = result;
    if (perfectStreak > 1) {
      feedbackText += ` x${perfectStreak}`;
    }

    feedback.textContent = feedbackText;

    // Toca som correspondente ao feedback
    switch (result) {
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
}

// Evento para teclado: barra de espaço
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    checarResultado();
  }
});

// Evento para toque em tela (celular) ou clique (PC)
function handleTouchOrClick() {
  checarResultado();
}
document.addEventListener("touchstart", handleTouchOrClick);
document.addEventListener("click", handleTouchOrClick);

// Inicia a primeira rodada
iniciarRodada();
