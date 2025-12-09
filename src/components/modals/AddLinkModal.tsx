import React from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { Category, CategoryType, Language } from '../../types';
import { CATEGORY_NAMES } from '../../constants';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  categories: Category[];
  
  // Form State
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  linkTitle: string;
  setLinkTitle: (val: string) => void;
  linkDesc: string;
  setLinkDesc: (val: string) => void;
  linkCategory: CategoryType;
  setLinkCategory: (val: CategoryType) => void;
  
  // Actions
  onAutoFill: () => void;
  isAutoFilling: boolean;
  onSave: () => void;
  onQuickAddCategory: () => void;
  
  isEditing: boolean;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  lang,
  categories,
  linkUrl,
  setLinkUrl,
  linkTitle,
  setLinkTitle,
  linkDesc,
  setLinkDesc,
  linkCategory,
  setLinkCategory,
  onAutoFill,
  isAutoFilling,
  onSave,
  onQuickAddCategory,
  isEditing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">
          {isEditing ? (lang === 'cn' ? '编辑链接' : 'Edit Link') : (lang === 'cn' ? '添加链接' : 'Add Link')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? 'URL' : 'URL'}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                placeholder="https://example.com"
              />
              <button
                onClick={onAutoFill}
                disabled={!linkUrl || isAutoFilling}
                className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={lang === 'cn' ? 'AI 自动填充' : 'AI Auto-fill'}
              >
                {isAutoFilling ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '标题' : 'Title'}</label>
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              placeholder={lang === 'cn' ? '输入标题' : 'Enter title'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '描述' : 'Description'}</label>
            <textarea
              value={linkDesc}
              onChange={(e) => setLinkDesc(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
              rows={3}
              placeholder={lang === 'cn' ? '输入描述' : 'Enter description'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '分类' : 'Category'}</label>
            <div className="flex gap-2">
              <select
                value={linkCategory}
                onChange={(e) => setLinkCategory(e.target.value as CategoryType)}
                className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.type}>
                    {category.customName || CATEGORY_NAMES[lang][category.type]}
                  </option>
                ))}
              </select>
              <button
                onClick={onQuickAddCategory}
                className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary transition-colors flex-shrink-0"
                title={lang === 'cn' ? '添加新分类' : 'Add New Category'}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {lang === 'cn' ? '取消' : 'Cancel'}
          </button>
          <button
            onClick={onSave}
            disabled={!linkTitle || !linkUrl}
            className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang === 'cn' ? '保存' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
