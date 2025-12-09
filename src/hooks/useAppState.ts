import { useState, useEffect } from 'react';
import { Language } from '../types';

export const useAppState = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Language
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'cn';
  });

  // Wallpaper
  const [wallpaper, setWallpaper] = useState<string>(() => {
    const saved = localStorage.getItem('wallpaper');
    return saved || '';
  });

  // AI Search Toggle
  const [isAiSearch, setIsAiSearch] = useState(() => {
    const saved = localStorage.getItem('isAiSearch');
    return saved ? JSON.parse(saved) : false;
  });

  // Edit Mode
  const [editMode, setEditMode] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('isAiSearch', JSON.stringify(isAiSearch));
  }, [isAiSearch]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'cn' : 'en');
  const toggleAiSearch = () => setIsAiSearch((prev: boolean) => !prev);
  const toggleEditMode = () => setEditMode(prev => !prev);

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    lang,
    setLang,
    toggleLang,
    wallpaper,
    setWallpaper,
    isAiSearch,
    setIsAiSearch,
    toggleAiSearch,
    editMode,
    setEditMode,
    toggleEditMode
  };
};
