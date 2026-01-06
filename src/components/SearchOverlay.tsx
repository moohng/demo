import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Clock, X, ExternalLink, Sparkles, Plus } from 'lucide-react';
import { Category, LinkItem } from '../types';
import { CATEGORY_NAMES, TRANSLATIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResult {
  link: LinkItem;
  categoryId: string;
  categoryType: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  recentLinks: LinkItem[];
  onAddToRecent: (link: LinkItem) => void;
  onRemoveFromRecent: (url: string) => void;
  onQuickAdd?: (query: string) => void;
}

interface SearchItemProps {
  title: string;
  description: string;
  categoryName?: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onRemove?: () => void;
  isQuickAdd?: boolean;
}

const SearchItem: React.FC<SearchItemProps> = ({
  title, description, categoryName, icon, isSelected, onSelect, onMouseEnter, onRemove, isQuickAdd
}) => (
  <button
    onClick={onSelect}
    onMouseEnter={onMouseEnter}
    className={`w-full p-4 flex items-center gap-4 transition-colors border-b border-gray-800/50 last:border-b-0 ${isSelected ? (isQuickAdd ? 'bg-primary/20' : 'bg-gray-800/70') : (isQuickAdd ? 'hover:bg-primary/10' : 'hover:bg-gray-800/50')
      }`}
  >
    <div className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${isQuickAdd ? 'bg-primary/20 text-primary' : 'text-gray-500'}`}>
      {icon}
    </div>
    <div className="flex-1 text-left min-w-0">
      <div className={`font-medium truncate ${isQuickAdd ? 'text-white' : 'text-white'}`}>{title}</div>
      <div className="text-sm text-gray-500 truncate">{description}</div>
      {categoryName && (
        <div className="text-xs text-gray-600 mt-1">{categoryName}</div>
      )}
    </div>
    {onRemove ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-600 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    ) : (
      !isQuickAdd && <ExternalLink size={16} className="text-gray-600 flex-shrink-0" />
    )}
    {isQuickAdd && <Sparkles size={16} className="text-primary animate-pulse" />}
  </button>
);

export const SearchOverlay: React.FC<SearchOverlayProps> = React.memo(({
  isOpen,
  onClose,
  categories,
  recentLinks,
  onAddToRecent,
  onRemoveFromRecent,
  onQuickAdd
}) => {
  const { lang } = useLanguage();
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search results
  const searchResults: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    categories.forEach(category => {
      category.links.forEach(link => {
        if (
          link.title.toLowerCase().includes(lowerQuery) ||
          link.description.toLowerCase().includes(lowerQuery) ||
          link.url.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            link,
            categoryId: category.id,
            categoryType: category.type
          });
        }
      });
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [query, categories]);

  const showQuickAdd = query.trim() !== '' && searchResults.length < 3;

  // Display items (search results or recent links)
  const displayItems = query.trim() ? searchResults : recentLinks;

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, displayItems.length]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const itemsCount = displayItems.length + (showQuickAdd ? 1 : 0);
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % itemsCount);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + itemsCount) % itemsCount);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, displayItems, onClose, showQuickAdd, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = useCallback((index: number) => {
    // Check if it's the Quick Add item
    if (showQuickAdd && index === searchResults.length) {
      onQuickAdd?.(query);
      onClose();
      return;
    }

    const item = displayItems[index];
    if (!item) return;

    if ('link' in item) {
      // Search result
      onAddToRecent(item.link);
      window.open(item.link.url, '_blank');
      onClose();
    } else {
      // Recent link (LinkItem)
      onAddToRecent(item);
      window.open(item.url, '_blank');
      onClose();
    }
  }, [displayItems, onAddToRecent, onClose, showQuickAdd, query, searchResults.length, onQuickAdd]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-20 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-down"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-gray-800/50 border border-gray-700 text-white text-lg rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none placeholder:text-gray-600"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results / History */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto custom-scrollbar">
          {query.trim() ? (
            // Search Results
            <>
              {searchResults.map((result, index) => (
                <SearchItem
                  key={`${result.categoryId}-${result.link.id}`}
                  title={result.link.title}
                  description={result.link.description}
                  categoryName={CATEGORY_NAMES[lang][result.categoryType]}
                  icon={<Search size={18} />}
                  isSelected={selectedIndex === index}
                  onSelect={() => handleSelect(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                />
              ))}

              {showQuickAdd && (
                <SearchItem
                  title={lang === 'cn' ? `将 "${query}" 添加为新链接` : `Add "${query}" as new link`}
                  description={lang === 'cn' ? '自动触发 AI 解析与填充' : 'Auto-trigger AI analysis and fill'}
                  icon={<Plus size={18} />}
                  isSelected={selectedIndex === searchResults.length}
                  onSelect={() => handleSelect(searchResults.length)}
                  onMouseEnter={() => setSelectedIndex(searchResults.length)}
                  isQuickAdd
                />
              )}

              {searchResults.length === 0 && !showQuickAdd && (
                <div className="p-8 text-center text-gray-500">
                  {lang === 'cn' ? '未找到匹配的链接' : 'No links found'}
                </div>
              )}
            </>
          ) : (
              // Recent Links
              <>
                {recentLinks.length > 0 && (
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800/50">
                  {lang === 'cn' ? '最近打开' : 'Recent Links'}
                </div>
                )}
                {recentLinks.map((item, index) => {
                const category = categories.find(cat =>
                  cat.links.some(link => link.url === item.url)
                );
                return (
                  <SearchItem
                    key={item.url}
                    title={item.title}
                    description={item.description}
                    categoryName={category ? CATEGORY_NAMES[lang][category.type] : undefined}
                    icon={<Clock size={16} />}
                    isSelected={selectedIndex === index}
                    onSelect={() => handleSelect(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onRemove={() => onRemoveFromRecent(item.url)}
                  />
                );
              })}
                {recentLinks.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    {lang === 'cn' ? '暂无最近打开的链接' : 'No recent links'}
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded">↑↓</kbd> {lang === 'cn' ? '选择' : 'Navigate'}</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded">Enter</kbd> {lang === 'cn' ? '打开' : 'Open'}</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded">Esc</kbd> {lang === 'cn' ? '关闭' : 'Close'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchOverlay.displayName = 'SearchOverlay';
