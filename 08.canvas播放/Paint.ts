class Paint {
  private restarting: boolean;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.background = '#fff';

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.width = 6;
  }

  set color(color: string) {
    this.ctx.strokeStyle = color || '#000000';
  }

  get color(): string {
    return this.ctx.strokeStyle as string;
  }

  set width(width: number) {
    this.ctx.lineWidth = width || 6;
  }

  get width(): number {
    return this.ctx.lineWidth;
  }

  set background(color: string) {
    this.ctx.fillStyle = color || '#ffffff';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  get background(): string {
    return this.ctx.fillStyle as string;
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
