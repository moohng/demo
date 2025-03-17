import React, { useContext, MouseEventHandler, FormEventHandler } from 'react';
import { Toast } from '@moohng/tui';
import * as dan from '@moohng/dan';
import { StateContext } from '../state';
import { download } from '../commons/util';
import { TypeKeys } from '../state/types';

const colorList = ['#ffffff', '#000000', '#FF3333', '#0066FF', '#FFFF33', '#33CC66'];

const widthList = [
  { value: 2, width: 4 },
  { value: 4, width: 6 },
  { value: 6, width: 8 },
  { value: 12, width: 10 },
  { value: 20, width: 12 },
  { value: 30, width: 14 },
];

const ToolBar = () => {

  const { state, dispatch } = useContext(StateContext);

  const handleColorSelect: MouseEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      dispatch?.({ type: TypeKeys.SET_COLOR, payload: target.value });
    }
  };

  const handleWidthSelect: MouseEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      dispatch?.({ type: TypeKeys.SET_WIDTH, payload: +(target).value });
    }
  };

  const handleColorInput: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    dispatch?.({ type: TypeKeys.SET_COLOR, payload: target.value });
  }

  const handleBgColorInput: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    dispatch?.({ type: TypeKeys.SET_BACKGROUND_COLOR, payload: target.value });
  }

  /** 操作 */

  const handleRevoke = () => {
    if (state.preview) return;
    const path = state.path.slice(0, state.path.length - 1);
    dispatch?.({ type: TypeKeys.SET_PATH, payload: path});
  };

  const handleClear = () => {
    if (state.preview) return;
    dispatch?.({ type: TypeKeys.SET_PATH, payload: [] });
  };

  const handlePreview = () => {
    if (state.preview) return;
    if (!state.path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    dispatch?.({ type: TypeKeys.SET_PREVIEW, payload: true });
  };

  const handleDownload = () => {
    if (!state.path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    if (state.env === 'miniProgram') {
      //
    } else if (state.env === 'h5') {
      download(document.querySelector('canvas')?.toDataURL()!);
    } else if (state.env === 'weixin') {
      // wx.downloadImage({
      //   serverId: document.querySelector('canvas')?.toDataURL()!,
      //   success: (res: any) => {
      //     alert(JSON.stringify(res));
      //   },
      //   fail: (err: any) => {
      //     alert(JSON.stringify(err));
      //   }
      // });
    }
  };

  const handleShare = () => {
    if (!state.path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    // 生成随机口令
    const code = dan.random(8) as string;

    dispatch?.({ type: TypeKeys.SET_CODE, payload: code });
    dispatch?.({ type: TypeKeys.SET_SAVE, payload: true });
    dispatch?.({ type: TypeKeys.SET_SHOW_PWD_DIALOG, payload: true });
  };

  return !state.previewMode ? (
    <>
      {/* <!-- 操作区域 --> */}
      <ul className="toolbar">
        <li className="button" onClick={handleRevoke}><i className="i-ri:arrow-go-back-line" /></li>
        <li className="button" onClick={handleClear}><i className="i-ri:delete-bin-line" /></li>
        <li className="button" onClick={handlePreview}><i className="i-ri:play-circle-line" /></li>
        {state.env === 'h5' && <li className="button" onClick={handleDownload}><i className="i-ri:download-2-line" /></li>}
        <li className="button" onClick={handleShare}><i className="i-ri:share-line" /></li>
      </ul>

      {/* <!-- 颜色选择 --> */}
      <ul className="color-bar" onClick={handleColorSelect}>
        {
          colorList.map((color, index) => (
            <li className="button" key={index}>
              <input type="radio" name="color" value={color} checked={state.color === color} readOnly />
              <i className="icon" style={{ color }}></i>
            </li>
          ))
        }
        <div className="line"></div>
        <li className="button">
          <input type="color" name="color" value={state.color} onInput={handleColorInput} />
          <i className="icon" style={{ color: state.color }}></i>
        </li>
        <div className="line"></div>
        <li className="button">
          <input type="color" name="color" value={state.backgroundColor} onInput={handleBgColorInput} />
          <i className="icon" style={{ color: state.backgroundColor }}></i>
        </li>
      </ul>

      {/* <!-- 画笔宽度 --> */}
      <ul className="width-bar" onClick={handleWidthSelect}>
        {
          widthList.map(({ value, width }, index) => (
            <li className="button" key={index}>
              <input type="radio" name="width" value={value} checked={value === state.width} readOnly />
              <i className="icon" style={{ width: `${width}px`, height: `${width}px`, color: state.color }}></i>
            </li>
          ))
        }
      </ul>
    </>
  ) : null;
};

export default ToolBar;
