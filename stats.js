// Generación del gráfico: Funcion que actualiza la barra del grafico en cada pregunta
let correctAnswers = 0;
let incorrectAnswers = 0;

function updateScore(correct, incorrect) {
  correctAnswers = correct;
  incorrectAnswers = incorrect;
  drawChart();
}

//Funcion que dibuja el gráfico de barras
function drawChart() {
  const canvas = document.getElementById("scoreChart");
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);

  const correctColor = "green";
  const incorrectColor = "red";
  const barWidth = 100;
  const barSpacing = 50;
  const maxHeight = canvas.height - 30;
  const correctHeight = (correctAnswers / (correctAnswers + incorrectAnswers)) * maxHeight;
  const incorrectHeight = (incorrectAnswers / (correctAnswers + incorrectAnswers)) * maxHeight;

  context.fillStyle = correctColor;
  context.fillRect(50, canvas.height - correctHeight - 10, barWidth, correctHeight);
  context.fillStyle = incorrectColor;
  context.fillRect(50 + barWidth + barSpacing, canvas.height - incorrectHeight - 10, barWidth, incorrectHeight);
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.fillText("Correctas: " + correctAnswers, 50, canvas.height - 10);
  context.fillText("Incorrectas: " + incorrectAnswers, 50 + barWidth + barSpacing, canvas.height - 10);
}
