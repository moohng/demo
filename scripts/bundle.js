import { join } from 'path';
import fs from 'fs';
import { build, createServer, mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import rootPackage from '../package.json' assert { type: "json" };

const relativeRoot = (...args) => join(process.cwd(), ...args);

// 获取所有 demo 示例，忽略下划线开头的目录
const getDemoDirs = () => {
  const dirs = fs
    .readdirSync(relativeRoot('demos'), { encoding: 'utf-8' })
    .filter(dir => !dir.startsWith('_') && fs.existsSync(relativeRoot('demos', dir, 'index.html')));
  console.log('===== demos dirs =====', dirs);
  return dirs;
}

function getDemoList(dirs) {
  // 内部 demos，忽略 home
  const demos = dirs.filter(dir => dir !== 'home').map(dir => {
    const packagePath = relativeRoot('demos', dir, 'package.json');
    const indexPath = relativeRoot('demos', dir, 'index.html');
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

const commonConfig = {
  plugins: [
    UnoCSS({
      // ...
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@': relativeRoot('src'),
    },
  },
};

async function runDev() {
  const dirs = getDemoDirs();
  const demoList = getDemoList(dirs);
  const server = await createServer({
    configFile: false,
    ...commonConfig,
    server: {
      host: '0.0.0.0',
      port: 8824,
    },
    define: {
      __DEMO_LIST__: JSON.stringify(demoList),
    },
  });

  await server.listen();
  console.log('dev server running at: http://localhost:' + server.config.server.port);
}

async function runBuild() {
  const dirs = getDemoDirs();
  const demoList = getDemoList(dirs);
  await build({
    ...commonConfig,
    define: {
      __DEMO_LIST__: JSON.stringify(demoList),
    },
  });

  await Promise.all(dirs.map(async (dir) => {
    const config = await import(relativeRoot('demos', dir, 'vite.config.js')).catch(() => ({ default: {} }));
    console.log('===== build demo', config);
    return build(mergeConfig({
      ...commonConfig,
      root: relativeRoot('demos', dir),
      base: join('/demos', dir, '/'),
      build: {
        outDir: relativeRoot('dist', 'demos', dir),
      },
    }), config.default);
  }));
}

export { runDev, runBuild };
