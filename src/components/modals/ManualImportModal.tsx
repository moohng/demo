import React from 'react';
import { X, User, CheckSquare } from 'lucide-react';
import { CategoryType, Language } from '../../types';
import { CATEGORY_NAMES } from '../../constants';

interface ImportCandidate {
  link: {
    id: string;
    title: string;
    url: string;
    description?: string;
  };
  selected: boolean;
  category: CategoryType;
}

interface ManualImportModalProps {
  isOpen: boolean;
  candidates: ImportCandidate[];
  lang: Language;
  onClose: () => void;
  onToggleCandidate: (index: number) => void;
  onUpdateCategory: (index: number, category: CategoryType) => void;
  onToggleAll: (selectAll: boolean) => void;
  onImport: () => void;
}

export const ManualImportModal: React.FC<ManualImportModalProps> = React.memo(({
  isOpen,
  candidates,
  lang,
  onClose,
  onToggleCandidate,
  onUpdateCategory,
  onToggleAll,
  onImport
}) => {
  if (!isOpen) return null;

  const selectedCount = candidates.filter(c => c.selected).length;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User size={24} className="text-primary" />
            {lang === 'cn' ? "选择要导入的书签" : "Select Bookmarks to Import"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => onToggleAll(true)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
            >
              {lang === 'cn' ? "全选" : "Select All"}
            </button>
            <button
              onClick={() => onToggleAll(false)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
            >
              {lang === 'cn' ? "取消全选" : "Deselect All"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0 custom-scrollbar">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${candidate.selected
                  ? 'bg-gray-800/80 border-primary/30'
                  : 'bg-gray-900/50 border-gray-800 opacity-60 hover:opacity-100'
                }`}
            >
              <button
                onClick={() => onToggleCandidate(index)}
                className={`w-6 h-6 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${candidate.selected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-gray-800 border-gray-600 text-transparent hover:border-gray-500'
                  }`}
              >
                <CheckSquare size={14} className={candidate.selected ? 'opacity-100' : 'opacity-0'} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate text-sm" title={candidate.link.title}>
                  {candidate.link.title || candidate.link.url}
                </div>
                <div className="text-xs text-gray-500 truncate" title={candidate.link.url}>
                  {candidate.link.url}
                </div>
              </div>

              <div className="flex-shrink-0">
                <select
                  value={candidate.category}
                  onChange={(e) => onUpdateCategory(index, e.target.value as CategoryType)}
                  className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {Object.values(CategoryType).map(type => (
                    <option key={type} value={type}>
                      {CATEGORY_NAMES[lang][type]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center flex-shrink-0">
          <div className="text-sm text-gray-400">
            {lang === 'cn'
              ? `已选择 ${selectedCount} / ${candidates.length} 个`
              : `Selected ${selectedCount} / ${candidates.length}`}
          </div>
          <button
            onClick={onImport}
            disabled={selectedCount === 0}
            className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {lang === 'cn' ? "导入选中的书签" : "Import Selected"}
          </button>
        </div>
      </div>
    </div>
  );
});

ManualImportModal.displayName = 'ManualImportModal';
