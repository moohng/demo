import Koa from 'koa';
import Router from '@koa/router';

const app = new Koa();

app.use(async (ctx, next) => {
  // cors
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  ctx.set('Access-Control-Allow-Credentials', 'true'); // 允许携带 cookie

  // 处理预检请求
  if (ctx.method === 'OPTIONS') {
    console.log('Received OPTIONS request');
    ctx.status = 204; // No Content
    return;
  }

  // cookie
  ctx.cookies.set('myCookie', 'cookieValue', {
    httpOnly: true,
    secure: false, // 在开发环境中可以设置为 false
    maxAge: 24 * 60 * 60 * 1000, // 1 天
  });

  await next();
});

// 路由
const router = new Router();
router.get('/hello', async (ctx) => {
  console.log('Received GET request on /hello');
  // 返回 JSON 响应
  ctx.body = { message: 'Hello from the API!' };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
