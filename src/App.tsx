import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bot, Plus, Github, Sparkles, Loader2, Upload, HelpCircle } from 'lucide-react';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import GeminiChat from './components/GeminiChat';
import Sidebar from './components/Sidebar';
import { Toast } from './components/Toast';
import { SearchOverlay } from './components/SearchOverlay';
import { ImportConfirmModal } from './components/modals/ImportConfirmModal';
import { ManualImportModal } from './components/modals/ManualImportModal';
import { HelpModal } from './components/modals/HelpModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { ImportProgressOverlay } from './components/overlays/ImportProgressOverlay';
import { Category, CategoryType, LinkItem, Language } from './types';
import { INITIAL_DATA, TRANSLATIONS, CATEGORY_NAMES } from './constants';
import { analyzeLinkInfo, recommendTools } from './services/geminiService';
import { useNotification } from './hooks/useNotification';
import { useImport } from './hooks/useImport';
import { useSearchHistory } from './hooks/useSearchHistory';

function App() {
  // Core State
  const [categories, setCategories] = useState<Category[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lang, setLang] = useState<Language>('cn');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // AI States
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Link Form State
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [originalCategoryId, setOriginalCategoryId] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState<CategoryType>(CategoryType.TOOLS);

  // Custom Hooks
  const { notification, showNotification } = useNotification();
  const { history: searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  const {
    isImporting,
    importProgress,
    showImportConfirmModal,
    showManualImportModal,
    pendingImportLinks,
    manualImportCandidates,
    handleFileSelect,
    startManualImport,
    toggleCandidate,
    updateCandidateCategory,
    toggleAllCandidates,
    processAIImport,
    setShowImportConfirmModal,
    setShowManualImportModal
  } = useImport();

  const t = TRANSLATIONS[lang];

  // Load from localStorage
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('devspace_data', JSON.stringify(categories));
  }, [categories]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchOverlay(true);
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
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, isAiSearch, categories, lang]);

  // Handlers
  const handleDeleteLink = useCallback((categoryId: string, linkId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        links: cat.links.filter(l => l.id !== linkId)
      };
    }));
  }, []);

  const openAddModal = useCallback(() => {
    setEditingLinkId(null);
    setOriginalCategoryId(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDesc('');
    setNewLinkCategory(CategoryType.TOOLS);
    setShowAddModal(true);
  }, []);

  const openEditModal = useCallback((categoryId: string, link: LinkItem) => {
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
  }, [categories]);

  const handleAutoFill = useCallback(async () => {
    if (!newLinkUrl) return;
    setIsAutoFilling(true);
    try {
      const info = await analyzeLinkInfo(newLinkUrl, newLinkTitle, lang);
      if (info.category) {
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
  }, [newLinkUrl, newLinkTitle, lang]);

  const handleSaveLink = useCallback(() => {
    if (!newLinkTitle || !newLinkUrl) return;

    let formattedUrl = newLinkUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const linkData: LinkItem = {
      id: editingLinkId || Math.random().toString(36).substr(2, 9),
      title: newLinkTitle,
      url: formattedUrl,
      description: newLinkDesc || 'Custom Bookmark',
    };

    setCategories(prev => {
      const newCategories = [...prev];

      if (editingLinkId && originalCategoryId) {
        // Remove from original category
        const originalCat = newCategories.find(c => c.id === originalCategoryId);
        if (originalCat) {
          originalCat.links = originalCat.links.filter(l => l.id !== editingLinkId);
        }
      }

      // Add to target category
      const targetCat = newCategories.find(c => c.type === newLinkCategory);
      if (targetCat) {
        targetCat.links = [...targetCat.links, linkData];
      }

      return newCategories;
    });

    setShowAddModal(false);
  }, [newLinkTitle, newLinkUrl, newLinkDesc, newLinkCategory, editingLinkId, originalCategoryId]);

  // Category Management Functions
  const handleEditCategory = useCallback((categoryId: string) => {
    setEditingCategoryId(categoryId);
    setShowCategoryModal(true);
  }, []);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const linkCount = category.links.length;
    const confirmMessage = linkCount > 0
      ? (lang === 'cn'
        ? `此分类下有 ${linkCount} 个链接，删除分类将同时删除所有链接。确定要删除吗？`
        : `This category has ${linkCount} links. Deleting it will also delete all links. Are you sure?`)
      : (lang === 'cn' ? '确定要删除此分类吗？' : 'Are you sure you want to delete this category?');

    if (window.confirm(confirmMessage)) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showNotification(
        lang === 'cn' ? '分类已删除' : 'Category deleted',
        'success'
      );
    }
  }, [categories, lang, showNotification]);

  const handleSaveCategory = useCallback((name: string, type: CategoryType) => {
    if (editingCategoryId) {
      // Edit existing category
      setCategories(prev => prev.map(cat =>
        cat.id === editingCategoryId
          ? { ...cat, customName: name, type }
          : cat
      ));
      showNotification(
        lang === 'cn' ? '分类已更新' : 'Category updated',
        'success'
      );
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        customName: name,
        links: []
      };
      setCategories(prev => [...prev, newCategory]);
      showNotification(
        lang === 'cn' ? '分类已添加' : 'Category added',
        'success'
      );
    }
    setEditingCategoryId(null);
    setShowCategoryModal(false);
  }, [editingCategoryId, lang, showNotification]);

  const handleAddCategory = useCallback(() => {
    setEditingCategoryId(null);
    setShowCategoryModal(true);
  }, []);

  const handleImportBookmarks = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileSelect(file);
    e.target.value = '';
  }, [handleFileSelect]);

  const processAIImportHandler = useCallback(async () => {
    setShowImportConfirmModal(false);
    const results = await processAIImport(pendingImportLinks, lang);

    setCategories(prev => {
      const newCategories = [...prev];
      results.forEach(item => {
        const catIndex = newCategories.findIndex(c => c.type === item.category);
        if (catIndex > -1) {
          newCategories[catIndex] = {
            ...newCategories[catIndex],
            links: [...newCategories[catIndex].links, item.link]
          };
        }
      });
      return newCategories;
    });

    showNotification(
      lang === 'cn' ? `成功导入并智能分类了 ${results.length} 个书签！` : `Successfully imported and categorized ${results.length} bookmarks!`,
      'success'
    );
  }, [pendingImportLinks, lang, processAIImport, setShowImportConfirmModal, showNotification]);

  const finishBulkImport = useCallback(() => {
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
        }
      });
      return newCategories;
    });

    setShowManualImportModal(false);
    showNotification(
      lang === 'cn' ? `成功导入了 ${selectedCandidates.length} 个书签！` : `Successfully imported ${selectedCandidates.length} bookmarks!`,
      'success'
    );
  }, [manualImportCandidates, lang, setShowManualImportModal, showNotification]);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  }, []);

  const toggleAiSearch = useCallback(() => {
    setIsAiSearch(prev => !prev);
    if (isAiSearch) {
      setAiRecommendations('');
    }
  }, [isAiSearch]);

  // Filtered categories
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

      <Toast {...notification} />

      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        categories={categories}
        recentLinks={searchHistory}
        onAddToRecent={addToHistory}
        onRemoveFromRecent={removeFromHistory}
        lang={lang}
        isAiSearch={isAiSearch}
        aiRecommendations={aiRecommendations}
        isAiSearching={isAiSearching}
      />

      <ImportProgressOverlay {...importProgress} lang={lang} />

      <ImportConfirmModal
        isOpen={showImportConfirmModal}
        bookmarkCount={pendingImportLinks.length}
        lang={lang}
        onClose={() => setShowImportConfirmModal(false)}
        onAIImport={processAIImportHandler}
        onManualImport={startManualImport}
      />

      <ManualImportModal
        isOpen={showManualImportModal}
        candidates={manualImportCandidates}
        lang={lang}
        onClose={() => setShowManualImportModal(false)}
        onToggleCandidate={toggleCandidate}
        onUpdateCategory={updateCandidateCategory}
        onToggleAll={toggleAllCandidates}
        onImport={finishBulkImport}
      />

      <HelpModal
        isOpen={showHelpModal}
        lang={lang}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Add Link Modal - TODO: Extract to component */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">
              {editingLinkId ? (lang === 'cn' ? '编辑链接' : 'Edit Link') : (lang === 'cn' ? '添加链接' : 'Add Link')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? 'URL' : 'URL'}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    placeholder="https://example.com"
                  />
                  <button
                    onClick={handleAutoFill}
                    disabled={!newLinkUrl || isAutoFilling}
                    className="px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title={lang === 'cn' ? 'AI 自动填充' : 'AI Auto-fill'}
                  >
                    {isAutoFilling ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '标题' : 'Title'}</label>
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  placeholder={lang === 'cn' ? '输入标题' : 'Enter title'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '描述' : 'Description'}</label>
                <textarea
                  value={newLinkDesc}
                  onChange={(e) => setNewLinkDesc(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                  rows={3}
                  placeholder={lang === 'cn' ? '输入描述' : 'Enter description'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">{lang === 'cn' ? '分类' : 'Category'}</label>
                <select
                  value={newLinkCategory}
                  onChange={(e) => setNewLinkCategory(e.target.value as CategoryType)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
                >
                  {Object.values(CategoryType).map(type => (
                    <option key={type} value={type}>{CATEGORY_NAMES[lang][type]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {lang === 'cn' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveLink}
                disabled={!newLinkTitle || !newLinkUrl}
                className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lang === 'cn' ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lang={lang}
        toggleLang={toggleLang}
        editMode={editMode}
        setEditMode={setEditMode}
        isAiSearch={isAiSearch}
        toggleAiSearch={toggleAiSearch}
        onSearchClick={() => setShowSearchOverlay(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          categories={categories}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          editMode={editMode}
          onAddCategory={handleAddCategory}
          lang={lang}
        />

        <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-52'}`}>
          {isAiSearch && searchQuery ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  {lang === 'cn' ? 'AI 推荐' : 'AI Recommendations'}
                </h2>
                {isAiSearching ? (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Loader2 className="animate-spin" size={20} />
                    {lang === 'cn' ? '正在分析...' : 'Analyzing...'}
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{aiRecommendations || (lang === 'cn' ? '输入搜索词以获取 AI 推荐' : 'Enter a search term to get AI recommendations')}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map(category => (
                <CategorySection
                  key={category.id}
                  category={category}
                  onEdit={openEditModal}
                  onDelete={handleDeleteLink}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                  editMode={editMode}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="fixed bottom-16 right-6 flex flex-col gap-4 z-50">
        {editMode && (
          <div className="flex flex-col gap-2 items-center">
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

        {editMode && (
          <button
            onClick={openAddModal}
            className="w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition-transform hover:scale-105"
            title={lang === 'cn' ? "添加链接" : "Add Link"}
          >
            <Plus size={24} />
          </button>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg shadow-black/50 flex items-center justify-center transition-transform hover:scale-105 border border-gray-700"
          title={lang === 'cn' ? "AI 助手" : "AI Assistant"}
        >
          <Bot size={24} />
        </button>
      </div>

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        lang={lang}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategoryId(null);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategoryId ? (() => {
          const cat = categories.find(c => c.id === editingCategoryId);
          return cat ? { name: cat.customName || CATEGORY_NAMES[lang][cat.type], type: cat.type } : undefined;
        })() : undefined}
        lang={lang}
      />
      <GeminiChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={lang}
        categories={categories}
      />
    </div>
  );
}

export default App;