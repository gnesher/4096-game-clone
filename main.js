/*
  Simple implementation of a 4096 game clone.
  The game uses a 4x4 grid and the objective is to reach the 4096 tile.
  Use the arrow keys to move the tiles.
*/

const boardSize = 4;
let board = [];
let score = 0;

// Initialize the game: create an empty board and add two random tiles.
function initGame() {
  board = [];
  score = 0;
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(0);
    }
    board.push(row);
  }
  addRandomTile();
  addRandomTile();
  updateBoard();
}

// Place a random tile (2 or 4) at an empty cell.
function addRandomTile() {
  let emptyCells = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) emptyCells.push({ i, j });
    }
  }
  if (emptyCells.length > 0) {
    let { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 90% chance for a 2, 10% for a 4.
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Update the visual board and score display.
function updateBoard() {
  const boardDiv = document.getElementById('game-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.className = "tile";
      if (board[i][j] !== 0) {
        cell.textContent = board[i][j];
        cell.classList.add("n" + board[i][j]);
      }
      boardDiv.appendChild(cell);
    }
  }
  document.getElementById('score').textContent = "Score: " + score;
}

// Slide and merge one row/column. Returns the new row.
function slide(row) {
  // Filter out zero values.
  let arr = row.filter(val => val !== 0);
  // Merge tiles.
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      // If you want to stop at target, you may add:
      // if(arr[i] === 4096) alert("You win!");
    }
  }
  // Filter again and add zeros to the end.
  arr = arr.filter(val => val !== 0);
  while (arr.length < boardSize) arr.push(0);
  return arr;
}

// Move tiles in the given direction and update the board.
function move(direction) {
  let moved = false;
  // Direction can be 'left', 'right', 'up', or 'down'
  switch (direction) {
    case 'left':
      for (let i = 0; i < boardSize; i++) {
        let original = board[i].slice();
        let newRow = slide(board[i]);
        board[i] = newRow;
        if (newRow.toString() !== original.toString()) moved = true;
      }
      break;
    case 'right':
      for (let i = 0; i < boardSize; i++) {
        let original = board[i].slice();
        let reversed = board[i].slice().reverse();
        let newRow = slide(reversed);
        newRow.reverse();
        board[i] = newRow;
        if (newRow.toString() !== original.toString()) moved = true;
      }
      break;
    case 'up':
      for (let j = 0; j < boardSize; j++) {
        let col = [];
        for (let i = 0; i < boardSize; i++) {
          col.push(board[i][j]);
        }
        let original = col.slice();
        let newCol = slide(col);
        for (let i = 0; i < boardSize; i++) {
          board[i][j] = newCol[i];
        }
        if (newCol.toString() !== original.toString()) moved = true;
      }
      break;
    case 'down':
      for (let j = 0; j < boardSize; j++) {
        let col = [];
        for (let i = 0; i < boardSize; i++) {
          col.push(board[i][j]);
        }
        let original = col.slice();
        col.reverse();
        let newCol = slide(col);
        newCol.reverse();
        for (let i = 0; i < boardSize; i++) {
          board[i][j] = newCol[i];
        }
        if (newCol.toString() !== original.toString()) moved = true;
      }
      break;
  }
  if (moved) {
    addRandomTile();
    updateBoard();
    if (isGameOver()) {
      setTimeout(() => alert("Game Over!"), 100);
    }
  }
}

// Check if there are no valid moves.
function isGameOver() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) return false;
      if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) return false;
      if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) return false;
    }
  }
  return true;
}

// Listen for arrow key presses.
document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case "ArrowLeft":
      move('left');
      break;
    case "ArrowRight":
      move('right');
      break;
    case "ArrowUp":
      move('up');
      break;
    case "ArrowDown":
      move('down');
      break;
  }
});

// Start a new game when the button is clicked.
document.getElementById('new-game').addEventListener('click', initGame);

// Initialize game on load.
initGame();
