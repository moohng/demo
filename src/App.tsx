import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Loader2, Upload, Plus } from 'lucide-react';

// Components
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { SearchOverlay } from './components/SearchOverlay';
import { ImportConfirmModal } from './components/modals/ImportConfirmModal';
import { ManualImportModal } from './components/modals/ManualImportModal';
import { HelpModal } from './components/modals/HelpModal';
import { CategoryModal } from './components/modals/CategoryModal';
import { AISettingsModal } from './components/modals/AISettingsModal';
import { ImportProgressOverlay } from './components/overlays/ImportProgressOverlay';
import { AuthModal } from './components/modals/AuthModal';
import { AddLinkModal } from './components/modals/AddLinkModal';

// Types & Config
import { Category, CategoryType, LinkItem } from './types';

// Hooks
import { useImport } from './hooks/useImport';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useCategories } from './hooks/useCategories';
import { useAppState } from './hooks/useAppState';
import { useLinkModal } from './hooks/useLinkModal';
import { useNotification } from './contexts/NotificationContext';
import { useConfirm } from './contexts/ConfirmContext';
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

  const { lang } = useLanguage();
  const { showNotification } = useNotification();
  const { showConfirm } = useConfirm();

  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    editMode,
    toggleEditMode
  } = useAppState();

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);

  // Category Edit State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isQuickAddCategory, setIsQuickAddCategory] = useState(false);

  // Quick Add State
  const [quickAddUrl, setQuickAddUrl] = useState<string | undefined>(undefined);

  // Link Modal Hook
  const {
    isOpen: showAddModal,
    setIsOpen: setShowAddModal,
    editingLinkId,
    originalCategoryId,
    openAddModal,
    openEditModal
  } = useLinkModal({
    categories,
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
      // 1. Meta/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchOverlay(true);
        return;
      }

      // 2. Space (Only when not typing)
      if (e.code === 'Space' || e.key === ' ') {
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        if (!isInput) {
          e.preventDefault();
          setShowSearchOverlay(true);
        }
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

  // Edit Mode Side Effects
  useEffect(() => {
    if (editMode) {
      setIsSidebarCollapsed(false);
    }
  }, [editMode, setIsSidebarCollapsed]);


  // 3. Handlers
  const handleQuickAdd = useCallback((url: string) => {
    setQuickAddUrl(url);
    setShowAddModal(true);
  }, []);

  // Link Saving



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
  }, [editingCategoryId, categories, updateCategory, addCategory, isQuickAddCategory, showNotification, lang]);

  const handleDeleteCategoryHandler = useCallback(async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    showConfirm({
      title: lang === 'cn' ? '删除分类' : 'Delete Category',
      message: lang === 'cn' ? `确定要删除分类 "${category.customName}" 吗？此操作不可撤销。` : `Are you sure you want to delete "${category.customName}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteCategory(categoryId);
        showNotification(lang === 'cn' ? '分类已删除' : 'Category deleted', 'success');
      }
    });
  }, [categories, lang, deleteCategory, showNotification, showConfirm]);

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

  return (
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Modals & Overlays */}
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => setShowSearchOverlay(false)}
          categories={categories}
          recentLinks={searchHistory}
          onAddToRecent={addToHistory}
          onRemoveFromRecent={removeFromHistory}
          onQuickAdd={handleQuickAdd}
        />

        <ImportProgressOverlay {...importProgress} />

        <ImportConfirmModal
          isOpen={showImportConfirmModal}
          bookmarkCount={pendingImportLinks.length}
          onClose={() => setShowImportConfirmModal(false)}
          onAIImport={processAIImportHandler}
          onManualImport={startManualImport}
        />

        <ManualImportModal
          isOpen={showManualImportModal}
          candidates={manualImportCandidates}
          onClose={() => setShowManualImportModal(false)}
          onToggleCandidate={toggleCandidate}
          onUpdateCategory={updateCandidateCategory}
          onToggleAll={toggleAllCandidates}
          onImport={finishBulkImport}
        />

        <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

        <AISettingsModal isOpen={showAISettings} onClose={() => setShowAISettings(false)} />

        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleSaveCategory}
          editingCategory={categories.find(c => c.id === editingCategoryId)}
        />

        <AddLinkModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setQuickAddUrl(undefined);
          }}
          categories={categories}
          initialUrl={quickAddUrl}
          // onSave={handleSaveLink}
          onQuickAddCategory={() => {
            setEditingCategoryId(null);
            setIsQuickAddCategory(true);
            setShowCategoryModal(true);
          }}
          isEditing={!!editingLinkId}
        />

        {/* Layout */}
        <Header
          editMode={editMode}
          setEditMode={toggleEditMode}
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
            <div className="space-y-12">
              {categories.map(category => (
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



            <Footer />
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