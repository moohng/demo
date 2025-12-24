import { useState, useCallback } from 'react';
import { Category, CategoryType, LinkItem } from '../types';

interface UseLinkModalProps {
  categories: Category[];
  onSaveCategory: (category: Category) => Promise<void>;
}

export const useLinkModal = ({ categories, onSaveCategory }: UseLinkModalProps) => {

  const [isOpen, setIsOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [originalCategoryId, setOriginalCategoryId] = useState<string | null>(null);

  // Form State


  const openAddModal = () => {
    setIsOpen(true);
  };

  const openEditModal = (categoryId: string, link: LinkItem) => {
    setEditingLinkId(link.id);
    setOriginalCategoryId(categoryId);
    // setLinkUrl(link.url);
    // setLinkTitle(link.title);
    // setLinkDesc(link.description);

    const currentCategory = categories.find(c => c.id === categoryId);
    if (currentCategory) {
      // setLinkCategory(currentCategory.type);
    }
    setIsOpen(true);
  };


  return {
    isOpen,
    setIsOpen,
    editingLinkId,
    originalCategoryId,
    openAddModal,
    openEditModal
  };
};
