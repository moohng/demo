import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface ImportProgressOverlayProps {
  isVisible: boolean;
  current: number;
  total: number;
  lang: Language;
}

export const ImportProgressOverlay: React.FC<ImportProgressOverlayProps> = React.memo(({
  isVisible,
  current,
  total,
  lang
}) => {
  if (!isVisible) return null;

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
            <Sparkles size={48} className="text-primary animate-pulse" />
          </div>
          <Loader2 size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary/50 animate-spin" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">
            {lang === 'cn' ? "AI 正在分析您的书签..." : "AI is analyzing your bookmarks..."}
          </h3>
          <p className="text-gray-400">
            {lang === 'cn' ? "正在智能分类，请稍候" : "Categorizing links intelligently, please wait"}
          </p>
        </div>

        <div className="w-80 space-y-2">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 font-mono">
            {current} / {total} ({percentage}%)
          </div>
        </div>
      </div>
    </div>
  );
});

ImportProgressOverlay.displayName = 'ImportProgressOverlay';
