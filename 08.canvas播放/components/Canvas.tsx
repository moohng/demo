import React, { useRef, useEffect, useContext } from 'react';
import { StateContext } from '../state';
import { Dot, Path, createPaint, Paint } from '../Paint';
import { getTouchDot } from '../util';

interface Props {
  onDrawChange?: (dot: Dot) => void;
  onDrawEnd?: (path: Path[]) => void;
}

const pop = () => {};

let currentLine: Path;
let painting = false;

const Canvas = ({
  onDrawChange = pop,
  onDrawEnd = pop,
}: Props) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  let paintRef = useRef<Paint>();

  let { state, dispatch } = useContext(StateContext);

  useEffect(() => {
    canvasRef.current!.width = innerWidth;
    canvasRef.current!.height = innerHeight;

    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.translate(innerWidth * 0.5, innerHeight * 0.5);
    paintRef.current = createPaint(ctx);
  }, []);

  useEffect(() => {
    paintRef.current?.setBackground(state.backgroundColor);
    paintRef.current?.drawPath(state.path);
  }, [state.backgroundColor]);

  useEffect(() => {
    paintRef.current!.color = state.color;
  }, [state.color]);

  useEffect(() => {
    paintRef.current!.width = state.width;
  }, [state.width]);

  useEffect(() => {
    if (state.previewMode) {
      state.path.length && startPlay()?.then(() => {
        dispatch?.({ type: 'setPlay', payload: false });
        dispatch?.({ type: 'setShowPreviewCover', payload: true });
      });
    } else {
      paintRef.current?.clear();
      paintRef.current?.setBackground(state.backgroundColor);
      paintRef.current?.drawPath(state.path);
    }
  }, [state.previewMode, state.path]);

  useEffect(() => {
    if (state.preview) {
      state.path.length && startPlay()?.then(() => {
        dispatch?.({ type: 'setPreview', payload: false });
      });
    }
  }, [state.preview]);

  useEffect(() => {
    if (state.previewMode) {
      if (state.play && state.path.length) {
        // 如果播放完成，重新开始播放
        if (paintRef.current!.isComplete) {
          startPlay()?.then(() => {
            dispatch?.({ type: 'setPlay', payload: false });
            dispatch?.({ type: 'setShowPreviewCover', payload: true });
          });
        } else {
          // 播放未完成，继续播放
          paintRef.current!.isPlay = true;
        }
      }
    }
  }, [state.play]);

  const startPlay = () => {
    paintRef.current?.clear();
    paintRef.current?.setBackground(state.backgroundColor);
    return paintRef.current?.playPath(state.path);
  };

  const handleTouchStart = (e: any) => {
    if (state.previewMode || state.preview) return;
    painting = true;
    const dot = getTouchDot(e, canvasRef.current!);
    currentLine = {
      width: state.width,
      color: state.color,
      pos: [dot],
    };
    paintRef.current!.color = state.color;
    paintRef.current!.width = state.width;
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
      const currentPath = [...state.path, currentLine];
      dispatch?.({ type: 'setPath', payload: currentPath });
      paintRef.current?.end();
      onDrawEnd(currentPath);
    }
  };

  const handlePause = () => {
    if (state.previewMode) {
      // 暂停播放
      paintRef.current!.isPlay = false;
      dispatch?.({ type: 'setPlay', payload: false});
      dispatch?.({ type: 'setShowPreviewCover', payload: true });
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
