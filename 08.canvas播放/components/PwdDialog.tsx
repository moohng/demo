import React, { useState, useEffect, FormEvent } from 'react';
import { Toast } from '@moohng/tui';

interface Props {
  show?: boolean;
  onConfirm?: (text: string) => void;
  onCancel?: () => void;
}

const pop = () => {};

const PwdDialog = ({
  show = false,
  onConfirm = pop,
  onCancel = pop,
}: Props) => {

  let [_show, setShow] = useState(show);
  let [style, setStyle] = useState({});

  let [text, setText] = useState('');

  useEffect(() => {
    if (show) {
      setShow(true);
      setStyle({
        opacity: '0',
        transform: 'scale(1.2)',
      });
      setTimeout(() => {
        setStyle({
          opacity: '1',
          transition: 'all .4s',
        });
      }, 50);
    } else {
      setStyle({
        opacity: '0',
        transform: 'scale(1.2)',
        transition: 'all .4s',
      });
      setTimeout(() => {
        setShow(false);
      }, 400);
    }
  }, [show]);

  const handleInput = (e: FormEvent) => {
    setText((e.target as HTMLInputElement).value);
  };

  const handleConfirm = () => {
    if (!text) {
      Toast.error('请输入一个口令');
      return;
    }
    onConfirm(text);
  };

  return _show ? (
    <div className="tui-dialog my" style={style}>
      <div className="cover mask"></div>
      <div className="tui-dialog__body">
        <div className="tui-dialog__hd">请输入口令：</div>
        <div className="tui-dialog__content">
          <input type="text" name="code" placeholder="口令" value={text} onInput={handleInput} />
        </div>
        <div className="tui-dialog__ft">
          <a className="btn" onClick={onCancel}>取消</a>
          <a className="btn" onClick={handleConfirm}>确定</a>
        </div>
      </div>
    </div>
  ) : null;
};

export default PwdDialog;
