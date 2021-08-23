import { Dialog, Toast } from '@moohng/tui';
import * as dan from '@moohng/dan';
import { addPath } from './api';
import { download } from './util';


/** 操作栏 */

document.querySelector('#share')!.addEventListener(
  'click',
  function (e) {
    if (!path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    // 生成随机口令
    const code = dan.random(8) as string;
    // document.querySelector<HTMLInputElement>('#code')!.value = code;
    // location.hash = '#inputPwd';
    addPath({
      code,
      path,
      background: paint.background,
    }).then(() => {
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
    });
  },
  false
);

document.querySelector('#clear')!.addEventListener(
  'click',
  function (e) {
    if (isPreview) return;
    path = [];
    paint.clear();
    paint.setBackground();
    paintBackgroundColor = paint.background;
  },
  false
);

document.querySelector('#revoke')!.addEventListener(
  'click',
  function (e) {
    if (isPreview) return;
    path.pop();
    paint.clear();
    paint.setBackground(paintBackgroundColor);
    paint.drawPath(path);
  },
  false
);

document.querySelector('#preview')!.addEventListener(
  'click',
  function (e) {
    if (isPreview) return;
    if (!path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    isPreview = true;
    paint.clear();
    paint.setBackground(paintBackgroundColor);
    paint.playPath(path).then(() => {
      isPreview = false;
      document.querySelector('.preview-cover')!.classList.add('mask');
    });
  },
  false
);

document.querySelector('#download')!.addEventListener(
  'click',
  function (e) {
    if (!path.length) {
      return Toast.error('先随便画点什么吧~');
    }
    download(canvas.toDataURL());
  },
  false
);
