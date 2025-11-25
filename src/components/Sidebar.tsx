import React from 'react';
import { ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import { Category, Language } from '../types';
import { CATEGORY_ICONS, CATEGORY_NAMES } from '../constants';

interface SidebarProps {
  categories: Category[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, isCollapsed, setIsCollapsed, lang }) => {
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 bg-[#0f172a]/80 backdrop-blur-xl border-r border-glassBorder transition-all duration-300 flex flex-col hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'
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
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.type] || Hash;
          const displayName = CATEGORY_NAMES[lang][category.type];

          return (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.type)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center' : 'justify-start gap-4'}
                hover:bg-glassHover text-gray-400 hover:text-white
              `}
            >
              <div className={`flex-shrink-0 transition-colors duration-300 ${!isCollapsed ? 'text-primary' : 'group-hover:text-primary'}`}>
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
      </nav>
    </aside>
  );
};

export default Sidebar;