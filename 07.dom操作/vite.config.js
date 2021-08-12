import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../docs/dom',
    emptyOutDir: false,
  },
  host: '0.0.0.0',
});
