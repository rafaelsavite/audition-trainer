const bolinha = document.getElementById("bolinha");
const zonaPerfect = document.getElementById("zona-perfect");
const feedbackContainer = document.getElementById("feedback-container");
const jogo = document.getElementById("jogo");

let position = 0;
let direction = 1;
let rodando = true;
let podePressionar = true;
let emPausa = false;
let perfectStreak = 0;
let mostrarStreak = null;

// Atualização visual da contagem de perfects
function mostrarContadorPerfects(x) {
  if (mostrarStreak) mostrarStreak.remove();
  const msg = document.createElement("div");
  msg.classList.add("feedback-message", "perfect");
  msg.innerText = `Perfect x${x}`;
  feedbackContainer.appendChild(msg);
  mostrarStreak = msg;
  setTimeout(() => {
    if (msg === mostrarStreak) {
      msg.remove();
      mostrarStreak = null;
    }
  }, 800);
}

// Gera feedback visual
function mostrarFeedback(tipo) {
  const msg = document.createElement("div");
  msg.classList.add("feedback-message", tipo.toLowerCase());
  msg.innerText = tipo.toUpperCase();
  feedbackContainer.appendChild(msg);
  setTimeout(() => msg.remove(), 800);
}

// Movimento da bolinha
function moverBolinha() {
  if (!rodando) return;

  position += direction * 4;
  if (position >= barra.clientWidth - bolinha.clientWidth || position <= 0) {
    direction *= -1;
    if (position <= 0) iniciarNovaRodada();
  }
  bolinha.style.left = `${position}px`;
  requestAnimationFrame(moverBolinha);
}

// Inicia nova rodada (ativa ou pausada)
function iniciarNovaRodada() {
  podePressionar = true;
  emPausa = !emPausa;

  if (emPausa) {
    jogo.classList.add("rounda-pausa");
  } else {
    jogo.classList.remove("rounda-pausa");
  }
}

// Detecta precisão
function verificarPrecisao() {
  const bolinhaRect = bolinha.getBoundingClientRect();
  const zonaRect = zonaPerfect.getBoundingClientRect();
  const overlap =
    Math.min(bolinhaRect.right, zonaRect.right) -
    Math.max(bolinhaRect.left, zonaRect.left);
  const larguraIntersecao = Math.max(0, overlap);

  if (larguraIntersecao >= 20) {
    mostrarFeedback("Perfect");
    perfectStreak++;
    mostrarContadorPerfects(perfectStreak);
  } else if (larguraIntersecao >= 10) {
    mostrarFeedback("Great");
    perfectStreak = 0;
  } else if (larguraIntersecao > 0) {
    mostrarFeedback("Cool");
    perfectStreak = 0;
  } else {
    mostrarFeedback("Bad");
    perfectStreak = 0;
  }
}

// Espaço só funciona se não estiver em pausa e se for a 1ª vez da rodada
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !emPausa && podePressionar) {
    verificarPrecisao();
    podePressionar = false;
  }
});

// Início
requestAnimationFrame(moverBolinha);
