document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(e) {
  if (e.code === "Space") {
    const bolinha = document.getElementById("bolinha");
    const zonaPerfect = document.getElementById("zona-perfect");
    const barra = document.getElementById("barra-container");
    const resultado = document.getElementById("resultado");

    const bolinhaRect = bolinha.getBoundingClientRect();
    const zonaRect = zonaPerfect.getBoundingClientRect();
    const barraRect = barra.getBoundingClientRect();

    const bolinhaX = bolinhaRect.left + bolinhaRect.width / 2 - barraRect.left;
    const targetX = zonaRect.left + zonaRect.width / 2 - barraRect.left;
    const distance = Math.abs(bolinhaX - targetX);

    if (distance < 10) {
      resultado.textContent = "Perfect!";
      resultado.style.color = "aqua";
    } else if (distance < 30) {
      resultado.textContent = "Cool";
      resultado.style.color = "lightgreen";
    } else if (distance < 60) {
      resultado.textContent = "Bad";
      resultado.style.color = "orange";
    } else {
      resultado.textContent = "Miss";
      resultado.style.color = "red";
    }

    setTimeout(() => resultado.textContent = "", 500);
  }
}
