# demo小示例

在线预览：[https://demo.codingmo.com/](https://demo.codingmo.com/)

## 开发

```bash
# 开发模式
$ npm run dev

# 打包构建
$ npm run build
```

## 如何参与

该项目使用Vite作为打包工具，故所有的demo示例需遵循以下标准：

1. 所有demo示例必须放在`/demos`目录下，创建新的目录作为demo的根目录；
2. **demo根目录**下必须包含`index.html`，作为demo的唯一入口文件；
3. **demo根目录下**必须包含`package.json`，作为demo的信息说明文件（`title`， `description`， `author`将会直接展示在demo的入口页面上）；

其他规范请参考[vite](https://cn.vitejs.dev/guide/build.html#multi-page-app)。