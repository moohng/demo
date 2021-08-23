import { createContext } from 'react';
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
  showPreviewCover: boolean;
  showPwdDialog: boolean;
}

export interface Action {
  type: ActionType;
  payload?: any;
}

export const initState: State = {
  path: [],
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 6,
  play: false,

  showPreviewCover: false,
  showPwdDialog: false,
};

export const reducer = (state: State, action: Action) => {
  return actions[action.type]?.(state, action.payload);
};

export const StateContext = createContext<{ state: State, dispatch?: React.Dispatch<Action> }>({
  state: initState,
});
