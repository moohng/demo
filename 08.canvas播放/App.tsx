import React, { useEffect, useState, useReducer } from 'react';
import { querystring } from '@moohng/dan';
import { Dialog } from '@moohng/tui';
import Canvas from './components/Canvas';
import ToolBar from './components/ToolBar';
import PwdDialog from './components/PwdDialog';
import PreviewCover from './components/PreviewCover';
import { initState, reducer, StateContext } from './state';
import { fetchPath } from './api';
import { pathFallback } from './util';

// 获取口令
const { code = '秦丹', edit } = querystring(location.search);
console.log('口令', code, edit);



const App = () => {

  const [state, dispatch] = useReducer(reducer, initState);

  // 是否预览状态
  let [isPreview, setPreview] = useState(!!code && edit === undefined);

  let [showPwdDialog, setShowPwdDialog] = useState(false);

  useEffect(() => {
    if (isPreview) {
      fetchData(code as string);
    }
  }, []);

  const fetchData = (code: string) => {
    return fetchPath({ code }).then((data: any[]) => {
      if (!data.length) {
        return Dialog({
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
      }
      const { path: _path, background = '#ffffff', title, code } = data[0];
      if (title) {
        document.title = title;
      }
      dispatch({ type: 'setBackgroundColor', payload: background });
      dispatch({ type: 'setPath', payload: code ? _path : pathFallback(_path) });
    });
  }

  const handlePwdConfirm = (text: string) => {
    fetchData(text);
  };

  /** 操作 */

  const handleRevoke = () => {
    const path = state.path.slice(0, state.path.length - 1);
    dispatch({ type: 'setPath', payload: path});
  };

  return <StateContext.Provider value={{ state, dispatch }}>
    <Canvas mode={isPreview ? 'preview' : 'draw'} />

    {/* 播放控制 */}
    <PreviewCover />

    {/* 口令弹窗 */}
    <PwdDialog onConfirm={handlePwdConfirm}/>

    {/* 工具面板 */}
    <ToolBar
      show={!isPreview}
      onColorSelect={(color) => dispatch({ type: 'setColor', payload: color })}
      onBgColorSelect={(color) => dispatch({ type: 'setBackgroundColor', payload: color })}
      onWidthSelect={(width) => dispatch({ type: 'setWidth', payload: width })}
      onRevoke={handleRevoke}
    />
  </StateContext.Provider>;
};

export default App;
