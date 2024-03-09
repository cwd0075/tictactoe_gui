function change_perspective(state, player) {
  //return state * player
  return state.map((subArr) => subArr.map((num) => player * num));
} // this file is used as a testing place to check javascript functions

var state = [
  [1, -1, 1],
  [0, 1, 0],
  [1, -1, 1],
];
var neutral_state = change_perspective(state, -1);

console.log(state);
console.log(neutral_state);
