// Configurações iniciais
let bpm = 120; // batidas por minuto
let duration = 60000 / bpm; // duração de cada batida em ms

// Elementos DOM
const bolinha = document.getElementById("bolinha");
const zona = document.getElementById("zona-perfect");
const barra = document.getElementById("barra");
const feedback = document.getElementById("feedback");
const botaoEspaco = document.getElementById("botaoEspaco");

const barraWidth = 400;
const bolinhaWidth = 30;

let animationFrameId;
let intervalId;

let perfectStreak = 0; // contador de perfects seguidos
let roundActive = true; // controla se está na rodada que aceita espaço

// Inicializa Tone.js sintetizadores para sons
const synthPerfect = new Tone.MembraneSynth().toDestination();
const synthGreat = new Tone.MembraneSynth().toDestination();
const synthCool = new Tone.MembraneSynth().toDestination();
const synthBad = new Tone.MembraneSynth().toDestination();
const synthMiss = new Tone.MembraneSynth().toDestination();

// Função para animar a bolinha da esquerda para direita numa duração definida
function animateBolinha() {
  const start = performance.now();

  function frame(now) {
    let elapsed = now - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    // calcula posição da bolinha
    const x = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${x}px`;

    if (percent < 1) {
      animationFrameId = requestAnimationFrame(frame);
    }
  }

  animationFrameId = requestAnimationFrame(frame);
}

// Função que inicia uma rodada
function startRound() {
  roundActive = true;

  // Recomeça a animação da bolinha
  animateBolinha();

  // Define tempo para encerrar a rodada e iniciar pausa
  intervalId = setTimeout(() => {
    roundActive = false;

    // Deixa barra, bolinha e zona com 70% de opacidade na pausa
    barra.style.opacity = "0.7";
    bolinha.style.opacity = "0.7";
    zona.style.opacity = "0.7";

    // Pausa visual, duração de 1 segundo antes da próxima rodada
    setTimeout(() => {
      barra.style.opacity = "1";
      bolinha.style.opacity = "1";
      zona.style.opacity = "1";

      startRound(); // reinicia a próxima rodada
    }, 1000);
  }, duration);
}

// Função para mostrar feedback (texto e cor) com animação suave
function showFeedback(text, classe) {
  feedback.textContent = text;
  feedback.className = classe; // aplica cor via classe

  feedback.style.opacity = "1";

  // Desaparece após 0.8s
  setTimeout(() => {
    feedback.style.opacity = "0";
  }, 800);
}

// Função para tocar sons com base no resultado
function playSound(result) {
  switch (result) {
    case "PERFECT":
      synthPerfect.triggerAttackRelease("C2", "8n");
      break;
    case "GREAT":
      synthGreat.triggerAttackRelease("E2", "8n");
      break;
    case "COOL":
      synthCool.triggerAttackRelease("G2", "8n");
      break;
    case "BAD":
      synthBad.triggerAttackRelease("A1", "8n");
      break;
    case "MISS":
      synthMiss.triggerAttackRelease("C1", "8n");
      break;
  }
}

// Função que verifica o timing quando o usuário aperta espaço ou clica no botão
function checkHit() {
  if (!roundActive) return; // ignora se está na pausa

  const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
  const zonaCenter = zona.offsetLeft + zona.offsetWidth / 2;
  const diff = Math.abs(bolinhaCenter - zonaCenter);

  let result = "";
  if (diff < 15) result = "PERFECT";
  else if (diff < 35) result = "GREAT";
  else if (diff < 55) result = "COOL";
  else if (diff < 80) result = "BAD";
  else result = "MISS";

  // Contador de perfects seguidos
  if (result === "PERFECT") {
    perfectStreak++;
  } else {
    perfectStreak = 0;
  }

  // Mostra a mensagem de feedback
  if (result === "PERFECT" && perfectStreak > 1) {
    showFeedback(`Perfect x${perfectStreak}`, "perfect");
  } else {
    showFeedback(result.charAt(0) + result.slice(1).toLowerCase(), result.toLowerCase());
  }

  playSound(result);
}

// Event listener para tecla espaço
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    checkHit();
  }
});

// Event listener para clique no botão espaço (mobile)
botaoEspaco.addEventListener("click", () => {
  checkHit();
});

// Inicializa Tone.js (exigido em alguns navegadores)
Tone.start().then(() => {
  // Inicia a primeira rodada ao carregar o jogo
  startRound();
});
