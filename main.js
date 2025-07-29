const bolinha = document.getElementById("bolinha");
const zonaPerfect = document.getElementById("zona-perfect");
const feedback = document.getElementById("feedback");
const bpmInput = document.getElementById("bpm");
const startBtn = document.getElementById("startBtn");
const perfectStreak = document.getElementById("perfect-streak");

let animationId;
let bpm = 120;
let pixelsPorSegundo;
let ultimaTecla = 0;
let streak = 0;

function calcularVelocidade() {
  bpm = parseInt(bpmInput.value);
  pixelsPorSegundo = (document.getElementById("barra").offsetWidth + 20) * (bpm / 60);
}

function mostrarFeedback(tipo) {
  const div = document.createElement("div");
  div.className = "feedback-text";
  div.textContent = tipo;

  switch (tipo) {
    case "PERFECT":
      div.style.color = "#00f";
      break;
    case "GREAT":
      div.style.color = "#0f0";
      break;
    case "COOL":
      div.style.color = "#0ff";
      break;
    case "BAD":
      div.style.color = "pink";
      break;
  }

  feedback.innerHTML = "";
  feedback.appendChild(div);
}

function resetStreak() {
  streak = 0;
  perfectStreak.textContent = "Perfect x0";
}

function startAnimation() {
  cancelAnimationFrame(animationId);
  calcularVelocidade();

  let startTime = null;
  const barra = document.getElementById("barra");
  const larguraBarra = barra.offsetWidth;
  const larguraBolinha = bolinha.offsetWidth;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const distance = (elapsed * pixelsPorSegundo) % (larguraBarra + larguraBolinha);
    bolinha.style.left = distance - larguraBolinha + "px";
    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const agora = Date.now();
    if (agora - ultimaTecla < 500) return; // evita spam
    ultimaTecla = agora;

    const bolinhaX = bolinha.getBoundingClientRect().left + bolinha.offsetWidth / 2;
    const zonaX = zonaPerfect.getBoundingClientRect();
    const centroZona = zonaX.left + zonaX.width / 2;

    const distancia = Math.abs(bolinhaX - centroZona);

    if (distancia < 10) {
      mostrarFeedback("PERFECT");
      streak++;
      perfectStreak.textContent = `Perfect x${streak}`;
    } else if (distancia < 20) {
      mostrarFeedback("GREAT");
      resetStreak();
    } else if (distancia < 40) {
      mostrarFeedback("COOL");
      resetStreak();
    } else {
      mostrarFeedback("BAD");
      resetStreak();
    }
  }
});

startBtn.addEventListener("click", () => {
  resetStreak();
  startAnimation();
});
