import * as t from "./tictactoe_module.js";
import * as m from "./mcts_module.js";
const tictactoe = new t.TicTacToe();
let args = {
  C: 1.41,
  num_searches: 1000,
};
const mcts = new m.MCTS(tictactoe, args);
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
  turn(square.target.id);
}

function turn(squareId) {
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
    } else {
      player = tictactoe.get_opponent(player);
      if (player === -1) {
        aiTurn();
      }
    }
  }
}
function aiTurn() {
  let neutral_state = tictactoe.change_perspective(state, player);
  let mcts_probs = mcts.search(neutral_state);
  console.log(mcts_probs);
  //action = np.argmax(mcts_probs)
  let action = mcts_probs.indexOf(Math.max(...mcts_probs));
  document.getElementById(action).innerText = player;
  state = tictactoe.get_next_state(state, action, player);

  const [value, isTerminal] = tictactoe.get_value_and_terminated(state, action);

  if (isTerminal) {
    console.log(state);
    if (value === 1) {
      console.log(player, "won");
      declareWinner(player + " won!");
    } else {
      console.log("draw");
      declareWinner("Tie Game!");
    }
  } else {
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
