/**
 * Unified AI Service
 * Manages AI provider selection and API calls
 */
import { AIConfig, UsageStats, Language } from '../types';
import { decryptAPIKey, encryptAPIKey } from '../utils/crypto';
import { UnifiedProvider } from './providers/unifiedProvider';

const STORAGE_KEY_CONFIG = 'devnavi_ai_config'; // Current active config
const STORAGE_KEY_STATS = 'devnavi_ai_stats';

export class AIService {
  private provider: UnifiedProvider | null = null;
  private config: AIConfig | null = null;
  private stats: UsageStats = {
    daily: 0,
    monthly: 0,
    lastReset: Date.now(),
    totalCalls: 0
  };

  constructor() {
    this.loadConfig();
    this.loadStats();
  }

  private async loadConfig() {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Decrypt key
        const decryptedKey = await decryptAPIKey(parsed.apiKey);
        if (decryptedKey) {
          this.config = parsed;
          this.initializeProvider(decryptedKey);
        }
      } catch (e) {
        console.error('Failed to load AI config', e);
      }
    }
  }

  private initializeProvider(apiKey: string) {
    if (!this.config) return;
    try {
      this.provider = new UnifiedProvider(
        apiKey,
        this.config.baseURL,
        this.config.model
      );
    } catch (e) {
      console.error('Failed to initialize AI provider', e);
    }
  }

  private loadStats() {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    if (saved) {
      this.stats = JSON.parse(saved);
      this.checkResetDaily();
    }
  }

  private checkResetDaily() {
    const now = new Date();
    const last = new Date(this.stats.lastReset);

    if (now.getDate() !== last.getDate()) {
      this.stats.daily = 0;
      this.stats.lastReset = now.getTime();
      this.saveStats();
    }
  }

  private saveStats() {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(this.stats));
  }

  private incrementStats() {
    this.checkResetDaily();
    this.stats.daily++;
    this.stats.monthly++;
    this.stats.totalCalls++;
    this.saveStats();
  }

  async saveConfig(config: AIConfig) {
    const rawApiKey = config.apiKey;
    const encryptedKey = await encryptAPIKey(rawApiKey);
    if (!encryptedKey) throw new Error('Failed to encrypt API Key');

    const configToSave = { ...config, apiKey: encryptedKey };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(configToSave));

    this.config = configToSave;
    this.initializeProvider(rawApiKey);
  }

  isConfigured(): boolean {
    return !!this.provider;
  }

  async getConfig(): Promise<AIConfig | null> {
    if (!this.config) return null;
    const decryptedKey = await decryptAPIKey(this.config.apiKey);
    return { ...this.config, apiKey: decryptedKey };
  }

  getStats(): UsageStats {
    return this.stats;
  }

  /**
   * Fetches the list of available models for a given configuration
   */
  async fetchModels(apiKey: string, baseURL: string): Promise<string[]> {
    return await UnifiedProvider.listModels(apiKey, baseURL);
  }

  /**
   * Validates the connection with the given configuration
   */
  async validateConnection(apiKey: string, baseURL: string, model: string): Promise<boolean> {
    return await UnifiedProvider.validateConnection(apiKey, baseURL, model);
  }

  async chat(prompt: string, lang: Language, systemInstruction?: string): Promise<string> {
    if (!this.provider) {
      // Try to re-initialize if we have config but no provider (edge case)
      if (this.config?.apiKey) {
        const decrypted = await decryptAPIKey(this.config.apiKey);
        if (decrypted) this.initializeProvider(decrypted);
      }

      if (!this.provider) throw new Error('AI_NOT_CONFIGURED');
    }

    try {
      const response = await this.provider!.chat(prompt, systemInstruction);
      this.incrementStats();
      return response;
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }

  async analyzeJSON(prompt: string): Promise<any> {
    if (!this.provider) {
      // Try to re-initialize
      if (this.config?.apiKey) {
        const decrypted = await decryptAPIKey(this.config.apiKey);
        if (decrypted) this.initializeProvider(decrypted);
      }
      if (!this.provider) throw new Error('AI_NOT_CONFIGURED');
    }

    try {
      const result = await this.provider!.analyzeJSON(prompt);
      this.incrementStats();
      return result;
    } catch (error) {
      console.error('AI analyzeJSON error:', error);
      throw error;
    }
  }

  
}

// Export singleton instance
export const aiService = new AIService();
