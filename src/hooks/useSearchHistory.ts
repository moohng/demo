import { useState, useEffect, useCallback } from 'react';
import { LinkItem } from '../types';

const STORAGE_KEY = 'devgo_recent_links';
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<LinkItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load recent links', e);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save recent links', e);
    }
  }, [history]);

  const addToHistory = useCallback((link: LinkItem) => {
    setHistory(prev => {
      // Remove if already exists (by URL)
      const filtered = prev.filter(item => item.url !== link.url);
      // Add to front
      const newHistory = [link, ...filtered];
      // Keep only MAX_HISTORY items
      return newHistory.slice(0, MAX_HISTORY);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((url: string) => {
    setHistory(prev => prev.filter(item => item.url !== url));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
};
