// @ts-check

class Canvas {
  /**
   * @readonly 宽度
   * @type {number}
   */
  width = 0;

  /**
  * @readonly 高度
   * @type {number}
  */
  height = 0;

  /**
   * @constructor 创建画布
   * @param {string} root 画布 root
   * @param {number?} width 画布宽度
   * @param {number?} height 画布高度
   */
  constructor(root, width, height) {
    /**
     * canvas实例
     * @readonly
     * @type {HTMLCanvasElement}
     */
    this.instance = document.createElement('canvas');

    const parent = document.querySelector(root) || document.body;
    parent.appendChild(this.instance);

    if (!width || !height) {
      // 计算可用空间
      const isMobile = window.innerWidth <= 768;
      const padding = isMobile ? 24 : 40; // 棋盘容器的内边距
      const headerHeight = isMobile ? 56 : 76; // 顶部状态栏高度
      const footerHeight = isMobile ? 48 : 60; // 底部按钮高度
      const maxContentHeight = window.innerHeight - headerHeight - footerHeight - padding * 2;
      const maxContentWidth = isMobile ? window.innerWidth - padding * 2 : Math.min(window.innerWidth - padding * 2, 768);
      
      // 取最小值确保为正方形
      const size = Math.min(maxContentWidth, maxContentHeight);
      this.width = size;
      this.height = size;
    } else {
      this.width = width;
      this.height = height;
    }

    this.instance.width = this.width;
    this.instance.height = this.height;
  }

  /**
   * canvas 上下文
   * @type {CanvasRenderingContext2D}
   */
  get ctx() {
    return this.instance?.getContext('2d');
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }
}

export default Canvas;
