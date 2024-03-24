let policy = [1, 2, 7];
let valid_moves = [1, 2, 1];
const a = policy.map(
  (val, idx) => val / policy.reduce((sum, val) => sum + val, 0)
);

console.log(a);
