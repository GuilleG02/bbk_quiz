
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let currentQuestionIndex = 0;
let questionList = [];
let score = 0;

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

//Funcion que crea nuestras preguntas manuales para mezclar con las de la API
// function getLocalQuestions() {
//   return [
//     {
//       question: "¿Cuál es la capital del País Vasco?",
//       answers: [
//         { text: "Bilbao", correct: false },
//         { text: "Córdoba", correct: false },
//         { text: "Vitoria-Gasteiz", correct: true },
//         { text: "Pamplona", correct: false }
//       ]
//     },
//     {
//       question: "¿Qué lengua cooficial se habla en el País Vasco junto al español?",
//       answers: [
//         { text: "Catalán", correct: false },
//         { text: "Euskera", correct: true },
//         { text: "Gallego", correct: false },
//         { text: "Aranés", correct: false }
//       ]
//     },
//     {
//       question: "¿Cuál de estos platos es típico de la gastronomía vasca?",
//       answers: [
//         { text: "Gazpacho", correct: false },
//         { text: "Marmitako ", correct: true },
//         { text: "Fabada", correct: false },
//         { text: "Escalivada", correct: false }
//       ]
//     },
//     {
//       question: "¿Qué monte es el más alto del País Vasco?",
//       answers: [
//         { text: "Txindoki", correct: false },
//         { text: "Gorbea ", correct: true },
//         { text: "Anboto", correct: false },
//         { text: "Jaizkibel", correct: false }
//       ]
//     }
//     // Puedes agregar más
//   ];
// }

//Funcion que tre preguntas desde la (API)
async function loadQuestionsFromAPI() {

  try {

    const response = await fetch(API_URL);
    const data = await response.json();

      const apiQuestions = data.results.map(item => {
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

    //Combinar preguntas api y las nuestras
    // questionList = [...getLocalQuestions(), ...apiQuestions]; 
    // questionList = questionList.sort(() => Math.random() - 0.5).slice(0, 10);

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

  // Comprobar si la respuesta es correcta o no
  if (selectedButton.dataset.correct) {
    correctAnswers++;
  } else {
    incorrectAnswers++;
  }
  
  // // Actualizar el gráfico
  // updateScore(correctAnswers, incorrectAnswers);

  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button);
  });

  if (selectedButton.dataset.correct) score++;

  if (questionList.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');

  } else {

    storeData();
    startButton.innerText = 'Restart';
    startButton.classList.remove('hide');
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


