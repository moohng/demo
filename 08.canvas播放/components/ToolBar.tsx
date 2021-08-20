import React, { useState, MouseEventHandler, FormEventHandler } from 'react';

const colorList = ['#ffffff', '#000000', '#FF3333', '#0066FF', '#FFFF33', '#33CC66'];

const widthList = [
  { value: 2, width: 4 },
  { value: 4, width: 6 },
  { value: 6, width: 8 },
  { value: 12, width: 10 },
  { value: 20, width: 12 },
  { value: 30, width: 14 },
];

interface Props {
  show?: boolean;
  onColorSelect?: (color: string) => void;
  onBgColorSelect?: (color: string) => void;
  onWidthSelect?: (width: number) => void;
  onRevoke?: () => void;
  onClear?: () => void;
  onPreview?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const pop = () => {};

const ToolBar = ({
  show = false,
  onColorSelect = pop,
  onBgColorSelect = pop,
  onWidthSelect = pop,
  onRevoke = pop,
  onClear = pop,
  onPreview = pop,
  onDownload = pop,
  onShare = pop,
}: Props) => {

  let [selectWidth, setSelectWidth] = useState(widthList[1].value);
  let [selectColor, setSelectColor] = useState(colorList[1]);
  let [selectBgColor, setSelectBgColor] = useState('#ffffff');

  const handleColorSelect: MouseEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setSelectColor(target.value);
      onColorSelect(target.value);
    }
  };

  const handleWidthSelect: MouseEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      setSelectWidth(+(target).value);
      onWidthSelect(+(target).value);
    }
  };

  const handleColorInput: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setSelectColor(target.value);
    onColorSelect(target.value);
  }

  const handleBgColorInput: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setSelectBgColor(target.value);
    onBgColorSelect(target.value);
  }

  return show ? (
    <>
      {/* <!-- 操作区域 --> */}
      <ul className="toolbar">
        <li className="button" onClick={onRevoke}><i className="iconfont icon-revoke"></i></li>
        <li className="button" onClick={onClear}><i className="iconfont icon-clear"></i></li>
        <li className="button" onClick={onPreview}><i className="iconfont icon-preview"></i></li>
        <li className="button" onClick={onDownload}><i className="iconfont icon-download"></i></li>
        <li className="button" onClick={onShare}><i className="iconfont icon-share"></i></li>
      </ul>

      {/* <!-- 颜色选择 --> */}
      <ul className="color-bar" onClick={handleColorSelect}>
        {
          colorList.map((color, index) => (
            <li className="button" key={index}>
              <input type="radio" name="color" value={color} checked={selectColor === color} readOnly />
              <i className="icon" style={{ color }}></i>
            </li>
          ))
        }
        <div className="line"></div>
        <li className="button">
          <input type="color" name="color" value={selectColor} onInput={handleColorInput} />
          <i className="icon" style={{ color: selectColor }}></i>
        </li>
        <div className="line"></div>
        <li className="button">
          <input type="color" name="color" value={selectBgColor} onInput={handleBgColorInput} />
          <i className="icon" style={{ color: selectBgColor }}></i>
        </li>
      </ul>

      {/* <!-- 画笔宽度 --> */}
      <ul className="width-bar" onClick={handleWidthSelect}>
        {
          widthList.map(({ value, width }, index) => (
            <li className="button" key={index}>
              <input type="radio" name="width" value={value} checked={value === selectWidth} readOnly />
              <i className="icon" style={{ width: `${width}px`, height: `${width}px`, }}></i>
            </li>
          ))
        }
      </ul>
    </>
  ) : null;
};

export default ToolBar;
