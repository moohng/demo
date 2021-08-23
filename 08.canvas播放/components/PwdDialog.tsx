import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { Toast } from '@moohng/tui';
import { StateContext } from '../state';

interface Props {
  onConfirm?: (text: string) => void;
}

const pop = () => {};

const PwdDialog = ({ onConfirm = pop }: Props) => {

  const { state, dispatch } = useContext(StateContext);

  let [_show, setShow] = useState(state.showPwdDialog);
  let [style, setStyle] = useState({});

  let [text, setText] = useState('');

  useEffect(() => {
    if (state.showPwdDialog) {
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
  }, [state.showPwdDialog]);

  const handleInput = (e: FormEvent) => {
    setText((e.target as HTMLInputElement).value);
  };

  const handleConfirm = () => {
    if (!text) {
      Toast.error('请输入一个口令');
      return;
    }
    dispatch?.({ type: 'setShowPreviewCover', payload: false });
    dispatch?.({ type: 'setShowPwdDialog', payload: false });
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
          <a className="btn" onClick={() => dispatch?.({ type: 'setShowPwdDialog', payload: false })}>取消</a>
          <a className="btn" onClick={handleConfirm}>确定</a>
        </div>
      </div>
    </div>
  ) : null;
};

export default PwdDialog;
