import { resolve, join } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(async () => {
  // 获取所有 demo 示例
  const dirs = fs.readdirSync(resolve(__dirname, 'demos'), { encoding: 'utf-8' });

  console.log('===== demos dirs =====', dirs);

  // 打包入口
  const demosInputs = dirs.reduce((inputs, dir) => {
    const dirPath = resolve(__dirname, 'demos', dir, 'index.html');
    return { ...inputs, [dir]: dirPath };
  }, {});

  console.log('===== demosInputs =====', demosInputs);

  // 生成示例数据
  const demoList = dirs.map(dir => {
    const packagePath = resolve(__dirname, 'demos', dir, 'package.json');
    const routePath = join('/demos', dir, '/');
    if (fs.existsSync(packagePath)) {
      const { name, description, author } = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      return {
        name: name || dir,
        path: routePath,
        description,
        author,
      };
    }
    return {
      name: dir,
      path: routePath,
    };
  });

  console.log('===== demoList =====', demoList);

  return {
    appType: 'mpa',
    plugins: [vue()],
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
    },
    define: {
      __DEMO_LIST__: JSON.stringify(demoList),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
