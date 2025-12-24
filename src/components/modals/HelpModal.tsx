import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = React.memo(({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle size={24} className="text-primary" />
          {lang === 'cn' ? "如何导出书签？" : "How to Export Bookmarks?"}
        </h3>

        <div className="space-y-4 text-sm text-gray-300">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/chrome/chrome_24x24.png" alt="Chrome" className="w-5 h-5 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
              Chrome / Edge
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>{lang === 'cn' ? "按快捷键" : "Press"} <kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded">O</kbd></li>
              <li>{lang === 'cn' ? "点击右上角的三个点 (⋮)" : "Click the three dots (⋮) in the top right"}</li>
              <li>{lang === 'cn' ? "选择'导出书签'" : "Select 'Export bookmarks'"}</li>
            </ol>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/firefox/firefox_24x24.png" alt="Firefox" className="w-5 h-5 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
              Firefox
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-400">
              <li>{lang === 'cn' ? "按快捷键" : "Press"} <kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded">O</kbd></li>
              <li>{lang === 'cn' ? "点击'导入和备份'" : "Click 'Import and Backup'"}</li>
              <li>{lang === 'cn' ? "选择'导出书签到 HTML'" : "Select 'Export Bookmarks to HTML'"}</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500 mt-4 italic">
            {lang === 'cn'
              ? "提示：导出后，点击下方的'上传'按钮选择该 HTML 文件即可。"
              : "Tip: After exporting, click the 'Upload' button below and select the HTML file."}
          </p>
        </div>
      </div>
    </div>
  );
});

HelpModal.displayName = 'HelpModal';
