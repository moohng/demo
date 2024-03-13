import { State } from './index';
import { TypeKeys } from './types';

type ActionType = {
  [key in TypeKeys]: (state: State, payload: any) => State
};

export const actions: ActionType = {
  [TypeKeys.SET_PATH] (state, path) {
    return {
      ...state,
      path,
    };
  },
  [TypeKeys.SET_PLAY] (state, play) {
    return {
      ...state,
      play,
    };
  },
  [TypeKeys.SET_SHOW_PREVIEW_COVER] (state, showPreviewCover) {
    return {
      ...state,
      showPreviewCover,
    };
  },
  [TypeKeys.SET_COLOR] (state, color) {
    return {
      ...state,
      color,
    };
  },
  [TypeKeys.SET_BACKGROUND_COLOR](state, backgroundColor) {
    return {
      ...state,
      backgroundColor,
    };
  },
  [TypeKeys.SET_WIDTH] (state, width) {
    return {
      ...state,
      width,
    };
  },
  [TypeKeys.SET_SHOW_PWD_DIALOG] (state, showPwdDialog) {
    return {
      ...state,
      showPwdDialog,
    };
  },
  [TypeKeys.SET_PREVIEW_MODE] (state, previewMode) {
    return {
      ...state,
      previewMode,
    };
  },
  [TypeKeys.SET_PREVIEW] (state, preview) {
    return {
      ...state,
      preview,
    };
  },
  [TypeKeys.SET_SAVE] (state, isSave) {
    return {
      ...state,
      isSave,
    };
  },
  [TypeKeys.SET_CODE] (state, code) {
    return {
      ...state,
      code,
    };
  },
  [TypeKeys.SET_ENV] (state, env) {
    return {
      ...state,
      env,
    }
  },
};
