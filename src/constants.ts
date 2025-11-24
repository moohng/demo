import { Category, CategoryType, LinkItem, Language } from './types';
import { 
  Code2, 
  Layout, 
  Wrench, 
  BookOpen, 
  Palette, 
  Type, 
  Server, 
  Users 
} from 'lucide-react';

export const CATEGORY_ICONS: Record<CategoryType, any> = {
  [CategoryType.FRAMEWORKS]: Code2,
  [CategoryType.UI_LIBRARIES]: Layout,
  [CategoryType.TOOLS]: Wrench,
  [CategoryType.LEARNING]: BookOpen,
  [CategoryType.DESIGN]: Palette,
  [CategoryType.ICONS_FONTS]: Type,
  [CategoryType.BACKEND_SERVICES]: Server,
  [CategoryType.COMMUNITY]: Users,
};

export const CATEGORY_NAMES: Record<Language, Record<CategoryType, string>> = {
  en: {
    [CategoryType.FRAMEWORKS]: 'Frameworks',
    [CategoryType.UI_LIBRARIES]: 'UI Libraries',
    [CategoryType.TOOLS]: 'Tools',
    [CategoryType.LEARNING]: 'Learning',
    [CategoryType.DESIGN]: 'Design',
    [CategoryType.ICONS_FONTS]: 'Icons & Fonts',
    [CategoryType.BACKEND_SERVICES]: 'Backend & DevOps',
    [CategoryType.COMMUNITY]: 'Community',
  },
  cn: {
    [CategoryType.FRAMEWORKS]: '前端框架',
    [CategoryType.UI_LIBRARIES]: 'UI 组件库',
    [CategoryType.TOOLS]: '开发工具',
    [CategoryType.LEARNING]: '学习资源',
    [CategoryType.DESIGN]: '设计资源',
    [CategoryType.ICONS_FONTS]: '图标与字体',
    [CategoryType.BACKEND_SERVICES]: '后端与运维',
    [CategoryType.COMMUNITY]: '社区',
  }
};

export const TRANSLATIONS = {
  en: {
    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
    systemOnline: "SYSTEM ONLINE",
    timeToShip: "Time to ship.",
    searchPlaceholder: "Search documentation, tools, or bookmarks...",
    editMode: "Edit Mode",
    doneEditing: "Done Editing",
    noResults: "No results found for",
    builtWith: "Built with React, Tailwind & Gemini",
    addShortcut: "Add Shortcut",
    editShortcut: "Edit Shortcut",
    title: "Title",
    url: "URL",
    category: "Category",
    description: "Description (Optional)",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    deleteConfirm: "Are you sure you want to delete",
    aiName: "Gemini Assistant",
    aiSubtitle: "Powered by Gemini 2.5 Flash",
    aiWelcome: "Hi! I'm your Frontend Assistant. Ask me anything about React, CSS, or web dev.",
    aiThinking: "Thinking...",
    aiInputPlaceholder: "Ask about React hooks, CSS grid...",
    aiError: "I'm having trouble connecting right now. Please check your network or API key.",
  },
  cn: {
    greetingMorning: "早上好",
    greetingAfternoon: "下午好",
    greetingEvening: "晚上好",
    systemOnline: "系统在线",
    timeToShip: "代码构建之时。",
    searchPlaceholder: "搜索文档、工具或书签...",
    editMode: "编辑模式",
    doneEditing: "完成编辑",
    noResults: "未找到结果：",
    builtWith: "构建于 React, Tailwind & Gemini",
    addShortcut: "添加快捷方式",
    editShortcut: "编辑快捷方式",
    title: "标题",
    url: "链接地址",
    category: "分类",
    description: "描述 (可选)",
    cancel: "取消",
    saveChanges: "保存更改",
    deleteConfirm: "确定要删除",
    aiName: "Gemini 助手",
    aiSubtitle: "由 Gemini 2.5 Flash 驱动",
    aiWelcome: "你好！我是你的前端助手。关于 React, CSS 或 Web 开发的问题都可以问我。",
    aiThinking: "思考中...",
    aiInputPlaceholder: "询问关于 React Hooks, CSS Grid...",
    aiError: "连接出现问题，请检查网络或 API Key。",
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const INITIAL_DATA: Category[] = [
  {
    id: generateId(),
    type: CategoryType.FRAMEWORKS,
    links: [
      { id: generateId(), title: 'React', url: 'https://react.dev', description: 'The library for web and native user interfaces' },
      { id: generateId(), title: 'Next.js', url: 'https://nextjs.org', description: 'The React Framework for the Web' },
      { id: generateId(), title: 'Vue.js', url: 'https://vuejs.org', description: 'The Progressive JavaScript Framework' },
      { id: generateId(), title: 'Svelte', url: 'https://svelte.dev', description: 'Cybernetically enhanced web apps' },
      { id: generateId(), title: 'Angular', url: 'https://angular.io', description: 'The modern web developer\'s platform' },
      { id: generateId(), title: 'Astro', url: 'https://astro.build', description: 'The web framework for content-driven websites' },
    ]
  },
  {
    id: generateId(),
    type: CategoryType.UI_LIBRARIES,
    links: [
      { id: generateId(), title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Rapidly build modern websites without leaving your HTML' },
      { id: generateId(), title: 'Shadcn UI', url: 'https://ui.shadcn.com', description: 'Beautifully designed components built with Radix UI' },
      { id: generateId(), title: 'MUI', url: 'https://mui.com', description: 'Move faster with intuitive React UI tools' },
      { id: generateId(), title: 'Framer Motion', url: 'https://www.framer.com/motion', description: 'A production-ready motion library for React' },
      { id: generateId(), title: 'Ant Design', url: 'https://ant.design', description: 'An enterprise-class UI design language' },
    ]
  },
  {
    id: generateId(),
    type: CategoryType.TOOLS,
    links: [
      { id: generateId(), title: 'GitHub', url: 'https://github.com', description: 'Where the world builds software' },
      { id: generateId(), title: 'Vercel', url: 'https://vercel.com', description: 'Develop. Preview. Ship.' },
      { id: generateId(), title: 'Can I Use', url: 'https://caniuse.com', description: 'Browser support tables for modern web technologies' },
      { id: generateId(), title: 'RegExr', url: 'https://regexr.com', description: 'Learn, build, & test Regular Expressions' },
      { id: generateId(), title: 'Bundlephobia', url: 'https://bundlephobia.com', description: 'Find the cost of adding a npm package to your bundle' },
    ]
  },
  {
    id: generateId(),
    type: CategoryType.LEARNING,
    links: [
      { id: generateId(), title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Resources for developers, by developers' },
      { id: generateId(), title: 'React Docs', url: 'https://react.dev/learn', description: 'Learn React from the official documentation' },
      { id: generateId(), title: 'Patterns.dev', url: 'https://www.patterns.dev', description: 'Free book on design patterns and component patterns' },
      { id: generateId(), title: 'CSS-Tricks', url: 'https://css-tricks.com', description: 'Daily articles about CSS, HTML, JavaScript' },
    ]
  },
  {
    id: generateId(),
    type: CategoryType.DESIGN,
    links: [
      { id: generateId(), title: 'Figma', url: 'https://figma.com', description: 'Collaborative interface design tool' },
      { id: generateId(), title: 'Dribbble', url: 'https://dribbble.com', description: 'Discover the world’s top designers & creatives' },
      { id: generateId(), title: 'Coolors', url: 'https://coolors.co', description: 'The super fast color schemes generator' },
    ]
  },
   {
    id: generateId(),
    type: CategoryType.ICONS_FONTS,
    links: [
      { id: generateId(), title: 'Lucide', url: 'https://lucide.dev', description: 'Beautiful & consistent icons' },
      { id: generateId(), title: 'Google Fonts', url: 'https://fonts.google.com', description: 'A library of open source font families' },
      { id: generateId(), title: 'React Icons', url: 'https://react-icons.github.io/react-icons', description: 'Include popular icons in your React projects' },
    ]
  },
];