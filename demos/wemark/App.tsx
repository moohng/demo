import React, { useState, useCallback, useEffect, useRef, UIEventHandler, useMemo } from 'react';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import CssEditorModal from './components/CssEditorModal';
import { INITIAL_CONTENT, DEFAULT_THEMES, BASE_CSS } from './constants';
import { Theme, ViewMode } from './types';
import { copyToWeChat } from './utils/clipboard';


const App: React.FC = () => {
  // --- State ---
  const [content, setContent] = useState<string>(INITIAL_CONTENT);
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES);
  const [activeThemeId, setActiveThemeId] = useState<string>(DEFAULT_THEMES[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('mobile');
  const [isReady, setIsReady] = useState(false);

  // UI State
  const [isCopied, setIsCopied] = useState(false);
  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);

  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  // Clear preview when modal closes
  useEffect(() => {
    if (!isCssModalOpen) {
      setPreviewTheme(null);
    }
  }, [isCssModalOpen]);

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
    setIsReady(true);
  }, []);

  // Save content
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('wemark-content', content);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [content]);

  useEffect(() => {
    setThemes(DEFAULT_THEMES);
  }, [DEFAULT_THEMES]);

  // Save themes
  useEffect(() => {
    localStorage.setItem('wemark-themes', JSON.stringify(themes));
  }, [themes]);

  // Sync editing theme with active theme if modal is open (and not creating new)
  useEffect(() => {
    if (isCssModalOpen && editingThemeId !== null && editingThemeId !== activeThemeId) {
      setEditingThemeId(activeThemeId);
    }
  }, [activeThemeId, isCssModalOpen, editingThemeId]);

  // --- Computed ---
  const activeTheme = useMemo(() => themes.find(t => t.id === activeThemeId) || themes[0], [themes, activeThemeId]);

  // --- Handlers ---

  const handleCopy = useCallback(async () => {
    if (!previewRef.current) return;

    // Attempt to find content in Shadow DOM first (for isolation mode)
    let markdownBody: Element | null | undefined;
    let fullCss = '';

    const shadowHost = previewRef.current.querySelector('[data-shadow-host]');
    if (shadowHost && shadowHost.shadowRoot) {
      markdownBody = shadowHost.shadowRoot.querySelector('#wemark');
      const styleElement = shadowHost.shadowRoot.querySelector('#wemark-theme');
      if (styleElement) {
        fullCss = styleElement.textContent || '';
      }
    }

    if (!markdownBody) {
      markdownBody = previewRef.current.querySelector('#wemark');
    }

    if (!markdownBody) return;

    const htmlContent = markdownBody.innerHTML;

    // Inject the Theme CSS
    const success = await copyToWeChat(htmlContent, fullCss || activeTheme.css);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [activeTheme]);

  // Theme Management

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
      // Force a new object reference to ensure updates trigger re-renders
      handleSaveTheme({ ...defaultTheme });
      // Clear any active preview so the UI reflects the reset theme
      setPreviewTheme(null);
    }
  };


  // Synchronized Scrolling Logic
  const syncScroll = (source: 'editor' | 'preview') => {
    if (isScrollingRef.current && isScrollingRef.current !== source) return;

    isScrollingRef.current = source;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const editorRef = editorWrapperRef.current as any;
    const editor = editorRef?.view?.scrollDOM;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    // Account for the 50vh padding added to the editor
    // const padding = window.innerHeight * 0.3;

    if (source === 'editor') {
      const effectiveScrollRange = editor.scrollHeight - editor.clientHeight;
      const percentage = effectiveScrollRange > 0 ? editor.scrollTop / effectiveScrollRange : 0;

      if (!isNaN(percentage)) {
        preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
      }
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      if (!isNaN(percentage)) {
        const effectiveScrollRange = editor.scrollHeight - editor.clientHeight;
        if (effectiveScrollRange > 0) {
          editor.scrollTop = percentage * effectiveScrollRange;
        }
      }
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = null;
    }, 100);
  };

  // Custom hook to attach scroll listener to CodeMirror's scroller
  // Because CodeMirror handles its own scrolling
  const handleEditorScroll = useCallback<UIEventHandler<HTMLDivElement>>((event) => {
    // This is a DOM event from the scrollable element
    syncScroll('editor');
  }, []);

  console.log('================');

  /* eslint-disable react-hooks/exhaustive-deps */
  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    EditorView.domEventHandlers({ scroll: () => syncScroll('editor') }),
    EditorView.theme({
      '.cm-content': { paddingBottom: '30vh' },
      '&.cm-editor': { height: '100%' }
    })
  ], []);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Toolbar */}
      <Toolbar
        themes={themes}
        currentThemeId={activeThemeId}
        onThemeChange={setActiveThemeId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCopy={handleCopy}
        isCopied={isCopied}
        onEditTheme={handleEditTheme}
        isEditorOpen={isCssModalOpen}
        onCloseEditor={() => setIsCssModalOpen(false)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex min-w-0 relative">
          {/* Editor */}
          <div className="w-1/2 h-full border-r border-gray-200 flex flex-col bg-white relative group">
            <div className="flex-1 overflow-hidden">
              <CodeMirror
                ref={editorWrapperRef as any}
                height="100%"
                className="relative h-full text-[16px]"
                value={content}
                onChange={setContent}
                extensions={extensions}
                theme={vscodeLight}
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  highlightActiveLine: false,
                  drawSelection: true,
                }}
              />
            </div>

            <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-2 text-xs text-gray-500 flex justify-between select-none shrink-0 z-10">
              <span className="font-medium text-gray-400">Markdown</span>
              <div className="flex space-x-4 font-mono">
                <span>{content.split('\n').length} 行</span>
                <span>{(content.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g) || []).length} 字</span>
                <span>{content.length} 字符</span>
              </div>
            </div>
          </div>

          {/* Preview Pane */}
          <div className="w-1/2 h-full relative">
            <Preview
              ref={previewRef}
              onScroll={() => syncScroll('preview')}
              content={content}
              theme={previewTheme || activeTheme}
              viewMode={viewMode}
              baseCSS={BASE_CSS}
            />
          </div>
        </div>
        {/* CSS Editor Drawer (Inline) */}
        <CssEditorModal
          isOpen={isCssModalOpen}
          onClose={() => setIsCssModalOpen(false)}
          theme={themes.find(t => t.id === editingThemeId) || null}
          onSave={handleSaveTheme}
          onDelete={handleDeleteTheme}
          onReset={handleResetTheme}
          onPreview={setPreviewTheme}
        />
      </div>
    </div>
  );
};

export default App;