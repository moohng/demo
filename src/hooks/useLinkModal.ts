import { useState, useCallback } from 'react';
import { Category, CategoryType, Language, LinkItem } from '../types';
import { analyzeLinkInfo } from '../services/geminiService';
import { CATEGORY_NAMES } from '../constants';

interface UseLinkModalProps {
  categories: Category[];
  lang: Language;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onSaveCategory: (category: Category) => Promise<void>;
}

export const useLinkModal = ({ categories, lang, showNotification, onSaveCategory }: UseLinkModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [originalCategoryId, setOriginalCategoryId] = useState<string | null>(null);

  // Form State
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
    setEditingLinkId(null);
    setOriginalCategoryId(null);
  }, []);

  const openAddModal = useCallback(() => {
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  const openEditModal = useCallback((categoryId: string, link: LinkItem) => {
    setEditingLinkId(link.id);
    setOriginalCategoryId(categoryId);
    setLinkUrl(link.url);
    setLinkTitle(link.title);
    setLinkDesc(link.description);

    const currentCategory = categories.find(c => c.id === categoryId);
    if (currentCategory) {
      setLinkCategory(currentCategory.type);
    }
    setIsOpen(true);
  }, [categories]);

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
  }, [linkUrl, linkTitle, lang, categories, showNotification, onSaveCategory]);

  return {
    isOpen,
    setIsOpen,
    editingLinkId,
    originalCategoryId,
    linkUrl,
    setLinkUrl,
    linkTitle,
    setLinkTitle,
    linkDesc,
    setLinkDesc,
    linkCategory,
    setLinkCategory,
    isAutoFilling,
    handleAutoFill,
    openAddModal,
    openEditModal
  };
};
