import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize the client only if the key exists to prevent immediate errors on load if missing
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiResponse = async (prompt: string, lang: Language, systemInstruction?: string): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure process.env.GEMINI_API_KEY.";
  }

  const defaultSystemInstructions = {
    en: "You are a senior frontend engineer assistant. Answer questions concisely about React, TypeScript, CSS, HTML, and web performance. Provide code snippets where helpful. Keep answers brief and to the point.",
    cn: "你是一个高级前端工程师助手。请用中文简明扼要地回答关于 React, TypeScript, CSS, HTML 和 Web 性能的问题。在有帮助的地方提供代码片段。保持回答简短直接。"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || defaultSystemInstructions[lang],
      }
    });
    
    return response.text || (lang === 'cn' ? "未生成回复。" : "No response generated.");
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return lang === 'cn' 
      ? "抱歉，处理您的请求时出现错误。" 
      : "Sorry, I encountered an error while processing your request.";
  }
};

export const analyzeLinkInfo = async (url: string, title: string, lang: Language): Promise<{ title?: string, category: string, description: string }> => {
  if (!ai) return { category: 'Tools', description: '' };

  const prompt = `
    Analyze this website link:
    URL: ${url}
    ${title ? `Title: ${title}` : 'Title: (Unknown, please infer from URL)'}

    Based on this, suggest:
    1. A short Title (if not provided).
    2. A Category (one of: Tools, Learning, Community, Frameworks, Design, Deployment).
    3. A short Description (max 10 words).
    
    Return ONLY a JSON object: { "title": "...", "category": "...", "description": "..." }
    Language: ${lang === 'cn' ? 'Chinese' : 'English'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to analyze link", e);
    return { category: 'Tools', description: '' };
  }
};

export const recommendTools = async (query: string, availableLinks: any[], lang: Language): Promise<string> => {
   if (!ai) return "";

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
  if (!ai || links.length === 0) return {};

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    
    const results = JSON.parse(text) as { category: string, description: string }[];
    
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