// @ts-check

/**
 * 获取半径范围
 * @param {number} x 中点坐标
 * @param {number} len 坐标系总长度
 * @param {number} radius 范围半径
 * @returns {[number, number]}
 */
export function getRange(x, len, radius = 4) {
  const start = x - Math.min(x, radius);
  const end = x + Math.min(len - x - 1, radius);
  return [start, end];
}

/**
 * 判断范围内指定条件连续出现的次数是否达到最大数
 * @typedef {(index: number) => boolean} ConditionCallback
 * @param {number} start 范围
 * @param {number} end 范围
 * @param {number} maxCount 最大次数
 * @param {ConditionCallback} fn 判断条件
 * @returns {boolean}
 */
export function isUptoMaxCount(start, end, maxCount, fn) {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (fn(i)) {
      count++;
      if (count >= maxCount) {
        return true;
      }
    } else {
      count = 0;
    }
  }
  return false;
}

/**
 * 判断范围内指定条件连续出现的次数是否达到最大数（二维）
 * @typedef {(x: number, y: number) => boolean} ConditionCallback2D
 * @param {{x: number, y: number}} start 范围
 * @param {{x: number, y: number}} end 范围
 * @param {number} maxCount 最大次数
 * @param {ConditionCallback2D} fn 判断条件
 */
export function isUptoMaxCount2D(start, end, maxCount, fn) {
  let count = 0;
  for (let i = start.x, j = start.y; i <= end.x && j <= end.y; i++, j++) {
    if (fn(i, j)) {
      count++;
      if (count >= maxCount) {
        return true;
      }
    } else {
      count = 0;
    }
  }
  return false;
}
