import { Language } from '../types';
import { aiService } from './aiService';

export const getGeminiResponse = async (prompt: string, lang: Language, systemInstruction?: string): Promise<string> => {
  if (!aiService.isConfigured()) {
    // Return a special message suggesting configuration
    return lang === 'cn'
      ? "AI 尚未配置。请点击左侧边栏的 'AI 设置' 按钮配置您的 API Key。"
      : "AI is not configured. Please click the 'AI Settings' button in the sidebar to configure your API Key.";
  }

  const defaultSystemInstructions = {
    en: "You are a senior frontend engineer assistant. Answer questions concisely about React, TypeScript, CSS, HTML, and web performance. Provide code snippets where helpful. Keep answers brief and to the point.",
    cn: "你是一个高级前端工程师助手。请用中文简明扼要地回答关于 React, TypeScript, CSS, HTML 和 Web 性能的问题。在有帮助的地方提供代码片段。保持回答简短直接。"
  };

  try {
    const response = await aiService.chat(prompt, lang, systemInstruction || defaultSystemInstructions[lang]);
    return response;
  } catch (error: any) {
    console.error("Error fetching AI response:", error);

    if (error.message === 'INVALID_API_KEY') {
      return lang === 'cn' ? "API Key 无效，请检查设置。" : "Invalid API Key, please check settings.";
    }
    if (error.message === 'QUOTA_EXCEEDED') {
      return lang === 'cn' ? "API 配额已用尽。" : "API quota exceeded.";
    }

    return lang === 'cn'
      ? "抱歉，处理您的请求时出现错误。"
      : "Sorry, I encountered an error while processing your request.";
  }
};

export const analyzeLinkInfo = async (
  url: string,
  title: string,
  lang: Language,
  existingCategories: Array<{ name: string, type: string }>
): Promise<{ title?: string, url?: string, category: string, description: string, isNewCategory?: boolean, suggestedIcon?: string }> => {
  if (!aiService.isConfigured()) return { category: 'Tools', description: '' };

  const availableCategories = existingCategories.map(c => c.name);
  const availableIcons = [
    'Frameworks', 'UI Libraries', 'Tools', 'Backend & DevOps', 'Documentation',
    'Learning', 'Tutorials', 'Design', 'Icons & Fonts', 'Colors',
    'Community', 'News', 'Blogs', 'Productivity', 'Entertainment', 'Shopping', 'Finance'
  ];

  const prompt = `
    Analyze this input from a user who wants to add a bookmark:
    Input: ${url}
    ${title ? `Additional context: ${title}` : ''}

    The input might be:
    1. A complete URL (e.g., "https://gmail.com")
    2. A partial URL (e.g., "gmail.com")
    3. A keyword or service name (e.g., "谷歌邮箱", "Google Mail", "GitHub")
    4. A product or tool name (e.g., "React", "Tailwind CSS")

    Your task:
    1. Infer the COMPLETE and CORRECT URL for the service/website
    2. Provide an accurate Title
    3. Write a short Description (max 10 words)
    4. Choose a Category from available categories, or suggest a NEW category if none fit
    5. If suggesting a NEW category, also suggest an appropriate icon type

    Available categories (user's existing categories): ${availableCategories.length > 0 ? availableCategories.join(', ') : 'None yet'}
    Available icon types (for new categories): ${availableIcons.join(', ')}

    Examples:
    - Input: "谷歌邮箱" → URL: "https://mail.google.com", Title: "Gmail", Category: "Productivity"
    - Input: "github" → URL: "https://github.com", Title: "GitHub", Category: "Tools"
    - Input: "react" → URL: "https://react.dev", Title: "React", Category: "Frameworks"
    - Input: "tailwind" → URL: "https://tailwindcss.com", Title: "Tailwind CSS", Category: "UI Libraries"
    
    Return ONLY a JSON object: 
    { 
      "url": "https://...",
      "title": "...", 
      "category": "...", 
      "description": "...",
      "isNewCategory": true/false,
      "suggestedIcon": "..." (only if isNewCategory is true)
    }
    Language for description: ${lang === 'cn' ? 'Chinese' : 'English'}
  `;

  try {
    return await aiService.analyzeJSON(prompt);
  } catch (e) {
    console.error("Failed to analyze link", e);
    return { category: 'Tools', description: '' };
  }
};

export const recommendTools = async (query: string, availableLinks: any[], lang: Language): Promise<string> => {
  if (!aiService.isConfigured()) return "";

  const linksContext = JSON.stringify(availableLinks.map(c => ({
    category: c.type,
    links: c.links.map((l: any) => ({ title: l.title, desc: l.description, url: l.url }))
  })));

  const prompt = `
     User Query: "${query}"
     
     Available Tools in Database:
     ${linksContext}

     Task: Recommend the best tools from the database for this query. If none match, suggest general advice.
     Format: Markdown list.
   `;

  return getGeminiResponse(prompt, lang, "You are a helpful navigation assistant. You know the user's saved tools.");
};

export const batchAnalyzeLinks = async (links: { title: string, url: string }[], lang: Language): Promise<Record<string, { category: string, description: string }>> => {
  if (!aiService.isConfigured() || links.length === 0) return {};

  // Limit batch size to avoid token limits (e.g., 10 at a time)
  // For simplicity in this demo, we'll take the first 10 if it's a huge list, or we could chunk it.
  // Let's process up to 15 for now.
  const linksToAnalyze = links.slice(0, 15);

  const linksList = linksToAnalyze.map((l, i) => `${i + 1}. URL: ${l.url}, Title: ${l.title}`).join('\n');

  const prompt = `
    Analyze these ${linksToAnalyze.length} links:
    ${linksList}

    For EACH link, suggest a Category (one of: Tools, Learning, Community, Frameworks, Design, Deployment) and a short Description (max 10 words).
    
    Return ONLY a JSON array of objects in the same order:
    [
      { "category": "...", "description": "..." },
      ...
    ]
    Language: ${lang === 'cn' ? 'Chinese' : 'English'}
  `;

  try {
    const results = await aiService.analyzeJSON(prompt) as { category: string, description: string }[];

    // Map back to URLs
    const resultMap: Record<string, { category: string, description: string }> = {};
    linksToAnalyze.forEach((link, index) => {
      if (results[index]) {
        resultMap[link.url] = results[index];
      }
    });

    return resultMap;
  } catch (e) {
    console.error("Failed to batch analyze links", e);
    return {};
  }
};
