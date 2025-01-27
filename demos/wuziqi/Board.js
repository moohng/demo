// @ts-check

import Canvas from './Canvas.js';
import Piece from './Piece.js';
import { getRange, isUptoMaxCount, isUptoMaxCount2D } from './utils.js';

class Board {
  /**
   * @constructor 创建棋盘
   * @param {Canvas} canvas 画布
   * @param {number?} blankWidth 棋盘间隔宽度
   */
  constructor(canvas, blankWidth) {
    /**
     * 间隔宽度
     * @readonly
     */
    // 移动端使用更小的格子间距，以显示更多格子
    const isMobile = window.innerWidth <= 768;
    this.blankWidth = blankWidth || (isMobile ? 18 : 28);

    /**
     * 画布
     * @readonly
     */
    this.canvas = canvas;

    // 计算棋盘格子数量
    const minGridCount = isMobile ? 23 : 15; // 移动端使用23路棋盘
    
    /**
     * 棋盘列数
     * @readonly
     */
    this.columnCount = Math.max(minGridCount, Math.floor(this.canvas.width / this.blankWidth));
    
    /**
     * 棋盘行数
     * @readonly
     */
    this.rowCount = Math.max(minGridCount, Math.floor(this.canvas.height / this.blankWidth));

    /**
     * 宽度
     * @readonly
     */
    this.width = this.blankWidth * (this.columnCount - 1);
    
    /**
     * 高度
     * @readonly
     */
    this.height = this.blankWidth * (this.rowCount - 1);
    
    /**
     * 左边距
     * @readonly
     */
    this.left = (this.canvas.width - this.width) / 2;
    
    /**
     * 上边距
     * @readonly
     */
    this.top = (this.canvas.height - this.height) / 2;
    
    /**
     * 右边距
     * @readonly
     */
    this.right = this.left + this.width;
    
    /**
     * 下边距
     * @readonly
     */
    this.bottom = this.top + this.height;

    // 初始化
    this.init();

    // 监听点击事件
    this.canvas.instance?.addEventListener('click', this.handleClick.bind(this));
    
    // 添加触摸事件支持
    this.canvas.instance?.addEventListener('touchstart', (e) => {
      e.preventDefault(); // 阻止默认行为
      const touch = e.touches[0];
      const rect = this.canvas.instance?.getBoundingClientRect();
      if (!rect) return;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.handleClick({ offsetX: x, offsetY: y });
    });
  }

  /**
   * 初始化数据
   * @private
   */
  init() {
    /**
     * 是否开始
     */
    this.isStart = false;
    /**
     * 落子的坐标记录
     * @type {[number, number][]}
     */
    this.pieces = [];

    /**
     * 下一步落子方 （白、黑）
     * @private
     * @type {'black' | 'white'}
     */
    this.nextStep = 'black';

    /**
     * 当前落子方 （白、黑）
     * @private
     * @type {'black' | 'white'}
     */
    this.currentStep = 'black';

    /**
     * 棋盘的2维数组
     * @type {(0 | 'black' | 'white')[][]}
     */
    this.cheeks = (() => {
      const arr = [];
      for (let i = 0; i < this.rowCount; i++) {
        arr[i] = new Array(this.columnCount).fill(0);
      }
      return arr;
    })();
  }

  /**
   * 绘制
   */
  draw() {
    const ctx = this.canvas.ctx;
    ctx.beginPath();
    // 横
    for (let i = 0; i < this.rowCount; i++) {
      const y = this.top + i * this.blankWidth;
      ctx.moveTo(this.left, y);
      ctx.lineTo(this.right, y);
    }
    // 竖
    for (let i = 0; i < this.columnCount; i++) {
      const x = this.left + i * this.blankWidth;
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
    }
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * 开始
   */
  start() {
    this.isStart = true;
  }

  /**
   * 重新开始
   */
  reset() {
    this.canvas.clear();
    this.init();
    this.draw();
    this.start();
  }

  /**
   * 是否可以落子
   * @private
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  canDropdown(x, y) {
    return this.cheeks[y][x] === 0;
  }

  /**
   * 计算棋局结果
   * @private
   * @param {number} x
   * @param {number} y
   */
  calcResult(x, y) {
    const result =
      this.left2right(x, y) ||
      this.top2bottom(x, y) ||
      this.leftTop2rightBottom(x, y) ||
      this.leftBottom2rightTop(x, y);
    if (result) {
      alert('恭喜，' + this.currentStep + '获胜！');

      location.reload();
    }
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  left2right(x, y) {
    // 获取左右半径为4的范围
    const [start, end] = getRange(x, this.columnCount, 4);
    return isUptoMaxCount(start, end, 5, (index) => this.cheeks[y][index] === this.currentStep);
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  top2bottom(x, y) {
    // 获取上下半径为4的范围
    const [start, end] = getRange(y, this.rowCount, 4);
    return isUptoMaxCount(start, end, 5, (index) => this.cheeks[index][x] === this.currentStep);
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  leftTop2rightBottom(x, y) {
    // 左上最小半径
    const startMinRadius = Math.min(x, y, 4);
    // 左上坐标点
    const startX = x - startMinRadius;
    const startY = y - startMinRadius;

    // 右下最小半径
    const endMinRadius = Math.min(this.columnCount - x - 1, this.rowCount - y - 1, 4);
    // 右下坐标点
    const endX = x + endMinRadius;
    const endY = y + endMinRadius;

    return isUptoMaxCount2D(
      { x: startX, y: startY },
      { x: endX, y: endY },
      5,
      (i, j) => this.cheeks[j][i] === this.currentStep
    );
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  leftBottom2rightTop(x, y) {
    // 左下最小半径
    const startMinRadius = Math.min(x, this.rowCount - y - 1, 4);
    // 左下坐标点
    const startX = x - startMinRadius;
    const endY = y + startMinRadius;

    // 右上最小半径
    const endMinRadius = Math.min(this.columnCount - x - 1, y, 4);
    // 右上坐标点
    const endX = x + endMinRadius;
    const startY = y - endMinRadius;

    return isUptoMaxCount2D(
      { x: startX, y: startY },
      { x: endX, y: endY },
      5,
      (i, j) => {
        return this.cheeks[endY - (j - startY)][i] === this.currentStep;
      }
    );
  }

  /**
   * 处理点击事件
   * @private
   * @param {{ offsetX: number, offsetY: number }} param0
   */
  handleClick({ offsetX: x, offsetY: y }) {
    if (!this.isStart) return;

    // 获取画布的实际显示尺寸
    const rect = this.canvas.instance.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    // 计算实际坐标
    const realX = x * scaleX;
    const realY = y * scaleY;

    // 计算落子位置
    let xWhere = Math.round((realX - this.left) / this.blankWidth);
    let yWhere = Math.round((realY - this.top) / this.blankWidth);

    // 边界检查
    if (xWhere < 0 || xWhere >= this.columnCount || yWhere < 0 || yWhere >= this.rowCount) {
      console.log('超出边界', xWhere, yWhere);
      return;
    }

    // 判断是否可落子
    if (!this.canDropdown(xWhere, yWhere)) {
      console.log('已有棋子', xWhere, yWhere);
      return;
    }

    const piece = new Piece(this.nextStep);
    piece.draw(
      this.canvas.ctx,
      xWhere * this.blankWidth + this.left,
      yWhere * this.blankWidth + this.top
    );

    // 落子记录
    this.pieces.push([xWhere, yWhere]);
    // 棋盘二维数组标记
    this.cheeks[yWhere][xWhere] = this.nextStep;

    this.currentStep = this.nextStep;
    this.nextStep = this.nextStep === 'black' ? 'white' : 'black';

    // 判断棋局结果
    this.calcResult(xWhere, yWhere);
  }
}

export default Board;
