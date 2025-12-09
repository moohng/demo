import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import { LinkItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LinkCardProps {
  link: LinkItem;
  onDelete?: (id: string) => void;
  onEdit?: (link: LinkItem) => void;
  onVisit?: (linkId: string) => void;
  editMode: boolean;
  lang: Language;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onEdit, onVisit, editMode, lang }) => {
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
    // 1. Critical: Stop propagation to prevent triggering the card's edit action
    e.preventDefault();
    e.stopPropagation();

    onDelete?.(link.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    if (editMode && onEdit) {
      e.preventDefault();
      onEdit(link);
    }
  };

  const handleLinkClick = () => {
    if (!editMode && onVisit) {
      onVisit(link.id);
    }
  };

  // Reusable content to maintain consistent layout
  const CardContent = () => (
    <>
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
        <h3 className={`font-semibold text-sm truncate transition-colors ${editMode ? 'text-blue-200' : 'text-gray-100 group-hover:text-primary'}`}>
          {link.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {link.description}
        </p>
      </div>

      <div className={`absolute top-4 right-4 transition-opacity ${editMode ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
        <ExternalLink size={14} className="text-gray-500" />
      </div>
    </>
  );

  return (
    <div
      className={`group relative flex flex-col p-4 rounded-xl border bg-glass backdrop-blur-md transition-all duration-300 ${editMode
        ? 'border-dashed border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/60 cursor-pointer'
        : 'border-glassBorder hover:bg-glassHover hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20'
        }`}
      // In edit mode, the entire card triggers the edit modal
      onClick={editMode ? handleEditClick : undefined}
    >
      {editMode ? (
        // Edit Mode: Static div wrapper (pointer-events-none on children ensures click hits parent)
        <div className="flex-grow flex items-start gap-3 opacity-80 pointer-events-none">
          <CardContent />
        </div>
      ) : (
        // View Mode: Actual anchor tag for navigation
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-grow flex items-start gap-3 cursor-pointer"
          onClick={handleLinkClick}
        >
          <CardContent />
        </a>
      )}

      {/* Delete Button - Only in Edit Mode */}
      {editMode && onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg shadow-black/30 z-50 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer pointer-events-auto"
          title="Delete Shortcut"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default LinkCard;