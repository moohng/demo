const arr = new Array(10000 * 100).fill(3);

// for
const map1 = new Map();
console.time('for');
for (let i = 0, len = arr.length; i < len; i++) {
  map1.set(i, arr[i]);
}
console.timeEnd('for');
console.log('map1', map1.size);

// for of
const map2 = new Map();
let index = 0;
console.time('for...of');
for (const item of arr) {
  map2.set(index++, item);
}
console.timeEnd('for...of');
console.log('map2', map2.size);

// forEach
const map3 = new Map();
console.time('forEach');
arr.forEach((item, index) => {
  map3.set(index, item);
});
console.timeEnd('forEach');
console.log('map3', map3.size);

// for in
const map4 = new Map();
console.time('for...in');
for (const key in arr) {
  map4.set(key, arr[key]);
}
console.timeEnd('for...in');
console.log('map4', map4.size);

// for keys
const map5 = new Map();
console.time('for...keys');
Object.keys(arr).forEach(key => {
  map5.set(key, arr[key]);
});
console.timeEnd('for...keys');
console.log('map5', map5.size);
