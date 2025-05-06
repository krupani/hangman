let players = { p1: "", p2: "" };
let scores = { p1: 0, p2: 0 };
let currentPlayer = "p1";
let secretWord = "";
let guessed = [];
let wrongGuesses = 0;
let maxWrong = 10;
const hangmanParts = [
  'base',
  'pole',
  'beam',
  'rope',
  'head',
  'body',
  'leftArm',
  'rightArm',
  'leftLeg',
  'rightLeg'
];

function startGame() {
  players.p1 = document.getElementById("player1Name").value || "Player 1";
  players.p2 = document.getElementById("player2Name").value || "Player 2";
  updateScores();
  document.body.className = "player1-theme";
  document.getElementById("landing").classList.remove("active");
  document.getElementById("wordEntry").classList.add("active");
  document.getElementById("wordEntryPrompt").innerText = `${players[currentPlayer]}, enter a word for your opponent`;
}

function submitWord() {
  secretWord = document.getElementById("secretWord").value.trim().toUpperCase();
  if (!secretWord) return;
  guessed = [];
  wrongGuesses = 0;
  document.getElementById("secretWord").value = "";
  document.getElementById("wordEntry").classList.remove("active");
  document.getElementById("gameplay").classList.add("active");
  document.body.className = currentPlayer === "p1" ? "player2-theme" : "player1-theme";
  document.getElementById("turnInfo").innerText = `${players[currentPlayer === "p1" ? "p2" : "p1"]} is guessing`;
  renderWord();
  renderKeyboard();
  resetHangman();
}

function renderWord() {
  let display = secretWord.split("").map(letter => guessed.includes(letter) ? letter : "_").join(" ");
  document.getElementById("wordDisplay").innerText = display;
}

function renderKeyboard() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const layout = [letters.slice(0, 7), letters.slice(7, 14), letters.slice(14,20), letters.slice(20)];

  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    row.forEach(letter => {
      const key = document.createElement("div");
      key.className = "key";
      key.innerText = letter;
      key.onclick = () => handleGuess(letter, key);
      rowDiv.appendChild(key);
    });
    keyboard.appendChild(rowDiv);
  });
}

function handleGuess(letter, key) {
  if (guessed.includes(letter)) return;
  guessed.push(letter);
  if (secretWord.includes(letter)) {
    key.classList.add("correct");
  } else {
    key.classList.add("wrong");
    wrongGuesses++;
    showHangmanPart(wrongGuesses);
  }
  renderWord();
  checkGameStatus();
}

function checkGameStatus() {
  const wordGuessed = secretWord.split("").every(l => guessed.includes(l));
  if (wordGuessed) {
    scores[currentPlayer === "p1" ? "p2" : "p1"]++;
    showOverlay("Correct!");
  } else if (wrongGuesses >= maxWrong) {
    scores[currentPlayer]++;
    showOverlay("You lost!");
  }
  updateScores();
}

function updateScores() {
  document.getElementById("scoreP1").innerText = `${players.p1}: ${scores.p1}`;
  document.getElementById("scoreP2").innerText = `${players.p2}: ${scores.p2}`;
}

function showOverlay(message) {
  document.getElementById("resultMessage").innerText = message;
  document.getElementById("revealedWord").innerText = secretWord;
  document.getElementById("overlay").style.display = "flex";
}

function nextTurn() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("gameplay").classList.remove("active");
  document.getElementById("wordEntry").classList.add("active");
  currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
  document.body.className = currentPlayer === "p1" ? "player1-theme" : "player2-theme";
  document.getElementById("wordEntryPrompt").innerText = `${players[currentPlayer]}, enter a word for your opponent`;
}

function showHangmanPart(index) {
  if (index < hangmanParts.length) {
    document.getElementById(hangmanParts[index - 1]).setAttribute('visibility', 'visible');
  }
}

function resetHangman() {
  hangmanParts.forEach(part => {
    document.getElementById(part).setAttribute('visibility', 'hidden');
  });
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('secretWord');
  const toggleIcon = document.getElementById('togglePassword');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}
