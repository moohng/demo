import { useLayoutEffect, useState } from 'react';
import { getRelativeDot } from '../commons/util';

interface Dot {
  x: number;
  y: number;
}

type Status = 'init' | 'down' | 'move' | 'up';

let painting = false;

/**
 * 获取绘制坐标、状态
 * @param enabled 是否禁用
 * @returns 坐标和状态
 */
export function useTouchMove(canvasRef: React.RefObject<HTMLCanvasElement>, enabled = false): {
  dot: Dot;
  status: Status;
} {
  const [dot, setDot] = useState<Dot>({ x: 0, y: 0 });
  const [status, setStatus] = useState<Status>('init');

  /** 按下 */
  useLayoutEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!enabled) return;
      painting = true;
      setStatus('down');
      const dot = getRelativeDot(getDot(event), canvasRef.current!);
      setDot(dot);
    };

    canvasRef.current!.addEventListener('touchstart', handler, false);
    canvasRef.current!.addEventListener('mousedown', handler, false);

    return () => {
      canvasRef.current!.removeEventListener('touchstart', handler, false);
      canvasRef.current!.removeEventListener('mousedown', handler, false);
    };
  }, []);

  /** 移动 */
  useLayoutEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (!enabled || !painting) return;
      setStatus('move');
      const dot = getRelativeDot(getDot(event), canvasRef.current!);;
      setDot(dot);
    };

    canvasRef.current!.addEventListener('touchmove', handler, false);
    canvasRef.current!.addEventListener('mousemove', handler, false);

    return () => {
      canvasRef.current!.removeEventListener('touchmove', handler, false);
      canvasRef.current!.removeEventListener('mousemove', handler, false);
    };
  }, []);

  /** 结束 */
  useLayoutEffect(() => {
    const handler = () => {
      if (!enabled || !painting) return;
      painting = false;
      setStatus('up');
    };

    canvasRef.current!.addEventListener('touchend', handler, false);
    canvasRef.current!.addEventListener('mouseup', handler, false);

    return () => {
      canvasRef.current!.removeEventListener('touchend', handler, false);
      canvasRef.current!.removeEventListener('mouseup', handler, false);
    };
  }, []);

  return { dot, status };
}

function getDot(event: MouseEvent | TouchEvent): Dot {
  if (event instanceof TouchEvent) {
    const {  clientX: x, clientY: y } = event.touches[0];
    return { x, y };
  }
  const { clientX: x, clientY: y } = event;
  return { x, y };
}
