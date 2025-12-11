import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Theme, ViewMode } from '../types';

interface PreviewProps {
  content: string;
  theme: Theme;
  viewMode: ViewMode;
  customCSS?: string; // This now contains BASE_CSS + Theme CSS
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

// Custom component to render Code Blocks with Mac-style window using Pure CSS classes
const PreBlock = ({ children, ...props }: any) => {
  return (
    <div className="mac-window">
      <div className="mac-header">
        <div className="mac-dots">
          <div className="mac-dot red"></div>
          <div className="mac-dot yellow"></div>
          <div className="mac-dot green"></div>
        </div>
      </div>
      <pre {...props}>
        {children}
      </pre>
    </div>
  );
};

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content, theme, viewMode, customCSS, onScroll }, ref) => {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  // Initialize Shadow DOM for strict style isolation
  useEffect(() => {
    if (shadowHostRef.current) {
      const existingRoot = shadowHostRef.current.shadowRoot;
      if (existingRoot) {
        setShadowRoot(existingRoot);
      } else {
        const root = shadowHostRef.current.attachShadow({ mode: 'open' });
        setShadowRoot(root);
      }
    }
  }, []);

  // Trigger Prism Autoloader whenever content changes
  useEffect(() => {
    if (shadowRoot && (window as any).Prism) {
      // Use setTimeout to allow React to render the new DOM inside Shadow Root
      setTimeout(() => {
        const container = shadowRoot.querySelector('.markdown-body');
        if (container) {
          (window as any).Prism.highlightAllUnder(container);
        }
      }, 10);
    }
  }, [content, theme, shadowRoot]);

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center relative overflow-hidden">
      {/* Viewport Container */}
      <div
        className={`
          relative flex-1 w-full transition-all duration-300 ease-in-out my-4 overflow-hidden flex flex-col
          ${viewMode === 'mobile' ? 'max-w-[375px] shadow-2xl rounded-[30px] border-8 border-gray-800 bg-white' : 'max-w-4xl shadow-sm bg-white border border-gray-200'}
        `}
      >
        {/* Mobile Header Simulation */}
        {viewMode === 'mobile' && (
          <div className="h-7 bg-gray-800 w-full flex items-center justify-center absolute top-0 z-10 rounded-t-[20px] shrink-0">
            <div className="w-16 h-4 bg-black rounded-b-xl"></div>
          </div>
        )}

        {/* Scrollable Content Area (Light DOM) - Handles scroll events */}
        <div
          ref={ref}
          onScroll={onScroll}
          className={`
            flex-1 w-full overflow-y-auto bg-white
            ${viewMode === 'mobile' ? 'pt-10 px-5 pb-8' : 'p-10'}
          `}
        >
          {/* Shadow Host - Isolates Markdown CSS from Tailwind */}
          <div ref={shadowHostRef} data-shadow-host="true" style={{ display: 'block' }}>
            {shadowRoot && createPortal(
              <>
                {/* Re-inject Prism CSS into Shadow DOM so it applies to the code blocks */}
                <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-vs.min.css" rel="stylesheet" />

                {/* Inject Combined Active Theme CSS (Base + Theme) */}
                <style>
                  {customCSS}
                </style>

                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      pre: PreBlock
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </>,
              shadowRoot
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;