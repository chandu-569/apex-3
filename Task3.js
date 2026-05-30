const startButton = document.getElementById("start-button");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const timerDisplay = document.getElementById("timer");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

startButton.addEventListener("click", startQuiz);

function startQuiz() {
  startButton.style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 30;
  fetchQuestions();
}

function fetchQuestions() {
  fetch("https://the-trivia-api.com/api/questions?categories=computers&limit=5&difficulty=easy")
    .then(res => res.json())
    .then(data => {
      questions = data;
      startTimer();
      displayQuestion();
    })
    .catch(err => {
      questionText.textContent = "Failed to load questions.";
      console.error(err);
    });
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function displayQuestion() {
  resetAnswers();

  if (currentQuestionIndex >= questions.length) {
    endQuiz();
    return;
  }

  const current = questions[currentQuestionIndex];
  questionText.textContent = current.question;

  const answers = [...current.incorrectAnswers, current.correctAnswer];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach(answer => {
    const button = document.createElement("button");
    button.classList.add("answer-button");
    button.textContent = answer;
    button.addEventListener("click", () => selectAnswer(answer === current.correctAnswer));
    answerButtons.appendChild(button);
  });
}

function selectAnswer(isCorrect) {
  if (isCorrect) {
    score++;
  }
  currentQuestionIndex++;
  displayQuestion();
}

function resetAnswers() {
  answerButtons.innerHTML = "";
}

function endQuiz() {
  clearInterval(timerInterval);
  questionText.innerHTML = `Quiz Finished! You scored ${score} out of ${questions.length}.`;
  answerButtons.innerHTML = "";
  startButton.textContent = "Restart Quiz";
  startButton.style.display = "inline-block";
  startButton.addEventListener("click", () => location.reload());
}
