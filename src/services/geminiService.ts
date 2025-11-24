import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to prevent immediate errors on load if missing
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiResponse = async (prompt: string, lang: Language): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  const systemInstructions = {
    en: "You are a senior frontend engineer assistant. Answer questions concisely about React, TypeScript, CSS, HTML, and web performance. Provide code snippets where helpful. Keep answers brief and to the point.",
    cn: "你是一个高级前端工程师助手。请用中文简明扼要地回答关于 React, TypeScript, CSS, HTML 和 Web 性能的问题。在有帮助的地方提供代码片段。保持回答简短直接。"
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstructions[lang],
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