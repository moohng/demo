import { Theme } from './types';

export const INITIAL_CONTENT = `# 欢迎使用 WeMark Pro

WeMark Pro 是一款专为微信公众号打造的 **Markdown 编辑器**。它能将 Markdown 转换为完美的公众号格式，让排版变得简单而优雅。

## 主要特性

1.  **所见即所得**：左侧编辑，右侧实时预览，支持手机端模拟。
2.  **一键复制**：完美适配公众号后台，格式不丢失。
3.  **多主题支持**：内置多款精心设计的主题，满足不同风格需求。
4.  **专业代码高亮**：支持多种编程语言，Mac 风格代码块，提升技术文章质感。

## 排版演示

### 1. 文本样式

支持 **加粗**、*斜体*、~~删除线~~、[超链接](https://github.com) 以及 \`行内代码\`。

> 这是一个引用块。
> 好的设计是尽可能少的设计。
> — Dieter Rams

### 2. 列表

**无序列表**：
*   项目 A
*   项目 B
    *   子项目 B1
    *   子项目 B2

**有序列表**：
1.  第一步：编写 Markdown
2.  第二步：选择喜欢的主题
3.  第三步：点击复制按钮

### 3. 代码片断

支持主流编程语言语法高亮：

\`\`\`javascript
// JavaScript 示例
function sayHello(name) {
  console.log(\`Hello, \${name}!\`);
}

sayHello('WeChat');
\`\`\`

\`\`\`python
# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

### 4. 表格支持

| 功能特性 | 免费版 | WeMark Pro |
| :--- | :---: | :---: |
| 实时预览 | ✅ | ✅ |
| 多款主题 | ❌ | ✅ |
| 导出 HTML | ✅ | ✅ |
| 专属客服 | ❌ | ✅ |

### 5. 图片展示

![示例图片](https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)
*配图文字：山川湖海，保持热爱*

---

## 关于公众号排版

公众号排版的核心在于**阅读体验**。WeMark Pro 通过精心调整的字间距、行高和配色，让你的文章在手机屏幕上呈现最佳的阅读效果。

如果您喜欢这个工具，欢迎分享给更多的朋友！
`;

// Shared styles for all themes. 
// This is always injected first.
export const BASE_CSS = `#wemark {
  /* font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; */
  padding: 1.5em 0;
  color: #252933;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  line-height: 1.8;
  letter-spacing: 0.02em;
  word-wrap: break-word;
}

/* Headings */
#wemark h1 {
  margin-top: 2em;
  margin-bottom: 1.2em;
  font-size: 1.8em;
}
#wemark h2 {
  margin-top: 1.8em;
  margin-bottom: 1em;
  font-size: 1.5em;
}
#wemark h3 {
  margin-top: 1.6em;
  margin-bottom: 1em;
  font-size: 1.25em;
}
#wemark h4 {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
#wemark p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
#wemark ul, #wemark ol {
  margin: 0.25em 0 0.25em;
  padding-left: 1.5em;
}
#wemark > ul, #wemark > ol {
  margin: 1.25em 0 1.25em;
}
#wemark ul {
  list-style-type: disc;
}
#wemark ol {
  list-style-type: decimal;
}
#wemark li {
  margin-bottom: 0.25em;
}

/* Images */
#wemark img {
  max-width: 100%;
}

/* Blockquotes */
#wemark blockquote {
  margin: 20px 0 20px;
  padding: 1px 16px;
  background: #f7f7f7;
  color: #555;
  font-size: 0.95em;
  border-left: 4px solid #ddd;
}

/* Inline Code */
#wemark :not(pre) > code {
  font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
  background: #f6f8fa;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  margin: 0 2px;
  color: #476582;
}

/* Prism Overrides for WeChat */
#wemark pre {
  margin: 20px 0 20px;
  padding: 16px;
  overflow-x: auto;
  background: #f6f8fa;
  font-size: 13px;
  line-height: 1.6;
  border: none;
  border-radius: 4px;
}
#wemark pre code {
  font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, 'Courier New', monospace;
}

/* Tables */
#wemark table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0 20px;
  font-size: 0.875em;
  table-layout: fixed;
}
#wemark th, #wemark td {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
  word-break: break-word;
}
#wemark th {
  background-color: #f6f8fa;
  font-weight: bold;
}

/* Horizontal Rule */
#wemark hr {
  height: 1px;
  padding: 0;
  margin: 2em 0;
  background-color: #e1e4e8;
  border: 0;
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
#wemark h2 {
  border-left: 4px solid var(--primary-color);
  padding-left: 12px;
}
#wemark strong {
  color: var(--primary-color);
  font-weight: 600;
}
#wemark blockquote {
  background: #f5f8ff;
  border-left: 4px solid var(--primary-color);
  color: #4a5a75;
}
#wemark a {
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
#wemark h1 {
  color: var(--primary-color);
}
#wemark h2 {
  margin-top: 2.2em;
  margin-bottom: 1.8em;
  color: var(--primary-color);
  font-size: 1.4em;
  text-align: center;
}
#wemark h2::after {
  content: '';
  display: block;
  margin: auto;
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
  margin-top: 8px;
}
#wemark h3 {
  color: var(--primary-color);
}
#wemark blockquote {
  background: var(--secondary-bg);
  border-left: 4px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.05);
}
#wemark strong {
  margin: 0 2px;
  color: var(--primary-color);
  background: linear-gradient(transparent 60%, rgba(7, 193, 96, 0.2) 0);
}
#wemark img {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(7, 193, 96, 0.05);
}
#wemark hr {
  margin: 48px auto 32px;
  background: var(--primary-color);
}
#wemark a {
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
#wemark h1 {
  text-align: center;
  background: var(--primary-color);
  color: #fff;
  padding: 12px;
  border-radius: 4px;
  font-size: 1.4em;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}
#wemark h2 {
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  display: block;
}
#wemark h2::before {
  content: '#';
  color: var(--primary-color);
  margin-right: 8px;
}
#wemark :not(pre) > code {
  color: #e01e5a;
  background: #fff0f3;
}
#wemark blockquote {
  padding-top: 16px;
  padding-bottom: 4px;
  background: #2b3137;
  color: #e1e4e8;
  border-left: none;
  border-radius: 4px;
  position: relative;
  padding-left: 36px;
}
#wemark blockquote::before {
  content: '"';
  font-family: Georgia, serif;
  font-size: 40px;
  position: absolute;
  left: 10px;
  top: 0;
  color: #586069;
}
#wemark strong {
  color: var(--primary-color);
}
#wemark a {
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
#wemark h1 {
  text-align: center;
  font-weight: normal;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  display: table;
  margin: 40px auto;
  padding: 10px 30px;
  letter-spacing: 0.1em;
}
#wemark h2 {
  text-align: center;
  font-weight: normal;
  color: var(--primary-color);
  margin-top: 50px;
}
#wemark h2::before, #wemark h2::after {
  content: '❧';
  font-size: 0.8em;
  margin: 0 10px;
  color: #ccc;
  vertical-align: middle;
}
#wemark h3 {
  font-weight: bold;
  color: #333;
  margin-top: 30px;
}
#wemark blockquote {
  border: none;
  background: transparent;
  color: var(--primary-color);
  text-align: right;
  font-style: italic;
  padding: 20px 30px;
}
#wemark strong {
  color: var(--primary-color);
  font-weight: bold;
}
#wemark img {
  border: 10px solid #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  box-sizing: border-box;
}
`
  }
];