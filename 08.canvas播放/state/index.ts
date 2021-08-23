import { createContext } from 'react';
import { querystring } from '@moohng/dan';
import { actions, ActionType } from './actions';

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
}

export interface Action {
  type: ActionType;
  payload?: any;
}

// 获取口令
const { code = '秦丹', edit } = querystring(location.search);
console.log('口令', code, edit);

export const initState: State = {
  path: [],
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 4,
  play: false,

  code: code as string,
  previewMode: !!code && edit === undefined,

  showPreviewCover: false,
  showPwdDialog: false,
  isSave: false,

  preview: false,
};

export const reducer = (state: State, action: Action) => {
  return actions[action.type]?.(state, action.payload);
};

export const StateContext = createContext<{ state: State, dispatch?: React.Dispatch<Action> }>({
  state: initState,
});
