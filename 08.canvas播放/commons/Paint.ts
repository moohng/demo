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

  private row = 0;
  private column = 0;
  private stop = false;
  private path: Path[] = [];
  public isComplete = false;

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

  /**
   * 绘制轨迹
   * @param param 坐标点
   */
  drawLine({ x, y }: Dot) {
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  /**
   * 开始绘制轨迹
   * @param dot 坐标点
   * @param color 轨迹颜色
   * @param width 轨迹宽度
   */
  start({ x, y }: Dot, color = this.defaultColor, width = this.defaultWidth) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.color = color;
    this.width = width;
  }

  /**
   * 设置背景
   * @param color 背景颜色
   */
  setBackground(color?: string) {
    this.ctx.fillStyle = color || '#ffffff';
    const { width, height } = this.ctx.canvas;
    this.ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  /**
   * 清空画布
   */
  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(-width / 2, -height / 2, width, height);
  }

  /**
   * 绘制路径
   * @param path 路径
   * @returns
   */
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

  /**
   * 从头绘制路径
   * @param path 路径
   * @param completed 完成回调
   * @returns
   */
  playPath(path: Path[], completed?: () => void) {
    console.log('播放轨迹', path);
    if (!path.length) return Promise.resolve();

    this.path = path;

    // 初始化
    this.row = 0;
    this.column = 0;
    this.stop = false;
    this.isComplete = false;

    const { pos, color, width } = path[0];
    this.start(pos[0], color, width);

    this.run(completed);
    if (completed) {
      this.completed = completed;
    }
  }

  private completed() {}

  private run(completed = this.completed) {
    // 结束绘制（下一次播放的时候要结束上一次播放）
    if (this.stop) {
      return;
    }

    if (this.column < this.path[this.row].pos.length) {
      // 绘制第 n 条轨迹
      this.drawLine(this.path[this.row].pos[this.column++]);
      setTimeout(() => this.run(), 16.7);
    } else {
      // 一条轨迹制完成
      if (++this.row < this.path.length) {
        // 初始化下一条轨迹
        this.column = 0;
        const { pos, color, width } = this.path[this.row];
        this.start(pos[0], color, width);

        // 延时一会儿开始绘制下一条轨迹
        setTimeout(() => {
          setTimeout(() => this.run(), 16.7);
        }, 240);
      } else {
        // 结束
        this.isComplete = true;
        completed();
      }
    }
  }

  /**
   * 暂停播放
   */
  pause() {
    this.stop = true;
  }

  /**
   * 继续播放
   * @param completed 完成回调
   */
  play(completed?: () => void) {
    this.stop = false;
    this.run(completed);
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
