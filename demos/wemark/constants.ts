import { Theme } from './types';

export const INITIAL_CONTENT = `# 欢迎使用 WeMark Pro

WeMark Pro 是一款专为微信公众号打造的 **Markdown 编辑器**。它能将 Markdown 转换为完美的公众号格式，让排版变得简单而优雅。

## 快速开始

::: tip
**所见即所得**：左侧编辑，右侧实时预览，支持手机端模拟。
:::

::: info
**一键复制**：完美适配公众号后台，样式、代码高亮一键带走。
:::

## 功能演示

### 1. 文本与排版

支持 **加粗**、*斜体*、~~删除线~~ 以及 [超链接](https://github.com)。

> 这是一个引用块。好的设计是尽可能少的设计。
> — Dieter Rams

**待办清单**：

- [x] 完成文章初稿
- [x] 选择心仪的主题
- [ ] 一键复制到公众号

### 2. 代码高亮

支持 \`const\`、\`function\` 等行内代码，以及多语言代码块：

::: success
代码块支持 macOS 风格窗口按钮，且完美保留缩进！
:::

\`\`\`javascript
// JavaScript 示例
function sayHello(name) {
  console.log(\`Hello, \${name}!\`);
}

sayHello('WeChat');
\`\`\`

### 3. 表格数据

简洁清晰的表格支持：

| 功能特性 | 免费版 | WeMark Pro |
| :--- | :---: | :---: |
| 实时预览 | ✅ | ✅ |
| 多款主题 | ❌ | ✅ |
| 导出 HTML | ✅ | ✅ |

### 4. 提示容器 (New)

使用自定义容器强调重要信息：

::: warning
这是一个警告信息，用于提示用户注意潜在风险。
:::

::: danger
这是一个危险警告，通常用于禁止的操作。
:::

---

## 关于排版

![示例图片](https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)
*配图文字：山川湖海，保持热爱*

公众号排版的核心在于**阅读体验**。WeMark Pro 通过精心调整的字间距、行高和配色，让你的文章在手机屏幕上呈现最佳效果。

如果您喜欢这个工具，欢迎分享给更多的朋友！
`;

// This is always injected first.
export const BASE_CSS = `#wemark {
  /* font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; */
  padding-bottom: 1em;
  color: #252933;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  line-height: 1.8;
  letter-spacing: 0.02em;
  word-wrap: break-word;
}

/* Headings */
h1 {
  margin-top: 2em;
  margin-bottom: 1.2em;
  font-size: 1.8em;
  font-weight: 600;
}
h2 {
  margin-top: 1.8em;
  margin-bottom: 1em;
  font-size: 1.5em;
  font-weight: 600;
}
h3 {
  margin-top: 1.6em;
  margin-bottom: 1em;
  font-size: 1.25em;
  font-weight: 600;
}
h4 {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  font-size: 1em;
  font-weight: 600;
}
p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
ul, ol {
  margin: 1.25em 0 1.25em;
  padding-left: 1.5em;
}
li ul, li ol {
  margin: 0.25em 0 0.25em;
}
ul {
  list-style-type: disc;
}
ol {
  list-style-type: decimal;
}
li {
  margin-bottom: 0.25em;
}

/* Images */
img {
  max-width: 100%;
}

/* Blockquotes */
blockquote {
  margin: 20px 0 20px;
  padding: 1px 16px;
  background: #f7f7f7;
  color: #555;
  font-size: 0.95em;
  border-left: 4px solid #ddd;
  border-radius: 0 4px 4px 0;
}

/* Inline Code */
:not(pre) > code {
  font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
  background: #f6f8fa;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  margin: 0 2px;
  color: #1e6bb8;
}

/* Prism Overrides for WeChat */
pre {
  margin: 20px 0 20px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  overflow-x: hidden;
}
pre::before {
  content: "";
  display: block;
  margin: 18px 16px 2px;
  width: 12px;
  height: 12px;
  background: #ff5f56;
  border-radius: 50%;
  box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
}
pre code {
  display: block;
  padding: 16px;
  font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0 20px;
  font-size: 0.875em;
  table-layout: fixed;
}
th, td {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
  word-break: break-word;
}
th {
  background-color: #f6f8fa;
  font-weight: bold;
}

/* Horizontal Rule */
hr {
  height: 1px;
  padding: 0;
  margin: 2em 0;
  background-color: #e1e4e8;
  border: 0;
}

em {
  font-style: italic;
}

/* Custom Containers */
.custom-container {
  margin: 1.25em 0;
  padding: 1.125em 1.125em 1px;
  border-radius: 4px;
  background-color: #f8f9fa;
  font-size: 0.95em;
}
.custom-container-title {
  font-weight: 600;
}

/* Info */
.custom-container.info {
  background-color: #f0f7ff;
}
.custom-container.info .custom-container-title {
  color: #3b8eed;
}

/* Success */
.custom-container.success {
  background-color: #f3fdf9;
}
.custom-container.success .custom-container-title {
  color: #42b983;
}

/* Warning */
.custom-container.warning {
  background-color: #fffbef;
}
.custom-container.warning .custom-container-title {
  color: #b29400;
}

/* Danger */
.custom-container.danger {
  background-color: #ffe6e6;
}
.custom-container.danger .custom-container-title {
  color: #cc0000;
}

/* Task Lists */
.contains-task-list {
  padding-left: 0;
}
.task-list-item {
  list-style-type: none !important;
  padding-left: 0 !important;
}
.task-list-item input[type="checkbox"] {
  margin: 0 8px 0 4px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
`;

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'lark-blue',
    type: 'system',
    name: '蓝湖',
    colors: { primary: '#3370ff', text: '#1f2329' },
    css: `/* 蓝湖 */
#wemark {
  --primary-color: #3370ff;
  --text-color: #1f2329;
}
#wemark {
  color: var(--text-color);
}
h2 {
  border-left: 4px solid var(--primary-color);
  padding-left: 12px;
}
strong {
  color: var(--primary-color);
  font-weight: 600;
}
blockquote {
  background: #f5f8ff;
  border-left: 4px solid var(--primary-color);
  color: #4a5a75;
}
a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color);
}
`
  },
  {
    id: 'fresh-green',
    type: 'system',
    name: '清新绿',
    colors: { primary: '#07c160', text: '#333333' },
    css: `/* 清新绿 */
#wemark {
  --primary-color: #07c160;
  --secondary-bg: #e7fbf0;
  --text-color: #333333;
}
#wemark {
  color: var(--text-color);
}
h1 {
  color: var(--primary-color);
}
h2 {
  margin-top: 2.2em;
  margin-bottom: 1.8em;
  color: var(--primary-color);
  font-size: 1.4em;
  text-align: center;
}
h2::after {
  content: '';
  display: block;
  margin: auto;
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
  margin-top: 8px;
}
h3 {
  color: var(--primary-color);
}
blockquote {
  background: var(--secondary-bg);
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.05);
}
strong {
  margin: 0 2px;
  color: var(--primary-color);
  background: linear-gradient(transparent 60%, rgba(7, 193, 96, 0.2) 0);
}
img {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.05);
}
hr {
  margin: 48px auto 32px;
  background: var(--primary-color);
}
a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color);
}
`
  },
  {
    id: 'geek-dark',
    type: 'system',
    name: '极客黑',
    colors: { primary: '#000000', text: '#24292e' },
    css: `/* 极客黑 */
#wemark {
  --primary-color: #000000;
  --text-color: #24292e;
}
#wemark {
  color: var(--text-color);
}
h1 {
  text-align: center;
  background: var(--primary-color);
  color: #fff;
  padding: 12px;
  border-radius: 4px;
  font-size: 1.4em;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}
h2 {
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  display: block;
}
h2::before {
  content: '#';
  color: var(--primary-color);
  margin-right: 8px;
}
:not(pre) > code {
  color: #e01e5a;
  background: #fff0f3;
}
blockquote {
  padding-top: 16px;
  padding-bottom: 4px;
  background: #2b3137;
  color: #e1e4e8;
  border-left: none;
  border-radius: 4px;
  position: relative;
  padding-left: 36px;
}
blockquote::before {
  content: '"';
  font-family: Georgia, serif;
  font-size: 40px;
  position: absolute;
  left: 10px;
  top: 0;
  color: #586069;
}
strong {
  color: var(--primary-color);
}
a {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary-color);
}
`
  },
  {
    id: 'elegant-serif',
    type: 'system',
    name: '京都紫',
    colors: { primary: '#8e44ad', text: '#595959' },
    css: `/* 京都紫 */
#wemark {
  --primary-color: #8e44ad;
  --accent-color: #e8d8f0;
  --text-color: #595959;
}
#wemark {
  font-family: "Optima", "Songti SC", "Noto Serif SC", serif;
  color: var(--text-color);
  line-height: 2;
}
h1 {
  text-align: center;
  font-weight: normal;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  display: table;
  margin: 40px auto;
  padding: 10px 30px;
  letter-spacing: 0.1em;
}
h2 {
  text-align: center;
  font-weight: normal;
  color: var(--primary-color);
  margin-top: 50px;
}
h2::before, h2::after {
  content: '❧';
  font-size: 0.8em;
  margin: 0 10px;
  color: #ccc;
  vertical-align: middle;
}
h3 {
  font-weight: bold;
  color: #333;
  margin-top: 30px;
}
blockquote {
  border: none;
  background: transparent;
  color: var(--primary-color);
  text-align: right;
  font-style: italic;
  padding: 20px 30px;
}
strong {
  color: var(--primary-color);
  font-weight: bold;
}
img {
  border: 10px solid #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  box-sizing: border-box;
}
`
  }
];