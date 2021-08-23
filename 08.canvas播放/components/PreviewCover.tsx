import React, { useState, useEffect, useContext } from 'react';
import { StateContext } from '../state';

let closeTimer: number;

const PreviewCover = () => {

  const { state, dispatch } = useContext(StateContext);
  let [_show, setShow] = useState(state.showPreviewCover);
  let [opacity, setOpacity] = useState('0');

  useEffect(() => {
    if (state.showPreviewCover) {
      clearTimeout(closeTimer);
      setShow(true);
      setTimeout(() => {
        setOpacity('1');
      }, 50);
    } else {
      setOpacity('0');
      closeTimer = setTimeout(() => {
        setShow(false);
      }, 400);
    }
  }, [state.showPreviewCover]);

  const handlePlay = () => {
    dispatch?.({ type: 'setPlay', payload: true });
    dispatch?.({ type: 'setShowPreviewCover', payload: false });
  };

  const handlePwd = () => {
    dispatch?.({ type: 'setSave', payload: false });
    dispatch?.({ type: 'setShowPwdDialog', payload: true });
  };

  return _show ? (
    <div className="preview-cover" style={{ opacity }}>
      <i className="iconfont icon-play" onClick={handlePlay}></i>
      <div className="bottom">
        <a className="btn" href="?edit">我也要玩~</a>
        <a className="btn" onClick={handlePwd}>输入口令</a>
      </div>
    </div>
  ) : null;
};

export default PreviewCover;
