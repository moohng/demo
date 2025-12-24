import React from 'react';
import { X, Upload, Sparkles, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImportConfirmModalProps {
  isOpen: boolean;
  bookmarkCount: number;
  onClose: () => void;
  onAIImport: () => void;
  onManualImport: () => void;
}

export const ImportConfirmModal: React.FC<ImportConfirmModalProps> = React.memo(({
  isOpen,
  bookmarkCount,
  onClose,
  onAIImport,
  onManualImport
}) => {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={24} className="text-primary" />
          {lang === 'cn' ? "导入选项" : "Import Options"}
        </h3>

        <p className="text-gray-300 mb-6">
          {lang === 'cn'
            ? `发现了 ${bookmarkCount} 个书签。您希望如何导入？`
            : `Found ${bookmarkCount} bookmarks. How would you like to import them?`}
        </p>

        <div className="space-y-3">
          <button
            onClick={onAIImport}
            className="w-full p-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">
                {lang === 'cn' ? "AI 智能分类 (推荐)" : "AI Smart Categorization (Recommended)"}
              </div>
              <div className="text-xs text-gray-400">
                {lang === 'cn' ? "自动分析并归类到正确的分组" : "Automatically analyzes and organizes into groups"}
              </div>
            </div>
          </button>

          <button
            onClick={onManualImport}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-200">
                {lang === 'cn' ? "手动分类" : "Manual Categorization"}
              </div>
              <div className="text-xs text-gray-500">
                {lang === 'cn' ? "逐个确认并选择分组" : "Review and categorize one by one"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

ImportConfirmModal.displayName = 'ImportConfirmModal';
