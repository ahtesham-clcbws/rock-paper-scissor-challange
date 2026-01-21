const validChoices = ['paper', 'scissors', 'rock', 'lizard', 'spock'];

const rules = {
  paper: { beats: ['rock', 'spock'] },
  scissors: { beats: ['paper', 'lizard'] },
  rock: { beats: ['scissors', 'lizard'] },
  lizard: { beats: ['spock', 'paper'] },
  spock: { beats: ['scissors', 'rock'] }
};

const scoreEl = document.getElementById('score-value');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const userSelectionEl = document.getElementById('user-selection');
const houseSelectionEl = document.getElementById('house-selection');
const resultText = document.getElementById('result-text');
const playAgainBtn = document.getElementById('play-again-btn');
const resultContainer = document.getElementById('result-container');

// Modal Elements
const rulesBtn = document.getElementById('rules-btn');
const rulesModal = document.getElementById('rules-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalMobile = document.getElementById('close-modal-mobile');

// State
let score = 0;

// Initialize
function init() {
  loadScore();
  bindEvents();
}

function loadScore() {
  const savedScore = localStorage.getItem('rps_score');
  if (savedScore) {
    score = parseInt(savedScore, 10);
    scoreEl.innerText = score;
  }
}

function updateScore(value) {
  score += value;
  if(score < 0) score = 0; // Prevent negative score? Rules don't say, but usually 0 floor is good.
  scoreEl.innerText = score;
  localStorage.setItem('rps_score', score);
}

function bindEvents() {
  // Option Buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      playRound(choice);
    });
  });

  // Play Again
  playAgainBtn.addEventListener('click', resetGame);

  // Modal
  rulesBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  closeModalMobile.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
}

function playRound(userChoice) {
  // 1. Update UI to Step 2
  step1.classList.add('hidden');
  step2.classList.remove('hidden');

  // 2. Display User Choice
  renderChoice(userSelectionEl, userChoice);

  // 3. House Choice after delay
  setTimeout(() => {
    const houseChoice = getHouseChoice();
    renderChoice(houseSelectionEl, houseChoice);
    
    // 4. Determine Winner
    const result = getResult(userChoice, houseChoice);
    
    // 5. Show Result & Update Score
    setTimeout(() => {
        showResult(result);
        if (result === 'win') {
            updateScore(1);
            highlightWinner(userSelectionEl);
        } else if (result === 'lose') {
            updateScore(-1); // Optional: deduct points
            highlightWinner(houseSelectionEl);
        }
    }, 500);

  }, 1000);
}

function getHouseChoice() {
  const randomIndex = Math.floor(Math.random() * validChoices.length);
  return validChoices[randomIndex];
}

function renderChoice(container, choice) {
  // Clear container (remove placeholder or previous choice)
  container.innerHTML = '';
  
  const btn = document.createElement('div');
  btn.classList.add('option-btn', choice);
  // Add static class to prevent hover effect in result view if needed, or rely on specific parent
  
  const inner = document.createElement('div');
  inner.classList.add('btn-inner');
  
  const img = document.createElement('img');
  img.src = `./assets/icon-${choice}.svg`;
  img.alt = choice;
  
  inner.appendChild(img);
  btn.appendChild(inner);
  container.appendChild(btn);
}

function getResult(user, house) {
  if (user === house) return 'draw';
  if (rules[user].beats.includes(house)) return 'win';
  return 'lose';
}

function showResult(result) {
  if (result === 'win') {
    resultText.innerText = "YOU WIN";
  } else if (result === 'lose') {
    resultText.innerText = "YOU LOSE";
  } else {
    resultText.innerText = "DRAW";
  }
  
  resultContainer.classList.remove('hidden');
}

function highlightWinner(containerElement) {
    const winnerEffect = document.createElement('div');
    winnerEffect.classList.add('winner-shadow');
    // Append to the button inside the slot
    const btn = containerElement.querySelector('.option-btn');
    if(btn) {
        btn.appendChild(winnerEffect);
        // Ensure z-index allows click through if necessary, but here button is static
    }
}

function resetGame() {
  step2.classList.add('hidden');
  resultContainer.classList.add('hidden');
  step1.classList.remove('hidden');
  
  // Clear slots
  userSelectionEl.innerHTML = '';
  houseSelectionEl.innerHTML = '<div class="placeholder-circle"></div>';
}

// Modal Functions
function openModal() {
  rulesModal.classList.remove('hidden');
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  rulesModal.classList.add('hidden');
  modalOverlay.classList.add('hidden');
}

// Start
init();
