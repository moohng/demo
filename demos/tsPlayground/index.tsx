import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import 'virtual:uno.css'; // 引入 UnoCSS 样式

createRoot(document.getElementById('app')!).render(<App />);