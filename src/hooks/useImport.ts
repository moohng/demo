import { useState, useCallback } from 'react';
import { LinkItem, CategoryType, Language } from '../types';
import { parseBookmarks } from '../utils/bookmarkParser';
import { batchAnalyzeLinks } from '../services/geminiService';

interface ImportCandidate {
  link: LinkItem;
  selected: boolean;
  category: CategoryType;
}

interface ImportProgress {
  current: number;
  total: number;
  isVisible: boolean;
}

export const useImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress>({ 
    current: 0, 
    total: 0, 
    isVisible: false 
  });
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
  const [showManualImportModal, setShowManualImportModal] = useState(false);
  const [pendingImportLinks, setPendingImportLinks] = useState<LinkItem[]>([]);
  const [manualImportCandidates, setManualImportCandidates] = useState<ImportCandidate[]>([]);

  const handleFileSelect = useCallback(async (file: File) => {
    const text = await file.text();
    const links = parseBookmarks(text);

    if (links.length > 0) {
      setPendingImportLinks(links);
      setShowImportConfirmModal(true);
    }
  }, []);

  const startManualImport = useCallback(() => {
    setShowImportConfirmModal(false);
    const candidates = pendingImportLinks.map(link => ({
      link,
      selected: true,
      category: CategoryType.TOOLS
    }));
    setManualImportCandidates(candidates);
    setShowManualImportModal(true);
  }, [pendingImportLinks]);

  const toggleCandidate = useCallback((index: number) => {
    setManualImportCandidates(prev => {
      const newCandidates = [...prev];
      newCandidates[index] = { ...newCandidates[index], selected: !newCandidates[index].selected };
      return newCandidates;
    });
  }, []);

  const updateCandidateCategory = useCallback((index: number, category: CategoryType) => {
    setManualImportCandidates(prev => {
      const newCandidates = [...prev];
      newCandidates[index] = { ...newCandidates[index], category };
      return newCandidates;
    });
  }, []);

  const toggleAllCandidates = useCallback((selectAll: boolean) => {
    setManualImportCandidates(prev => prev.map(c => ({ ...c, selected: selectAll })));
  }, []);

  const processAIImport = useCallback(async (links: LinkItem[], lang: Language): Promise<{ link: LinkItem, category: CategoryType }[]> => {
    setIsImporting(true);
    setImportProgress({ current: 0, total: links.length, isVisible: true });
    
    const BATCH_SIZE = 10;
    let allAnalyzedData: Record<string, { category: string, description: string }> = {};
    
    for (let i = 0; i < links.length; i += BATCH_SIZE) {
      const chunk = links.slice(i, i + BATCH_SIZE);
      try {
        const chunkResults = await batchAnalyzeLinks(chunk, lang);
        allAnalyzedData = { ...allAnalyzedData, ...chunkResults };
      } catch (e) {
        console.error(`Batch analysis failed for chunk ${i}`, e);
      }
      
      setImportProgress(prev => ({ ...prev, current: Math.min(i + BATCH_SIZE, links.length) }));
    }

    const results = links.map(link => {
      const info = allAnalyzedData[link.url];
      let targetType = CategoryType.TOOLS;
      let description = link.description;

      if (info) {
        const foundType = Object.values(CategoryType).find(t => t.toLowerCase() === info.category.toLowerCase());
        if (foundType) targetType = foundType;
        if (info.description) description = info.description;
      }

      return {
        link: { ...link, description: description || 'Imported Bookmark' },
        category: targetType
      };
    });

    setIsImporting(false);
    setImportProgress(prev => ({ ...prev, isVisible: false }));
    setPendingImportLinks([]);
    
    return results;
  }, []);

  const resetImport = useCallback(() => {
    setShowImportConfirmModal(false);
    setShowManualImportModal(false);
    setPendingImportLinks([]);
    setManualImportCandidates([]);
    setIsImporting(false);
    setImportProgress({ current: 0, total: 0, isVisible: false });
  }, []);

  return {
    // State
    isImporting,
    importProgress,
    showImportConfirmModal,
    showManualImportModal,
    pendingImportLinks,
    manualImportCandidates,
    
    // Actions
    handleFileSelect,
    startManualImport,
    toggleCandidate,
    updateCandidateCategory,
    toggleAllCandidates,
    processAIImport,
    resetImport,
    setShowImportConfirmModal,
    setShowManualImportModal
  };
};
