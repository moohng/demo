<template>
  <div class="resume-builder flex h-screen w-full bg-gray-50">
    <div class="editor-container p-4 w-1/2 border-r border-gray-200">
      <textarea 
        v-model="markdownText" 
        placeholder="在此输入Markdown格式的简历内容..."
        class="w-full h-full box-border p-4 border border-gray-300 rounded-lg font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      ></textarea>
    </div>
    <div class="preview-container -ml-4 w-1/2 p-4 overflow-auto">
      <div 
        class="resume-preview min-h-full p-6 bg-white rounded-lg shadow-md" 
        v-html="compiledMarkdownWithTemplate"
      ></div>
    </div>
    <div class="controls fixed bottom-4 right-4 flex gap-2">
      <select 
        v-model="selectedTheme" 
        class="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      >
        <option v-for="template in templates" :key="template.name" :value="template.name">{{ template.name }}</option>
      </select>
      <button 
        @click="exportToPDF" 
        class="btn-primary"
      >导出PDF</button>
      <button 
        @click="loadTemplate" 
        class="btn-secondary"
      >加载模板</button>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import { html2pdf } from 'html2pdf.js';
import { getTemplates } from '../templates';

export default {
  data() {
    return {
      markdownText: '',
      selectedTheme: 'default',
      templates: [],
    };
  },
  computed: {
    compiledMarkdown() {
      return marked.parse(this.markdownText);
    },
    compiledMarkdownWithTemplate() {
      const template = this.templates?.find(t => t.name === this.selectedTheme);
      if (!template) {
        return this.compiledMarkdown;
      }
      const html = template.html.replace(/\{\{\s*content\s*\}\}/, this.compiledMarkdown);
      return `<style>${template.css}</style>${html}`;
    }
  },
  async created() {
    this.templates = await getTemplates(); // 确保在组件创建后加载模板
    console.log('加载模板', this.templates);
  },
  methods: {
    exportToPDF() {
      html2pdf().from(this.$el.querySelector('.resume-preview')).save('resume.pdf');
    },
    async loadTemplate() {
      const md = await import('../examples/markdown-template.md?raw').then(res => res.default)
      this.markdownText = md;
    }
  }
};
</script>

<style scoped>
/* 保留必要的样式以确保Vue作用域样式正常工作 */
</style>