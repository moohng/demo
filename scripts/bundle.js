import { join } from 'path';
import fs from 'fs';
import { build, createServer, mergeConfig, loadEnv } from 'vite';
import UnoCSS from 'unocss/vite';
import presetWind from '@unocss/preset-wind3';
import presetIcons from '@unocss/preset-icons';
import react from '@vitejs/plugin-react';

import rootPackage from '../package.json';

console.log("runtime", process.versions.bun);

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
        path: routePath.replace(/\\/g, '/'),
        key: dir,
        indexPath,
        description,
        author,
      };
    }
    return {
      title: dir,
      path: routePath.replace(/\\/g, '/'),
      key: dir,
      indexPath,
    };
  });

  // 外部 demos
  let outerDemos = rootPackage.demos || [];
  outerDemos = outerDemos.map((demo, index) => ({ ...demo, key: `outer-demo-${index}` }));

  return [].concat(demos, outerDemos);
}

const getCommonConfig = (mode) => {
  const dirs = getDemoDirs();
  const demoList = getDemoList(dirs);

  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      UnoCSS({
        presets: [
          presetWind(),
          presetIcons({
            prefix: 'i-',
            extraProperties: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': '1',
            },
          }),
        ],
      }),
      react(),
    ],
    define: {
      __DEMO_LIST__: JSON.stringify(demoList),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': relativeRoot('src'),
      },
    },
  };
};

async function runDev() {
  const server = await createServer({
    configFile: false,
    ...getCommonConfig('development'),
    server: {
      host: '0.0.0.0',
      port: 8824,
    },
  });

  await server.listen();
  console.log('dev server running at: http://localhost:' + server.config.server.port);
}

async function runBuild() {
  await build({
    ...getCommonConfig('production'),
  });

  const dirs = getDemoDirs();
  await Promise.all(dirs.map(async (dir) => {
    const config = await import(relativeRoot('demos', dir, 'vite.config.js')).catch(() => ({ default: {} }));
    console.log('===== build demo', config);
    return build(mergeConfig({
      ...getCommonConfig('production'),
      root: relativeRoot('demos', dir),
      base: join('/demos', dir, '/'),
      build: {
        outDir: relativeRoot('dist', 'demos', dir),
      },
    }), config.default);
  }));
}

export { runDev, runBuild };
