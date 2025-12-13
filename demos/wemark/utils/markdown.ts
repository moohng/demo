import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export const md = new MarkdownIt({
  html: true,       // Enable HTML tags in source
  linkify: true,    // Autoconvert URL-like text to links
  typographer: true,// Enable some language-neutral replacement + quotes beautification
  highlight: function (str, lang) {
    if (!lang) {
      lang = "bash";
    }

    let highlighted = '';
    if (hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
      } catch (__) {}
    }

    if (!highlighted) {
      highlighted = md.utils.escapeHtml(str);
    }

    // Replace spaces with \u00A0 in text content to preserve indentation
    const fixed = highlighted.split(/(<[^>]*>)/).map((part, index) => {
      // Even indices are text content
      return index % 2 === 0 ? part.replace(/ /g, '\u00A0') : part;
    }).join('');

    return `<pre class="custom hljs"><code>${fixed}</code></pre>`;
  }
});

md.use(replaceLiPlugin);

// 替换 li 标签，增加 section 包裹
function replaceLiPlugin(md: MarkdownIt) {
  md.renderer.rules.list_item_open = function (tokens, idx, options, env, self) {
    return `${self.renderToken(tokens, idx, options)}<section>`;
  };
  md.renderer.rules.list_item_close = function (tokens, idx, options, env, self) {
    return `</section>${self.renderToken(tokens, idx, options)}`;
  };
}
