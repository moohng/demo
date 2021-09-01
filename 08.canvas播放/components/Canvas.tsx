import React, { useRef, useLayoutEffect, useContext } from 'react';
import { StateContext } from '../state';
import { Path, createPaint, Paint } from '../commons/Paint';
import { useTouchMove } from '../uses';

let currentLine: Path;

const Canvas = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  let paintRef = useRef<Paint>();

  let { state, dispatch } = useContext(StateContext);

  /** 初始化 canvas */
  useLayoutEffect(() => {
    canvasRef.current!.width = innerWidth;
    canvasRef.current!.height = innerHeight;

    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.translate(innerWidth * 0.5, innerHeight * 0.5);
    paintRef.current = createPaint(ctx);
  }, []);

  useLayoutEffect(() => {
    paintRef.current?.setBackground(state.backgroundColor);
    paintRef.current?.drawPath(state.path);
  }, [state.backgroundColor]);

  useLayoutEffect(() => {
    paintRef.current!.color = state.color;
  }, [state.color]);

  useLayoutEffect(() => {
    paintRef.current!.width = state.width;
  }, [state.width]);

  useLayoutEffect(() => {
    if (state.previewMode) {
      state.path.length && startPlay(() => {
        dispatch?.({ type: 'setPlay', payload: false });
        dispatch?.({ type: 'setShowPreviewCover', payload: true });
      });
    } else {
      paintRef.current?.clear();
      paintRef.current?.setBackground(state.backgroundColor);
      paintRef.current?.drawPath(state.path);
    }
  }, [state.previewMode, state.path]);

  useLayoutEffect(() => {
    if (state.preview) {
      state.path.length && startPlay(() => {
        dispatch?.({ type: 'setPreview', payload: false });
      });
    }
  }, [state.preview]);

  useLayoutEffect(() => {
    if (state.previewMode) {
      if (state.play && state.path.length) {
        // 如果播放完成，重新开始播放
        if (paintRef.current?.isComplete) {
          startPlay(() => {
            dispatch?.({ type: 'setPlay', payload: false });
            dispatch?.({ type: 'setShowPreviewCover', payload: true });
          });
        } else {
          // 播放未完成，继续播放
          paintRef.current?.play();
        }
      }
    }
  }, [state.play]);

  const startPlay = (completed?: () => void) => {
    paintRef.current?.clear();
    paintRef.current?.setBackground(state.backgroundColor);
    return paintRef.current?.playPath(state.path, completed);
  };

  const { dot, status } = useTouchMove(canvasRef, !state.previewMode && !state.preview);

  useLayoutEffect(() => {
    if (status === 'down') {
      paintRef.current?.start(dot, state.color, state.width);
      paintRef.current?.drawLine(dot);
      currentLine = {
        width: state.width,
        color: state.color,
        pos: [dot],
      };
    } else if (status === 'move') {
      paintRef.current?.drawLine(dot);
      currentLine.pos.push(dot);
    } else if (status === 'up') {
      paintRef.current?.drawLine(dot);
      const currentPath = [...state.path, currentLine];
      dispatch?.({ type: 'setPath', payload: currentPath });
    }
  }, [dot]);

  const handlePause = () => {
    if (state.previewMode) {
      // 暂停播放
      paintRef.current?.pause();
      dispatch?.({ type: 'setPlay', payload: false});
      dispatch?.({ type: 'setShowPreviewCover', payload: true });
    }
  };

  return <canvas ref={canvasRef} onClick={handlePause} ></canvas>;
};

export default Canvas;
