import { createContext } from 'react';
import { querystring } from '@moohng/dan';
import { actions } from './actions';
import { TypeKeys } from './types';

export interface Dot {
  x: number;
  y: number;
}

export interface Path {
  pos: Dot[];
  color?: string;
  width?: number;
}

export interface State {
  path: Path[];
  color: string;
  backgroundColor: string;
  width: number;
  play: boolean;

  code: string;
  previewMode: boolean;

  showPreviewCover: boolean;
  showPwdDialog: boolean;
  isSave: boolean;

  /** 操作 */
  preview: boolean;

  env: 'h5' | 'miniProgram' | 'weixin' | '';
}

export interface Action<T> {
  type: TypeKeys;
  payload?: T;
}

// 获取口令
const { code } = querystring(location.search);

export const initState: State = {
  path: [],
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 4,
  play: false,

  code: code as string,
  previewMode: !!code,

  showPreviewCover: false,
  showPwdDialog: false,
  isSave: false,

  preview: false,

  env: '',
};

export const reducer = <T>(state: State, action: Action<T>) => {
  return actions[action.type]?.(state, action.payload);
};

/** 创建全局 state context */
export const StateContext = createContext({
  state: initState,
  dispatch: <T>(action: Action<T>): void => {},
});
