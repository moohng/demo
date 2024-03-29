import React, { useEffect, useReducer } from 'react';
import { Dialog } from '@moohng/tui';
import * as dan from '@moohng/dan';
import Canvas from './components/Canvas';
import ToolBar from './components/ToolBar';
import PwdDialog from './components/PwdDialog';
import PreviewCover from './components/PreviewCover';
import { initState, reducer, StateContext } from './state';
import { fetchPath, addPath } from './commons/api';
import { getEnv, pathFallback } from './commons/util';
import { TypeKeys } from './state/types';
import wx from 'weixin-js-sdk';


const App = () => {

  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (state.previewMode) {
      fetchData(state.code);
    }

    // // 获取当前环境
    const env = getEnv();
    dispatch({ type: TypeKeys.SET_ENV, payload: env });
  }, []);

  const fetchData = async (parmCode: string) => {
    const data = await fetchPath({ code: parmCode });
    if (!data) {
      Dialog({
        title: '提示',
        content: '链接已失效~',
        buttons: [
          {
            text: '去分享',
            onClick: async () => {
              (location.search = '?edit');
              return;
            },
          },
        ],
      });
      return;
    }
    const { path: _path, background = '#ffffff', title, code } = data;
    if (title) {
      document.title = title;
    }
    dispatch({ type: TypeKeys.SET_BACKGROUND_COLOR, payload: background });
    dispatch({ type: TypeKeys.SET_PATH, payload: code ? _path : pathFallback(_path) });
  }

  const handlePwdConfirm = async (code?: string) => {
    if (state.isSave) {
      await addPath({
        code: code || state.code,
        path: state.path,
        background: state.backgroundColor,
      });

      if (state.env === 'miniProgram') {
        code && wx.miniProgram.postMessage({ data: { code } });
      }
      const shareUrl = location.origin + location.pathname + '?code=' + code;
      console.log('share url', shareUrl);
      dan.copy(shareUrl);
      // Toast.success('链接已复制，赶紧去微信粘贴分享给小伙伴吧~');
      Dialog({
        title: '提示',
        content: '链接已复制，赶紧去微信粘贴分享给小伙伴吧~\n' + shareUrl,
        buttons: [
          {
            text: '确定',
            onClick: async () => {
              dan.copy(shareUrl);
              return;
            },
          },
        ],
      });
    } else {
      code && fetchData(code);
    }
  };

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Canvas />
      {/* 工具面板 */}
      <ToolBar />

      {/* 播放控制 */}
      <PreviewCover />

      {/* 口令弹窗 */}
      <PwdDialog onConfirm={handlePwdConfirm} />
    </StateContext.Provider>
  );
};

export default App;
