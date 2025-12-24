import { useState, useEffect } from 'react';

export const useAppState = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Edit Mode
  const [editMode, setEditMode] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleEditMode = () => setEditMode(prev => !prev);

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    editMode,
    setEditMode,
    toggleEditMode
  };
};
