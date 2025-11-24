import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Plus, Github } from 'lucide-react';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import GeminiChat from './components/GeminiChat';
import Sidebar from './components/Sidebar';
import { Category, CategoryType, LinkItem, Language } from './types';
import { INITIAL_DATA, TRANSLATIONS, CATEGORY_NAMES } from './constants';

function App() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lang, setLang] = useState<Language>('cn'); // Default to Chinese

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

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'cn' : 'en');
  };

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const lowerQuery = searchQuery.toLowerCase();

    return categories.map(cat => ({
      ...cat,
      links: cat.links.filter(link =>
        link.title.toLowerCase().includes(lowerQuery) ||
        link.description.toLowerCase().includes(lowerQuery) ||
        link.url.toLowerCase().includes(lowerQuery)
      )
    })).filter(cat => cat.links.length > 0);
  }, [categories, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 selection:bg-primary/30 selection:text-white flex flex-col">

      {/* Header Section (Hero) */}
      <Header
        onSearch={setSearchQuery}
        editMode={editMode}
        toggleEditMode={() => setEditMode(!editMode)}
        lang={lang}
        toggleLang={toggleLang}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl w-full mx-auto px-6 flex items-start gap-8 relative flex-1">

        {/* Sidebar Navigation (Sticky) */}
        <Sidebar
          categories={filteredCategories.length > 0 ? filteredCategories : categories}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          lang={lang}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-20">
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
      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lang={lang} />

      {/* Add/Edit Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingLinkId ? t.editShortcut : t.addShortcut}
            </h2>

            <div className="space-y-4">
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
                <label className="block text-xs font-medium text-gray-400 mb-1">{t.url}</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-primary focus:outline-none"
                  placeholder="https://..."
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
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