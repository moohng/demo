import React from 'react';
import { ChevronLeft, ChevronRight, Hash, Plus, Settings, Search } from 'lucide-react';
import { Category, CategoryType, Language } from '../types';
import { CATEGORY_ICONS, CATEGORY_NAMES, CATEGORY_THEMES } from '../constants';

import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  categories: Category[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onAddCategory: () => void;
  onAISettingsClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, isCollapsed, setIsCollapsed, onAddCategory, onAISettingsClick }) => {
  const { lang } = useLanguage();
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 bg-[#0f172a]/80 backdrop-blur-xl border-r border-glassBorder transition-all duration-300 flex flex-col hidden md:flex ${isCollapsed ? 'w-18' : 'w-44'
        }`}
    >
      <div className="p-3 flex justify-center shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-glass hover:bg-glassHover text-gray-400 hover:text-white transition-colors w-full flex justify-center"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 space-y-2 custom-scrollbar">
        {categories
          .map((category) => {
            const Icon = CATEGORY_ICONS[category.type] || Hash;
            const displayName = category.customName || CATEGORY_NAMES[lang][category.type];
            const theme = CATEGORY_THEMES[category.type] || CATEGORY_THEMES[CategoryType.TOOLS];

            return (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.type)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                  ${isCollapsed ? 'justify-center' : 'justify-start gap-4'}
                  hover:bg-glassHover text-gray-400 hover:text-white
                `}
              >
                <div className={`flex-shrink-0 transition-colors duration-300 ${theme.text}`}>
                  <Icon size={20} />
                </div>

                <span
                  className={`whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left ${isCollapsed ? 'opacity-0 w-0 scale-0' : 'opacity-100 w-auto scale-100 animate-fade-in'
                    }`}
                >
                  {displayName}
                </span>

                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    {displayName}
                    {/* Little triangle arrow */}
                    <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
                  </div>
                )}
              </button>
            );
          })}

        {/* Add Category Button - only in edit mode */}
        {!isCollapsed && (
          <button
            onClick={onAddCategory}
            className="w-full flex items-center p-3 rounded-xl transition-all duration-200 border-2 border-dashed border-gray-700 hover:border-primary/50 text-gray-500 hover:text-primary gap-3"
          >
            <Plus size={20} />
            <span className="font-medium text-sm">{lang === 'cn' ? '添加分类' : 'Add Category'}</span>
          </button>
        )}
      </nav>

      {/* AI Settings Button */}
      <div className="p-3 border-t border-glassBorder shrink-0">
        <button
          onClick={onAISettingsClick}
          className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group hover:bg-glassHover text-gray-400 hover:text-white ${isCollapsed ? 'justify-center' : 'justify-start gap-4'}`}
          title={lang === 'cn' ? 'AI 设置' : 'AI Settings'}
        >
          <Settings size={20} className="flex-shrink-0 text-primary" />
          <span
            className={`whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left ${isCollapsed ? 'opacity-0 w-0 scale-0' : 'opacity-100 w-auto scale-100 animate-fade-in'}`}
          >
            {lang === 'cn' ? 'AI 设置' : 'AI Settings'}
          </span>
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0 transition-all duration-200">
              {lang === 'cn' ? 'AI 设置' : 'AI Settings'}
            </div>
          )}
        </button>
      </div>

      {/* GitHub Link at Bottom */}
      <div className="p-3 border-t border-glassBorder shrink-0">
        <a
          href="https://github.com/moohng/demo"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center p-3 rounded-xl transition-all duration-200 group hover:bg-glassHover text-gray-400 hover:text-white ${isCollapsed ? 'justify-center' : 'justify-start gap-4'
            }`}
          title="GitHub Repository"
        >
          <div className="flex-shrink-0 transition-colors duration-300 group-hover:text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          <span
            className={`whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left ${isCollapsed ? 'opacity-0 w-0 scale-0' : 'opacity-100 w-auto scale-100 animate-fade-in'
              }`}
          >
            GitHub
          </span>

          {/* Tooltip for collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0 transition-all duration-200">
              GitHub
              <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
            </div>
          )}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;