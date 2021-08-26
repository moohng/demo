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
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  start({ x, y }: Dot, color = this.defaultColor, width = this.defaultWidth) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.color = color;
    this.width = width;
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
    console.log('绘制轨迹', path);
    if (!path.length) return;
    path.forEach(({ pos, color, width }) => {
      this.start(pos[0], color, width);
      pos.forEach((dot) => {
        this.drawLine(dot);
      });
    });
  }

  playPath(path: Path[]): Promise<void> {
    console.log('播放轨迹', path);
    if (!path.length) return Promise.resolve();

    // 标记已完成（结束上一次播放）
    this.isComplete = true;

    return new Promise((resolve) => {
      let i = 0; // 线
      let j = 0; // 点

      const run = () => {
        // 结束绘制（下一次播放的时候要结束上一次播放）
        if (this.isComplete) {
          return;
        }

        // 暂停（原地死循环，便于继续播放）
        if (!this.isPlay) {
          requestAnimationFrame(run);
          return;
        }

        if (j < path[i].pos.length) {
          // 绘制第 n 条轨迹
          this.drawLine(path[i].pos[j++]);
          requestAnimationFrame(run);
        } else {
          // 一条轨迹制完成
          if (++i < path.length) {
            // 初始化下一条轨迹
            j = 0;
            const { pos, color, width } = path[i];
            this.start(pos[0], color, width);

            // 延时一会儿开始绘制下一条轨迹
            setTimeout(() => {
              // this.drawLine(pos[j++]);
              requestAnimationFrame(run);
            }, 240);
          } else {
            // 结束
            this.isComplete = true;
            resolve();
          }
        }
      };

      setTimeout(() => {
        // 初始化第一条轨迹
        this.isPlay = true;
        this.isComplete = false;

        const { pos, color, width } = path[0];
        this.start(pos[0], color, width);

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
