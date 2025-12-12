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
export const BASE_CSS = `#wemark {
  /* font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; */
  line-height: 1.8;
  letter-spacing: 0.02em;
  word-wrap: break-word;
  font-size: 15px;
  padding: 24px 0;
  color: #333;
  text-align: left;
}

/* Headings */
#wemark h1 {
  margin-top: 48px;
  margin-bottom: 40px;
  font-size: 1.8em;
  letter-spacing: 0;
}
#wemark h2 {
  margin-top: 40px;
  margin-bottom: 24px;
  font-size: 1.5em;
}
#wemark h3 {
  margin-top: 24px;
  margin-bottom: 20px;
  font-size: 1.2em;
}
#wemark h4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
#wemark p {
  margin-top: 16px;
  margin-bottom: 16px;
}
#wemark ul, #wemark ol {
  padding-left: 24px;
}
#wemark ul {
  list-style-type: disc;
}
#wemark ol {
  list-style-type: decimal;
}
#wemark li {
  margin-bottom: 6px;
}

/* Images */
#wemark img {
  max-width: 100%;
  display: block;
  margin: 16px auto 24px;
}

/* Blockquotes */
#wemark blockquote {
  margin: 16px 0 24px;
  padding: 8px 20px;
  background: #f7f7f7;
  color: #555;
  font-size: 0.95em;
  border-left: 4px solid #ddd;
}

/* Inline Code */
#wemark :not(pre) > code {
  font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
  background: #f6f8fa;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  margin: 0 2px;
  color: #476582;
}

/* Prism Overrides for WeChat */
#wemark pre {
  margin: 16px 0 24px;
  padding: 16px;
  overflow-x: auto;
  background: #f6f8fa;
  font-size: 13px;
  line-height: 1.6;
  border: none;
  border-radius: 4px;
}
#wemark pre code {
  font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
}

/* Tables */
#wemark table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 24px;
  font-size: 14px;
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
    colors: { primary: '#3370ff', text: '#1f2329' },
    css: `/* Lark Blue Theme */
#wemark {
  --primary-color: #3370ff;
  --text-color: #1f2329;
}
#wemark {
  color: var(--text-color);
}
#wemark h1 {
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 10px;
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
    name: 'Fresh Green',
    colors: { primary: '#07c160', text: '#333333' },
    css: `/* Fresh Green Theme */
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
  font-size: 1.5em;
  text-align: center;
  position: relative;
}
#wemark h1::after {
  content: '';
  display: block;
  margin: auto;
  width: 40px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 2px;
  margin-top: 8px;
}
#wemark h2 {
  margin: 40px auto 24px;
  background: var(--secondary-bg);
  color: var(--primary-color);
  width: fit-content;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 1.2em;
  text-align: center;
}
#wemark h3 {
  color: var(--primary-color);
  padding-left: 8px;
  border-left: 3px solid var(--primary-color);
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
  width: 10%;
  height: 2px;
}
`
  },
  {
    id: 'geek-dark',
    type: 'system',
    name: 'Geek Black',
    colors: { primary: '#000000', text: '#24292e' },
    css: `/* Geek Black Theme */
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
    colors: { primary: '#8e44ad', text: '#595959' },
    css: `/* Kyoto Purple Theme */
#wemark {
  --primary-color: #8e44ad;
  --accent-color: #e8d8f0;
  --text-color: #595959;
}
#wemark {
  font-family: "Optima", "Songti SC", "Noto Serif SC", serif;
  background-color: #fdfbf7;
  color: var(--text-color);
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
#wemark p {
  text-indent: 2em;
  line-height: 2;
}
#wemark blockquote {
  border: none;
  background: transparent;
  color: var(--primary-color);
  text-align: center;
  font-style: italic;
  padding: 20px 40px;
}
#wemark strong {
  color: var(--primary-color);
  font-weight: bold;
}
#wemark img {
  border: 10px solid #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
`
  }
];