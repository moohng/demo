import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  Copy, 
  Check,
  Plus,
  Edit2
} from 'lucide-react';
import { Theme, ViewMode } from '../types';

interface ToolbarProps {
  themes: Theme[];
  currentThemeId: string;
  onThemeChange: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCopy: () => void;
  isCopied: boolean;
  onAddTheme: () => void;
  onEditTheme: (themeId: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  themes,
  currentThemeId,
  onThemeChange,
  viewMode,
  onViewModeChange,
  onCopy,
  isCopied,
  onAddTheme,
  onEditTheme
}) => {
  const currentTheme = themes.find(t => t.id === currentThemeId);

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center space-x-2">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text mr-4">
          WeMark Pro
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Scroll Area */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-[500px] no-scrollbar pb-1">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            {themes.map(theme => {
              const isActive = currentThemeId === theme.id;
              return (
                <div key={theme.id} className="relative group flex items-center">
                  <button
                    onClick={() => onThemeChange(theme.id)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center space-x-2
                      ${isActive 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
                    `}
                    title={theme.name}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-black/5" 
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span className="hidden sm:inline whitespace-nowrap">{theme.name}</span>
                  </button>
                  
                  {/* Edit Button (Visible on hover or active) */}
                  {(isActive) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTheme(theme.id);
                      }}
                      className="ml-1 p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"
                      title="Edit Theme"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
            
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            
            <button
               onClick={onAddTheme}
               className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-200 rounded-md transition-colors"
               title="Add Custom Theme"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* View Mode */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('desktop')}
            className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            title="Desktop View"
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('mobile')}
            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            title="Mobile View"
          >
            <Smartphone size={18} />
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onCopy}
          className={`
            flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm
            ${isCopied 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'}
          `}
        >
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;