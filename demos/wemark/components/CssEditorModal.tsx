import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Trash2 } from 'lucide-react';
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
}

const CssEditorModal: React.FC<CssEditorModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSave,
  onDelete,
  onReset
}) => {
  // Local state for form fields
  const [name, setName] = useState('');
  const [css, setCss] = useState('');
  const [colors, setColors] = useState({ primary: '#000000', text: '#333333' });

  // Initialize form when opening
  useEffect(() => {
    if (isOpen && theme) {
      setName(theme.name);
      setCss(theme.css);
      setColors(theme.colors);
    } else if (isOpen && !theme) {
      // New theme default
      setName('自定义主题');
      setCss('/* 自定义你的 CSS, 必须放在 #wemark 选择器下 */\n#wemark {\n  --primary-color: #000000;\n}');
      setColors({ primary: '#000000', text: '#333333' });
    }
  }, [isOpen, theme]);

  if (!isOpen) return null;

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

  const isSystemTheme = theme?.type === 'system';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">
            {theme ? `编辑主题: ${theme.name}` : '创建新主题'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">

              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">主题名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., My Awesome Theme"
                />
              </div>

              {/* Color Pickers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">颜色选择</label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>主色调</span>
                      <span>{colors.primary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          setColors({ ...colors, primary: newColor });
                          // Regex to find --primary-color: #......;
                          setCss(prev => prev.replace(/--primary-color:\s*#[a-fA-F0-9]{6}/gi, `--primary-color: ${newColor}`));
                        }}
                        className="h-9 w-full cursor-pointer rounded border border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>文本色</span>
                      <span>{colors.text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={colors.text}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          setColors({ ...colors, text: newColor });
                          // Regex to find --text-color: #......;
                          setCss(prev => prev.replace(/--text-color:\s*#[a-fA-F0-9]{6}/gi, `--text-color: ${newColor}`));
                        }}
                        className="h-9 w-full cursor-pointer rounded border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-800 border border-blue-100">
                <p className="font-semibold mb-1">提示:</p>
                <p>基础样式（字体、间距、布局）总是应用。使用右侧的 CSS 编辑器覆盖它们或添加特定的视觉效果。</p>
              </div>

            </div>
          </div>

          {/* CSS Editor */}
          <div className="flex-1 flex flex-col relative">
            <CodeMirror
              height="100%"
              value={css}
              onChange={(value) => setCss(value)}
              className="h-full text-sm"
              spellCheck={false}
              extensions={[langcss()]}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              placeholder="/* Enter your custom CSS overrides here */"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-3">
            {/* Delete/Reset Logic */}
            {theme && !isSystemTheme && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this theme?')) {
                    onDelete(theme.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}

            {theme && isSystemTheme && onReset && (
              <button
                onClick={() => {
                  if (confirm('Reset this system theme to defaults?')) {
                    onReset(theme.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{theme ? 'Save Changes' : 'Create Theme'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssEditorModal;