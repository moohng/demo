import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../docs/play',
    emptyOutDir: true,
  },
  host: '0.0.0.0',
});
