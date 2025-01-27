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

    ctx.save();

    // 绘制阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = pieceRadius / 2;
    ctx.shadowOffsetX = pieceRadius / 6;
    ctx.shadowOffsetY = pieceRadius / 6;

    // 创建径向渐变
    const gradient = ctx.createRadialGradient(
      x - pieceRadius / 2,
      y - pieceRadius / 2,
      pieceRadius / 8,
      x,
      y,
      pieceRadius
    );

    if (this.color === 'black') {
      gradient.addColorStop(0, '#666');
      gradient.addColorStop(0.3, '#333');
      gradient.addColorStop(1, '#000');
    } else {
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(0.3, '#eee');
      gradient.addColorStop(1, '#ddd');
    }

    // 绘制棋子主体
    ctx.beginPath();
    ctx.arc(x, y, pieceRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制高光
    const highlightGradient = ctx.createRadialGradient(
      x - pieceRadius / 2,
      y - pieceRadius / 2,
      pieceRadius / 8,
      x,
      y,
      pieceRadius
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(x, y, pieceRadius, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();

    // 绘制边框
    ctx.strokeStyle = this.color === 'black' ? '#333' : '#ccc';
    ctx.lineWidth = isMobile ? 1 : 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

export default Piece;
