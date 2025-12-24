import React from 'react';
import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { LinkItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

import { useLanguage } from '../contexts/LanguageContext';

interface LinkCardProps {
  link: LinkItem;
  onDelete?: (id: string) => void;
  onEdit?: (link: LinkItem) => void;
  onVisit?: (linkId: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onEdit, onVisit }) => {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];

  // Extract domain for favicon
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return ''; // Fallback handled by onError
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
  e.stopPropagation();
    onDelete?.(link.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  onEdit?.(link);
  };

  const handleLinkClick = () => {
    if (onVisit) {
      onVisit(link.id);
    }
  };

  return (
    <div className="group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleLinkClick}
        className="flex flex-col p-4 rounded-xl border border-glassBorder bg-glass backdrop-blur-md transition-all duration-300 hover:bg-glassHover hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 group/card"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gray-800/50 overflow-hidden flex items-center justify-center">
            <img
              loading="lazy"
              src={getFavicon(link.url)}
              alt="icon"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#4f46e5';
              }}
            />
          </div>

        <div className="flex flex-col overflow-hidden w-full">
          <h3 className="font-semibold text-sm truncate transition-colors text-gray-100 group-hover/card:text-primary">
            {link.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {link.description}
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 transition-opacity opacity-0 group-hover/card:opacity-100">
        <ExternalLink size={14} className="text-gray-500" />
      </div>
    </a>

    {/* Action Buttons Overlay - Shown on Hover */}
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 scale-90 origin-top-right">
      <button
        onClick={handleEditClick}
        className="p-1.5 bg-gray-900/80 backdrop-blur-md border border-gray-700 text-gray-400 hover:text-white hover:bg-primary/20 hover:border-primary/50 rounded-lg transition-all"
        title={lang === 'cn' ? '编辑' : 'Edit'}
        >
        <Edit2 size={14} />
      </button>
      <button
          onClick={handleDelete}
        className="p-1.5 bg-gray-900/80 backdrop-blur-md border border-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/50 rounded-lg transition-all"
        title={lang === 'cn' ? '删除' : 'Delete'}
        >
        <Trash2 size={14} />
        </button>
    </div>
    </div>
  );
};

export default LinkCard;