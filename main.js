const bolinha = document.getElementById("bolinha");
const bpmInput = document.getElementById("bpm");
const zonaPerfect = document.getElementById("zona-perfect");
const jogo = document.getElementById("jogo");

let intervalId;
let inputEnabled = false;
let rodadaPausada = false;
let spacePressedThisRound = false;
let perfectCount = 0;
let bolinhaAnimacaoId = null;

function iniciarJogo() {
  clearInterval(intervalId);
  cancelarAnimacaoBolinha();

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
  rodadaPausada = !rodadaPausada;
  spacePressedThisRound = false;

  if (rodadaPausada) {
    jogo.classList.add("rounda-pausa");
    inputEnabled = false;
    cancelarAnimacaoBolinha();
  } else {
    jogo.classList.remove("rounda-pausa");
    inputEnabled = true;
    moverBolinha();
  }
}

function moverBolinha() {
  const barra = document.getElementById("barra-container");
  const barraWidth = barra.clientWidth;
  const bolinhaWidth = bolinha.clientWidth;
  const start = 0;
  const end = barraWidth - bolinhaWidth;

  const bpm = parseInt(bpmInput.value);
  const duracao = 60000 / bpm;

  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duracao, 1);
    const pos = start + (end - start) * progress;
    bolinha.style.left = `${pos}px`;

    if (progress < 1 && !rodadaPausada) {
      bolinhaAnimacaoId = requestAnimationFrame(animate);
    }
  }

  bolinha.style.left = "0px";
  bolinhaAnimacaoId = requestAnimationFrame(animate);
}

function cancelarAnimacaoBolinha() {
  if
