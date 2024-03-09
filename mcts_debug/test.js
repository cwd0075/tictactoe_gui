function get_ucb() {
  let child_value_sum = 0;
  let child_visit_count = 1;
  let this_visit_count = 8;
  let q_value = 1 - (child_value_sum / child_visit_count + 1) / 2;

  return (
    q_value + 1.41 * Math.sqrt(Math.log(this_visit_count) / child_visit_count)
  );
}
var neutral_state = get_ucb();

console.log(neutral_state);
