/* Container fixo para mensagens de feedback */
#feedback-container {
  position: relative;
  height: 100px;
  margin-top: 30px;
}

/* Estilo base da mensagem */
.feedback-message {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5em;
  font-weight: bold;
  opacity: 1;
  animation: floatUp 0.8s ease forwards;
  text-shadow: 2px 2px 4px #000;
  font-family: 'Arial Black', sans-serif;
}

/* Animação: sobe e desaparece */
@keyframes floatUp {
  0% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -40px);
    opacity: 0;
  }
}

/* Estilos específicos */
.perfect {
  color: #00bfff; /* Azul vibrante */
}

.great {
  color: #00ff66; /* Verde forte */
}

.cool {
  color: #66ccff; /* Azul claro */
}

.bad {
  color: #ff66cc; /* Rosa vibrante */
}

.miss {
  color: #ff3333; /* Vermelho escuro */
}
