import { State } from './index';

export type ActionType = 'setPath' | 'setPlay' | 'setShowPreviewCover' | 'setColor' | 'setBackgroundColor' | 'setWidth' | 'setShowPwdDialog';

export const actions: {
  [key in ActionType]: (state: State, payload: any) => State;
} = {
  setPath (state, path) {
    return {
      ...state,
      path,
    };
  },
  setPlay (state, play) {
    return {
      ...state,
      play,
    };
  },
  setShowPreviewCover (state, showPreviewCover) {
    return {
      ...state,
      showPreviewCover,
    };
  },
  setColor (state, color) {
    return {
      ...state,
      color,
    };
  },
  setBackgroundColor(state, backgroundColor) {
    return {
      ...state,
      backgroundColor,
    };
  },
  setWidth (state, width) {
    return {
      ...state,
      width,
    };
  },
  setShowPwdDialog (state, showPwdDialog) {
    return {
      ...state,
      showPwdDialog,
    };
  },
};
