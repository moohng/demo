import { BASE_CSS } from '../constants';
import juice from 'juice';

/**
 * Copies the HTML content to clipboard using `juice` for robust CSS inlining.
 * This ensures that all styles (Theme + Prism Syntax Highlighting) are correctly 
 * applied to the HTML elements as inline styles, which is required for WeChat.
 */
export async function copyToWeChat(htmlContent: string, themeCss: string): Promise<boolean> {
  try {
    // 2. Combine CSS
    // Order matters: Prism CSS first, then Theme CSS (to allow overrides if needed)
    const fullCss = `${BASE_CSS}\n${themeCss}`;

    // 3. Wrap HTML
    // We wrap the content in .markdown-body because our BASE_CSS uses selectors like 
    // `.markdown-body h1`. Without this wrapper, juice won't match those selectors.
    const wrappedHtml = `<section class="markdown-body">${htmlContent}</section>`;

    // 4. Inline Styles with Juice
    // juice.inlineContent takes the HTML string and CSS string, and returns HTML with inline styles.
    const inlinedHtml = juice.inlineContent(wrappedHtml, fullCss, {
      inlinePseudoElements: false, // WeChat doesn't support pseudo-elements in inline styles
      removeStyleTags: true,       // Don't leave the <style> block in the body
      preserveImportant: true,     // Keep !important flags
      resolveCSSVariables: true,
      webResources: {
        images: false,             // Don't try to fetch remote images
        scripts: false,
        links: false
      }
    });

    console.log(inlinedHtml);

    // For plain text, we strip tags. A regex is sufficient for this simple use case.
    const textContent = inlinedHtml.replace(/<[^>]+>/g, '');

    // 6. Write to Clipboard
    await navigator.clipboard.write([
      new ClipboardItem({ 
        'text/html': inlinedHtml,
        'text/plain': textContent
      })
    ]);
    
    return true;

  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}