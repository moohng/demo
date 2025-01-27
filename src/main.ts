import { createApp } from 'vue';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import 'virtual:uno.css';
import './assets/styles/global.scss';
import { initTheme } from './utils/theme';

inject();

// 初始化主题
initTheme();

createApp(App).mount('#app');