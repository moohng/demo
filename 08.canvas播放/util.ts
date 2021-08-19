import { Path } from "./paint";

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
