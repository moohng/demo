import React from 'react';
import { Category, CategoryType, LinkItem, Language } from '../types';
import LinkCard from './LinkCard';
import { CATEGORY_ICONS, CATEGORY_NAMES } from '../constants';

interface CategorySectionProps {
  category: Category;
  editMode: boolean;
  onDeleteLink: (categoryId: string, linkId: string) => void;
  onEditLink: (categoryId: string, link: LinkItem) => void;
  lang: Language;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, editMode, onDeleteLink, onEditLink, lang }) => {
  const Icon = CATEGORY_ICONS[category.type] || CATEGORY_ICONS[CategoryType.TOOLS];
  const displayName = CATEGORY_NAMES[lang][category.type];

  if (category.links.length === 0 && !editMode) return null;

  return (
    <div id={category.type} className="mb-10 animate-fade-in-up scroll-mt-28">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon size={20} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">{displayName}</h2>
        <div className="h-px bg-gray-800 flex-grow ml-4"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {category.links.map((link) => (
          <LinkCard 
            key={link.id} 
            link={link} 
            editMode={editMode}
            lang={lang}
            onDelete={(linkId) => onDeleteLink(category.id, linkId)}
            onEdit={(linkItem) => onEditLink(category.id, linkItem)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;