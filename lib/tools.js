/**
 * 函数运行时间
 * @param {Function} func
 * @param  {...any} args
 */
export async function run(func, ...args) {
  console.log('输入', ...args);
  console.time(func.name);
  const result = await func(...args);
  console.timeEnd(func.name);
  console.log('输出', result);
}

/**
 * 生成随机数
 * @param {Number} start
 * @param {Number} end
 * @param {Boolean} isInt
 * @returns {Number}
 */
export function random(start = 0, end = 1, isInt = false) {
  const res = start + Math.random() * (end - start);
  return isInt ? Math.floor(res) : res;
}

/**
 * 生成数组
 * @param {number} length
 * @param {function} func
 * @returns {number[]}
 */
export function generateArray(length, func = () => random(0, 100)) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(func(i));
  }
  return arr;
}
