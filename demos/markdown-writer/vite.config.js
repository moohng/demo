import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['marked', 'highlight.js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['marked', 'highlight.js']
  }
})