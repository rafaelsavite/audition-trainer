body {
  background-color: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
  color: white;
}

#barra-container {
  position: relative;
  width: 80%;
  height: 40px;
  background: #333;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
}

#zona-perfect {
  position: absolute;
  width: 120px;
  height: 100%;
  left: 80%;
  transform: translateX(-50%);
  background: radial-gradient(circle, #00d0ff, #0066cc);
  border-radius: 10px;
  opacity: 0.6;
  animation: none;
}

#bolinha {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: lime;
  border-radius: 50%;
  top: 10px;
  left: 0;
  animation: mover 2s linear infinite;
}

@keyframes mover {
  from { left: 0%; }
  to { left: 100%; }
}

#resultado {
  font-size: 24px;
  height: 30px;
}
