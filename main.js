document.addEventListener("DOMContentLoaded", () => {
  const bolinha = document.getElementById("bolinha");
  const zonaPerfect = document.getElementById("zona-perfect");
  const feedback = document.getElementById("feedback");
  const barra = document.getElementById("barra-container");

  let bpm = 120; // pode adaptar com interface futuramente
  let intervalo = (60 / bpm) * 1000;
  let posicao = 0;
  let direcao = 1;

  // Movimento contínuo da bolinha
  function moverBolinha() {
    const larguraBarra = barra.offsetWidth;
    const larguraBolinha = bolinha.offsetWidth;
    const passo = larguraBarra / 200;

    posicao += passo * direcao;

    if (posicao + larguraBolinha >= larguraBarra) {
      direcao = -1;
      posicao = larguraBarra - larguraBolinha;
    } else if (posicao <= 0) {
      direcao = 1;
      posicao = 0;
    }

    bolinha.style.left = `${posicao}px`;
  }

  setInterval(moverBolinha, intervalo / 60);

  // Captura do espaço e verificação de precisão
  function handleKeyPress(event) {
    if (event.code === "Space") {
      const bolinhaRect = bolinha.getBoundingClientRect();
      const zonaRect = zonaPerfect.getBoundingClientRect();
      const barraRect = barra.getBoundingClientRect();

      const bolinhaX = bolinhaRect.left + bolinhaRect.width / 2 - barraRect.left;
      const targetX = zonaRect.left + zonaRect.width / 2 - barraRect.left;

      const distancia = Math.abs(bolinhaX - targetX);
      let resultado = "";

      if (distancia < 10) {
        resultado = "Perfect";
        feedback.style.color = "#00ffcc";
      } else if (distancia < 25) {
        resultado = "Great";
        feedback.style.color = "#00ccff";
      } else if (distancia < 50) {
        resultado = "Cool";
        feedback.style.color = "#0066ff";
      } else if (distancia < 75) {
        resultado = "Bad";
        feedback.style.color = "#ff6600";
      } else {
        resultado = "Miss";
        feedback.style.color = "#ff0033";
      }

      feedback.textContent = resultado;
      feedback.classList.add("mostrar");
      setTimeout(() => feedback.classList.remove("mostrar"), 600);
    }
  }

  document.addEventListener("keydown", handleKeyPress);
});
