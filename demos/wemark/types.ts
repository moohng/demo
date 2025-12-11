export interface Theme {
  id: string;
  type: 'system' | 'custom';
  name: string;
  css: string;
  colors: {
    primary: string;
    text: string;
  };
}

export type ViewMode = 'desktop' | 'mobile';

export interface EditorState {
  content: string;
  themeId: string;
  themes: Theme[];
  viewMode: ViewMode;
}