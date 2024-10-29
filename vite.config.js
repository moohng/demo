import { resolve, join } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import rootPackage from './package.json';

export default defineConfig(async () => {
  // 获取所有 demo 示例，忽略下划线开头的目录
  const dirs = fs
    .readdirSync(resolve(__dirname, 'demos'), { encoding: 'utf-8' })
    .filter(dir => !dir.startsWith('_') && fs.existsSync(resolve(__dirname, 'demos', dir, 'index.html')));
  console.log('===== demos dirs =====', dirs);

  // 生成示例数据
  const demoList = getDemoList(dirs);
  console.log('===== demoList =====', demoList);

  // 打包入口
  const demosInputs = dirs.reduce((inputs, dir) => {
    return { ...inputs, [dir]: resolve(__dirname, 'demos', dir, 'index.html') };
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

function getDemoList(dirs) {
  // 内部 demos，忽略 home
  const demos = dirs.filter(dir => dir !== 'home').map(dir => {
    const packagePath = resolve(__dirname, 'demos', dir, 'package.json');
    const indexPath = resolve(__dirname, 'demos', dir, 'index.html');
    const routePath = join('/demos', dir, '/');

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
  });

  // 外部 demos
  let outerDemos = rootPackage.demos || [];
  outerDemos = outerDemos.map((demo, index) => ({ ...demo, key: `outer-demo-${index}` }));

  return [].concat(demos, outerDemos);
}