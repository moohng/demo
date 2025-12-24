import React, { useState, useEffect } from 'react';
import { Search, Globe, User, LogOut } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onSearchClick?: () => void;
  onLoginClick: () => void;
}

const UserDropdown: React.FC<{ user: any; lang: string; onLogout: () => void }> = ({ user, lang, onLogout }) => (
  <div className="group relative">
    <button className="flex items-center gap-2 p-0.5 rounded-full border-2 border-glassBorder hover:border-primary/50 transition-all overflow-hidden bg-glass shadow-lg group-hover:shadow-primary/20">
      {user.user_metadata?.avatar_url ? (
        <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-sm">
          {(user.email?.[0] || 'U').toUpperCase()}
        </div>
      )}
    </button>
    <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-[60]">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-glassBorder rounded-xl shadow-2xl p-2 overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-800 mb-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Account</p>
          <p className="text-sm text-gray-300 truncate font-medium">{user.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group/item"
        >
          <LogOut size={14} className="group-hover/item:scale-110 transition-transform" />
          <span>{lang === 'cn' ? '退出登录' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  </div>
);

const SearchBar: React.FC<{ placeholder: string; onClick?: () => void; isSticky?: boolean }> = ({ placeholder, onClick, isSticky }) => (
  <div className={`relative group ${isSticky ? '' : 'w-full max-w-2xl'}`}>
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
      <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={isSticky ? 18 : 20} />
    </div>
    <input
      type="text"
      placeholder={placeholder}
      readOnly
      onClick={onClick}
      className={`w-full bg-gray-900/60 border border-gray-700 hover:border-gray-600 focus:border-primary/50 text-white shadow-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:text-gray-600 cursor-pointer ${isSticky ? 'rounded-2xl py-4 pl-12 pr-24' : 'text-lg rounded-2xl py-4 pl-12 pr-4'
        }`}
    />
    <div className="absolute inset-y-0 right-4 flex items-center gap-2">
      <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400 font-sans">
        space
      </kbd>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ onSearchClick, onLoginClick }) => {
  const { lang, toggleLang } = useLanguage();
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 280);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-16 pb-12 relative px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass border border-glassBorder text-xs text-primary mb-4 font-medium tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t.systemOnline}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">
            {greeting}, {user ? (user.email?.split('@')[0] || 'Dev') : 'Dev'}.
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">{time} — {t.timeToShip}</p>
        </div>

        <SearchBar placeholder={t.searchPlaceholder} onClick={onSearchClick} />

        <div className="fixed top-6 right-6 flex gap-3 z-50 transition-all duration-300">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-glass text-gray-400 border-glassBorder hover:text-white hover:bg-glassHover"
            title={lang === 'en' ? "切换到中文" : "Switch to English"}
          >
            <Globe size={14} />
            {lang === 'en' ? '中文' : 'EN'}
          </button>

          {user ? (
            <UserDropdown user={user} lang={lang} onLogout={handleLogout} />
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30 hover:text-blue-300 hover:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <User size={14} />
              {lang === 'cn' ? '登录' : 'Login'}
            </button>
          )}
        </div>
      </div>

      <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl w-[600px] max-w-[90vw]">
          <SearchBar placeholder={t.searchPlaceholder} onClick={onSearchClick} isSticky />
        </div>
      </div>
    </>
  );
};

export default Header;