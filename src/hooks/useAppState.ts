import { useState, useEffect } from 'react';

export const useAppState = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
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
    localStorage.setItem('isAiSearch', JSON.stringify(isAiSearch));
  }, [isAiSearch]);

  const toggleAiSearch = () => setIsAiSearch((prev: boolean) => !prev);
  const toggleEditMode = () => setEditMode(prev => !prev);

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isAiSearch,
    setIsAiSearch,
    toggleAiSearch,
    editMode,
    setEditMode,
    toggleEditMode
  };
};
