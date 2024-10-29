import { Path, Dot } from "./Paint";

/**
 * 下载资源
 * @param url 下载链接
 * @param name 下载命名
 */
export function download(url: string, name = String(Date.now())) {
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.click();
}

/**
 * 路径兼容，canvas 原点移到中心点
 * @param path 路径
 * @returns
 */
export function pathFallback(path: Path[]): Path[] {
  return path.map(item => {
    return {
      ...item,
      pos: item.pos.map(({ x, y }) => ({ x: x - 180, y: y - 284 })),
    };
  });
}

/**
 * 坐标点相对中心点
 * @param param0
 * @param param1
 * @returns
 */
export function getRelativeDot({ x, y }: Dot, { width, height }: HTMLCanvasElement): Dot {
  return {
    x: x - width * 0.5,
    y: y - height * 0.5,
  };
}


export function getEnv(): string {
  const ua = window.navigator.userAgent.toLowerCase();
  let env = 'h5';
  if (/miniProgram/i.test(ua)) {
    env = 'miniProgram';
  } else if (/MicroMessenger/i.test(ua)) {
    env = 'weixin';
  }
  return env;
}
