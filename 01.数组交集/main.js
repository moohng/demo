// @ts-check
import { run, generateArray, random } from '../lib/tools';

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
export function intersect(nums1, nums2) {
  const map = new Map();
  for (let i = 0, len = nums1.length; i < len; i++) {
    const key = nums1[i];
    const val = map.get(key) || 0;
    map.set(key, val + 1);
  }
  const res = [];
  for (let i = 0, len = nums2.length; i < len; i++) {
    const key = nums2[i];
    const val = map.get(key);
    if (val > 0) {
      res.push(key);
      map.set(key, val - 1);
    }
  }
  return res;
}

const length = 1e6

const num1 = generateArray(length, () => random(0, 1e10, true));
const num2 = generateArray(length, () => random(0, 1e10, true));

run(intersect, num1, num2);
