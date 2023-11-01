const arr = [4, 6, 32, 12, 42, 12, 45, 77, 86, 43, 22];

const ans = arr.reduce((acc, curr, index, arr) => {
  console.log(index);
  return (acc += curr);
}, 10000);

console.log(ans);
