import React, { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { CategoryType, Language } from '../../types';
import { CATEGORY_ICONS, CATEGORY_NAMES, CATEGORY_THEMES } from '../../constants';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, type: CategoryType) => void;
  editingCategory?: {
    name: string;
    type: CategoryType;
  };
  lang: Language;
}

export const CategoryModal: React.FC<CategoryModalProps> = React.memo(({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  lang
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.TOOLS);

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setCategoryName(editingCategory.name);
        setCategoryType(editingCategory.type);
      } else {
        setCategoryName('');
        setCategoryType(CategoryType.TOOLS);
      }
    }
  }, [isOpen, editingCategory]);

  const handleSave = () => {
    if (!categoryName.trim()) return;
    onSave(categoryName.trim(), categoryType);
    onClose();
  };

  if (!isOpen) return null;

  const currentTheme = CATEGORY_THEMES[categoryType] || CATEGORY_THEMES[CategoryType.TOOLS];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[#0f172a] rounded-2xl shadow-2xl border border-glassBorder max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-glassBorder bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentTheme.bg}`}>
              <FolderPlus size={24} className={currentTheme.text} />
            </div>
            {editingCategory
              ? (lang === 'cn' ? '编辑分类' : 'Edit Category')
              : (lang === 'cn' ? '添加分类' : 'Add Category')
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-glass hover:bg-glassHover text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {lang === 'cn' ? '分类名称' : 'Category Name'}
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder={lang === 'cn' ? '输入分类名称' : 'Enter category name'}
                className={`w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-opacity-50 outline-none transition-all
                ${currentTheme.text.replace('text-', 'focus:border-').replace('text-', 'focus:ring-')}
              `}
                autoFocus
              />
            </div>

            {/* Category Type (Icon) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {lang === 'cn' ? '选择图标' : 'Select Icon'}
              </label>
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                {Object.values(CategoryType).map((type) => {
                  const Icon = CATEGORY_ICONS[type];
                  const isSelected = categoryType === type;
                  const theme = CATEGORY_THEMES[type];

                  return (
                    <button
                      key={type}
                      onClick={() => setCategoryType(type)}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 
                      ${isSelected
                          ? `${theme.bg} ${theme.border} ${theme.text}`
                          : `bg-gray-800 border-gray-700 ${theme.text.replace('text-', 'text-').replace('400', '400/70')} hover:border-gray-600 hover:text-white hover:bg-gray-700`
                        }`}
                      title={CATEGORY_NAMES[lang][type]}
                    >
                      <Icon size={20} className="mx-auto" />
                      <span className="text-[10px] truncate w-full text-center text-gray-400 group-hover:text-white">{CATEGORY_NAMES[lang][type]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {lang === 'cn' ? '取消' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={!categoryName.trim()}
              className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lang === 'cn' ? '保存' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
})

CategoryModal.displayName = 'CategoryModal';
