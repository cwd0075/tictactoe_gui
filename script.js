class TicTacToe {
  constructor() {
    this.row_count = 3;
    this.column_count = 3;
    this.action_size = this.row_count * this.column_count;
  }

  getInitialState() {
    const myArray = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    return myArray;
  }

  getNextState(state, action, player) {
    const row = Math.floor(action / this.column_count);
    const column = action % this.column_count;
    state[row][column] = player;
    return state;
  }

  getValidMoves(state) {
    let b = [];

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        // If the current element in `a` is non-zero, add 1 to `b`.
        // Otherwise, add 0 to `b`.
        b.push(state[i][j] !== 0 ? 0 : 1);
      }
    }
    return b;
  }

  checkWin(state, action) {
    const row = Math.floor(action / this.column_count);
    const column = action % this.column_count;
    const player = state[row][column];

    let row_sum = 0;
    for (let j = 0; j < state[row].length; j++) {
      row_sum += state[row][j];
    }

    let col_sum = 0;
    for (let j = 0; j < state.length; j++) {
      col_sum += state[j][column];
    }

    let diagSum = 0;

    for (let i = 0; i < state.length; i++) {
      diagSum += state[i][i];
    }

    let arr = structuredClone(state);
    for (let i = 0; i < arr.length; i++) {
      arr[i].reverse();
    }

    let flipdiagSum = 0;
    for (let i = 0; i < arr.length; i++) {
      flipdiagSum += arr[i][i];
    }

    return (
      row_sum == player * this.column_count ||
      col_sum == player * this.row_count ||
      diagSum == player * this.row_count ||
      flipdiagSum == player * this.row_count
    );
  }

  getValueAndTerminated(state, action) {
    if (this.checkWin(state, action)) {
      return [1, 1]; // value, terminated
    }
    const arr = this.getValidMoves(state);
    const sum = arr.reduce((acc, val) => acc + val, 0);
    if (sum == 0) {
      return [0, 1];
    }
    return [0, 0]; // value, terminated
  }

  getOpponent(player) {
    return -player;
  }
}

var origBoard;
//const huPlayer = "1";
//const aiPlayer = "-1";
const tictactoe = new TicTacToe();
var player = 1;
var state = tictactoe.getInitialState();

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  player = 1;
  state = tictactoe.getInitialState();
  //create any array of 0-8
  //console.log(origBoard);
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  const squareId = square.target.id;
  const validMoves = tictactoe.getValidMoves(state);
  console.log(state);
  console.log(validMoves[squareId]);
  if (validMoves[squareId]) {
    document.getElementById(squareId).innerText = player;
    state = tictactoe.getNextState(state, squareId, player);

    const [value, isTerminal] = tictactoe.getValueAndTerminated(
      state,
      squareId
    );

    if (isTerminal) {
      console.log(state);
      if (value === 1) {
        console.log(player, "won");
      } else {
        console.log("draw");
      }
    }
    player = tictactoe.getOpponent(player);
  }
}

function turn(squareId, inplayer) {
  document.getElementById(squareId).innerText = inplayer;
}
