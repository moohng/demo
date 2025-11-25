import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Plus, Github, Sparkles, Loader2, Upload, HelpCircle, X, User, CheckSquare, Square } from 'lucide-react';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import GeminiChat from './components/GeminiChat';
import Sidebar from './components/Sidebar';
import { Category, CategoryType, LinkItem, Language } from './types';
import { INITIAL_DATA, TRANSLATIONS, CATEGORY_NAMES } from './constants';
import { analyzeLinkInfo, recommendTools, batchAnalyzeLinks } from './services/geminiService';
import { parseBookmarks } from './utils/bookmarkParser';

function App() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lang, setLang] = useState<Language>('cn'); // Default to Chinese

  // AI States
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, isVisible: false });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
  const [pendingImportLinks, setPendingImportLinks] = useState<LinkItem[]>([]);

  // Manual Import State
  const [showManualImportModal, setShowManualImportModal] = useState(false);
  const [manualImportCandidates, setManualImportCandidates] = useState<{ link: LinkItem, selected: boolean, category: CategoryType }[]>([]);

  // Notification State
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info', isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  // Link State for Add/Edit Form
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [originalCategoryId, setOriginalCategoryId] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState<CategoryType>(CategoryType.TOOLS);

  const t = TRANSLATIONS[lang];

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('devspace_data');
    if (savedData) {
      try {
        setCategories(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on medium screens, expand on large screens
      if (window.innerWidth < 1280) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('devspace_data', JSON.stringify(categories));
  }, [categories]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AI Search Effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isAiSearch && searchQuery.length > 2) {
        setIsAiSearching(true);
        try {
          const result = await recommendTools(searchQuery, categories, lang);
          setAiRecommendations(result);
        } catch (e) {
          console.error("AI Search failed", e);
        } finally {
          setIsAiSearching(false);
        }
      } else if (isAiSearch && searchQuery.length === 0) {
        setAiRecommendations('');
      }
    }, 800); // Debounce

    return () => clearTimeout(timer);
  }, [searchQuery, isAiSearch, categories, lang]);

  const handleDeleteLink = (categoryId: string, linkId: string) => {
    // Confirmation is now handled in LinkCard.tsx to ensure UI responsiveness
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        links: cat.links.filter(l => l.id !== linkId)
      };
    }));
  };

  const openAddModal = () => {
    setEditingLinkId(null);
    setOriginalCategoryId(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDesc('');
    // Default to first category or currently viewed one if we were tracking scroll position, 
    // but default Tools is fine.
    setNewLinkCategory(CategoryType.TOOLS);
    setShowAddModal(true);
  };

  const openEditModal = (categoryId: string, link: LinkItem) => {
    setEditingLinkId(link.id);
    setOriginalCategoryId(categoryId);
    setNewLinkTitle(link.title);
    setNewLinkUrl(link.url);
    setNewLinkDesc(link.description);

    const currentCategory = categories.find(c => c.id === categoryId);
    if (currentCategory) {
      setNewLinkCategory(currentCategory.type);
    }

    setShowAddModal(true);
  };

  const handleAutoFill = async () => {
    if (!newLinkUrl) return;
    setIsAutoFilling(true);
    try {
      const info = await analyzeLinkInfo(newLinkUrl, newLinkTitle, lang);
      if (info.category) {
        // Map string category to enum if possible, else default
        const foundType = Object.values(CategoryType).find(t => t.toLowerCase() === info.category.toLowerCase());
        if (foundType) setNewLinkCategory(foundType);
      }
      if (info.description) setNewLinkDesc(info.description);
      if (info.title && !newLinkTitle) setNewLinkTitle(info.title);
    } catch (e) {
      console.error("Auto-fill failed", e);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSaveLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;

    // Normalize URL
    let formattedUrl = newLinkUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // New Link Object
    const linkData: LinkItem = {
      id: editingLinkId || Math.random().toString(36).substr(2, 9),
      title: newLinkTitle,
      url: formattedUrl,
      description: newLinkDesc || 'Custom Bookmark',
    };

    setCategories(prev => {
      let newCategories = [...prev];

      // If editing, first remove the old link from its original category
      // This handles cases where we move a link to a different category
      if (editingLinkId && originalCategoryId) {
        let isSameCategory = false;
        newCategories = newCategories.map(cat => {
          if (cat.id === originalCategoryId) {
            if (cat.type === newLinkCategory) {
              isSameCategory = true;
              return {
                ...cat,
                links: cat.links.map(l => l.id === editingLinkId ? linkData : l)
              };
            } else {
              return {
                ...cat,
                links: cat.links.filter(l => l.id !== editingLinkId)
              };
            }
          }
          return cat;
        });

        if (isSameCategory) {
          return newCategories;
        }
      }

      // Find target category to add/update the link
      const targetCategoryIndex = newCategories.findIndex(c => c.type === newLinkCategory);

      if (targetCategoryIndex > -1) {
        // Add to existing category
        newCategories[targetCategoryIndex] = {
          ...newCategories[targetCategoryIndex],
          links: [...newCategories[targetCategoryIndex].links, linkData]
        };
      } else {
        // Create new category if needed (rare case given strict types, but robust)
        newCategories.push({
          id: Math.random().toString(36).substr(2, 9),
          type: newLinkCategory,
          links: [linkData]
        });
      }

      return newCategories;
    });

    // Reset and Close
    setEditingLinkId(null);
    setOriginalCategoryId(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDesc('');
    setShowAddModal(false);
  };

  const handleImportBookmarks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const links = parseBookmarks(text);

    if (links.length > 0) {
      setPendingImportLinks(links);
      setShowImportConfirmModal(true);
    }

    // Reset input
    e.target.value = '';
  };

  const processImport = async (useAI: boolean) => {
    setShowImportConfirmModal(false);
    const links = pendingImportLinks;

    if (useAI) {
      setIsImporting(true);
      setImportProgress({ current: 0, total: links.length, isVisible: true });

      const BATCH_SIZE = 10;
      let allAnalyzedData: Record<string, { category: string, description: string }> = {};

      // Process in chunks
      for (let i = 0; i < links.length; i += BATCH_SIZE) {
        const chunk = links.slice(i, i + BATCH_SIZE);
        try {
          const chunkResults = await batchAnalyzeLinks(chunk, lang);
          allAnalyzedData = { ...allAnalyzedData, ...chunkResults };
        } catch (e) {
          console.error(`Batch analysis failed for chunk ${i}`, e);
        }

        // Update progress
        setImportProgress(prev => ({ ...prev, current: Math.min(i + BATCH_SIZE, links.length) }));
      }

      setCategories(prev => {
        const newCategories = [...prev];

        links.forEach(link => {
          const info = allAnalyzedData[link.url];
          let targetType = CategoryType.TOOLS; // Default
          let description = link.description;

          if (info) {
            // Try to match category
            const foundType = Object.values(CategoryType).find(t => t.toLowerCase() === info.category.toLowerCase());
            if (foundType) targetType = foundType;
            if (info.description) description = info.description;
          }

          // Find or create category
          const catIndex = newCategories.findIndex(c => c.type === targetType);
          const newLink = { ...link, description };

          if (catIndex > -1) {
            newCategories[catIndex] = {
              ...newCategories[catIndex],
              links: [...newCategories[catIndex].links, newLink]
            };
          } else {
            const toolsIndex = newCategories.findIndex(c => c.type === CategoryType.TOOLS);
            if (toolsIndex > -1) {
              newCategories[toolsIndex] = {
                ...newCategories[toolsIndex],
                links: [...newCategories[toolsIndex].links, newLink]
              };
            }
          }
        });

        return newCategories;
      });

      setIsImporting(false);
      setImportProgress(prev => ({ ...prev, isVisible: false }));
      alert(lang === 'cn' ? `成功导入并智能分类了 ${links.length} 个书签！` : `Successfully imported and intelligently categorized ${links.length} bookmarks!`);
    } else {
      // Simple Import
      setCategories(prev => {
        const newCategories = [...prev];
        const toolsIndex = newCategories.findIndex(c => c.type === CategoryType.TOOLS);

        if (toolsIndex > -1) {
          newCategories[toolsIndex] = {
            ...newCategories[toolsIndex],
            links: [...newCategories[toolsIndex].links, ...links]
          };
        } else {
          // Fallback if for some reason Tools category doesn't exist
          newCategories.push({
            id: Math.random().toString(36).substr(2, 9),
            type: CategoryType.TOOLS,
            links: links
          });
        }
        return newCategories;
      });

      alert(lang === 'cn' ? `成功导入 ${links.length} 个书签到“工具”分类！` : `Successfully imported ${links.length} bookmarks to Tools category!`);
    }

    setPendingImportLinks([]);
  };

  const startManualImport = () => {
    setShowImportConfirmModal(false);
    // Initialize candidates with all selected by default, and default category TOOLS
    const candidates = pendingImportLinks.map(link => ({
      link,
      selected: true,
      category: CategoryType.TOOLS
    }));
    setManualImportCandidates(candidates);
    setShowManualImportModal(true);
  };

  const toggleCandidate = (index: number) => {
    setManualImportCandidates(prev => {
      const newCandidates = [...prev];
      newCandidates[index] = { ...newCandidates[index], selected: !newCandidates[index].selected };
      return newCandidates;
    });
  };

  const updateCandidateCategory = (index: number, category: CategoryType) => {
    setManualImportCandidates(prev => {
      const newCandidates = [...prev];
      newCandidates[index] = { ...newCandidates[index], category };
      return newCandidates;
    });
  };

  const toggleAllCandidates = (selectAll: boolean) => {
    setManualImportCandidates(prev => prev.map(c => ({ ...c, selected: selectAll })));
  };

  const finishBulkImport = () => {
    const selectedCandidates = manualImportCandidates.filter(c => c.selected);

    if (selectedCandidates.length === 0) {
      showNotification(lang === 'cn' ? "未选择任何书签。" : "No bookmarks selected.", 'info');
      return;
    }

    setCategories(prev => {
      const newCategories = [...prev];

      selectedCandidates.forEach(item => {
        const catIndex = newCategories.findIndex(c => c.type === item.category);
        const linkToAdd = { ...item.link, description: item.link.description || 'Imported Bookmark' };

        if (catIndex > -1) {
          newCategories[catIndex] = {
            ...newCategories[catIndex],
            links: [...newCategories[catIndex].links, linkToAdd]
          };
        } else {
          // Fallback
          const toolsIndex = newCategories.findIndex(c => c.type === CategoryType.TOOLS);
          if (toolsIndex > -1) {
            newCategories[toolsIndex] = {
              ...newCategories[toolsIndex],
              links: [...newCategories[toolsIndex].links, linkToAdd]
            };
          }
        }
      });

      return newCategories;
    });

    setShowManualImportModal(false);
    showNotification(lang === 'cn' ? `成功导入了 ${selectedCandidates.length} 个书签！` : `Successfully imported ${selectedCandidates.length} bookmarks!`, 'success');
    setPendingImportLinks([]);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery || isAiSearch) return categories;
    const lowerQuery = searchQuery.toLowerCase();

    return categories.map(cat => ({
      ...cat,
      links: cat.links.filter(link =>
        link.title.toLowerCase().includes(lowerQuery) ||
        link.description.toLowerCase().includes(lowerQuery) ||
        link.url.toLowerCase().includes(lowerQuery)
      )
    })).filter(cat => cat.links.length > 0);
  }, [categories, searchQuery, isAiSearch]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 selection:bg-primary/30 selection:text-white flex flex-col relative">

      {/* Toast Notification */}
      {notification.isVisible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[110] animate-fade-in-down">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${notification.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' :
                'bg-blue-500/20 border-blue-500/50 text-blue-200'
            }`}>
            {notification.type === 'success' && <CheckCircle size={20} />}
            {notification.type === 'error' && <AlertTriangle size={20} />}
            {notification.type === 'info' && <Info size={20} />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Import Confirmation Modal */}
      {showImportConfirmModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowImportConfirmModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowImportConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload size={24} className="text-primary" />
              {lang === 'cn' ? "导入选项" : "Import Options"}
            </h3>

            <p className="text-gray-300 mb-6">
              {lang === 'cn'
                ? `发现了 ${pendingImportLinks.length} 个书签。您希望如何导入？`
                : `Found ${pendingImportLinks.length} bookmarks. How would you like to import them?`}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => processImport(true)}
                className="w-full p-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl flex items-center gap-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">
                    {lang === 'cn' ? "AI 智能分类 (推荐)" : "AI Smart Categorization (Recommended)"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {lang === 'cn' ? "自动分析并归类到正确的分组" : "Automatically analyzes and organizes into groups"}
                  </div>
                </div>
              </button>

              <button
                onClick={startManualImport}
                className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center gap-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User size={20} className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-200">
                    {lang === 'cn' ? "手动分类" : "Manual Categorization"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lang === 'cn' ? "逐个确认并选择分组" : "Review and categorize one by one"}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Manual Import Modal */}
      {showManualImportModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={24} className="text-primary" />
                {lang === 'cn' ? "选择要导入的书签" : "Select Bookmarks to Import"}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAllCandidates(true)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
                >
                  {lang === 'cn' ? "全选" : "Select All"}
                </button>
                <button
                  onClick={() => toggleAllCandidates(false)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
                >
                  {lang === 'cn' ? "取消全选" : "Deselect All"}
                </button>
                <button
                  onClick={() => setShowManualImportModal(false)}
                  className="text-gray-400 hover:text-white transition-colors ml-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 min-h-0 custom-scrollbar">
              {manualImportCandidates.map((candidate, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${candidate.selected
                    ? 'bg-gray-800/80 border-primary/30'
                    : 'bg-gray-900/50 border-gray-800 opacity-60 hover:opacity-100'
                    }`}
                >
                  <button
                    onClick={() => toggleCandidate(index)}
                    className={`w-6 h-6 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${candidate.selected
                      ? 'bg-primary border-primary text-white'
                      : 'bg-gray-800 border-gray-600 text-transparent hover:border-gray-500'
                      }`}
                  >
                    <CheckSquare size={14} className={candidate.selected ? 'opacity-100' : 'opacity-0'} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate text-sm" title={candidate.link.title}>
                      {candidate.link.title || candidate.link.url}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={candidate.link.url}>
                      {candidate.link.url}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <select
                      value={candidate.category}
                      onChange={(e) => updateCandidateCategory(index, e.target.value as CategoryType)}
                      className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.values(CategoryType).map(type => (
                        <option key={type} value={type}>
                          {CATEGORY_NAMES[lang][type]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center flex-shrink-0">
              <div className="text-sm text-gray-400">
                {lang === 'cn'
                  ? `已选择 ${manualImportCandidates.filter(c => c.selected).length} / ${manualImportCandidates.length} 个`
                  : `Selected ${manualImportCandidates.filter(c => c.selected).length} / ${manualImportCandidates.length}`}
              </div>
              <button
                onClick={finishBulkImport}
                disabled={manualImportCandidates.filter(c => c.selected).length === 0}
                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {lang === 'cn' ? "导入选中的书签" : "Import Selected"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowHelpModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={24} className="text-primary" />
              {lang === 'cn' ? "如何导出书签？" : "How to Export Bookmarks?"}
            </h3>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/chrome/chrome_24x24.png" alt="Chrome" className="w-5 h-5 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                  Chrome / Edge
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>{lang === 'cn' ? "按快捷键" : "Press"} <kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded">O</kbd></li>
                  <li>{lang === 'cn' ? "点击右上角的三个点 (⋮)" : "Click the three dots (⋮) in the top right"}</li>
                  <li>{lang === 'cn' ? "选择“导出书签”" : "Select 'Export bookmarks'"}</li>
                </ol>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.0.0/firefox/firefox_24x24.png" alt="Firefox" className="w-5 h-5 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                  Firefox
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-400">
                  <li>{lang === 'cn' ? "按快捷键" : "Press"} <kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded">O</kbd></li>
                  <li>{lang === 'cn' ? "点击“导入和备份”" : "Click 'Import and Backup'"}</li>
                  <li>{lang === 'cn' ? "选择“导出书签到 HTML”" : "Select 'Export Bookmarks to HTML'"}</li>
                </ol>
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                {lang === 'cn'
                  ? "提示：导出后，点击下方的“上传”按钮选择该 HTML 文件即可。"
                  : "Tip: After exporting, click the 'Upload' button below and select the HTML file."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overlay */}
      {importProgress.isVisible && (
        <div className="fixed inset-0 z-[100] bg-[#0f172a]/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="w-full max-w-md p-8 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-gray-900 rounded-full w-full h-full flex items-center justify-center border border-primary/50 shadow-2xl shadow-primary/30">
                <Sparkles size={40} className="text-primary animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {lang === 'cn' ? "AI 正在分析您的书签..." : "AI is analyzing your bookmarks..."}
            </h2>
            <p className="text-gray-400 mb-8">
              {lang === 'cn' ? "正在智能分类，请稍候" : "Categorizing links intelligently, please wait"}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden border border-gray-700">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 ease-out"
                style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm font-mono text-gray-500">
              <span>{Math.round((importProgress.current / importProgress.total) * 100)}%</span>
              <span>{importProgress.current} / {importProgress.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header Section (Hero) */}
      <Header
        onSearch={setSearchQuery}
        editMode={editMode}
        toggleEditMode={() => setEditMode(!editMode)}
        lang={lang}
        toggleLang={toggleLang}
        isAiSearch={isAiSearch}
        toggleAiSearch={() => {
          setIsAiSearch(!isAiSearch);
          setSearchQuery('');
          setAiRecommendations('');
        }}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl w-full mx-auto px-6 flex items-start gap-8 relative flex-1">

        {/* Sidebar Navigation (Sticky) */}
        {!isAiSearch && (
          <Sidebar
            categories={filteredCategories.length > 0 ? filteredCategories : categories}
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            lang={lang}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-20">
          {isAiSearch ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 min-h-[400px]">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
              </div>

              {isAiSearching ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Thinking...</span>
                </div>
              ) : aiRecommendations ? (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{aiRecommendations}</p>
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <p className="text-xl">Type something to get AI recommendations...</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <p className="text-xl">{t.noResults} "{searchQuery}"</p>
                </div>
              ) : (
                filteredCategories.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    editMode={editMode}
                    lang={lang}
                    onDeleteLink={handleDeleteLink}
                    onEditLink={openEditModal}
                  />
                ))
              )}
            </>
          )}

          <footer className="text-center text-gray-600 text-sm mt-12 mb-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gray-400 transition-colors">
              <Github size={14} />
              <span>{t.builtWith}</span>
            </a>
          </footer>
        </main>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        {/* Import Button (Visible only in Edit Mode) */}
        {editMode && (
          <div className="flex flex-col gap-2 items-center">
            {/* Help Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-8 h-8 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-colors border border-gray-700 mb-1"
              title={lang === 'cn' ? "如何导出书签？" : "How to export bookmarks?"}
            >
              <HelpCircle size={16} />
            </button>

            <input
              type="file"
              id="import-bookmarks"
              className="hidden"
              accept=".html"
              onChange={handleImportBookmarks}
            />
            <label
              htmlFor="import-bookmarks"
              className={`w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg shadow-black/50 flex items-center justify-center transition-transform hover:scale-105 border border-gray-700 cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={lang === 'cn' ? "导入书签" : "Import Bookmarks"}
            >
              {isImporting ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            </label>
          </div>
        )}

        {/* Add Link Button (Visible only in Edit Mode) */}
        {editMode && (
          <button
            onClick={openAddModal}
            className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg shadow-black/50 flex items-center justify-center transition-transform hover:scale-105 border border-gray-700"
            title={t.addShortcut}
          >
            <Plus size={24} />
          </button>
        )}

        {/* Gemini Chat Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300 border border-white/10
            ${isChatOpen
              ? 'bg-gray-800 text-gray-400 rotate-90'
              : 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-105 animate-pulse-slow'
            }`}
          title={t.aiName}
        >
          <Bot size={28} />
        </button>
      </div>

      {/* Chat Interface */}
      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lang={lang} categories={categories} />

      {/* Add/Edit Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingLinkId ? t.editShortcut : t.addShortcut}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">{t.url}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none"
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={e => setNewLinkUrl(e.target.value)}
                  />
                  <button
                    onClick={handleAutoFill}
                    disabled={isAutoFilling || !newLinkUrl}
                    className="px-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg border border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Auto-fill with AI"
                  >
                    {isAutoFilling ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">{t.title}</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none"
                  placeholder="e.g. My Blog"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">{t.category}</label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none appearance-none"
                  value={newLinkCategory}
                  onChange={(e) => setNewLinkCategory(e.target.value as CategoryType)}
                >
                  {Object.values(CategoryType).map(type => (
                    <option key={type} value={type}>{CATEGORY_NAMES[lang][type]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">{t.description}</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none"
                  placeholder={lang === 'cn' ? "简短描述..." : "Short description..."}
                  value={newLinkDesc}
                  onChange={e => setNewLinkDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveLink}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;