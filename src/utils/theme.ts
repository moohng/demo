// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 获取当前主题模式
export const getThemeMode = (): ThemeMode => {
  return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
};

// 设置主题模式
export const setThemeMode = (mode: ThemeMode) => {
  const html = document.documentElement;
  
  if (mode === 'system') {
    localStorage.removeItem('theme-mode');
    html.removeAttribute('data-theme');
  } else {
    localStorage.setItem('theme-mode', mode);
    html.setAttribute('data-theme', mode);
  }
};

// 初始化主题
export const initTheme = () => {
  const mode = getThemeMode();
  setThemeMode(mode);
}; 