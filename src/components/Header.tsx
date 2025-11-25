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
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, lang, toggleLang, editMode, setEditMode, isAiSearch, toggleAiSearch }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
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
    const timer = setInterval(updateTime, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, [lang, t]);

  return (
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900/60 border border-gray-700 hover:border-gray-600 focus:border-primary/50 text-white text-lg rounded-2xl py-4 pl-12 pr-4 shadow-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-gray-600"
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
      <div className="absolute top-6 right-6 flex gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-glass text-gray-400 border-glassBorder hover:text-white hover:bg-glassHover"
          title={lang === 'en' ? "Switch to Chinese" : "Switch to English"}
        >
          <Globe size={14} />
          {lang === 'en' ? 'EN' : '中文'}
        </button>

        {/* Edit Mode Toggle */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${editMode
            ? 'bg-red-500/10 text-red-400 border-red-500/50'
            : 'bg-glass text-gray-400 border-glassBorder hover:text-white hover:bg-glassHover'
            }`}
        >
          <Terminal size={14} />
          {editMode ? t.doneEditing : t.editMode}
        </button>
      </div>
    </div>
  );
};

export default Header;