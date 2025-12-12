import React, { useState, useCallback, useEffect, useRef, UIEventHandler, useMemo } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import Toolbar from './components/Toolbar';
import Preview from './components/Preview';
import CssEditorModal from './components/CssEditorModal';
import { INITIAL_CONTENT, DEFAULT_THEMES, BASE_CSS } from './constants';
import { Theme, ViewMode } from './types';
import { copyToWeChat } from './utils/clipboard';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { createStarryNight, common } from '@wooorm/starry-night';

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

  const [starryNight, setStarryNight] = useState(null);
  useEffect(() => {
    console.log('createStarryNight');
    createStarryNight(common).then((starryNight) => {
      setStarryNight(starryNight);
    });
  }, []);


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

    const shadowHost = previewRef.current.querySelector('[data-shadow-host]');
    if (shadowHost && shadowHost.shadowRoot) {
      markdownBody = shadowHost.shadowRoot.querySelector('#wemark');
    }

    if (!markdownBody) {
      markdownBody = previewRef.current.querySelector('#wemark');
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

    const editor = editorWrapperRef.current;
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
        const cmScroller = editorWrapperRef.current;
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
  const handleEditorScroll = useCallback<UIEventHandler<HTMLDivElement>>((event) => {
    // This is a DOM event from the scrollable element
    syncScroll('editor');
  }, []);

  console.log('================');

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* ... (keep Toolbar) */}
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
        {/* Main Content Wrapper (Flexible) */}
        <div className="flex-1 flex min-w-0 relative">
          {/* ... (keep Editor Pane) */}
          <div className="w-1/2 h-full border-r border-gray-200 flex flex-col bg-white relative group">
            {/* ... (keep existing editor code) ... */}
            <div
              ref={editorWrapperRef}
              className="flex-1 overflow-auto w-full relative"
              onScroll={handleEditorScroll}
            >
              <div className="relative min-h-full">
                {starryNight && <div className="h-full whitespace-pre-wrap tracking-normal p-4 pb-[300px] text-[16px] font-sans leading-[1.8] break-words [&_*]:!font-normal">
                  {toJsxRuntime(starryNight.highlight(content, starryNight.flagToScope('markdown')), {
                    Fragment,
                    jsx,
                    jsxs,
                  })}
                  {/\n[ \t]*$/.test(content) ? <br /> : undefined}
                </div>}
                <textarea
                  spellCheck="false"
                  className="w-full h-full absolute top-0 left-0 bg-transparent text-transparent overflow-hidden border-none outline-none caret-black tracking-normal resize-none p-4 text-[16px] font-sans leading-[1.8]"
                  value={content}
                  rows={content.split('\n').length + 1}
                  onChange={function (event) {
                    setContent(event.target.value)
                  }}
                />
              </div>
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