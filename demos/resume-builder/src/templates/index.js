const html = `<div class='resume-template'>{{ content }}</div>`

export async function getTemplates() {
  const defaultStyles = await import('./default.css?raw').then(res => res.default)
  const modernStyles = await import('./modern.css?raw').then(res => res.default)
  return {
    default: {
      html,
      css: defaultStyles,
    },
    modern: {
      html,
      css: modernStyles,
    },
  }
}
