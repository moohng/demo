import { random } from '../lib/tools';

/**
 * @param {string} s
 * @return {number}
 */
 var firstUniqChar = function(s) {
  // const map = {}; // 565.696ms
  const map = Object.create(null); // 532.137ms
  // const map = new Map(); // 819.727ms
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] || 0) + 1;
    // map.set(s[i], (map.get(s[i] || 0) + 1));
  }
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] === 1) {
    // if (map.get(s[i]) === 1) {
      return i;
    }
  }
  return -1;
};

let str = '';
const x = 'qwertyuioplkjhgfdsazxcvbnm';
for (let i = 0; i < 10000000; i++) {
  str += x[random(0, x.length - 1,  true)];
}

console.time('runtime');

const res = firstUniqChar(str);

console.timeEnd('runtime');
// console.log(str);
console.log(res);
