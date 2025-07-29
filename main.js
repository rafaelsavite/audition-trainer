// Posição do alvo azul (70px de largura, posicionado a 80% da barra)
const alvo = document.querySelector(".alvo");
const indicador = document.querySelector(".indicador");

// Função para verificar o acerto quando o jogador pressiona "espaço"
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    const indicadorPos = indicador.getBoundingClientRect();
    const alvoPos = alvo.getBoundingClientRect();

    const centerIndicador = indicadorPos.left + indicadorPos.width / 2;
    const startAlvo = alvoPos.left;
    const endAlvo = alvoPos.right;

    if (centerIndicador >= startAlvo && centerIndicador <= endAlvo) {
      const distanceToCenter = Math.abs(centerIndicador - (startAlvo + alvoPos.width / 2));
      if (distanceToCenter < 5) {
        alert("Perfect!");
      } else if (distanceToCenter < 15) {
        alert("Cool");
      } else {
        alert("Bad");
      }
    } else {
      alert("Miss");
    }
  }
});

// Suporte para toque em celular usando botão "Espaço"
document.getElementById("botaoEspaco").addEventListener("click", () => {
  const event = new KeyboardEvent("keydown", {
    key: " ",
    code: "Space",
    keyCode: 32,
    which: 32,
    bubbles: true,
  });
  document.dispatchEvent(event);
});
