class Paint {
  private restarting: boolean;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  drawLine(x: number, y: number) {
    if (this.restarting) {
      this.restarting = false;
      this.ctx.moveTo(x, y);
      this.ctx.beginPath();
    }
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    return this;
  }

  end() {
    this.restarting = true;
    this.ctx.closePath();

    return this;
  }

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}

export default Paint;
