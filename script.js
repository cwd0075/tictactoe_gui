import * as t from "./tictactoe_module.js";
const tictactoe = new t.TicTacToe();
var player = 1;
var state;

const cells = document.querySelectorAll(".cell");
window.startGame = startGame; //if using js6 modules your html events attributes won't work. in that case you must bring your function from global scope to module scope. Just add this to your javascript file: window.functionName= functionName;

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";

  player = 1;
  state = tictactoe.get_initial_state();

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  const squareId = square.target.id;
  const validMoves = tictactoe.get_valid_moves(state);
  console.log(state);
  console.log(validMoves[squareId]);
  if (validMoves[squareId]) {
    document.getElementById(squareId).innerText = player;
    state = tictactoe.get_next_state(state, squareId, player);

    const [value, isTerminal] = tictactoe.get_value_and_terminated(
      state,
      squareId
    );

    if (isTerminal) {
      console.log(state);
      if (value === 1) {
        console.log(player, "won");
        declareWinner(player + " won!");
      } else {
        console.log("draw");
        declareWinner("Tie Game!");
      }
    }
    player = tictactoe.get_opponent(player);
  }
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
}

