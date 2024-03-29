import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { Toast } from '@moohng/tui';
import { StateContext } from '../state';
import { TypeKeys } from '../state/types';

interface Props {
  onConfirm?: (text: string) => void;
  onCancel?: () => void;
}

const pop = () => {};

let closeTimer: NodeJS.Timeout;

const PwdDialog = ({ onConfirm = pop, onCancel = pop }: Props) => {

  const { state, dispatch } = useContext(StateContext);

  let [_show, setShow] = useState(state.showPwdDialog);
  let [style, setStyle] = useState({});

  let [text, setText] = useState('');

  useEffect(() => {
    _show && setText(state.isSave ? state.code : '');
  }, [_show]);

  useEffect(() => {
    if (state.showPwdDialog) {
      clearTimeout(closeTimer);
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
      closeTimer = setTimeout(() => {
        setText('');
        setShow(false);
      }, 400);
    }
  }, [state.showPwdDialog]);

  const handleInput = (e: FormEvent) => {
    setText((e.target as HTMLInputElement).value);
  };

  const handleFocus = (e: FormEvent) => {
    (e.target as HTMLInputElement).select();
  };

  const handleConfirm = () => {
    if (!text) {
      Toast.error('请输入一个口令');
      return;
    }
    dispatch?.({ type: TypeKeys.SET_SHOW_PREVIEW_COVER, payload: false });
    dispatch?.({ type: TypeKeys.SET_SHOW_PWD_DIALOG, payload: false });
    onConfirm(text);
  };

  const handleCancel = () => {
    dispatch?.({ type: TypeKeys.SET_SHOW_PWD_DIALOG, payload: false });
    onCancel();
  };

  return _show ? (
    <div className="tui-dialog my" style={style}>
      <div className="cover mask"></div>
      <div className="tui-dialog__body">
        <div className="tui-dialog__hd">请输入口令：</div>
        <div className="tui-dialog__content">
          <input type="text" name="code" placeholder="口令" value={text} onInput={handleInput} onFocus={handleFocus} />
        </div>
        <div className="tui-dialog__ft">
          <a className="btn" onClick={handleCancel}>取消</a>
          <a className="btn" onClick={handleConfirm}>确定</a>
        </div>
      </div>
    </div>
  ) : null;
};

export default PwdDialog;
