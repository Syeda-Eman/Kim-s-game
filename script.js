const itemPool = [
  "🍎 Apple", "🔑 Key", "📖 Book", "💍 Ring", "✏️ Pencil", 
  "👓 Glasses", "🎲 Dice", "🍌 Banana", "✂️ Scissors", "⏰ Clock", 
  "🎈 Balloon", "☕ Cup", "🎧 Headphones", "👟 Shoe", "🚗 Car", 
  "🔒 Lock", "💡 Bulb", "🖊️ Pen", "🍞 Bread", "🪙 Coin", 
  "🕯️ Candle", "📱 Phone", "🧩 Puzzle", "🧸 Teddy Bear"
];

let currentItems = [];
let timerInterval;

function startGame() {
  // Reset UI
  document.getElementById('start-btn').classList.add('hidden');
  document.getElementById('recall-section').classList.add('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('cover').classList.add('hidden');
  document.getElementById('tray').classList.remove('hidden');
  document.getElementById('user-input').value = "";

  // Pick 20 random items
  currentItems = [...itemPool].sort(() => 0.5 - Math.random()).slice(0, 20);

  // Render items to tray
  const tray = document.getElementById('tray');
  tray.innerHTML = currentItems.map(item => `<div class="item">${item}</div>`).join('');

  startTimer(45, "Observe time remaining: ", coverItems);
}

function coverItems() {
  document.getElementById('tray').classList.add('hidden');
  document.getElementById('cover').classList.remove('hidden');
  document.getElementById('recall-section').classList.remove('hidden');

  startTimer(300, "Recall time remaining: ", checkAnswers);
}

function startTimer(seconds, label, onComplete) {
  clearInterval(timerInterval);
  let timeRemaining = seconds;
  const timerDisplay = document.getElementById('timer');

  timerDisplay.innerText = `${label}${formatTime(timeRemaining)}`;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerDisplay.innerText = `${label}${formatTime(timeRemaining)}`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      onComplete();
    }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function checkAnswers() {
  clearInterval(timerInterval);
  document.getElementById('timer').innerText = "";
  document.getElementById('cover').classList.add('hidden');
  document.getElementById('recall-section').classList.add('hidden');
  document.getElementById('tray').classList.remove('hidden');

  // Process user input
  const rawInput = document.getElementById('user-input').value.toLowerCase();
  const userAnswers = rawInput.split(/[\n,]+/).map(item => item.trim()).filter(Boolean);

  let score = 0;

  // Clean item names for comparison
  currentItems.forEach(item => {
    const cleanName = item.replace(/[^\xa0-\xff\w\s]/g, '').trim().toLowerCase();
    
    const found = userAnswers.some(ans => ans.length > 2 && cleanName.includes(ans));
    if (found) {
      score++;
    }
  });

  const resultsDiv = document.getElementById('results');
  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = `
    <h2>Game Over!</h2>
    <p><strong>Your Score: ${score} / ${currentItems.length}</strong></p>
    <p><strong>Items on the tray were:</strong></p>
    <p>${currentItems.join(', ')}</p>
  `;

  document.getElementById('start-btn').innerText = "Play Again";
  document.getElementById('start-btn').classList.remove('hidden');
}