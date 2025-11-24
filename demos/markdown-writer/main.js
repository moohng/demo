import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置 marked
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    breaks: true,
    gfm: true
});

// 全局状态
const state = {
    currentTheme: 'light',
    currentTemplate: 'default',
    customColors: {
        primary: '#07c160',
        text: '#333333',
        bg: '#ffffff'
    }
};

// 模板配置
const templates = {
    default: {
        name: '默认模板',
        styles: {
            titleColor: '#333',
            titleBorder: '#07c160',
            textColor: '#444',
            bgColor: '#ffffff',
            accentColor: '#07c160'
        }
    },
    elegant: {
        name: '优雅风格',
        styles: {
            titleColor: '#2c3e50',
            titleBorder: '#e74c3c',
            textColor: '#34495e',
            bgColor: '#f8f9fa',
            accentColor: '#e74c3c'
        }
    },
    modern: {
        name: '现代风格',
        styles: {
            titleColor: '#1a1a1a',
            titleBorder: '#007bff',
            textColor: '#333',
            bgColor: '#ffffff',
            accentColor: '#007bff'
        }
    },
    classic: {
        name: '经典风格',
        styles: {
            titleColor: '#2c1810',
            titleBorder: '#8b4513',
            textColor: '#3e2723',
            bgColor: '#f5f5dc',
            accentColor: '#8b4513'
        }
    }
};

// DOM 元素
const elements = {
    editor: document.getElementById('markdown-editor'),
    preview: document.getElementById('content-preview'),
    themeToggle: document.getElementById('theme-toggle'),
    exportBtn: document.getElementById('export-btn'),
    templateSelect: document.getElementById('template-select'),
    primaryColor: document.getElementById('primary-color'),
    textColor: document.getElementById('text-color'),
    bgColor: document.getElementById('bg-color')
};

// 初始化应用
function init() {
    bindEvents();
    loadDefaultContent();
    updatePreview();
    applyTheme();
}

// 绑定事件
function bindEvents() {
    // 编辑器事件
    elements.editor.addEventListener('input', updatePreview);
    
    // 工具栏事件
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', handleToolAction);
    });
    
    // 主题切换
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // 导出功能
    elements.exportBtn.addEventListener('click', exportWechatArticle);
    
    // 模板选择
    elements.templateSelect.addEventListener('change', handleTemplateChange);
    
    // 自定义颜色
    elements.primaryColor.addEventListener('input', handleColorChange);
    elements.textColor.addEventListener('input', handleColorChange);
    elements.bgColor.addEventListener('input', handleColorChange);
}

// 加载默认内容
function loadDefaultContent() {
    const defaultContent = `# 欢迎使用 Markdown 公众号写作工具

这是一个示例文章，展示了 Markdown 在公众号中的渲染效果。

## 功能介绍

- **实时预览**：左侧编辑，右侧实时预览
- **多种模板**：支持多种公众号样式模板
- **自定义主题**：可自定义颜色和样式
- **代码高亮**：支持代码块语法高亮

## 使用示例

\`\`\`javascript
// 这是一个 JavaScript 代码示例
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

> 提示：您可以在左侧编辑器中修改内容，右侧会实时显示预览效果。

## 支持的 Markdown 语法

- 标题 (#, ##, ###)
- 列表 (-, 1.)
- 代码块 (\`\`\`)
- 引用 (>)
- 粗体 (**text**)
- 斜体 (*text*)
- 链接 ([text](url))
- 图片 (![alt](url))

开始创作您的公众号文章吧！`;
    
    elements.editor.value = defaultContent;
}

// 更新预览
function updatePreview() {
    const markdown = elements.editor.value;
    const html = marked.parse(markdown);
    const template = templates[state.currentTemplate];
    
    elements.preview.innerHTML = `
        <div class="wechat-content" style="
            --primary-color: ${state.customColors.primary};
            --text-color: ${state.customColors.text};
            --bg-color: ${state.customColors.bg};
        ">
            ${html}
        </div>
    `;
    
    applyTemplateStyles(template);
}

// 应用模板样式
function applyTemplateStyles(template) {
    const style = document.createElement('style');
    style.id = 'template-styles';
    style.textContent = `
        .wechat-content h1 {
            color: ${template.styles.titleColor} !important;
            border-bottom-color: ${template.styles.titleBorder} !important;
        }
        .wechat-content h2, .wechat-content h3 {
            color: ${template.styles.titleColor} !important;
        }
        .wechat-content p, .wechat-content li {
            color: ${template.styles.textColor} !important;
        }
        .wechat-content blockquote {
            border-left-color: ${template.styles.accentColor} !important;
        }
        .content-preview {
            background-color: ${template.styles.bgColor} !important;
        }
    `;
    
    // 移除旧的样式
    const oldStyle = document.getElementById('template-styles');
    if (oldStyle) {
        oldStyle.remove();
    }
    
    document.head.appendChild(style);
}

// 处理工具栏动作
function handleToolAction(e) {
    const action = e.target.dataset.action;
    const editor = elements.editor;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    
    let newText = '';
    
    switch (action) {
        case 'bold':
            newText = `**${selectedText || '粗体文字'}**`;
            break;
        case 'italic':
            newText = `*${selectedText || '斜体文字'}*`;
            break;
        case 'heading':
            newText = `## ${selectedText || '标题'}`;
            break;
        case 'list':
            newText = selectedText ? selectedText.split('\n').map(line => `- ${line}`).join('\n') : '- 列表项';
            break;
        case 'code':
            newText = selectedText ? `\`${selectedText}\`` : '\`代码\`';
            break;
    }
    
    // 插入文本
    editor.setRangeText(newText, start, end, 'select');
    editor.focus();
    updatePreview();
}

// 切换主题
function toggleTheme() {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
}

// 应用主题
function applyTheme() {
    document.body.className = state.currentTheme;
    elements.themeToggle.textContent = state.currentTheme === 'light' ? '🌙 暗色模式' : '☀️ 亮色模式';
}

// 处理模板变更
function handleTemplateChange(e) {
    state.currentTemplate = e.target.value;
    updatePreview();
}

// 处理颜色变更
function handleColorChange(e) {
    const colorType = e.target.id.replace('-color', '');
    state.customColors[colorType] = e.target.value;
    updatePreview();
}

// 导出公众号文章
function exportWechatArticle() {
    const markdown = elements.editor.value;
    const html = marked.parse(markdown);
    
    // 创建样式化的 HTML 内容
    const exportHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公众号文章</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f8f8;
        }
        .article-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        h1 { color: #333; border-bottom: 2px solid ${state.customColors.primary}; padding-bottom: 10px; }
        h2, h3 { color: #333; margin: 25px 0 15px 0; }
        p { color: #444; margin-bottom: 15px; }
        ul, ol { margin: 15px 0; padding-left: 30px; }
        li { margin-bottom: 8px; }
        blockquote { 
            border-left: 4px solid ${state.customColors.primary}; 
            padding-left: 20px; 
            margin: 20px 0; 
            color: #666; 
            font-style: italic; 
        }
        code { 
            background: #f5f5f5; 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-family: monospace; 
        }
        pre { 
            background: #2d2d2d; 
            color: #f8f8f2; 
            padding: 15px; 
            border-radius: 6px; 
            overflow-x: auto; 
            margin: 15px 0; 
        }
    </style>
</head>
<body>
    <div class="article-content">
        ${html}
    </div>
</body>
</html>`;
    
    // 创建下载链接
    const blob = new Blob([exportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '公众号文章.html';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('文章已导出为 HTML 文件！');
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportWechatArticle();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }
});

// 自动保存到本地存储
function autoSave() {
    const content = elements.editor.value;
    localStorage.setItem('markdown-writer-content', content);
}

// 加载保存的内容
function loadSavedContent() {
    const saved = localStorage.getItem('markdown-writer-content');
    if (saved) {
        elements.editor.value = saved;
        updatePreview();
    }
}

// 初始化自动保存
elements.editor.addEventListener('input', autoSave);

// 显示状态消息
function showStatus(message, isError = false) {
    const statusEl = document.createElement('div');
    statusEl.className = `status-message ${isError ? 'error' : ''}`;
    statusEl.textContent = message;
    
    document.body.appendChild(statusEl);
    
    setTimeout(() => {
        statusEl.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        statusEl.classList.remove('show');
        setTimeout(() => {
            if (statusEl.parentNode) {
                statusEl.parentNode.removeChild(statusEl);
            }
        }, 300);
    }, 3000);
}

// 添加工具提示
function addTooltips() {
    const tooltips = {
        'theme-toggle': '切换亮色/暗色主题 (Ctrl+D)',
        'export-btn': '导出公众号文章 (Ctrl+S)',
        'template-select': '选择公众号模板风格',
        'primary-color': '设置主色调',
        'text-color': '设置文字颜色',
        'bg-color': '设置背景颜色'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltiptext';
            tooltip.textContent = tooltips[id];
            
            const wrapper = document.createElement('div');
            wrapper.className = 'tooltip';
            wrapper.appendChild(element.cloneNode(true));
            wrapper.appendChild(tooltip);
            
            element.parentNode.replaceChild(wrapper, element);
            wrapper.firstChild.id = id; // 保持ID不变
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 显示加载状态
    showStatus('应用初始化中...');
    
    try {
        init();
        loadSavedContent();
        addTooltips();
        
        // 设置自动保存间隔
        setInterval(autoSave, 10000); // 每10秒自动保存
        
        showStatus('应用加载完成！');
    } catch (error) {
        console.error('初始化错误:', error);
        showStatus('初始化失败，请刷新页面重试', true);
    }
});