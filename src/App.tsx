import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Loader2, Upload, Plus } from 'lucide-react';

// Components
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { Toast } from './components/Toast';
import { SearchOverlay } from './components/SearchOverlay';
import { ImportConfirmModal } from './components/modals/ImportConfirmModal';
import { ManualImportModal } from './components/modals/ManualImportModal';
import { HelpModal } from './components/modals/HelpModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { ConfirmModal } from './components/modals/ConfirmModal';
import { AISettingsModal } from './components/modals/AISettingsModal';
import { ImportProgressOverlay } from './components/overlays/ImportProgressOverlay';
import { AuthModal } from './components/modals/AuthModal';
import { AddLinkModal } from './components/modals/AddLinkModal';

// Types & Config
import { Category, CategoryType, LinkItem } from './types';
import { recommendTools } from './services/geminiService';

// Hooks
import { useNotification } from './hooks/useNotification';
import { useImport } from './hooks/useImport';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCategories } from './hooks/useCategories';
import { useAppState } from './hooks/useAppState';
import { useLinkModal } from './hooks/useLinkModal';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  // 1. Hooks Initialization
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addLink, 
    deleteLink 
  } = useCategories();

  const { lang, toggleLang } = useLanguage();

  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isAiSearch,
    toggleAiSearch,
    editMode,
    toggleEditMode
  } = useAppState();

  const { notification, showNotification } = useNotification();
  const { history: searchHistory, addToHistory, removeFromHistory } = useSearchHistory();
  
  // Import Logic
  const {
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

  // Local UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  
  // Confirm Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Category Edit State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isQuickAddCategory, setIsQuickAddCategory] = useState(false);

  // AI Search State
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  // Link Modal Hook
  const {
    isOpen: showAddModal,
    setIsOpen: setShowAddModal,
    editingLinkId,
    originalCategoryId,
    linkUrl,
    setLinkUrl,
    linkTitle,
    setLinkTitle,
    linkDesc,
    setLinkDesc,
    linkCategory,
    setLinkCategory,
    isAutoFilling,
    handleAutoFill,
    openAddModal,
    openEditModal
  } = useLinkModal({ 
    categories, 
    lang, 
    showNotification,
    onSaveCategory: addCategory
  });

  // 2. Effects
  
  // Resize Handler
  useEffect(() => {
    const handleResize = () => setIsSidebarCollapsed(window.innerWidth < 1280);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarCollapsed]);

  // Keyboard Shortcuts
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

  // Expose Settings
  useEffect(() => {
    (window as any).openAISettings = () => setShowAISettings(true);
    return () => { delete (window as any).openAISettings; };
  }, []);

  // AI Search Debounce
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

  // Edit Mode Side Effects
  useEffect(() => {
    if (editMode) {
      setIsSidebarCollapsed(false);
    }
  }, [editMode, setIsSidebarCollapsed]);


  // 3. Handlers

  // Link Saving
  const handleSaveLink = useCallback(async () => {
    if (!linkTitle || !linkUrl) return;

    let formattedUrl = linkUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Check duplicate
    const duplicateLink = categories.flatMap(c => c.links).find(
      l => l.url.toLowerCase() === formattedUrl.toLowerCase() && l.id !== editingLinkId
    );

    const saveAction = async () => {
      const linkData: LinkItem = {
        id: editingLinkId || crypto.randomUUID(),
        title: linkTitle,
        url: formattedUrl,
        description: linkDesc || 'Custom Bookmark',
      };

      // 1. Remove duplicate if exists
      if (duplicateLink) {
        const dupCat = categories.find(c => c.links.some(l => l.id === duplicateLink.id));
        if (dupCat) await deleteLink(dupCat.id, duplicateLink.id);
      }

      // 2. Remove from old category if moving
      if (editingLinkId && originalCategoryId) {
         const oldCat = categories.find(c => c.id === originalCategoryId);
         const targetCat = categories.find(c => c.type === linkCategory);
         if (oldCat && targetCat && oldCat.id !== targetCat.id) {
             await deleteLink(originalCategoryId, editingLinkId);
         }
      }

      // 3. Add/Update in target
      const targetCat  = categories.find(c => c.type === linkCategory);
      if (targetCat) {
        await addLink(targetCat.id, linkData);
      }
      
      setShowAddModal(false);
      showNotification(lang === 'cn' ? '保存成功' : 'Saved successfully', 'success');
    };

    if (duplicateLink) {
      setConfirmModalData({
        title: lang === 'cn' ? 'URL 已存在' : 'URL Already Exists',
        message: lang === 'cn'
          ? `URL "${formattedUrl}" 已存在于书签中（${duplicateLink.title}）。确认保存将覆盖现有链接。`
          : `URL "${formattedUrl}" already exists. Overwrite?`,
        onConfirm: saveAction
      });
      setShowConfirmModal(true);
    } else {
      await saveAction();
    }
  }, [linkTitle, linkUrl, linkDesc, linkCategory, editingLinkId, originalCategoryId, categories, lang, deleteLink, addLink, showNotification, setShowAddModal]);


  // Category Management
  const handleSaveCategory = useCallback(async (name: string, type: CategoryType) => {
    if (editingCategoryId) {
      const cat = categories.find(c => c.id === editingCategoryId);
      if (cat) {
        await updateCategory({ ...cat, customName: name, type });
        showNotification(lang === 'cn' ? '分类已更新' : 'Category updated', 'success');
      }
    } else {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        type,
        customName: name,
        links: []
      };
      await addCategory(newCategory);
      if (isQuickAddCategory) {
        setLinkCategory(type);
        setIsQuickAddCategory(false);
      }
      showNotification(lang === 'cn' ? '分类已添加' : 'Category added', 'success');
    }
    setEditingCategoryId(null);
    setShowCategoryModal(false);
  }, [editingCategoryId, categories, updateCategory, addCategory, isQuickAddCategory, setLinkCategory, showNotification, lang]);

  const handleDeleteCategoryHandler = useCallback(async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    if (window.confirm(lang === 'cn' ? '确定删除吗？' : 'Are you sure?')) {
      await deleteCategory(categoryId);
      showNotification(lang === 'cn' ? '分类已删除' : 'Category deleted', 'success');
    }
  }, [categories, lang, deleteCategory, showNotification]);

  const handleLinkVisit = useCallback((linkId: string) => {
    const category = categories.find(c => c.links.some(l => l.id === linkId));
    if (category) {
      const link = category.links.find(l => l.id === linkId);
      if (link) {
        addLink(category.id, {
           ...link, 
           visitCount: (link.visitCount || 0) + 1, 
           lastVisited: Date.now() 
        });
      }
    }
  }, [categories, addLink]);

  const handleImportBookmarks = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
      e.target.value = '';
    }
  }, [handleFileSelect]);

  const processAIImportHandler = useCallback(async () => {
    setShowImportConfirmModal(false);
    const results = await processAIImport(pendingImportLinks, lang);
    for (const item of results) {
       const cat = categories.find(c => c.type === item.category);
       if (cat) await addLink(cat.id, item.link);
    }
    showNotification(lang === 'cn' ? '导入成功' : 'Import success', 'success');
  }, [pendingImportLinks, lang, processAIImport, categories, addLink, showNotification, setShowImportConfirmModal]);

  const finishBulkImport = useCallback(async () => {
    const selected = manualImportCandidates.filter(c => c.selected);
    for (const item of selected) {
       const cat = categories.find(c => c.type === item.category);
       if (cat) {
         await addLink(cat.id, { ...item.link, description: item.link.description || 'Imported' });
       }
    }
    setShowManualImportModal(false);
    showNotification(lang === 'cn' ? '导入成功' : 'Import success', 'success');
  }, [manualImportCandidates, categories, addLink, setShowManualImportModal, showNotification, lang]);


  // 4. Render
  
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
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      <div className="relative z-10">
        <Toast {...notification} />
        
        {/* Modals & Overlays */}
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

        <HelpModal isOpen={showHelpModal} lang={lang} onClose={() => setShowHelpModal(false)} />
        
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} lang={lang} />
        
        <AISettingsModal isOpen={showAISettings} onClose={() => setShowAISettings(false)} lang={lang} />

        <CategoryModal
           isOpen={showCategoryModal}
           onClose={() => setShowCategoryModal(false)}
           onSave={handleSaveCategory}
           editingCategory={categories.find(c => c.id === editingCategoryId)}
           lang={lang}
        />

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
             confirmModalData?.onConfirm();
             setShowConfirmModal(false);
          }}
          title={confirmModalData?.title || ''}
          message={confirmModalData?.message || ''}
          lang={lang}
        />

        <AddLinkModal
           isOpen={showAddModal}
           onClose={() => setShowAddModal(false)}
           lang={lang}
           categories={categories}
           linkUrl={linkUrl}
           setLinkUrl={setLinkUrl}
           linkTitle={linkTitle}
           setLinkTitle={setLinkTitle}
           linkDesc={linkDesc}
           setLinkDesc={setLinkDesc}
           linkCategory={linkCategory}
           setLinkCategory={setLinkCategory}
           onAutoFill={handleAutoFill}
           isAutoFilling={isAutoFilling}
           onSave={handleSaveLink}
           onQuickAddCategory={() => {
              setEditingCategoryId(null);
              setIsQuickAddCategory(true);
              setShowCategoryModal(true);
           }}
           isEditing={!!editingLinkId}
        />

        {/* Layout */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          editMode={editMode}
          setEditMode={toggleEditMode}
          isAiSearch={isAiSearch}
          toggleAiSearch={toggleAiSearch}
          onSearchClick={() => setShowSearchOverlay(true)}
          onLoginClick={() => setShowAuthModal(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            categories={categories}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            editMode={editMode}
            onAddCategory={() => {
                setEditingCategoryId(null);
                setIsQuickAddCategory(false);
                setShowCategoryModal(true);
            }}
          />

          <main className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-52'}`}>
             {isAiSearch && searchQuery ? (
               <div className="max-w-4xl mx-auto mb-6">
                 <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
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
                      <p className="text-gray-300 whitespace-pre-wrap">{aiRecommendations}</p>
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
                        onDelete={(catId, linkId) => deleteLink(catId, linkId)}
                        onEditCategory={(id) => {
                            setEditingCategoryId(id);
                            setShowCategoryModal(true);
                        }}
                        onDeleteCategory={handleDeleteCategoryHandler}
                        onVisit={handleLinkVisit}
                       editMode={editMode}
                     />
                   ))}
                </div>
             )}
             


             <Footer lang={lang} />
          </main>
        </div>

        {/* Floating Action Buttons (Only in Edit Mode) */}
        {editMode && (
          <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
            {/* Import Button */}
            <>
              <input
                type="file"
                accept=".html"
                onChange={handleImportBookmarks}
                className="hidden"
                id="fab-import-file"
              />
              <label
                htmlFor="fab-import-file"
                className="p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-xl cursor-pointer hover:scale-110 transition-all flex items-center justify-center border border-gray-700"
                title={lang === 'cn' ? '导入书签' : 'Import Bookmarks'}
              >
                <Upload size={24} />
              </label>
            </>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="p-4 bg-primary hover:scale-110 text-white rounded-full shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center border border-white/20"
              title={lang === 'cn' ? '添加链接' : 'Add Link'}
            >
              <Plus size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;