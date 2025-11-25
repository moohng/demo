import { LinkItem } from '../types';

export const parseBookmarks = (htmlContent: string): LinkItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const links: LinkItem[] = [];
  
  const anchors = doc.getElementsByTagName('a');
  
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    const url = anchor.getAttribute('href');
    const title = anchor.textContent || 'Untitled';
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      links.push({
        id: Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        url: url,
        description: 'Imported from browser bookmarks'
      });
    }
  }
  
  return links;
};
