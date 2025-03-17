import React from 'react';
import { render } from 'react-dom';
import App from './App';
import AV from 'leancloud-storage';
import 'virtual:uno.css';

// 初始化 LeanCloud
AV.init({
  appId: import.meta.env.VITE_LEANCLOUD_APP_ID,
  appKey: import.meta.env.VITE_LEANCLOUD_APP_KEY,
  serverURL: import.meta.env.VITE_LEANCLOUD_SERVER_URL
});

render(<App />, document.querySelector('#app'));
