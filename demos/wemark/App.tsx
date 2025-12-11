import React, { useState, useCallback, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import CssEditorModal from './components/CssEditorModal';
import { INITIAL_CONTENT, DEFAULT_THEMES, BASE_CSS } from './constants';
import { Theme, ViewMode } from './types';
import { copyToWeChat } from './utils/clipboard';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

// Access global Prism object loaded via script tag
const Prism = (window as any).Prism;

const App: React.FC = () => {
  // --- State ---
  const [content, setContent] = useState<string>(INITIAL_CONTENT);
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES);
  const [activeThemeId, setActiveThemeId] = useState<string>(DEFAULT_THEMES[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');

  // UI State
  const [isCopied, setIsCopied] = useState(false);
  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);

  // Refs
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Locks
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Persistence ---

  // Load content and themes from LS on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('wemark-content');
    if (savedContent) setContent(savedContent);

    const savedThemes = localStorage.getItem('wemark-themes');
    if (savedThemes) {
      try {
        const parsed = JSON.parse(savedThemes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThemes(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved themes', e);
      }
    }
  }, []);

  // Save content
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('wemark-content', content);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  // Save themes
  useEffect(() => {
    localStorage.setItem('wemark-themes', JSON.stringify(themes));
  }, [themes]);


  // --- Computed ---

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];

  // --- Handlers ---

  const handleCopy = useCallback(async () => {
    if (!previewRef.current) return;

    // Attempt to find content in Shadow DOM first (for isolation mode)
    let markdownBody: Element | null | undefined;

    const shadowHost = previewRef.current.querySelector('[data-shadow-host]');
    if (shadowHost && shadowHost.shadowRoot) {
      markdownBody = shadowHost.shadowRoot.querySelector('.markdown-body');
    }

    if (!markdownBody) {
      markdownBody = previewRef.current.querySelector('.markdown-body');
    }

    if (!markdownBody) return;

    const htmlContent = markdownBody.innerHTML;

    // Inject the Theme CSS
    const success = await copyToWeChat(htmlContent, activeTheme.css);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [activeTheme]);

  // Theme Management

  const handleAddTheme = () => {
    setEditingThemeId(null); // Null means creating new
    setIsCssModalOpen(true);
  };

  const handleEditTheme = (id: string) => {
    setEditingThemeId(id);
    setIsCssModalOpen(true);
  };

  const handleSaveTheme = (themeData: Theme) => {
    setThemes(prev => {
      const exists = prev.find(t => t.id === themeData.id);
      if (exists) {
        return prev.map(t => t.id === themeData.id ? themeData : t);
      } else {
        return [...prev, themeData];
      }
    });
    setActiveThemeId(themeData.id);
  };

  const handleDeleteTheme = (id: string) => {
    setThemes(prev => {
      const newThemes = prev.filter(t => t.id !== id);
      // If we deleted the active theme, switch to the first one
      if (activeThemeId === id && newThemes.length > 0) {
        setActiveThemeId(newThemes[0].id);
      }
      return newThemes;
    });
  };

  const handleResetTheme = (id: string) => {
    // Restore a system theme to its default state from DEFAULT_THEMES
    const defaultTheme = DEFAULT_THEMES.find(t => t.id === id);
    if (defaultTheme) {
      handleSaveTheme(defaultTheme);
    }
  };


  // Synchronized Scrolling Logic
  const syncScroll = (source: 'editor' | 'preview') => {
    if (isScrollingRef.current && isScrollingRef.current !== source) return;

    isScrollingRef.current = source;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // CodeMirror 6 scroll element handling might differ structure-wise
    // We target the .cm-scroller element inside the wrapper
    const editor = source === 'editor'
      ? editorWrapperRef.current?.querySelector('.cm-scroller') as HTMLElement
      : editorWrapperRef.current; // Fallback or incorrect, but we need to find the right element

    const preview = previewRef.current;

    if (!editor || !preview) return;

    if (source === 'editor') {
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      if (!isNaN(percentage)) {
        preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
      }
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      if (!isNaN(percentage)) {
        // Find the scroller to set scrollTop
        const cmScroller = editorWrapperRef.current?.querySelector('.cm-scroller');
        if (cmScroller) {
          cmScroller.scrollTop = percentage * (cmScroller.scrollHeight - cmScroller.clientHeight);
        }
      }
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 100);
  };

  // Custom hook to attach scroll listener to CodeMirror's scroller
  // Because CodeMirror handles its own scrolling
  const handleEditorScroll = useCallback((event: Event) => {
    // This is a DOM event from the scrollable element
    syncScroll('editor');
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar
        themes={themes}
        currentThemeId={activeThemeId}
        onThemeChange={setActiveThemeId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCopy={handleCopy}
        isCopied={isCopied}
        onAddTheme={handleAddTheme}
        onEditTheme={handleEditTheme}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className="w-1/2 h-full border-r border-gray-200 flex flex-col bg-white relative group">
          <div
            ref={editorWrapperRef}
            // For React Simpe Code editor, the wrapper was the scroll container. 
            // For CodeMirror, the internal .cm-scroller is the scroll container.
            // We'll attach the listener via the onCreateEditor prop or by effect if possible,
            // But CodeMirror doesn't expose onScroll directly on the component same as div.
            // Actually @uiw/react-codemirror creates a wrapper. 
            // We can let CodeMirror handle its scroll and capture it.
            // However, to simplify, we can wrap it or just use the basic setup.
            // @uiw/react-codemirror exposes `onCreateEditor`.
            className="flex-1 overflow-hidden w-full relative"
            id="editor-container"
          >
            <CodeMirror
              value={content}
              height="100%"
              // theme={githubLight}
              extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
              onChange={(val) => setContent(val)}
              // Attach scroll listener to the underlying scroller
              onCreateEditor={(view) => {
                // view.scrollDOM is the scrollable element
                view.scrollDOM.addEventListener('scroll', () => syncScroll('editor'));
              }}
              style={{ fontSize: '1.125rem', fontFamily: 'JetBrains Mono, monospace' }}
              className="h-full"
            />
          </div>

          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-2 text-xs text-gray-500 flex justify-between select-none shrink-0 z-10">
            <span className="font-medium text-gray-400">Markdown Input</span>
            <span className="font-mono">{content.length} chars</span>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="w-1/2 h-full relative">
          <Preview
            ref={previewRef}
            onScroll={() => syncScroll('preview')}
            content={content}
            theme={activeTheme}
            viewMode={viewMode}
            // Pass the FULL CSS to preview (Base + Theme)
            baseCSS={BASE_CSS}
          />
        </div>
      </div>

      {/* CSS Editor Modal */}
      <CssEditorModal
        isOpen={isCssModalOpen}
        onClose={() => setIsCssModalOpen(false)}
        // If editing, find the object; otherwise null (new)
        theme={themes.find(t => t.id === editingThemeId) || null}
        onSave={handleSaveTheme}
        onDelete={handleDeleteTheme}
        onReset={handleResetTheme}
      />
    </div>
  );
};

export default App;