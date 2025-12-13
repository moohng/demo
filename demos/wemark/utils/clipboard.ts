import juice from 'juice';

/**
 * Copies the HTML content to clipboard using `juice` for robust CSS inlining.
 * This ensures that all styles (Theme + Prism Syntax Highlighting) are correctly 
 * applied to the HTML elements as inline styles, which is required for WeChat.
 */
export async function copyToWeChat(htmlContent: string, fullCss: string): Promise<boolean> {
  try {
    // 3. Wrap HTML
    const wrappedHtml = `<section id="wemark">${htmlContent}</section>`;

    // 4. Inline Styles with Juice
    let inlinedHtml = juice.inlineContent(wrappedHtml, fullCss, {
      inlinePseudoElements: true,
      preserveImportant: true,
      resolveCSSVariables: true,
      xmlMode: true,
    });

    // 过滤微信不支持的标签
    inlinedHtml = inlinedHtml
      .replace(/<a\s/g, '<span ')
      .replace(/<\/a>/g, '</span>');

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