
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

let currentQuestionIndex = 0;
let questionList = [];
let score = 0;

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

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


function decodeHTML(html) {

  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}


function startGame() {

  startButton.classList.add('hide');
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}


function setNextQuestion() {

  resetState();
  showQuestion(questionList[currentQuestionIndex]);
}


function resetState() {

  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}


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


function selectAnswer(e) {

  const selectedButton = e.target;
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


nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});

startButton.addEventListener('click', () => {
  loadQuestionsFromAPI(); 
});



