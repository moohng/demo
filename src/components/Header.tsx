import React, { useState, useEffect } from 'react';
import { Search, Command, Terminal, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lang: Language;
  toggleLang: () => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  isAiSearch: boolean;
  toggleAiSearch: () => void;
  onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, lang, toggleLang, editMode, setEditMode, isAiSearch, toggleAiSearch, onSearchClick }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();

      let greet = t.greetingEvening;
      if (hrs < 12) greet = t.greetingMorning;
      else if (hrs < 18) greet = t.greetingAfternoon;

      setGreeting(greet);
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, [lang, t]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Original Header - unchanged */}
      <div className="flex flex-col items-center justify-center pt-16 pb-12 relative px-4">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

        {/* Greeting */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass border border-glassBorder text-xs text-primary mb-4 font-medium tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t.systemOnline}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">
            {greeting}, Dev.
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">{time} — {t.timeToShip}</p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            readOnly
            onClick={onSearchClick}
            className="w-full bg-gray-900/60 border border-gray-700 hover:border-gray-600 focus:border-primary/50 text-white text-lg rounded-2xl py-4 pl-12 pr-4 shadow-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-gray-600 cursor-pointer"
          />
          <div className="absolute inset-y-0 right-4 flex items-center gap-2">
            <button
              onClick={toggleAiSearch}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${isAiSearch
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              title={lang === 'cn' ? "AI 智能搜索" : "AI Smart Search"}
            >
              <Sparkles size={12} />
              <span>AI</span>
            </button>
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400 font-sans">
              <Command size={10} /> K
            </kbd>
          </div>
        </div>

        {/* Controls */}
        <div className="fixed top-6 right-6 flex gap-3 z-50">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-glass text-gray-400 border-glassBorder hover:text-white hover:bg-glassHover"
            title={lang === 'en' ? "切换到中文" : "Switch to English"}
          >
            <Globe size={14} />
            {lang === 'en' ? '中文' : 'EN'}
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${editMode
              ? 'bg-glass bg-green-500/10 text-green-400 border-green-500/50 border-glassBorder hover:text-green-400 hover:bg-green-500/20'
              : 'bg-glass text-gray-400 border-glassBorder hover:text-white hover:bg-glassHover'
              }`}
          >
            <Terminal size={14} />
            {editMode ? t.doneEditing : t.editMode}
          </button>
        </div>
      </div>

      {/* Sticky Search Bar - shows when scrolled */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
        }`}>
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl px-4 py-3 w-[600px] max-w-[90vw]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              readOnly
              onClick={onSearchClick}
              className="w-full bg-gray-800/50 border border-gray-700 hover:border-gray-600 focus:border-primary/50 text-white rounded-xl py-2.5 pl-12 pr-28 shadow-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none placeholder:text-gray-600 cursor-pointer"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <button
                onClick={toggleAiSearch}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${isAiSearch
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
              >
                <Sparkles size={12} />
                AI
              </button>
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded border border-gray-700">
                <Command size={10} />K
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;