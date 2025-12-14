import React, { useState, useEffect, useRef } from 'react';
import { X, Save, RotateCcw, Trash2, Eye, Copy } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { css as langcss } from '@codemirror/lang-css';
import { Theme } from '../types';

interface CssEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme | null; // The theme being edited (null if new)
  onSave: (theme: Theme) => void;
  onDelete: (themeId: string) => void;
  onReset?: (themeId: string) => void;
  onPreview: (theme: Theme) => void;
}

const CssEditorModal: React.FC<CssEditorModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSave,
  onDelete,
  onReset,
  onPreview
}) => {
  // Local state for form fields
  const [name, setName] = useState('');
  const [css, setCss] = useState('');
  const [colors, setColors] = useState({ primary: '#000000', text: '#333333' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize form when opening
  useEffect(() => {
    setShowResetConfirm(false); // Reset confirmation state
    setShowDeleteConfirm(false); // Reset delete confirmation state
    if (isOpen && theme) {
      setName(theme.name);
      setCss(theme.css);
      setColors(theme.colors);
    } else if (isOpen && !theme) {
      // New theme default
      setName('自定义主题');
      setCss('/* 自定义你的 CSS, 必须放在 #wemark 选择器下 */\n#wemark {\n  --primary-color: #000000;\n  --text-color: #333333;\n}');
      setColors({ primary: '#000000', text: '#333333' });
    }
  }, [isOpen, theme]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  // Handle CSS variable updates based on color changes
  const updateTheme = (type: 'primary' | 'text' | 'css', value: string) => {
    if (type === 'css') {
      setCss(value);
    }

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewTimeoutRef.current = setTimeout(() => {
      if (type === 'css') {
        onPreview({
          id: 'preview-temp',
          type: 'custom',
          name,
          css: value,
          colors
        });
        return;
      }

      const newColors = { ...colors, [type]: value };
      setColors(newColors);

      // Regex Update
      let newCss = css;
      if (type === 'primary') {
        newCss = newCss.replace(/--primary-color:\s*.*;/gi, `--primary-color: ${value};`);
      } else {
        newCss = newCss.replace(/--text-color:\s*.*;/gi, `--text-color: ${value};`);
      }
      setCss(newCss);

      // Auto-preview on color change for immediate feedback
      // Construct temp theme
      const tempTheme: Theme = {
        id: 'preview-temp',
        type: 'custom',
        name,
        css: newCss,
        colors: newColors,
      };
      onPreview(tempTheme);
    }, 100);
  };

  const handleSave = () => {
    const newTheme: Theme = {
      id: theme ? theme.id : `custom-${Date.now()}`,
      type: theme ? theme.type : 'custom',
      name,
      css,
      colors
    };
    onSave(newTheme);
  };

  const handleSaveAs = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      name: `${name} (Copy)`,
      css,
      colors
    };
    onSave(newTheme);
  };

  const isSystemTheme = theme?.type === 'system';

  return (
    <div
      className={`h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out overflow-hidden flex flex-col shadow-xl z-10 shrink-0 ${isOpen ? 'w-[450px]' : 'w-0 border-l-0'}`}
    >
      <div className="w-[450px] flex flex-col h-full">



        {/* Compact Controls Section */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 space-y-3 shrink-0">
          {/* Name Row */}
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-gray-500 w-12 shrink-0">名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="主题名称"
            />
          </div>

          {/* Colors Row */}
          <div className="flex items-center space-x-3">
            <label className="text-xs font-semibold text-gray-500 w-12 shrink-0">配色</label>
            <div className="flex items-center space-x-6">

              {/* Primary Picker */}
              <div className="relative flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded border border-gray-100 cursor-pointer transition-colors group">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                />
                <span className="text-xs text-gray-600 font-mono group-hover:text-gray-900 transition-colors">{colors.primary}</span>
                <input
                  title="主色调"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => updateTheme('primary', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Text Picker */}
              <div className="relative flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded border border-gray-100 cursor-pointer transition-colors group">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: colors.text }}
                />
                <span className="text-xs text-gray-600 font-mono group-hover:text-gray-900 transition-colors">{colors.text}</span>
                <input
                  title="文本色"
                  type="color"
                  value={colors.text}
                  onChange={(e) => updateTheme('text', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* CSS Editor - Prioritized */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-5 py-1.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            <span>CSS 编辑器</span>
            <span>#wemark</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              height="100%"
              value={css}
              onChange={(value) => updateTheme('css', value)}
              className="text-sm"
              spellCheck={false}
              extensions={[langcss()]}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <div className="flex space-x-2">
            {theme && !isSystemTheme && (
              <div className="relative">
                {showDeleteConfirm ? (
                  <div className="flex items-center space-x-1 bg-red-100 rounded-lg hover:bg-red-200 transition-colors p-1 animate-in fade-in slide-in-from-left-2 duration-200">
                    <button
                      onClick={() => {
                        onDelete(theme.id);
                      }}
                      className="p-1 px-2 text-xs text-red-600 font-medium"
                    >
                      删除?
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 text-red-500 hover:text-red-600 rounded transition-colors"
                    title="删除主题"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
            {theme && isSystemTheme && onReset && (
              <div className="relative">
                {showResetConfirm ? (
                  <div className="flex items-center space-x-1 bg-red-100 rounded-lg p-1 animate-in fade-in slide-in-from-left-2 duration-200 hover:bg-red-200 transition-colors">
                    <button
                      onClick={() => {
                        onReset(theme.id);
                        setShowResetConfirm(false);
                      }}
                      className="p-1 px-2 text-xs text-red-600 font-medium"
                    >
                      确认重置？
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      title="重置为默认值"
                    >
                      <RotateCcw size={16} />
                    </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Save As Button (Only if editing existing) */}
            {theme && (
              <button
                onClick={handleSaveAs}
                className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded bg-blue-100 hover:bg-blue-200 transition-colors text-sm font-medium"
                title="保存为新主题"
              >
                <Copy size={14} />
                <span>另存为</span>
              </button>
            )}

            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow-sm transition-colors flex items-center space-x-2"
            >
              <Save size={14} />
              <span>保存</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssEditorModal;