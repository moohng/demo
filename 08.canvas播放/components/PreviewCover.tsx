import React, { useState, useEffect } from 'react';

interface Props {
  show?: boolean;
  onAction: ActionCallback;
}

export interface ActionCallback {
  (type: 'play' | 'draw' | 'pwd'): void;
}

const PreviewCover = ({ show = false, onAction = () => {} }: Props) => {

  let [_show, setShow] = useState(show);
  let [opacity, setOpacity] = useState('0');

  useEffect(() => {
    if (show) {
      setShow(true);
      setTimeout(() => {
        setOpacity('1');
      }, 100);
    } else {
      setOpacity('0');
      setTimeout(() => {
        setShow(false);
      }, 400);
    }
  }, [show]);

  return _show ? (
    <div className="preview-cover" style={{ opacity }}>
      <i className="iconfont icon-play" onClick={() => onAction('play')}></i>
      <div className="bottom">
        <a className="btn" href="?edit">我也要玩~</a>
        <a className="btn" onClick={() => onAction('pwd')}>输入口令</a>
      </div>
    </div>
  ) : null;
};

export default PreviewCover;
