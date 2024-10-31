import { createApp } from 'vue';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import 'virtual:uno.css';

inject();

createApp(App).mount('#app');