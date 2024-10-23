import { resolve, join } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(async () => {
  // 获取所有 demo 示例
  const dirs = fs.readdirSync(resolve(__dirname, 'demos'), { encoding: 'utf-8' });

  console.log('===== demos dirs =====', dirs);

  // 生成示例数据
  const demoList = dirs.map(dir => {
    const packagePath = resolve(__dirname, 'demos', dir, 'package.json');
    const indexPath = resolve(__dirname, 'demos', dir, 'index.html');
    const routePath = join('/demos', dir, '/');
    if (!fs.existsSync(indexPath)) {
      return;
    }
    if (fs.existsSync(packagePath)) {
      const { title, name, description, author } = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      return {
        title: title || name || dir,
        path: routePath,
        key: dir,
        indexPath,
        description,
        author,
      };
    }
    return {
      title: dir,
      path: routePath,
      key: dir,
      indexPath,
    };
  }).filter(Boolean);

  console.log('===== demoList =====', demoList);

  // 打包入口
  const demosInputs = demoList.reduce((inputs, { key, indexPath }) => {
    return { ...inputs, [key]: indexPath };
  }, {});

  console.log('===== demosInputs =====', demosInputs);

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
      // proxy: {
      //   '/1.1': {
      //     target: 'https://budb3sbl.api.lncldglobal.com',
      //     changeOrigin: true,
      //   },
      // },
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
