const a = [0, 0, 1, 1, 0, 1, 1, 0, 1];
const b = a.reduce((sum, value) => sum + value, 0);
console.log(b);
