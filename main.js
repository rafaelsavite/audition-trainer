const redBar = document.querySelector('.combo-bar-red');
const blueBar = document.querySelector('.combo-bar-blue');

const totalWidth = 600; // em pixels, igual ao container

// Vamos deixar a barra azul fixa com 85% da largura do container,
// deixando 15% no total de espaço (10% livre no final da barra azul como você pediu e 5% de sobra)
blueBar.style.width = '85%';

let redWidthPercent = 0;

function updateRedBar() {
  // Incrementa a barra vermelha em 2% até um máximo de 75% para deixar 10% de espaço livre (já que azul tá em 85%)
  if (redWidthPercent < 75) {
    redWidthPercent += 2;
    redBar.style.width = redWidthPercent + '%';
  } else {
    // Reseta para simular o combo acabando e recomeçando (só pra teste)
    redWidthPercent = 0;
    redBar.style.width = '0%';
  }
}

// Atualiza a barra vermelha a cada 100ms para mostrar movimento
setInterval(updateRedBar, 100);
