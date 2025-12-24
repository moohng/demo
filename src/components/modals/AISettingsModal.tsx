import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Eye, EyeOff, Activity, Server, Key, Zap, CheckCircle, AlertCircle, RefreshCw, List } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AIConfig, UsageStats } from '../../types';
import { AI_PROVIDERS } from '../../constants';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'cn';
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, lang }) => {
  const [baseURL, setBaseURL] = useState<string>(DEFAULT_BASE_URL);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showKey, setShowKey] = useState(false);

  // Track the actual currently active/live provider from config
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'fetching' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [showUrlDropdown, setShowUrlDropdown] = useState(false);

  const urlDropdownRef = useRef<HTMLDivElement>(null);

  // Effect to populate initial state
  useEffect(() => {
    if (isOpen) {
      loadProviderSettings();
      setStats(aiService.getStats());
      setStatus('idle');
      setStatusMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (urlDropdownRef.current && !urlDropdownRef.current.contains(event.target as Node)) {
        setShowUrlDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProviderSettings = async () => {
    const savedCallback = await aiService.getConfig();

    if (savedCallback) {
      setApiKey(savedCallback.apiKey);
      setBaseURL(savedCallback.baseURL || DEFAULT_BASE_URL);
      setModel(savedCallback.model);
    } else {
      // Load defaults if no saved config
      setApiKey('');
      setBaseURL(DEFAULT_BASE_URL);
      setModel(''); // Default fallback
      setAvailableModels([]);
    }
  };

  const fetchModels = async () => {
    if (!apiKey) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    setStatus('fetching');
    setStatusMsg('');
    try {
      const models = await aiService.fetchModels(apiKey, baseURL);
      setAvailableModels(models);
      if (models.length > 0) {
        // Only switch model if current is invalid or we just fetched for the first time
        if (!models.includes(model) || !model) {
          setModel(models[0]);
        }
      }
      setStatus('success');
      setStatusMsg(lang === 'cn' ? `成功获取 ${models.length} 个模型` : `Successfully fetched ${models.length} models`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        if (status === 'success') {
          setStatus('idle');
          setStatusMsg('');
        }
      }, 3000);

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
    setStatusMsg('');
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

  const handleSaveAndUse = async () => {
    if (!apiKey) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    try {
      const config: AIConfig = {
        apiKey,
        model,
        baseURL,
      };

      await aiService.saveConfig(config);

      onClose();

    } catch (error) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '保存失败' : 'Failed to save');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Active Tab Config Form */}
          <div className="grid grid-cols-1 gap-6">

            {/* Base URL */}
            <div className="space-y-2 relative" ref={urlDropdownRef}>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                Base URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={baseURL}
                  onChange={(e) => {
                    setBaseURL(e.target.value);
                  }}
                  onFocus={() => setShowUrlDropdown(true)}
                  className={`w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-mono`}
                  placeholder="https://api.openai.com/v1"
                  autoComplete="one-time-code"
                  spellCheck={false}
                />

                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <List className="w-4 h-4" onClick={() => setShowUrlDropdown(!showUrlDropdown)} />
                </button>

                {showUrlDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 max-h-[240px] overflow-y-auto">
                      {AI_PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setBaseURL(p.baseURL);
                            setShowUrlDropdown(false);
                            // Also update active tab if it matches a known provider
                            // setActiveTab(p.id); 
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors group"
                        >
                          <span className="text-sm font-medium text-white group-hover:text-blue-400">{p.baseURL}</span>
                          <span className="text-sm text-slate-500 font-mono truncate max-w-[200px]">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Row: Provider Info & API Key */}
            <div className="space-y-4">
              {/* Quick Info / Description could go here if we wanted per-provider info */}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    autoComplete="one-time-code"
                    spellCheck={false}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-slate-600 transition-all font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'cn'
                    ? 'API Key 将被加密存储在本地。'
                    : 'Keys are encrypted and stored locally.'}
                </p>
              </div>
            </div>

            {/* Model Selection Row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-400" />
                  {lang === 'cn' ? '模型' : 'Model'}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  {availableModels.length > 0 ? (
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none text-sm"
                    >
                      {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. gpt-4o"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                    />
                  )}
                  {availableModels.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <List className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <button
                  onClick={fetchModels}
                  disabled={status === 'fetching' || !apiKey || !baseURL}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all active:scale-95"
                  title={lang === 'cn' ? "获取模型列表" : "Get Models List"}
                >
                  {status === 'fetching' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span className="text-sm font-medium">{lang === 'cn' ? "获取模型" : "Get Models"}</span>
                </button>
              </div>
            </div>

            {/* Stats Section - Global Stats (or per provider? currently global in service) */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3 mt-2">
              <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {lang === 'cn' ? '全局使用统计' : 'Global Usage Stats'}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '今日' : 'Today'}</div>
                  <div className="text-lg font-bold text-white">{stats?.daily || 0}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '本月' : 'Month'}</div>
                  <div className="text-lg font-bold text-white">{stats?.monthly || 0}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1">{lang === 'cn' ? '总计' : 'Total'}</div>
                  <div className="text-lg font-bold text-blue-400">{stats?.totalCalls || 0}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-800/50">
          {/* Status Message */}
          {statusMsg && (
            <div className={`flex items-center gap-2 text-sm animate-fade-in ${status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {status === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              <span className="truncate">{statusMsg}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={status === 'validating' || !apiKey || !baseURL}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'validating'
                ? (lang === 'cn' ? '测试中...' : 'Testing...')
                : (lang === 'cn' ? '测试连接' : 'Test Connection')}
            </button>

            <button
              onClick={handleSaveAndUse}
              disabled={!apiKey || !baseURL}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {lang === 'cn' ? '保存' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
AISettingsModal.displayName = 'AISettingsModal';
