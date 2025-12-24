import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { Category, CategoryType, LinkItem } from '../../types';
import { CATEGORY_NAMES } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useConfirm } from '../../contexts/ConfirmContext';
import { analyzeLinkInfo } from '../../services/geminiService';
import { storageService } from '@/services/storageService';


interface AddLinkModalProps {
  isOpen: boolean;
  categories: Category[];
  editingLinkId?: string;

  onClose: () => void;
  onSaveCategory: (category: Category) => Promise<void>;
  onQuickAddCategory: () => void;
  initialUrl?: string;
  isEditing?: boolean;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onQuickAddCategory,
  editingLinkId,
  initialUrl,
  isEditing,
}) => {
  const { lang } = useLanguage();
  const { showNotification } = useNotification();
  const { showConfirm } = useConfirm();

  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkCategory, setLinkCategory] = useState<CategoryType>(CategoryType.TOOLS);

  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const resetForm = useCallback(() => {
    setLinkUrl('');
    setLinkTitle('');
    setLinkDesc('');
    setLinkCategory(CategoryType.TOOLS);
  }, []);

  const handleAutoFill = useCallback(async () => {
    if (!linkUrl) return;
    setIsAutoFilling(true);

    try {
      const existingCategories = categories.map(c => ({
        name: c.customName || CATEGORY_NAMES[lang][c.type],
        type: c.type
      }));

      const info = await analyzeLinkInfo(linkUrl, linkTitle, lang, existingCategories);

      if (info.url && info.url !== linkUrl) setLinkUrl(info.url);
      if (info.title) setLinkTitle(info.title);
      if (info.description) setLinkDesc(info.description);

      // Handle Category Suggestion
      if (info.isNewCategory && info.suggestedIcon) {
        const iconType = Object.values(CategoryType).find(
          type => type.toLowerCase() === info.suggestedIcon?.toLowerCase() ||
            CATEGORY_NAMES[lang][type].toLowerCase() === info.suggestedIcon?.toLowerCase()
        );

        if (iconType) {
          const existingCat = categories.find(c => c.type === iconType && c.customName === info.category);
          if (!existingCat) {
            const newCategory: Category = {
              id: crypto.randomUUID(),
              type: iconType,
              customName: info.category,
              links: []
            };
            await onSaveCategory(newCategory);
            showNotification(lang === 'cn' ? `已创建新分类: ${info.category}` : `Created new category: ${info.category}`, 'success');
          }
          setLinkCategory(iconType);
        }
      } else {
        // Match existing logic (simplified for brevity, matching previous App.tsx logic)
        let foundType = Object.values(CategoryType).find(t =>
          t.toLowerCase() === info.category.toLowerCase() ||
          CATEGORY_NAMES['en'][t].toLowerCase() === info.category.toLowerCase() ||
          CATEGORY_NAMES['cn'][t].toLowerCase() === info.category.toLowerCase()
        );
        if (!foundType) {
          const matchingCategory = categories.find(c =>
            c.customName?.toLowerCase() === info.category.toLowerCase()
          );
          if (matchingCategory) foundType = matchingCategory.type;
        }

        if (foundType) setLinkCategory(foundType);
      }

    } catch (e) {
      console.error("Auto-fill failed", e);
    } finally {
      setIsAutoFilling(false);
    }
  }, [linkUrl, linkTitle, lang, categories, onSaveCategory]);

  // Handle Initial URL and Auto-fill
  const autoFillStarted = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      autoFillStarted.current = false;
      return;
    }

    if (isOpen && initialUrl && !editingLinkId && !autoFillStarted.current) {
      autoFillStarted.current = true;
      setLinkUrl(initialUrl);
      // Trigger auto fill after a short delay to ensure UI is ready
      setTimeout(() => {
        handleAutoFill();
      }, 500);
    }
  }, [isOpen, initialUrl, editingLinkId, handleAutoFill]);

  const handleSaveLink = useCallback(async () => {
    if (!linkTitle || !linkUrl) return;

    let formattedUrl = linkUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Check duplicate
    const duplicateLink = !editingLinkId && categories.flatMap(c => c.links).find(
      l => l.url.toLowerCase() === formattedUrl.toLowerCase()
    );

    const saveAction = async () => {
      const linkData: LinkItem = {
        id: editingLinkId || crypto.randomUUID(),
        title: linkTitle,
        url: formattedUrl,
        description: linkDesc || 'Custom Bookmark',
      };

      // 1. 覆盖重复
      if (duplicateLink) {
        const dupCat = categories.find(c => c.links.some(l => l.id === duplicateLink.id));
        if (dupCat) await storageService.deleteLink(dupCat.id, duplicateLink.id);
      }

      // 3. 添加/更新
      const targetCat = categories.find(c => c.type === linkCategory);
      if (targetCat) {
        await storageService.saveLink(targetCat.id, linkData);
      }

      onClose();
      showNotification(lang === 'cn' ? '保存成功' : 'Saved successfully', 'success');
    };

    if (duplicateLink) {
      showConfirm({
        title: lang === 'cn' ? 'URL 已存在' : 'URL Already Exists',
        message: lang === 'cn'
          ? `URL "${formattedUrl}" 已存在于书签中（${duplicateLink.title}）。确认保存将覆盖现有链接。`
          : `URL "${formattedUrl}" already exists. Overwrite?`,
        onConfirm: saveAction
      });
    } else {
      await saveAction();
    }
  }, [linkTitle, linkUrl, linkDesc, linkCategory, categories, lang, showNotification]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">
          {editingLinkId ? (lang === 'cn' ? '编辑链接' : 'Edit Link') : (lang === 'cn' ? '添加链接' : 'Add Link')}
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
                onClick={handleAutoFill}
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
            onClick={handleSaveLink}
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
