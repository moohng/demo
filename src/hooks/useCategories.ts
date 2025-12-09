import { useState, useEffect, useCallback } from 'react';
import { Category, LinkItem, CategoryType } from '../types';
import { storageService } from '../services/storageService';
import { supabase } from '../lib/supabase';
import { INITIAL_DATA } from '../constants';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  // Initial Data Load & Subscription
  useEffect(() => {
    // Subscribe to changes
    const unsubscribe = storageService.subscribe((data) => {
      // If data is empty, try loading local data and syncing (legacy fallback logic from App.tsx)
      if (!data.categories?.length) {
        // This logic was in App.tsx, keeping it to maintain behavior
        storageService.loadLocalData().then(localData => {
          setCategories(localData.categories);
          storageService.syncLocalToCloud();
        });
      } else {
        setCategories(data.categories);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // CRUD Operations Wrappers
  const addCategory = useCallback(async (category: Category) => {
    await storageService.saveCategory(category);
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    await storageService.saveCategory(category);
  }, []);

  const deleteCategory = useCallback(async (categoryId: string) => {
    await storageService.deleteCategory(categoryId);
  }, []);

  const addLink = useCallback(async (categoryId: string, link: LinkItem) => {
    await storageService.saveLink(categoryId, link);
  }, []);

  const updateLink = useCallback(async (categoryId: string, link: LinkItem) => {
    await storageService.saveLink(categoryId, link);
  }, []);

  const deleteLink = useCallback(async (categoryId: string, linkId: string) => {
    await storageService.deleteLink(categoryId, linkId);
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addLink,
    updateLink,
    deleteLink
  };
};
