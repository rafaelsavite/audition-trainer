const bolinha = document.getElementById("bolinha");
const bpmInput = document.getElementById("bpm");
const zonaPerfect = document.getElementById("zona-perfect");
const jogo = document.getElementById("jogo");

let intervalId;
let inputEnabled = true;
let rodadaPausada = false;
let spacePressedThisRound = false;
let perfectCount = 0;

function iniciarJogo() {
  clearInterval(intervalId);
  const bpm = parseInt(bpmInput.value);
  const intervalo = 60000 / bpm;

  startRodadas(intervalo);
}

function startRodadas(intervalo) {
  rodada(); // Primeira jogada

  intervalId = setInterval(() => {
    rodada();
  }, intervalo);
}

function rodada() {
  // Alterna rodada ativa/inativa
  rodadaPausada = !rodadaPausada;
  spacePressedThisRound = false;

  if (rodadaPausada) {
    jogo.classList.add("rounda-pausa");
    inputEnabled = false;
  } else {
    jogo.classList.remove("rounda-pausa");
    inputEnabled = true;
  }

  moverBolinha();
}

function moverBolinha() {
  const barra = document.getElementById("barra-container");
  const barraWidth = barra.clientWidth;
  const bolinhaWidth = bolinha.clientWidth;
  const duracao = 600; // milissegundos
  const fps = 60;
  const totalFrames = (duracao / 1000) * fps;
  let frame = 0;

  const interval = setInterval(() => {
    if (frame > totalFrames) {
      clearInterval(interval);
      return;
    }

    const percent = frame / totalFrames;
    const pos = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${pos}px`;

    frame++;
  }, 1000 / fps);
}

function showFeedback(result, type) {
  const container = document.getElementById("feedback-container");
  const message = document.createElement("div");

  message.classList.add("feedback-message", type);
  message.textContent = result;

  container.appendChild(message);

  setTimeout(() => {
    container.removeChild(message);
  }, 800);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && inputEnabled && !spacePressedThisRound) {
    spacePressedThisRound = true;

    const bolinhaLeft = bolinha.offsetLeft + bolinha.clientWidth / 2;
    const zonaStart = zonaPerfect.offsetLeft;
    const zonaWidth = zonaPerfect.clientWidth;
    const zonaCenter = zonaStart + zonaWidth / 2;
    const diff = Math.abs(bolinhaLeft - zonaCenter);

    let result;

    if (diff < 15) {
      result = `PERFECT x${++perfectCount}`;
      showFeedback(result, "perfect");
    } else if (diff < 35) {
      result = "GREAT";
      perfectCount = 0;
      showFeedback(result, "great");
    } else if (diff < 55) {
      result = "COOL";
      perfectCount = 0;
      showFeedback(result, "cool");
    } else if (diff < 80) {
      result = "BAD";
      perfectCount = 0;
      showFeedback(result, "bad");
    } else {
      result = "MISS";
      perfectCount = 0;
      showFeedback(result, "miss");
    }
  }
});
