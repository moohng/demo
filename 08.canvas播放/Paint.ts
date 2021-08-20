export interface Dot {
  x: number;
  y: number;
}

export interface Path {
  pos: Dot[];
  color?: string;
  width?: number;
}

export class Paint {
  private readonly defaultWidth = 6;
  private readonly defaultColor = '#000000';

  private restarting: boolean = true;

  public isPlay: boolean = false;
  public isComplete: boolean = false;

  constructor(private ctx: CanvasRenderingContext2D, color?: string, width: number = 6) {
    this.setBackground();

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.color = color || this.defaultColor;
    this.width = width;
  }

  set color(color: string) {
    this.ctx.strokeStyle = color || this.defaultColor;
  }

  get color(): string {
    return this.ctx.strokeStyle as string;
  }

  set width(width: number) {
    this.ctx.lineWidth = width || this.defaultWidth;
  }

  get width(): number {
    return this.ctx.lineWidth;
  }

  get background(): string {
    return this.ctx.fillStyle as string;
  }

  drawLine({ x, y }: Dot) {
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

  setBackground(color?: string) {
    this.ctx.fillStyle = color || '#ffffff';
    const { width, height } = this.ctx.canvas;
    this.ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(-width / 2, -height / 2, width, height);
  }

  drawPath(path: Path[]) {
    console.log('drawPath', path);
    if (!path.length) return;
    path.forEach(({ pos, color, width }) => {
      this.width = width || this.defaultWidth;
      this.color = color || this.defaultColor;
      pos.forEach((dot) => {
        this.drawLine(dot);
      });
      this.end();
    });
  }

  async playPath(path: Path[]): Promise<void> {
    console.log('playPath', path);
    if (!path.length) return Promise.resolve();

    // 标记已完成
    this.isComplete = true;

    await new Promise((resolve) => {
      let i = 0; // 线
      let j = 0; // 点

      const draw = (dot: Dot) => {
        this.drawLine(dot);
        requestAnimationFrame(run);
      };

      const run = () => {
        if (this.isComplete) {
          this.end();
          return;
        }
        if (!this.isPlay) {
          return requestAnimationFrame(run);
        }
        if (j >= path[i].pos.length) {
          this.end();
          if (++i < path.length) {
            j = 0;
            this.color = path[i].color || this.defaultColor;
            this.width = path[i].width || this.defaultWidth;
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

      setTimeout(() => {
        // 初始化
        this.isPlay = true;
        this.isComplete = false;
        this.color = path[0].color || this.defaultColor;
        this.width = path[0].width || this.defaultWidth;

        run();
      }, 100);
    });
  }
}

let paint: Paint;

export function createPaint(ctx?: CanvasRenderingContext2D) {
  if (paint) {
    return paint;
  }
  if (!ctx) {
    throw new Error('请提供 ctx');
  }
  return new Paint(ctx);
}
