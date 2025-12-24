import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';

import 'virtual:uno.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ConfirmProvider } from './contexts/ConfirmContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <ConfirmProvider>
          <App />
          <SpeedInsights />
        </ConfirmProvider>
      </NotificationProvider>
    </LanguageProvider>
  </React.StrictMode>
);