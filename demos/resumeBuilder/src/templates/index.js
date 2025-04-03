export async function getTemplates() {
  const modules = import.meta.glob('./**/*.css', { query: '?raw', import: 'default' });
  console.log('===== getTemplates =====', modules);
  const templates = [];
  for (const key in modules) {
    if (Object.hasOwnProperty.call(modules, key)) {
      const name = key.replace('./', '').replace('.css', '');
      const cssContent = await modules[key]();
      templates.push({ 
        name, 
        html: `<div class='${name}-resume'>{{ content }}</div>`, 
        css: cssContent
      });
    }
  }
  
  return templates;
}
