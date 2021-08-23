import { State } from './index';

export type ActionType = 'setPath' | 'setPlay' | 'setShowPreviewCover' | 'setColor' | 'setBackgroundColor' | 'setWidth' | 'setShowPwdDialog' | 'setPreviewMode' | 'setPreview' | 'setSave' | 'setCode';

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
  setPreviewMode (state, previewMode) {
    return {
      ...state,
      previewMode,
    };
  },
  setPreview (state, preview) {
    return {
      ...state,
      preview,
    };
  },
  setSave (state, isSave) {
    return {
      ...state,
      isSave,
    };
  },
  setCode (state, code) {
    return {
      ...state,
      code,
    };
  },
};
