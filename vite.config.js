import { resolve } from 'path';
import fs from 'fs/promises';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  const dirs = await fs.readdir(resolve(__dirname, 'demos'))

  console.log('===== demos dirs =====', dirs);

  const demosInputs = dirs.reduce((inputs, dir) => {
    const dirPath = resolve(__dirname, 'demos', dir, 'index.html');
    return { ...inputs, [dir]: dirPath };
  }, {});

  console.log('===== demosInputs =====', demosInputs);

  return {
    appType: 'mpa',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          ...demosInputs,
        },
      },
      outDir: 'dist',
    },
    server: {
      host: '0.0.0.0',
      port: 8824,
      open: true,
    },
  };
});
