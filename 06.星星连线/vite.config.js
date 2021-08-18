import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../docs/star-line',
    emptyOutDir: true,
  }
});
