import React, { useRef } from 'react';
import { X, Image as ImageIcon, Upload, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { PRESET_WALLPAPERS, TRANSLATIONS } from '../constants';

interface WallpaperPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: string;
  onWallpaperChange: (wallpaper: string) => void;
  lang: Language;
}

const WallpaperPanel: React.FC<WallpaperPanelProps> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onWallpaperChange,
  lang
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onWallpaperChange(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    onWallpaperChange('');
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen z-40 bg-[#0f172a]/95 backdrop-blur-xl border-l border-glassBorder transition-all duration-300 flex flex-col ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'
        }`}
    >
      {isOpen && (
        <div className="flex flex-col h-full p-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon size={24} className="text-primary" />
              {t.wallpaperSettings}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-glass hover:bg-glassHover text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {/* Preset Wallpapers */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">{t.presetWallpapers}</h3>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_WALLPAPERS.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => onWallpaperChange(wallpaper.url)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${currentWallpaper === wallpaper.url
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-gray-700 hover:border-gray-600'
                      }`}
                  >
                    {wallpaper.type === 'gradient' ? (
                      <div
                        className="w-full h-full"
                        style={{ background: wallpaper.url }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{wallpaper.name}</span>
                      </div>
                    )}
                    {currentWallpaper === wallpaper.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Wallpaper */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">{t.customWallpaper}</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-700 hover:border-primary/50 text-gray-400 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Upload size={18} />
                <span className="text-sm font-medium">{t.uploadImage}</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span className="text-sm font-medium">{t.resetWallpaper}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default WallpaperPanel;
