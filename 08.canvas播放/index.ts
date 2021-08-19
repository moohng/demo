import Paint, { Path } from './Paint';
import { fetchPath, addPath } from './api';
import { download, pathFallback } from './util';

/** 初始化 Canvas */
const canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
canvas.width = innerWidth;
canvas.height = innerHeight;

let paintColor = '#000000';
let paintBackgroundColor = '#ffffff';
let paintWidth = 6;

const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
const paint = new Paint(ctx, paintColor, paintWidth);

// { path: [], background: '', backgroundColor: '', title: '' },
let path: Path[] = []; // 记录全部轨迹
let currentLine: Path | null; // 记录每一笔 { pos: [{x, y}, {x, y}], width: 12, color: 'red' }
let painting = false; // 正在绘图

// 获取口令
const { code = '秦丹', edit } = dan.querystring(location.search);
console.log('口令', code, edit);
let isPreview = !!code && edit === undefined;

const canTouch = 'ontouchstart' in document.documentElement;

if (!isPreview) {
  /** 绘画事件监听 */
  const TOUCHSTART = canTouch ? 'touchstart' : 'mousedown';
  const TOUCHMOVE = canTouch ? 'touchmove' : 'mousemove';
  const TOUCHEND = canTouch ? 'touchend' : 'mouseup';
  const TOUCHCANCEL = canTouch ? 'touchcancel' : 'mouseleave';

  canvas.addEventListener(TOUCHSTART, onTouchStart, false);
  canvas.addEventListener(TOUCHMOVE, onTouchMove, false);
  canvas.addEventListener(TOUCHEND, onTouchEnd, false);
  canvas.addEventListener(TOUCHCANCEL, onTouchEnd, false);

  // document.querySelector('.toolbar').style.opacity = 1;
  // document.querySelector('.color-bar').style.opacity = 1;
  document.querySelector<HTMLElement>('.preview-cover')!.style.display = 'none';
} else {
  document.querySelector<HTMLElement>('.toolbar')!.style.opacity = '0';
  document.querySelector<HTMLElement>('.color-bar')!.style.opacity = '0';
  document.querySelector<HTMLElement>('.width-bar')!.style.opacity = '0';

  /** 播放 */
  fetchData(code);

  document.querySelector('.preview-cover')!.addEventListener('click', onPlay, false);
  document.querySelector('#pwdConfirm')!.addEventListener('click', function () {
    const code = document.querySelector<HTMLInputElement>('#code')!.value;
    if (!code) return tui.Toast.error('请输入一个口令');
    location.hash = '';
    document.querySelector('.preview-cover')!.classList.remove('mask');
    fetchData(code);
  }, false);
}

function fetchData(code: string) {
  return fetchPath({ code }).then((data: any[]) => {
    if (!data.length) {
      return tui.Dialog({
        title: '提示',
        content: '链接已失效~',
        buttons: [
          {
            text: '去分享',
            onClick: async () => {
              return (location.search = '?edit');
            },
          },
        ],
      });
    }
    const { path: _path, background = '#ffffff', title, code } = data[0];
    if (title) {
      document.title = title;
    }
    path = code ? _path : pathFallback(_path);
    paintBackgroundColor = background;
    paint.clear();
    paint.setBackground(paintBackgroundColor);
    return paint.playPath(path).then(() => {
      document.querySelector('.preview-cover')!.classList.add('mask');
    });
  });
}

function onTouchStart(e: any) {
  if (isPreview) return;
  painting = true;
  let { clientX: x, clientY: y } = canTouch ? e.touches[0] : e;
  x = x - canvas.width * 0.5;
  y = y - canvas.height * 0.5;
  const dot = { x, y };
  paint.color = paintColor;
  paint.width = paintWidth;
  currentLine = {
    width: paint.width,
    color: paint.color,
    pos: [dot],
  };
  paint.drawLine(x, y);
}

function onTouchMove(e: any) {
  if (painting) {
    let { clientX: x, clientY: y } = canTouch ? e.touches[0] : e;
    x = x - canvas.width * 0.5;
    y = y - canvas.height * 0.5;
    currentLine!.pos.push({ x, y });
    paint.drawLine(x, y);
  }
}

function onTouchEnd() {
  if (painting) {
    painting = false;
    path.push(currentLine!);
    currentLine = null;
    paint.end();
  }
}

function onPlay(this: HTMLElement, e: any) {
  if (e.target !== e.currentTarget) return;
  if (paint.isComplete) {
    this.classList.remove('mask');
    paint.clear();
    paint.setBackground(paintBackgroundColor);
    paint.playPath(path).then(() => {
      document.querySelector('.preview-cover')!.classList.add('mask');
    });
    return;
  }
  paint.isPlay = !paint.isPlay;
  if (paint.isPlay) {
    this.classList.remove('mask');
  } else {
    this.classList.add('mask');
  }
}

/** 操作栏 */

document.querySelector('#share')!.addEventListener(
  'click',
  function (e) {
    if (!path.length) {
      return tui.Toast.error('先随便画点什么吧~');
    }
    // 生成随机口令
    const code = dan.random(8);
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
      // tui.Toast.success('链接已复制，赶紧去微信粘贴分享给小伙伴吧~');
      tui.Dialog({
        title: '提示',
        content: '链接已复制，赶紧去微信粘贴分享给小伙伴吧~\n' + shareUrl,
        buttons: [
          {
            text: '确定',
            onClick: async () => {
              return dan.copy(shareUrl);
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
      return tui.Toast.error('先随便画点什么吧~');
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
      return tui.Toast.error('先随便画点什么吧~');
    }
    download(canvas.toDataURL());
  },
  false
);

/** 颜色选择 */

document.querySelector('.color-bar')!.addEventListener(
  'click',
  function (e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      paintColor = (e.target as HTMLInputElement).value;
    }
    console.log('color select', (e.target as HTMLInputElement).value);
  },
  false
);

document.querySelector('.width-bar')!.addEventListener(
  'click',
  function (e) {
    if ((e.target as HTMLInputElement).checked) {
      paintWidth = +(e.target as HTMLInputElement).value;
    }
    console.log('width select', (e.target as HTMLInputElement).value);
  },
  false
);

/** 自定义颜色 */

document.querySelector('#colorSelect')!.addEventListener(
  'click',
  (e) => {
    e.stopPropagation();
  },
  false
);
document.querySelector('#backgroundSelect')!.addEventListener(
  'click',
  (e) => {
    e.stopPropagation();
  },
  false
);
document.querySelector('#colorSelect')!.addEventListener(
  'input',
  function (this: HTMLElement, e) {
    paintColor = (e.target as HTMLInputElement).value;
    (this.nextElementSibling as HTMLElement).style.color = paintColor;
  },
  false
);
document.querySelector('#backgroundSelect')!.addEventListener(
  'input',
  function (this: HTMLElement, e) {
    paintBackgroundColor = (e.target as HTMLInputElement).value;
    (this.nextElementSibling as HTMLElement).style.color = paintBackgroundColor;
    paint.clear();
    paint.setBackground(paintBackgroundColor);
    paint.drawPath(path);
  },
  false
);
