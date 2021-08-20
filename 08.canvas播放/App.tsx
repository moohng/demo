import React, { useEffect, useState, useReducer } from 'react';
import { querystring } from '@moohng/dan';
import { Dialog } from '@moohng/tui';
import Canvas from './components/Canvas';
import ToolBar from './components/ToolBar';
import PwdDialog from './components/PwdDialog';
import PreviewCover, { ActionCallback } from './components/PreviewCover';
import { Path } from './Paint';
import { fetchPath } from './api';
import { pathFallback } from './util';

// useReducer((state, action) => {
//   return state;
// }, { a: 1 });

// 获取口令
const { code = '秦丹', edit } = querystring(location.search);
console.log('口令', code, edit);

const App = () => {

  // 是否预览状态
  let [isPreview, setPreview] = useState(!!code && edit === undefined);

  let [showPreviewCover, setShowPreviewCover] = useState(false);

  let [showPwdDialog, setShowPwdDialog] = useState(false);

  useEffect(() => {
    if (isPreview) {
      fetchData(code as string);
    }
  }, []);

  // { path: [], background: '', backgroundColor: '', title: '' },
  let [path, setPath] = useState<Path[]>([]); // 记录全部轨迹
  let [background, setBackground] = useState('#ffffff');
  let [play, setPlay] = useState(false);
  let [color, setColor] = useState('#000000');
  let [width, setWidth] = useState(6);

  const handleDrawEnd = (path: Path[]) => {
    console.log('handleDrawEnd', path);
    setPath(path);
  };

  const handlePause = () => {
    setShowPreviewCover(true);
    setPlay(false);
  };

  const handlePreviewCoverAction: ActionCallback = (type) => {
    if (type === 'play') {
      setShowPreviewCover(false);
      setPlay(true);
    } else if (type === 'pwd') {
      setShowPwdDialog(true);
    }
  };

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
      setPath(code ? _path : pathFallback(_path));
      setBackground(background);
    });
  }

  const handlePwdConfig = (text: string) => {
    setShowPreviewCover(false);
    setShowPwdDialog(false);
    fetchData(text);
  };

  /** 操作 */

  const handleRevoke = () => {
    setPath(pre => {
      return pre.slice(0, pre.length - 1);
    });
  };

  return <>
    <Canvas
      mode={isPreview ? 'preview' : 'draw'}
      width={width}
      color={color}
      path={path}
      play={play}
      backgroundColor={background}
      onDrawEnd={handleDrawEnd}
      onPause={handlePause}
    />

    {/* 播放控制 */}
    <PreviewCover show={showPreviewCover} onAction={handlePreviewCoverAction} />

    {/* 口令弹窗 */}
    <PwdDialog show={showPwdDialog} onCancel={() => setShowPwdDialog(false)} onConfirm={handlePwdConfig}/>

    {/* 工具面板 */}
    <ToolBar
      show={!isPreview}
      onColorSelect={(color) => setColor(color)}
      onBgColorSelect={(color) => setBackground(color)}
      onWidthSelect={(width) => setWidth(width)}
      onRevoke={handleRevoke}
    />
  </>;
};

export default App;
