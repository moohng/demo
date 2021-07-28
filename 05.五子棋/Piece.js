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
  draw(ctx, x, y, radius = 12) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export default Piece;
