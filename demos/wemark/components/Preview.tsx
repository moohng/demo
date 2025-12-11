import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Theme, ViewMode } from '../types';

interface PreviewProps {
  content: string;
  theme: Theme;
  viewMode: ViewMode;
  baseCSS?: string;
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

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content, theme, viewMode, baseCSS: customCSS, onScroll }, ref) => {
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

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center relative overflow-hidden">
      {/* Viewport Container */}
      <div
        className={`
          relative flex-1 w-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col
          ${viewMode === 'mobile'
            ? 'my-4 max-w-[390px] h-[844px] shadow-2xl rounded-[50px] border-[12px] border-[#1f2937] bg-black ring-4 ring-gray-900/20'
            : 'max-w-4xl shadow-sm bg-white border-gray-200'}
        `}
      >
        {/* Mobile Header / Dynamic Island Simulation */}
        {viewMode === 'mobile' && (
          <div className="absolute top-0 w-full h-14 z-20 flex justify-center pointer-events-none bg-white">
            {/* Dynamic Island */}
            <div className="w-[100px] h-[32px] bg-black rounded-[20px] absolute top-2.5 flex items-center justify-center space-x-2">
              <div className="w-16 h-4 bg-[#1a1a1a] rounded-full flex items-center justify-end px-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Status Bar Time/Icons Mockup */}
            <div className="w-full px-8 flex justify-between items-center text-[#1a1a1a] text-[13px] font-medium">
              <span>9:41</span>
              <div className="flex space-x-1.5 items-center">
                <div className="w-4 h-2.5 border border-[#1a1a1a]/50 rounded-[2px] relative"><div className="absolute inset-0 bg-[#1a1a1a] m-0.5"></div></div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content Area (Light DOM) - Handles scroll events */}
        <div
          ref={ref}
          onScroll={onScroll}
          className={`
            flex-1 w-full overflow-y-auto bg-white relative
            ${viewMode === 'mobile' ? 'pt-[50px] px-5 pb-8 no-scrollbar rounded-[38px]' : 'p-10'}
          `}
        >
          {/* Shadow Host - Isolates Markdown CSS from Tailwind */}
          <div ref={shadowHostRef} data-shadow-host="true" style={{ display: 'block' }}>
            {shadowRoot && createPortal(
              <>
                {/* Inject Combined Active Theme CSS (Base + Theme) */}
                <style>
                  {customCSS}
                  {theme.css}
                </style>

                <div id="wemark">
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