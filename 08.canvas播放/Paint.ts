interface Dot {
  x: number;
  y: number;
}

interface Path {
  pos: Dot[];
  color?: string;
  width?: number;
}

class Paint {
  private restarting: boolean;

  public isPlay: boolean = false;
  public isComplete: boolean = false;

  constructor(private ctx: CanvasRenderingContext2D, color: string = '#000000', width: number = 6) {
    this.background = '#fff';

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.color = color;
    this.width = width;
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
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawPath(path: Path[]) {
    this.clear();
    path.forEach(({ pos, color, width }) => {
      this.width = width;
      this.color = color;
      pos.forEach(({ x, y }) => {
        this.drawLine(x, y);
      });
      this.end();
    });
  }

  async playPath(path: Path[]): Promise<void> {
    console.log('path', path);
    if (!path.length) return Promise.resolve();

    this.isPlay = true;
    this.isComplete = false;
    this.clear();

    await new Promise((resolve) => {
      let i = 0; // 线
      let j = 0; // 点

      const draw = ({ x, y }) => {
        this.drawLine(x, y);
        requestAnimationFrame(run);
      };

      const run = () => {
        if (!this.isPlay) {
          return requestAnimationFrame(run);
        }
        if (j >= path[i].pos.length) {
          this.end();
          if (++i < path.length) {
            j = 0;
            this.color = path[i].color;
            this.width = path[i].width;
          } else {
            // 结束
            this.isComplete = true;
            return resolve(void 0);
          }

          setTimeout(() => {
            draw(path[i].pos[j++]);
          }, 240);
        } else {
          draw(path[i].pos[j++]);
        }
      };

      this.color = path[0].color;
      this.width = path[0].width;
      requestAnimationFrame(run);
    });
  }
}

export default Paint;
