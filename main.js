
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let currentQuestionIndex = 0;
let questionList = [];
let score = 0;

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';


//Funcion que tre preguntas desde la (API)
async function loadQuestionsFromAPI() {

  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    questionList = data.results.map(item => {
      const allAnswers = [...item.incorrect_answers, item.correct_answer];
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
      return {

        question: decodeHTML(item.question),
        answers: shuffledAnswers.map(answer => ({
          text: decodeHTML(answer),
          correct: answer === item.correct_answer
        }))

      };
    });

    startGame();
  } catch (error) {
    console.error('Error cargando preguntas:', error);
  }
}


//Convierte símbolos raros del HTML (como &quot;, &#039;, &amp;, etc.) en texto legible normal.
function decodeHTML(html) {

  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}


//Inicia el juego
function startGame() {

  startButton.classList.add('hide');
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}


//Siguiente pregunta
function setNextQuestion() {

  resetState();
  showQuestion(questionList[currentQuestionIndex]);
}


//Funcion que Oculta el botón de "Next" para que no aparezca antes de tiempo.
// y que borra todos los botones de respuesta que quedaron de la pregunta anterior.
function resetState() {

  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}


//Muestra preguntas y respuestas
function showQuestion(question) {

  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;

    if (answer.correct) {

      button.dataset.correct = true;
    }

    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}


//Seleccionar una respuesta
function selectAnswer(e) {

  const selectedButton = e.target;
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button);
  });

  if (selectedButton.dataset.correct) score++;

  if (questionList.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');

  }   else {

    // Guardardamos la puntuación actual para usarla en results.html

      localStorage.setItem("lastScore", JSON.stringify({
      correct: score,
      total: questionList.length

    }));

    //Metodo de Guardar

    storeData();

    // Redirigir a página de resultados
    
    window.location.href = "results.html";
  }

}

function storeData() {

  let stats = JSON.parse(localStorage.getItem("stats") || "[]");
  const entry = {
    "score": score,
    "date": new Date()
  }
  stats.push(entry);
  localStorage.setItem("stats", JSON.stringify(stats));
  score = 0;
}

function setStatusClass(element) {

  element.dataset.correct ? element.classList.add('color-correct') : 
    element.classList.add('color-wrong');
}


//Navegación entre preguntas
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});


//Empieza el juego 
startButton.addEventListener('click', () => {
  loadQuestionsFromAPI(); 
});


