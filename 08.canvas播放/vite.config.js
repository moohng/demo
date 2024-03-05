import { defineConfig } from 'vite';

export default defineConfig({
  base: '/play',
  build: {
    outDir: '../dist/play',
    emptyOutDir: true,
  },
  host: '0.0.0.0',
});
