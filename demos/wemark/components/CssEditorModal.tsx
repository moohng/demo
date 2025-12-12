import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Trash2, Eye, Copy, Palette } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { css as langcss, cssLanguage } from '@codemirror/lang-css';
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

  // Initialize form when opening
  useEffect(() => {
    setShowResetConfirm(false); // Reset confirmation state
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

  // Handle CSS variable updates based on color changes
  const updateColor = (type: 'primary' | 'text', value: string) => {
    const newColors = { ...colors, [type]: value };
    setColors(newColors);

    // Regex Update
    let newCss = css;
    if (type === 'primary') {
      newCss = newCss.replace(/--primary-color:\s*#[a-fA-F0-9]{6}/gi, `--primary-color: ${value}`);
    } else {
      newCss = newCss.replace(/--text-color:\s*#[a-fA-F0-9]{6}/gi, `--text-color: ${value}`);
    }
    setCss(newCss);

    // Auto-preview on color change for immediate feedback
    // Construct temp theme
    const tempTheme: Theme = {
      id: 'preview-temp',
      type: 'custom',
      name,
      css: newCss,
      colors: newColors
    };
    onPreview(tempTheme);
  };

  const handlePreview = () => {
    const tempTheme: Theme = {
      id: 'preview-temp',
      type: 'custom',
      name,
      css,
      colors
    };
    onPreview(tempTheme);
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
    onClose();
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
    onClose();
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
              <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <div className="relative w-4 h-4 rounded-full overflow-hidden border border-black/10 shadow-sm">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-600 font-mono">{colors.primary}</span>
                </div>

              {/* Text Picker */}
              <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <div className="relative w-4 h-4 rounded-full overflow-hidden border border-black/10 shadow-sm">
                  <input
                    type="color"
                    value={colors.text}
                    onChange={(e) => updateColor('text', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-600 font-mono">{colors.text}</span>
              </div>

            </div>
          </div>
        </div>

        {/* CSS Editor - Prioritized */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="absolute inset-x-0 top-0 z-10 px-5 py-1.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            <span>CSS 编辑器</span>
            <span>#wemark</span>
          </div>
          <div className="flex-1 pt-8 relative overflow-hidden"> {/* pt-8 for header space */}
              <CodeMirror
                height="100%"
                value={css}
                onChange={(value) => setCss(value)}
                className="absolute inset-0 text-sm"
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
              <button
                onClick={() => {
                  if (confirm('确认删除该主题？')) {
                    onDelete(theme.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                title="删除主题"
              >
                <Trash2 size={16} />
              </button>
            )}
            {theme && isSystemTheme && onReset && (
              <div className="relative">
                {showResetConfirm ? (
                  <div className="flex items-center space-x-1 bg-red-50 rounded-lg p-1 animate-in fade-in slide-in-from-left-2 duration-200 hover:bg-red-100 transition-colors">
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
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                      title="重置为默认值"
                    >
                      <RotateCcw size={16} />
                    </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Preview Button */}
            <button
              onClick={handlePreview}
              className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors text-sm font-medium"
              title="应用样式查看效果（不保存）"
            >
              <Eye size={14} />
              <span>预览</span>
            </button>

            {/* Save As Button (Only if editing existing) */}
            {theme && (
              <button
                onClick={handleSaveAs}
                className="flex items-center space-x-1.5 text-gray-600 hover:text-green-600 px-3 py-1.5 rounded hover:bg-green-50 transition-colors text-sm font-medium"
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