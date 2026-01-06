/**
 * Unified AI Provider
 * Supports any OpenAI-compatible API (OpenAI, Gemini, DeepSeek, etc.)
 */
import OpenAI from 'openai';
import { cleanJSON } from '../../utils/json';

export class UnifiedProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, baseURL: string, model: string) {
    // OpenAI SDK requires a full URL, so we resolve relative paths against the current origin
    const resolvedBaseURL =
      baseURL.startsWith('/') && typeof window !== 'undefined' ? `${window.location.origin}${baseURL}` : baseURL;

    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: resolvedBaseURL,
      dangerouslyAllowBrowser: true,
    });
    this.model = model;
  }

  /**
   * List available models using the provided credentials
   */
  static async listModels(apiKey: string, baseURL: string): Promise<string[]> {
    try {
      const resolvedBaseURL =
        baseURL.startsWith('/') && typeof window !== 'undefined' ? `${window.location.origin}${baseURL}` : baseURL;

      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: resolvedBaseURL,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.models.list();
      return response.data.map(m => m.id).sort();
    } catch (error) {
      console.error('Failed to list models:', error);
      throw error;
    }
  }

  /**
   * Validate connection by making a minimal request
   */
  static async validateConnection(apiKey: string, baseURL: string, model: string): Promise<boolean> {
    try {
      const resolvedBaseURL =
        baseURL.startsWith('/') && typeof window !== 'undefined' ? `${window.location.origin}${baseURL}` : baseURL;

      const client = new OpenAI({
        apiKey: apiKey,
        baseURL: resolvedBaseURL,
        dangerouslyAllowBrowser: true,
      });

      await client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1
      });
      // await client.models.retrieve(model);

      return true;
    } catch (error) {
      console.error('Connection validation failed:', error);
      throw error; // Rethrow to show specific error in UI
    }
  }

  async chat(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const messages: any[] = [];

      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }

      messages.push({ role: 'user', content: prompt });

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
      });

      return completion.choices[0]?.message?.content || 'No response generated.';

    } catch (error: any) {
      // Standardize error codes if needed, but OpenAI SDK usually handles this well
      if (error.status === 401) throw new Error('INVALID_API_KEY');
      if (error.status === 429) throw new Error('QUOTA_EXCEEDED');

      console.error('Chat request failed:', error);
      throw error;
    }
  }

  async analyzeJSON(prompt: string): Promise<any> {
    try {
      // Try json_object mode first
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      });

      const text = completion.choices[0]?.message?.content;

      if (!text) throw new Error('No response');

      const cleanedText = cleanJSON(text);
      return JSON.parse(cleanedText);
    } catch (error) {
      // Fallback to text mode if json_object fails or model doesn't support it
      console.warn('JSON mode failed or unsupported, retrying with text mode:', error);

      // Retry with explicit instruction
      const response = await this.chat(prompt + '\n\nIMPORTANT: Return valid JSON only. No markdown, no comments.');
      try {
        return JSON.parse(cleanJSON(response));
      } catch (e) {
        console.error('JSON analysis failed:', e);
        throw e;
      }
    }
  }
}
