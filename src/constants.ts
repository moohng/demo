import { Category, CategoryType, LinkItem, Language } from './types';
import { 
  Code2, 
  Layout, 
  Wrench, 
  BookOpen, 
  Palette, 
  Type, 
  Server, 
  Users,
  FileText,
  GraduationCap,
  Droplet,
  Newspaper,
  PenTool,
  Zap,
  Gamepad2,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

export const CATEGORY_ICONS: Record<CategoryType, any> = {
  // Development
  [CategoryType.FRAMEWORKS]: Code2,
  [CategoryType.UI_LIBRARIES]: Layout,
  [CategoryType.TOOLS]: Wrench,
  [CategoryType.BACKEND_SERVICES]: Server,
  [CategoryType.DOCUMENTATION]: FileText,
  
  // Learning
  [CategoryType.LEARNING]: BookOpen,
  [CategoryType.TUTORIALS]: GraduationCap,
  
  // Design
  [CategoryType.DESIGN]: Palette,
  [CategoryType.ICONS_FONTS]: Type,
  [CategoryType.COLORS]: Droplet,
  
  // Community
  [CategoryType.COMMUNITY]: Users,
  [CategoryType.NEWS]: Newspaper,
  [CategoryType.BLOGS]: PenTool,
  
  // General
  [CategoryType.PRODUCTIVITY]: Zap,
  [CategoryType.ENTERTAINMENT]: Gamepad2,
  [CategoryType.SHOPPING]: ShoppingCart,
  [CategoryType.FINANCE]: DollarSign,
};

export const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', baseURL: 'https://api.openai.com/v1' },
  { id: 'gemini', name: 'Gemini', baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' },
  { id: 'deepseek', name: 'DeepSeek', baseURL: 'https://api.deepseek.com' },
  { id: 'hunyuan', name: '混元', baseURL: 'https://api.hunyuan.cloud.tencent.com/v1' },
  { id: 'qwen', name: '千问', baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1' },
  { id: 'doubao', name: '豆包', baseURL: 'https://ark.cn-beijing.volces.com/api/v3' },
];

export const CATEGORY_NAMES: Record<Language, Record<CategoryType, string>> = {
  en: {
    // Development
    [CategoryType.FRAMEWORKS]: 'Frameworks',
    [CategoryType.UI_LIBRARIES]: 'UI Libraries',
    [CategoryType.TOOLS]: 'Tools',
    [CategoryType.BACKEND_SERVICES]: 'Backend & DevOps',
    [CategoryType.DOCUMENTATION]: 'Documentation',
    
    // Learning
    [CategoryType.LEARNING]: 'Learning',
    [CategoryType.TUTORIALS]: 'Tutorials',
    
    // Design
    [CategoryType.DESIGN]: 'Design',
    [CategoryType.ICONS_FONTS]: 'Icons & Fonts',
    [CategoryType.COLORS]: 'Colors',
    
    // Community
    [CategoryType.COMMUNITY]: 'Community',
    [CategoryType.NEWS]: 'News',
    [CategoryType.BLOGS]: 'Blogs',
    
    // General
    [CategoryType.PRODUCTIVITY]: 'Productivity',
    [CategoryType.ENTERTAINMENT]: 'Entertainment',
    [CategoryType.SHOPPING]: 'Shopping',
    [CategoryType.FINANCE]: 'Finance',
  },
  cn: {
    // Development
    [CategoryType.FRAMEWORKS]: '前端框架',
    [CategoryType.UI_LIBRARIES]: 'UI 组件库',
    [CategoryType.TOOLS]: '开发工具',
    [CategoryType.BACKEND_SERVICES]: '后端与运维',
    [CategoryType.DOCUMENTATION]: '文档',
    
    // Learning
    [CategoryType.LEARNING]: '学习资源',
    [CategoryType.TUTORIALS]: '教程',
    
    // Design
    [CategoryType.DESIGN]: '设计资源',
    [CategoryType.ICONS_FONTS]: '图标与字体',
    [CategoryType.COLORS]: '配色',
    
    // Community
    [CategoryType.COMMUNITY]: '社区',
    [CategoryType.NEWS]: '新闻',
    [CategoryType.BLOGS]: '博客',
    
    // General
    [CategoryType.PRODUCTIVITY]: '效率工具',
    [CategoryType.ENTERTAINMENT]: '娱乐',
    [CategoryType.SHOPPING]: '购物',
    [CategoryType.FINANCE]: '金融',
  }
};

export const PRESET_WALLPAPERS = [
  {
    id: 'gradient-1',
    name: 'Purple Gradient',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-2',
    name: 'Ocean Blue',
    url: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-3',
    name: 'Sunset',
    url: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)',
    type: 'gradient'
  },
  {
    id: 'gradient-4',
    name: 'Dark Night',
    url: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    type: 'gradient'
  },
  {
    id: 'gradient-5',
    name: 'Forest',
    url: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    type: 'gradient'
  },
  {
    id: 'none',
    name: 'None',
    url: '',
    type: 'none'
  }
];

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
    wallpaperSettings: "Wallpaper Settings",
    presetWallpapers: "Preset Wallpapers",
    customWallpaper: "Custom Wallpaper",
    uploadImage: "Upload Image",
    resetWallpaper: "Reset to Default",
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
    wallpaperSettings: "壁纸设置",
    presetWallpapers: "预设壁纸",
    customWallpaper: "自定义壁纸",
    uploadImage: "上传图片",
    resetWallpaper: "重置为默认",
  }
};

// Use Web Crypto API for UUIDs to match Supabase requirements
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (should rarely happen in modern contexts)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const CATEGORY_THEMES: Record<CategoryType, { text: string; bg: string; border: string; hover: string }> = {
  // Development
  [CategoryType.FRAMEWORKS]: { 
    text: 'text-cyan-400', 
    bg: 'bg-cyan-400/10', 
    border: 'border-cyan-400/20',
    hover: 'group-hover:text-cyan-400'
  },
  [CategoryType.UI_LIBRARIES]: { 
    text: 'text-sky-400', 
    bg: 'bg-sky-400/10', 
    border: 'border-sky-400/20',
    hover: 'group-hover:text-sky-400'
  },
  [CategoryType.TOOLS]: { 
    text: 'text-slate-400', 
    bg: 'bg-slate-400/10', 
    border: 'border-slate-400/20',
    hover: 'group-hover:text-slate-400'
  },
  [CategoryType.BACKEND_SERVICES]: { 
    text: 'text-indigo-400', 
    bg: 'bg-indigo-400/10', 
    border: 'border-indigo-400/20',
    hover: 'group-hover:text-indigo-400'
  },
  [CategoryType.DOCUMENTATION]: { 
    text: 'text-blue-400', 
    bg: 'bg-blue-400/10', 
    border: 'border-blue-400/20',
    hover: 'group-hover:text-blue-400'
  },
  
  // Learning
  [CategoryType.LEARNING]: { 
    text: 'text-emerald-400', 
    bg: 'bg-emerald-400/10', 
    border: 'border-emerald-400/20',
    hover: 'group-hover:text-emerald-400'
  },
  [CategoryType.TUTORIALS]: { 
    text: 'text-green-400', 
    bg: 'bg-green-400/10', 
    border: 'border-green-400/20',
    hover: 'group-hover:text-green-400'
  },
  
  // Design
  [CategoryType.DESIGN]: { 
    text: 'text-pink-400', 
    bg: 'bg-pink-400/10', 
    border: 'border-pink-400/20',
    hover: 'group-hover:text-pink-400'
  },
  [CategoryType.ICONS_FONTS]: { 
    text: 'text-purple-400', 
    bg: 'bg-purple-400/10', 
    border: 'border-purple-400/20',
    hover: 'group-hover:text-purple-400'
  },
  [CategoryType.COLORS]: { 
    text: 'text-rose-400', 
    bg: 'bg-rose-400/10', 
    border: 'border-rose-400/20',
    hover: 'group-hover:text-rose-400'
  },
  
  // Community
  [CategoryType.COMMUNITY]: { 
    text: 'text-orange-400', 
    bg: 'bg-orange-400/10', 
    border: 'border-orange-400/20',
    hover: 'group-hover:text-orange-400'
  },
  [CategoryType.NEWS]: { 
    text: 'text-amber-400', 
    bg: 'bg-amber-400/10', 
    border: 'border-amber-400/20',
    hover: 'group-hover:text-amber-400'
  },
  [CategoryType.BLOGS]: { 
    text: 'text-yellow-400', 
    bg: 'bg-yellow-400/10', 
    border: 'border-yellow-400/20',
    hover: 'group-hover:text-yellow-400'
  },
  
  // General
  [CategoryType.PRODUCTIVITY]: { 
    text: 'text-violet-400', 
    bg: 'bg-violet-400/10', 
    border: 'border-violet-400/20',
    hover: 'group-hover:text-violet-400'
  },
  [CategoryType.ENTERTAINMENT]: { 
    text: 'text-red-400', 
    bg: 'bg-red-400/10', 
    border: 'border-red-400/20',
    hover: 'group-hover:text-red-400'
  },
  [CategoryType.SHOPPING]: { 
    text: 'text-teal-400', 
    bg: 'bg-teal-400/10', 
    border: 'border-teal-400/20',
    hover: 'group-hover:text-teal-400'
  },
  [CategoryType.FINANCE]: { 
    text: 'text-emerald-500', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/20',
    hover: 'group-hover:text-emerald-500'
  },
};

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
    ]
  },
];