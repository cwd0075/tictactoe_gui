export class Node {
  constructor(game, args, state, parent = null, action_taken = null) {
    this.game = game;
    this.args = args;
    this.state = state;
    this.parent = parent;
    this.action_taken = action_taken;
    this.children = [];
    this.expandable_moves = game.get_valid_moves(state);
    this.visit_count = 0;
    this.value_sum = 0;
  }
  is_fully_expanded() {
    return (
      //return np.sum(self.expandable_moves) == 0 and len(self.children) > 0
      this.expandable_moves.reduce((a, b) => a + b, 0) === 0 &&
      this.children.length > 0
    );
  }
  select() {
    let best_child = null;
    let best_ucb = -Infinity;
    for (let child of this.children) {
      let ucb = this.get_ucb(child);
      if (ucb > best_ucb) {
        best_child = child;
        best_ucb = ucb;
      }
    }
    return best_child;
  }
  get_ucb(child) {
    let q_value = 1 - (child.value_sum / child.visit_count + 1) / 2;
    return (
      q_value +
      this.args["C"] * Math.sqrt(Math.log(this.visit_count) / child.visit_count)
    );
  }
  expand() {
    //action = np.random.choice(np.where(self.expandable_moves == 1)[0])
    //let action = this.expandable_moves.findIndex((move) => move === 1);
    let action = Math.floor(Math.random() * this.expandable_moves.length);
    while (this.expandable_moves[action] !== 1) {
      action = Math.floor(Math.random() * this.expandable_moves.length);
    }
    this.expandable_moves[action] = 0;
    let child_state = structuredClone(this.state);
    child_state = this.game.get_next_state(child_state, action, 1);
    child_state = this.game.change_perspective(child_state, -1);
    let child = new Node(this.game, this.args, child_state, this, action);
    this.children.push(child);
    return child;
  }
  simulate() {
    let [value, is_terminal] = this.game.get_value_and_terminated(
      this.state,
      this.action_taken
    );
    value = this.game.get_opponent_value(value);
    if (is_terminal) {
      return value;
    }
    let rollout_state = structuredClone(this.state);
    let rollout_player = 1;
    while (true) {
      let valid_moves = this.game.get_valid_moves(rollout_state);
      //action = np.random.choice(np.where(valid_moves == 1)[0])
      //let action = valid_moves.findIndex((move) => move === 1);
      let action = Math.floor(Math.random() * valid_moves.length);
      while (valid_moves[action] !== 1) {
        action = Math.floor(Math.random() * valid_moves.length);
      }
      rollout_state = this.game.get_next_state(
        rollout_state,
        action,
        rollout_player
      );
      [value, is_terminal] = this.game.get_value_and_terminated(
        rollout_state,
        action
      );
      if (is_terminal) {
        if (rollout_player === -1) {
          value = this.game.get_opponent_value(value);
        }
        return value;
      }
      rollout_player = this.game.get_opponent(rollout_player);
    }
  }
  backpropagate(value) {
    this.value_sum += value;
    this.visit_count += 1;
    value = this.game.get_opponent_value(value);
    if (this.parent !== null) {
      this.parent.backpropagate(value);
    }
  }
}

export class MCTS {
  constructor(game, args) {
    this.game = game;
    this.args = args;
  }
  search(state) {
    let root = new Node(this.game, this.args, state);
    for (let search = 0; search < this.args["num_searches"]; search++) {
      let node = root;
      while (node.is_fully_expanded()) {
        node = node.select();
      }
      let [value, is_terminal] = this.game.get_value_and_terminated(
        node.state,
        node.action_taken
      );
      value = this.game.get_opponent_value(value);
      if (!is_terminal) {
        node = node.expand();
        value = node.simulate();
      }
      node.backpropagate(value);
    }
    let action_probs = new Array(this.game.action_size).fill(0);
    for (let child of root.children) {
      action_probs[child.action_taken] = child.visit_count;
    }
    //action_probs /= np.sum(action_probs)
    action_probs = action_probs.map(
      (prob) => prob / action_probs.reduce((a, b) => a + b, 0)
    );
    return action_probs;
  }
}
