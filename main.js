let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let barraWidth = barra.offsetWidth;
let bolinhaWidth = bolinha.offsetWidth;
let duration = 0;

let redBar = document.getElementById("barra-vermelha");
let redBarWidth = 30; // largura fixa da barra vermelha

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;
  barraWidth = barra.offsetWidth;
  bolinhaWidth = bolinha.offsetWidth;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  zona.style.animation = "none";
  void zona.offsetWidth; // força reflow para animação reiniciar

  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n");

    zona.style.animation = `pulse ${60 / bpm}s ease`;
    setTimeout(() => zona.style.animation = "none", (60 / bpm) * 1000);

    animateBolinha();
  }, duration);

  animateRedBar();
}

function animateBolinha() {
  const start = performance.now();

  function frame(now) {
    let elapsed = now - start;
    let percent = elapsed / duration;
    if (percent > 1) percent = 1;

    const x = percent * (barraWidth - bolinhaWidth);
    bolinha.style.left = `${x}px`;

    if (percent < 1) {
      animationFrameId = requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function animateRedBar() {
  const start = performance.now();

  function step(now) {
    let elapsed = now - start;
    let percent = (elapsed % duration) / duration; // loop de 0 a 1

    const x = percent * (barraWidth - redBarWidth);
    redBar.style.left = `${x}px`;

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const redBarCenter = redBar.offsetLeft + redBarWidth / 2;
    const zonaCenter = barraWidth * 0.75; // zona azul no 75% da barra
    const diff = Math.abs(redBarCenter - zonaCenter);

    let result;
    if (diff < 15) result = "💯 PERFECT";
    else if (diff < 35) result = "🔥 GREAT";
    else if (diff < 55) result = "😐 COOL";
    else if (diff < 80) result = "❌ BAD";
    else result = "💀 MISS";

    document.getElementById("feedback").textContent = result;
  }
});
