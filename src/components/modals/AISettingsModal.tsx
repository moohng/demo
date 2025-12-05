import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, Activity, Server, Key, Zap, CheckCircle, AlertCircle, RefreshCw, List } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AIConfig, UsageStats } from '../../types';
import { AI_PROVIDERS } from '../../constants';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'cn';
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, lang }) => {
  const [providerId, setProviderId] = useState<string>('openai');
  const [baseURL, setBaseURL] = useState<string>('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const [stats, setStats] = useState<UsageStats | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'fetching' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isCustomBaseURL, setIsCustomBaseURL] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentConfig = aiService.getConfig();
      if (currentConfig) {
        setProviderId(currentConfig.providerId);
        setBaseURL(currentConfig.baseURL);
        setModel(currentConfig.model);
        setEnabled(currentConfig.enabled);
        setIsCustomBaseURL(currentConfig.providerId === 'custom');
      // Note: We don't populate apiKey for security, user must re-enter to change
      }
      setStats(aiService.getStats());
    }
  }, [isOpen]);

  const handleProviderChange = (newPlatformId: string) => {
    setProviderId(newPlatformId);
    const provider = AI_PROVIDERS.find(p => p.id === newPlatformId);
    if (provider) {
      setBaseURL(provider.baseURL);
      setIsCustomBaseURL(newPlatformId === 'custom');
    }
  };

  const fetchModels = async () => {
    if (!apiKey) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    setStatus('fetching');
    try {
      const models = await aiService.fetchModels(apiKey, baseURL);
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(model)) {
        setModel(models[0]);
      }
      setStatus('idle');
    } catch (error: any) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '获取模型列表失败: ' + error.message : 'Failed to fetch models: ' + error.message);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    setStatus('validating');
    try {
      const isValid = await aiService.validateConnection(apiKey, baseURL, model);
      if (isValid) {
        setStatus('success');
        setStatusMsg(lang === 'cn' ? '连接成功！' : 'Connection successful!');
      } else {
        setStatus('error');
        setStatusMsg(lang === 'cn' ? '连接失败，请检查配置' : 'Connection failed, check settings');
      }
    } catch (error: any) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '连接错误: ' + error.message : 'Connection error: ' + error.message);
    }
  };

  const handleSave = async () => {
    if (!apiKey && !aiService.getConfig()?.apiKey) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    try {
      const config: AIConfig = {
        providerId,
        apiKey: '', // Will be handled by service
        model,
        baseURL,
        enabled
      };

      // If user didn't enter a new key, we need to handle that logic carefully. 
      // Current simplified logic requires re-entry or passing existing raw key if we had it (which we don't safely).
      // For this demo, let's assume if key is empty we might keep existing if set, but for best security 
      // in this simple implementation we ask for key if changing settings.

      if (apiKey) {
        await aiService.saveConfig(config, apiKey);
        onClose();
      } else {
        // If simply toggling enable/disable without changing key
        const existing = aiService.getConfig();
        if (existing) {
          // We can't re-encrypt without raw key. 
          // Ideally we shouldn't allow saving config without re-entering key if critical params change.
          // But for enable/disable toggles we might want to allow it.
          // Here we simple prompt user.
          setStatus('error');
          setStatusMsg(lang === 'cn' ? '更改设置需重新输入 API Key' : 'Please re-enter API Key to save changes');
        }
      }

    } catch (error) {
      console.error(error);
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '保存失败' : 'Failed to save');
    }
  };

  if (!isOpen) return null;

  const usage = stats || { daily: 0, monthly: 0, lastReset: Date.now(), totalCalls: 0 };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'cn' ? 'AI 模型设置' : 'AI Model Settings'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Top Row: Provider & API Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                {lang === 'cn' ? 'AI 提供商' : 'AI Provider'}
              </label>
              <select
                value={providerId}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {AI_PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full pl-4 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-slate-600"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Base URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Base URL</label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              className={`w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${!isCustomBaseURL && providerId !== 'custom' ? 'opacity-80' : ''}`}
            />
          </div>

          {/* Model Selection Row */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <List className="w-4 h-4 text-emerald-400" />
              {lang === 'cn' ? '模型选择' : 'Model Selection'}
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                {availableModels.length > 0 ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. gpt-4o"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                )}
              </div>

              <button
                onClick={fetchModels}
                disabled={status === 'fetching' || !apiKey}
                className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white border border-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                title={lang === 'cn' ? "获取模型列表" : "Fetch Models"}
              >
                {status === 'fetching' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="hidden sm:inline">{lang === 'cn' ? "获取模型" : "Fetch Models"}</span>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm ${status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              {status === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {statusMsg}
            </div>
          )}

          {/* Stats Section */}
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {lang === 'cn' ? '使用统计' : 'Usage Statistics'}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '今日调用' : 'Today'}</div>
                <div className="text-lg font-bold text-white">{stats?.daily || 0}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '本月调用' : 'Month'}</div>
                <div className="text-lg font-bold text-white">{stats?.monthly || 0}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '总计调用' : 'Total'}</div>
                <div className="text-lg font-bold text-blue-400">{stats?.totalCalls || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-800/50">
          <button 
            onClick={handleTestConnection}
            disabled={status === 'validating' || !apiKey}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {status === 'validating'
              ? (lang === 'cn' ? '测试中...' : 'Testing...')
              : (lang === 'cn' ? '测试连接' : 'Test Connection')}
          </button>

          <button
            onClick={handleSave}
            disabled={!apiKey && !aiService.getConfig()?.apiKey}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {lang === 'cn' ? '保存配置' : 'Save Config'}
          </button>
        </div>
      </div>
    </div>
  );
};

AISettingsModal.displayName = 'AISettingsModal';
