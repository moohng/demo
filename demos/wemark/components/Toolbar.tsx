import React from 'react';
import { 
  Smartphone, 
  Monitor, 
  Copy, 
  Check,
  Palette,
  X,
  Settings
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
  onEditTheme: (themeId: string) => void;
  isEditorOpen: boolean;
  onCloseEditor: () => void;
  onSettingsClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  themes,
  currentThemeId,
  onThemeChange,
  viewMode,
  onViewModeChange,
  onCopy,
  isCopied,
  onEditTheme,
  isEditorOpen,
  onCloseEditor,
  onSettingsClick
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
        {/* Theme Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="relative group z-30">
            <button className="w-40 h-9 flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 rounded-lg transition-colors">
              <div
                className="w-3 h-3 rounded-full border border-black/5"
                style={{ backgroundColor: currentTheme?.colors.primary }}
              />
              <span className="flex-1 font-medium text-left text-sm text-gray-700 truncate">{currentTheme?.name}</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left">
              <div className="p-2 space-y-1">
                <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">选择主题</div>
                {themes.map(theme => {
                  const isActive = currentThemeId === theme.id;
                  return (
                    <div key={theme.id} className={`rounded-lg flex items-center justify-between group/item ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <button
                        onClick={() => onThemeChange(theme.id)}
                        className="w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-3"
                      >
                        <div
                          className="w-3 h-3 rounded-full border border-black/5 shrink-0"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <span className="overflow-hidden whitespace-nowrap">{theme.name}</span>
                        {isActive && <Check size={14} className="ml-auto" />}
                      </button>
                    </div>
                  );
                })}


              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditorOpen) {
                onCloseEditor();
              } else {
                currentTheme && onEditTheme(currentTheme.id);
              }
            }}
            className={`h-9 w-9 flex items-center justify-center rounded-lg transition-colors ${isEditorOpen
              ? 'text-red-500 hover:bg-red-50 bg-red-50/50'
              : 'text-gray-500 hover:text-blue-600 bg-gray-100'
              }`}
            title={isEditorOpen ? "关闭编辑器" : "编辑当前主题"}
          >
            {isEditorOpen ? <X size={18} /> : <Palette size={18} />}
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* View Mode */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('desktop')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            title="Desktop View"
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('mobile')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            title="Mobile View"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          title="设置"
        >
          <Settings size={18} />
        </button>

        {/* Action Button */}
        <button
          onClick={onCopy}
          className={`
            h-9 flex items-center space-x-2 px-4 rounded-lg font-semibold transition-all shadow-sm
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