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
      // 移动端使用更大的尺寸
      const isMobile = window.innerWidth <= 768;
      const minScreenSize = Math.min(window.innerWidth, window.innerHeight);
      const size = isMobile ? Math.min(minScreenSize * 0.9, 600) : Math.min(minScreenSize, 768);
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
