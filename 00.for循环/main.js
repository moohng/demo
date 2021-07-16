// @ts-check
// console.time('执行时间');

// let sum = 0;
// const len = 20000; // 269ms
// for (let i = 0; i < len; i++) {
//   for (let j = 0; j < len; j++) {
//     sum++
//   }
// }

const arr = new Array(10000000).fill(0);

console.log('start');
console.time('执行时间');
let sum = 0;
// for (let item of arr) {
//   sum++;
// }

for (let i = 0; i < 10000000; i++) {
  sum++;
}

// let i = 0;
// while (i < 10000000) {
//   sum++;
//   i++;
// }

console.timeEnd('执行时间');
console.log(sum);

// const map = Object.create(null); // 1.236s 1.213s
// const map = {}; // 1.235s 1.189s
// const map = new Map(); // 1.753s 1.693s

// for (let i = 0; i < 10000000; i++) {
//   // map[String(i)] = i * 2;
//   map.set(String(i), i * 2);
// }

// let val;
// for (let [key, value] of map) {
//   // val = map[key]; // 4.194s          4.159s
//   val = value;
// }

// console.timeEnd('执行时间');
// console.log(val);
