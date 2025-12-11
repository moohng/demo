import { Theme } from './types';

export const INITIAL_CONTENT = `# Welcome to WeMark Pro

This is a **Markdown** editor designed for WeChat Official Accounts.

## Features

1.  **Real-time Preview**: Type on the left, see changes on the right.
2.  **Mobile Simulator**: Toggle the phone icon to see how it looks on a narrow screen.
3.  **Theming**: Switch between professional themes inspired by popular tools.
4.  **Code Highlighting**: Professional Mac-style window effects for code blocks.

## Code Example

\`\`\`javascript
// Mac-style code blocks are supported by default
function sayHello() {
  const msg = "Hello, WeChat!";
  console.log(msg);
}
\`\`\`

## Blockquotes

> Good design is as little design as possible.
> — Dieter Rams

## Tables

| Feature | Support |
| :--- | :--- |
| Mobile View | ✅ Yes |
| Custom CSS | ✅ Yes |
| Syntax Highlight | ✅ Yes |

## Images

![Placeholder Image](https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)
*Caption: Beautiful scenery*
`;

// Shared styles for all themes. 
// This is always injected first.
export const BASE_CSS = `
  .markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.8;
    letter-spacing: 0.05em;
    word-wrap: break-word;
    font-size: 15px;
    padding-bottom: 20px;
    color: #333;
    text-align: left;
  }
  
  /* Headings */
  .markdown-body h1 {
    font-size: 1.6em;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 24px;
    line-height: 1.4;
    text-align: center;
  }
  .markdown-body h2 {
    font-size: 1.4em;
    font-weight: bold;
    margin-top: 32px;
    margin-bottom: 20px;
    line-height: 1.4;
  }
  .markdown-body h3 {
    font-size: 1.2em;
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  /* Paragraphs & Lists */
  .markdown-body p {
    margin-bottom: 16px;
    text-align: justify;
    color: #3f3f3f;
  }
  .markdown-body ul, .markdown-body ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }
  .markdown-body ul {
    list-style-type: disc;
  }
  .markdown-body ol {
    list-style-type: decimal;
  }
  .markdown-body li {
    margin-bottom: 8px;
    line-height: 1.7;
  }
  
  /* Images */
  .markdown-body img {
    max-width: 100%;
    border-radius: 8px;
    display: block;
    margin: 24px auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  
  /* Blockquotes */
  .markdown-body blockquote {
    margin: 24px 0;
    padding: 16px 20px;
    background: #f7f7f7;
    border-radius: 6px;
    color: #555;
    font-size: 0.95em;
    border-left: 4px solid #ddd;
  }
  
  /* Code Blocks - DOM-based Mac Window */
  .mac-window {
    background: #f6f8fa;
    border-radius: 8px;
    margin: 24px 0;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  
  .mac-header {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    background: #f1f3f5;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .mac-dots {
    display: flex;
    gap: 6px;
  }
  
  .mac-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .mac-dot.red { background-color: #ff5f56; }
  .mac-dot.yellow { background-color: #ffbd2e; }
  .mac-dot.green { background-color: #27c93f; }
  
  .markdown-body pre {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    background: transparent;
    font-size: 13px;
    line-height: 1.6;
    border: none;
    border-radius: 0;
  }
  
  /* Inline Code */
  .markdown-body :not(pre) > code {
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    background: rgba(27,31,35,0.05);
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    margin: 0 2px;
    color: #476582;
  }

  /* Prism Overrides for WeChat */
  .markdown-body pre code {
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
    text-shadow: none !important;
    background: transparent !important;
    color: inherit;
  }
  
  /* Tables */
  .markdown-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
    table-layout: fixed;
  }
  .markdown-body th, .markdown-body td {
    border: 1px solid #dfe2e5;
    padding: 8px 12px;
    word-break: break-word;
  }
  .markdown-body th {
    background-color: #f6f8fa;
    font-weight: bold;
  }
  
  /* Horizontal Rule */
  .markdown-body hr {
    height: 1px;
    padding: 0;
    margin: 32px 0;
    background-color: #e1e4e8;
    border: 0;
  }
`;

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'lark-blue',
    type: 'system',
    name: 'Lark Blue',
    colors: { primary: '#3370ff', background: '#ffffff', text: '#1f2329' },
    css: `
      /* Lark Blue Theme */
      :root {
        --primary-color: #3370ff;
      }
      .markdown-body h1 {
        border-bottom: 2px solid #eaeaea;
        padding-bottom: 10px;
        color: #1f2329;
        text-align: left;
      }
      .markdown-body h2 {
        border-left: 4px solid var(--primary-color);
        padding-left: 12px;
        color: #1f2329;
      }
      .markdown-body strong {
        color: var(--primary-color);
        font-weight: 600;
      }
      .markdown-body blockquote {
        background: #f5f8ff;
        border-left: 4px solid var(--primary-color);
        color: #4a5a75;
      }
      .markdown-body a {
        color: var(--primary-color);
        text-decoration: none;
        border-bottom: 1px dashed var(--primary-color);
      }
    `
  },
  {
    id: 'fresh-green',
    type: 'system',
    name: 'Fresh Green',
    colors: { primary: '#07c160', background: '#f6fffa', text: '#333333' },
    css: `
      /* Fresh Green Theme */
      :root {
        --primary-color: #07c160;
        --secondary-bg: #e7fbf0;
      }
      .markdown-body h1 {
        display: inline-block;
        color: var(--primary-color);
        font-size: 1.5em;
        position: relative;
        margin-bottom: 30px;
      }
      .markdown-body h1::after {
        content: '';
        display: block;
        width: 40px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 2px;
        margin-top: 8px;
      }
      .markdown-body h2 {
        background: var(--secondary-bg);
        color: var(--primary-color);
        display: inline-block;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 1.2em;
        border: none;
      }
      .markdown-body h3 {
        color: var(--primary-color);
        padding-left: 8px;
        border-left: 3px solid var(--primary-color);
      }
      .markdown-body blockquote {
        background: #fff;
        border: 1px solid var(--secondary-bg);
        border-left: 4px solid var(--primary-color);
        box-shadow: 0 2px 8px rgba(7, 193, 96, 0.05);
      }
      .markdown-body strong {
        color: var(--primary-color);
        background: linear-gradient(transparent 60%, rgba(7, 193, 96, 0.2) 0);
      }
      .markdown-body img {
        border-radius: 12px;
        border: 4px solid var(--secondary-bg);
      }
    `
  },
  {
    id: 'geek-dark',
    type: 'system',
    name: 'Geek Black',
    colors: { primary: '#000000', background: '#ffffff', text: '#24292e' },
    css: `
      /* Geek Black Theme */
      :root {
        --primary-color: #24292e;
      }
      .markdown-body h1 {
        text-align: center;
        background: var(--primary-color);
        color: #fff;
        padding: 12px;
        border-radius: 4px;
        font-size: 1.4em;
        box-shadow: 0 4px 0 rgba(0,0,0,0.1);
      }
      .markdown-body h2 {
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 8px;
        display: block;
      }
      .markdown-body h2::before {
        content: '#';
        color: var(--primary-color);
        margin-right: 8px;
      }
      .markdown-body :not(pre) > code {
        color: #e01e5a;
        background: #fff0f3;
      }
      .markdown-body blockquote {
        background: #2b3137;
        color: #e1e4e8;
        border-left: none;
        border-radius: 4px;
        position: relative;
        padding-left: 36px;
      }
      .markdown-body blockquote::before {
        content: '"';
        font-family: Georgia, serif;
        font-size: 40px;
        position: absolute;
        left: 10px;
        top: 0;
        color: #586069;
      }
      .markdown-body strong {
        color: #000;
        text-emphasis: dot;
        -webkit-text-emphasis: dot;
      }
    `
  },
  {
    id: 'elegant-serif',
    type: 'system',
    name: 'Kyoto Purple',
    colors: { primary: '#8e44ad', background: '#fdfbf7', text: '#595959' },
    css: `
      /* Kyoto Purple Theme */
      :root {
        --primary-color: #8e44ad;
        --accent-color: #e8d8f0;
      }
      .markdown-body {
        font-family: "Optima", "Songti SC", "Noto Serif SC", serif;
        background-color: #fdfbf7;
        color: #595959;
      }
      .markdown-body h1 {
        text-align: center;
        font-weight: normal;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        display: table;
        margin: 40px auto;
        padding: 10px 30px;
        letter-spacing: 0.1em;
      }
      .markdown-body h2 {
        text-align: center;
        font-weight: normal;
        color: var(--primary-color);
        margin-top: 50px;
      }
      .markdown-body h2::before, .markdown-body h2::after {
        content: '❧';
        font-size: 0.8em;
        margin: 0 10px;
        color: #ccc;
        vertical-align: middle;
      }
      .markdown-body h3 {
        font-weight: bold;
        color: #333;
        margin-top: 30px;
      }
      .markdown-body p {
        text-indent: 2em;
        line-height: 2;
      }
      .markdown-body blockquote {
        border: none;
        background: transparent;
        color: var(--primary-color);
        text-align: center;
        font-style: italic;
        padding: 20px 40px;
      }
      .markdown-body strong {
        color: var(--primary-color);
        font-weight: bold;
      }
      .markdown-body img {
        border: 10px solid #fff;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      }
    `
  }
];