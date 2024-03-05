import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dom',
  build: {
    outDir: '../dist/dom',
    emptyOutDir: true,
  },
  host: '0.0.0.0',
});
