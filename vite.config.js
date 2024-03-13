import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // base: './',
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wuziqi: resolve(__dirname, 'demos/wuziqi/index.html'),
        dotline: resolve(__dirname, 'demos/dotline/index.html'),
        canvasPlay: resolve(__dirname, 'demos/canvasPlay/index.html'),
      },
    },
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    port: 8824,
    open: true,
  },
});
