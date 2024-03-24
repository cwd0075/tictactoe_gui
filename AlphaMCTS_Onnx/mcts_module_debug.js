import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/esm/ort.min.js";
export class Node {
  constructor(
    game,
    args,
    state,
    parent = null,
    action_taken = null,
    prior = 0
  ) {
    this.game = game;
    this.args = args;
    this.state = state;
    this.parent = parent;
    this.action_taken = action_taken;
    this.children = [];
    //this.expandable_moves = game.get_valid_moves(state);
    this.visit_count = 0;
    this.value_sum = 0;
    this.prior = prior;
  }
  is_fully_expanded() {
    return (
      //return len(self.children) > 0

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
    let q_value = 0;
    if (child.visit_count === 0) {
      q_value = 0;
    } else {
      q_value = 1 - (child.value_sum / child.visit_count + 1) / 2;
    }
    return (
      q_value +
      this.args["C"] *
        (Math.sqrt(this.visit_count) / (child.visit_count + 1)) *
        child.prior
    );
  }

  expand(policy) {
    for (let action = 0; action < policy.length; action++) {
      let prob = policy[action];
      if (prob > 0) {
        let child_state = structuredClone(this.state);
        child_state = this.game.get_next_state(child_state, action, 1);
        child_state = this.game.change_perspective(child_state, -1);
        let child = new Node(
          this.game,
          this.args,
          child_state,
          this,
          action,
          prob
        );
        this.children.push(child);
      }
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
  constructor(game, args, session) {
    this.game = game;
    this.args = args;
    this.session = session;
  }
  async search(state) {
    console.log("run search now!"); //debug delete
    let root = new Node(this.game, this.args, state);
    for (let search = 0; search < this.args["num_searches"]; search++) {
      console.log("search time ", search); //debug delete
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
        let encodedstate = this.game.get_encoded_state(node.state);
        console.log(encodedstate); //debug delete
        let flattenstate = this.game.flatten3DArray(encodedstate);
        console.log(flattenstate); //debug delete

        let tensorA = new ort.Tensor("float32", flattenstate, [1, 3, 3, 3]);

        console.log(tensorA); // debug delete
        //console.log(this.session.inputNames);
        let feeds = { "input.1": tensorA };
        //console.log(this.session.outputNames);
        let results = await this.session.run(feeds);

        value = Array.from(results["123"].data)[0];
        console.log(value); // debug delete
        let policy = Array.from(results["117"].data);
        console.log(policy); // debug delete
        let policy_np = this.game.softmax(policy);
        console.log(policy_np); // debug delete
        let valid_moves = this.game.get_valid_moves(node.state);
        //policy *= valid_moves
        let policy_np_valid = policy_np.map(
          (value, index) => value * valid_moves[index]
        );
        console.log(valid_moves); // debug delete
        console.log(policy_np_valid); //debug delete

        //policy /= np.sum(policy)
        let normalize_policy = policy_np_valid.map(
          (val, idx) => val / policy_np_valid.reduce((sum, val) => sum + val, 0)
        );
        console.log(normalize_policy); // debug delete
        node.expand(normalize_policy);
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
