import React, { useState, useEffect, useContext } from 'react';
import { StateContext } from '../state';
import { TypeKeys } from '../state/types';
import wx from 'weixin-js-sdk';

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
    dispatch?.({ type: TypeKeys.SET_PLAY, payload: true });
    dispatch?.({ type: TypeKeys.SET_SHOW_PREVIEW_COVER, payload: false });
  };

  const handlePwd = () => {
    dispatch?.({ type: TypeKeys.SET_SAVE, payload: false });
    dispatch?.({ type: TypeKeys.SET_SHOW_PWD_DIALOG, payload: true });
  };

  const handleGoPlay = () => {
    if (state.env === 'miniProgram') {
      wx.miniProgram.reLaunch({ url: '/pages/index/index' });
    } else {
      location.search = '?edit';
    }
  };

  return _show ? (
    <div className="preview-cover" style={{ opacity }}>
      <i className="i-ri:play-fill" onClick={handlePlay}></i>
      <div className="bottom">
        <a className="btn" onClick={handleGoPlay}>我也要玩~</a>
        <a className="btn" onClick={handlePwd}>输入口令</a>
      </div>
    </div>
  ) : null;
};

export default PreviewCover;
