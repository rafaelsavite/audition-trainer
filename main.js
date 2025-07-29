const bpmInput = document.getElementById("bpm");
const startBtn = document.getElementById("startBtn");
const bolinha = document.getElementById("bolinha");
const zonaPerfect = document.getElementById("zona-perfect");
const feedback = document.getElementById("feedback");

let interval;
let podeApertar = false;
let rodadaAtiva = true;
let comboCount = 0;

const comboEl = document.createElement("div");
comboEl.id = "comboCount";
document.body.appendChild(comboEl);

startBtn.addEventListener("click", () => {
  clearInterval(interval);
  iniciarTreino();
});

function iniciarTreino() {
  const bpm = parseInt(bpmInput.value);
  const intervaloMs = 60000 / bpm;

  const barra = document.getElementById("barra");
  const barraWidth = barra.offsetWidth;
  const bolinhaWidth = bolinha.offsetWidth;

  const finalPos = barraWidth - bolinhaWidth;

  interval = setInterval(() => {
    bolinha.style.transition = "none";
    bolinha.style.left = "0px";

    setTimeout(() => {
      bolinha.style.transition = `left ${intervaloMs}ms linear`;
      bolinha.style.left = `${finalPos}px`;
    }, 20);

    rodadaAtiva = !rodadaAtiva;
    podeApertar = true;

    document.body.style.opacity = rodadaAtiva ? "1" : "0.4";
  }, intervaloMs + 200); // margem entre rodadas
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && rodadaAtiva && podeApertar) {
    podeApertar = false;
    checarPrecisao();
  }
});

function checarPrecisao() {
  const zona = zonaPerfect.getBoundingClientRect();
  const bola = bolinha.getBoundingClientRect();

  const centroBola = bola.left + bola.width / 2;
  const centroZona = zona.left + zona.width / 2;
  const distancia = Math.abs(centroBola - centroZona);

  let resultado = "";
  if (distancia < 5) {
    resultado = "PERFECT";
    comboCount++;
  } else if (distancia < 15) {
    resultado = "GREAT";
    comboCount = 0;
  } else if (distancia < 30) {
    resultado = "COOL";
    comboCount = 0;
  } else {
    resultado = "BAD";
    comboCount = 0;
  }

  mostrarFeedback(resultado);
}

function mostrarFeedback(resultado) {
  feedback.innerHTML = `<span class="${resultado.toLowerCase()}">${resultado}</span>`;
  if (comboCount > 1) {
    comboEl.textContent = `Perfect x${comboCount}`;
  } else {
    comboEl.textContent = "";
  }

  setTimeout(() => {
    feedback.innerHTML = "";
  }, 800);
}
