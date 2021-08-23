import { defineConfig } from 'vite';

export default defineConfig({
  // base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: false,
  },
  host: '0.0.0.0',
});
