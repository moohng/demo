// @ts-check

class Piece {
  /**
   * 创建棋子
   * @param {string} color 棋子颜色
   */
  constructor(color) {
    /**
     * @readonly
     */
    this.color = color;
  }

  /**
   * 绘制棋子
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number?} radius
   */
  draw(ctx, x, y, radius) {
    // 根据设备类型设置棋子大小
    const isMobile = window.innerWidth <= 768;
    const defaultRadius = isMobile ? 8 : 12;
    const pieceRadius = radius || defaultRadius;

    ctx.beginPath();
    ctx.arc(x, y, pieceRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // 添加棋子边框
    ctx.strokeStyle = this.color === 'black' ? '#333' : '#ccc';
    ctx.lineWidth = isMobile ? 1 : 2;
    ctx.stroke();
    ctx.closePath();
  }
}

export default Piece;
