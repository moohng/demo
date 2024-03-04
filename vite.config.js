import { defineConfig } from 'vite';

export default defineConfig({
  // base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
  host: '0.0.0.0',
});
