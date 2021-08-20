import React, { useRef, useEffect, useState } from 'react';
import { Dot, Path, createPaint, Paint } from '../Paint';
import { getTouchDot } from '../util';

interface Props {
  /** 画笔宽度 */
  width?: number;
  /** 画笔颜色 */
  color?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  mode?: 'preview' | 'draw';
  path?: Path[];
  /** 播放 */
  play?: boolean;
  onDrawChange?: (dot: Dot) => void;
  onDrawEnd?: (path: Path[]) => void;
  onPause: () => void;
}

const pop = () => {};

let currentPath: Path[] = [];
let currentLine: Path;
let painting = false;

const Canvas = ({
  color = '#000000',
  width = 4,
  backgroundColor = '#ffffff',
  mode = 'preview',
  path = [],
  play = false,
  onDrawChange = pop,
  onDrawEnd = pop,
  onPause = pop,
}: Props) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  let paintRef = useRef<Paint>();

  useEffect(() => {
    canvasRef.current!.width = innerWidth;
    canvasRef.current!.height = innerHeight;

    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.translate(innerWidth * 0.5, innerHeight * 0.5);
    paintRef.current = createPaint(ctx);
  }, []);

  useEffect(() => {
    paintRef.current?.setBackground(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    paintRef.current!.color = color;
  }, [color]);

  useEffect(() => {
    paintRef.current!.width = width;
  }, [width]);

  useEffect(() => {
    if (mode === 'preview') {
      path.length && startPlay();
    } else {
      paintRef.current?.clear();
      paintRef.current?.setBackground(backgroundColor);
      paintRef.current?.drawPath(path);
    }
  }, [mode, path]);

  useEffect(() => {
    if (play && mode === 'preview' && path.length) {
      // 如果播放完成，重新开始播放
      if (paintRef.current!.isComplete) {
        startPlay();
      } else {
        // 播放未完成，继续播放
        paintRef.current!.isPlay = true;
      }
    }
  }, [play]);

  const startPlay = () => {
    paintRef.current?.clear();
    paintRef.current?.setBackground(backgroundColor);
    paintRef.current?.playPath(path).then(() => {
      onPause();
    });
  };

  const handleTouchStart = (e: any) => {
    if (mode === 'preview') return;
    painting = true;
    const dot = getTouchDot(e, canvasRef.current!);
    currentLine = {
      width,
      color,
      pos: [dot],
    };
    paintRef.current?.drawLine(dot);
    onDrawChange(dot);
  };

  const handleTouchMove = (e: any) => {
    if (painting) {
      const dot = getTouchDot(e, canvasRef.current!);
      currentLine.pos.push(dot);
      paintRef.current?.drawLine(dot);
      onDrawChange(dot);
    }
  };

  const handleTouchEnd = () => {
    if (painting) {
      painting = false;
      currentPath.push(currentLine);
      paintRef.current?.end();
      onDrawEnd(currentPath);
    }
  };

  const handlePause = () => {
    if (mode === 'preview') {
      // 暂停播放
      paintRef.current!.isPlay = false;
      onPause();
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onClick={handlePause}
      ></canvas>
    </>
  );
};

export default Canvas;
