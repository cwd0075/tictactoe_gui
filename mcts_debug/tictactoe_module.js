export class TicTacToe {
  constructor() {
    this.row_count = 3;
    this.column_count = 3;
    this.action_size = this.row_count * this.column_count;
  }
  get_initial_state() {
    //np.zeros((self.row_count, self.column_count))
    //[ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ]
    return Array.from({ length: this.row_count }, () =>
      Array(this.column_count).fill(0)
    );
  }
  get_next_state(state1, action, player) {
    //let state1 = state2.slice(0);
    //console.log("player in get next state", player);
    const row = Math.floor(action / this.column_count);
    const column = action % this.column_count;
    state1[row][column] = player;
    return state1;
  }
  get_valid_moves(state) {
    //(state.reshape(-1) == 0).astype(np.uint8)
    //[  [1, -1, 0],  [0, 1, 0],  [0, -1, 1]] >> [  0, 0, 1, 1, 0, 1, 1, 0, 0]
    //console.log("state in valid moves", state);
    return state.flat().map((value) => (value === 0 ? 1 : 0));
  }
  check_win(state, action) {
    if (action === null) {
      return false;
    }
    const row = Math.floor(action / this.column_count);
    const column = action % this.column_count;
    const player = state[row][column];
    return (
      // row sum, column sum, diagonal sum, flip diagonal sum
      state[row].reduce((sum, value) => sum + value, 0) ===
        player * this.column_count ||
      state.map((row) => row[column]).reduce((sum, value) => sum + value, 0) ===
        player * this.row_count ||
      state
        .map((row, index) => row[index])
        .reduce((sum, value) => sum + value, 0) ===
        player * this.row_count ||
      state
        .map((row, index) => row[this.row_count - index - 1])
        .reduce((sum, value) => sum + value, 0) ===
        player * this.row_count
    );
  }
  get_value_and_terminated(state, action) {
    if (this.check_win(state, action)) {
      return [1, true];
    }
    if (
      //np.sum(self.get_valid_moves(state)) == 0
      this.get_valid_moves(state).reduce((sum, value) => sum + value, 0) === 0
    ) {
      return [0, true];
    }
    return [0, false];
  }
  get_opponent(player) {
    return -player;
  }
  get_opponent_value(value) {
    return -1 * value;
  }
  change_perspective(state, player) {
    //return state * player
    return state.map((subArr) => subArr.map((num) => player * num));
  }
}
