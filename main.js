let bpm = 120;
let intervalId;
let animationFrameId;
let bolinha = document.getElementById("bolinha");
let zona = document.getElementById("zona-perfect");
let barra = document.getElementById("barra");
let barraWidth = barra.offsetWidth;
let bolinhaWidth = bolinha.offsetWidth;
let duration = 0;

function startTraining() {
  bpm = parseInt(document.getElementById("bpm").value);
  duration = 60000 / bpm;

  Tone.start();
  const synth = new Tone.MembraneSynth().toDestination();

  clearInterval(intervalId);
  cancelAnimationFrame(animationFrameId);

  intervalId = setInterval(() => {
    synth.triggerAttackRelease("C2", "8n");
    const batidaDuracaoSegundos = 60 / bpm;
    zona.style.animation = `pulse ${batidaDuracaoSegundos}s ease`;
    setTimeout(() => zona.style.animation = "none", batidaDuracaoSegundos * 1000);
    animateBolinha();
  }, duration);
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

document.getElementById("startBtn").addEventListener("click", startTraining);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const bolinhaCenter = bolinha.offsetLeft + bolinhaWidth / 2;
    const zonaCenter = barraWidth * 0.75; // zona posicionada em 75% da barra
    const diff = Math.abs(bolinhaCenter - zonaCenter);

    let result;
    if (diff < 10) result = "💯 PERFECT";
    else if (diff < 25) result = "🔥 GREAT";
    else if (diff < 45) result = "😐 COOL";
    else if (diff < 65) result = "❌ BAD";
    else result = "💀 MISS";

    document.getElementById("feedback").textContent = result;
  }
});
