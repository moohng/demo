import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Category, LinkItem, Language } from '../types';
import LinkCard from './LinkCard';
import { CATEGORY_ICONS, CATEGORY_NAMES, CATEGORY_THEMES } from '../constants';

interface CategorySectionProps {
  category: Category;
  editMode: boolean;
  onDelete: (categoryId: string, linkId: string) => void;
  onEdit: (categoryId: string, link: LinkItem) => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onVisit?: (linkId: string) => void;
  lang: Language;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  editMode,
  onDelete,
  onEdit,
  onEditCategory,
  onDeleteCategory,
  onVisit,
  lang
}) => {
  const Icon = CATEGORY_ICONS[category.type];
  const displayName = category.customName || CATEGORY_NAMES[lang][category.type];
  const theme = CATEGORY_THEMES[category.type];

  // Sort links by visit frequency (most visited first)
  const sortedLinks = [...category.links].sort((a, b) => {
    const aCount = a.visitCount || 0;
    const bCount = b.visitCount || 0;
    return bCount - aCount; // Descending order
  });

  // Hide empty categories in non-edit mode
  if (!editMode && category.links.length === 0) {
    return null;
  }

  return (
    <div id={category.type} className="mb-12 scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w - 10 h - 10 rounded - xl ${theme.bg} flex items - center justify - center flex - shrink - 0`}>
          <Icon className={theme.text} size={22} />
        </div>
        <h2 className="text-2xl font-bold text-white">{displayName}</h2>

        {editMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditCategory?.(category.id)}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              title={lang === 'cn' ? '编辑分类' : 'Edit Category'}
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDeleteCategory?.(category.id)}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              title={lang === 'cn' ? '删除分类' : 'Delete Category'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}

        <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedLinks.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            editMode={editMode}
            lang={lang}
            onDelete={() => onDelete(category.id, link.id)}
            onEdit={() => onEdit(category.id, link)}
            onVisit={onVisit}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;