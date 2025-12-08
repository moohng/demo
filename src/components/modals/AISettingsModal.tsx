import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Eye, EyeOff, Activity, Server, Key, Zap, CheckCircle, AlertCircle, RefreshCw, List, Plus, Trash2 } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AIConfig, UsageStats } from '../../types';
import { AI_PROVIDERS } from '../../constants';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'cn';
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<string>('openai');
  const [visibleTabs, setVisibleTabs] = useState<string[]>(AI_PROVIDERS.map(p => p.id));
  const [showAddTab, setShowAddTab] = useState(false);

  const [baseURL, setBaseURL] = useState<string>('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [enabled, setEnabled] = useState(true);

  // Track the actual currently active/live provider from config
  const [liveProviderId, setLiveProviderId] = useState<string>('');

  const [stats, setStats] = useState<UsageStats | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'fetching' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isCustomBaseURL, setIsCustomBaseURL] = useState(false);

  const addTabRef = useRef<HTMLDivElement>(null);

  // Close add dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addTabRef.current && !addTabRef.current.contains(event.target as Node)) {
        setShowAddTab(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect to populate initial state
  useEffect(() => {
    if (isOpen) {
      const currentConfig = aiService.getConfig();
      // const configured = aiService.getConfiguredProviders();

      // Determine initial visible tabs
      // const initialTabs = new Set(configured);
      // if (currentConfig?.providerId) initialTabs.add(currentConfig.providerId);
      // // Ensure we have at least 'openai' or the active one
      // if (initialTabs.size === 0) initialTabs.add('openai');

      // setVisibleTabs(Array.from(initialTabs));

      if (currentConfig) {
        setLiveProviderId(currentConfig.providerId);
        setActiveTab(currentConfig.providerId);
        loadProviderSettings(currentConfig.providerId);
      } else {
        setActiveTab('openai');
        loadProviderSettings('openai');
      }

      setStats(aiService.getStats());
      setStatus('idle');
      setStatusMsg('');
    }
  }, [isOpen]);

  const loadProviderSettings = async (id: string) => {
    // 1. Try to get saved config for this provider
    const savedCallback = await aiService.getProviderConfig(id);

    // 2. Get static defaults
    const providerDef = AI_PROVIDERS.find(p => p.id === id);

    if (savedCallback) {
      setApiKey(savedCallback.apiKey);
      setBaseURL(savedCallback.baseURL || providerDef?.baseURL || '');
      setModel(savedCallback.model);
      // Enable edit if custom
      setIsCustomBaseURL(id === 'custom');

      // If it was the active config, update enabled state from live config, 
      // else default to true as we are editing it potentially to enable it.
      const currentConfig = aiService.getConfig();
      if (currentConfig?.providerId === id) {
        setEnabled(currentConfig.enabled);
      } else {
        setEnabled(true);
      }

    } else {
      // Load defaults if no saved config
      setApiKey('');
      setBaseURL(providerDef?.baseURL || '');
      setModel(''); // Default fallback
      setIsCustomBaseURL(id === 'custom');
      setAvailableModels([]);
      setEnabled(true);
    }
  };

  const handleTabChange = async (newTabId: string) => {
    setActiveTab(newTabId);
    setStatus('idle');
    setStatusMsg('');
    await loadProviderSettings(newTabId);
  };

  const handleAddTab = (providerId: string) => {
    if (!visibleTabs.includes(providerId)) {
      setVisibleTabs([...visibleTabs, providerId]);
    }
    handleTabChange(providerId);
    setShowAddTab(false);
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

  const handleSave = async () => {
    if (!apiKey && enabled) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    try {
      const config: AIConfig = {
        providerId: activeTab,
        apiKey,
        model,
        baseURL,
        enabled
      };
      await aiService.saveConfig(config);
      setStatus('success');
      setStatusMsg(lang === 'cn' ? '保存成功！' : 'Saved successfully!');
    } catch (error: any) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '保存失败: ' + error.message : 'Save failed: ' + error.message);
    }
  };

  const handleSaveAndUse = async () => {
    if (!apiKey && enabled) {
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '请输入 API Key' : 'Please enter API Key');
      return;
    }

    try {
      const config: AIConfig = {
        providerId: activeTab,
        apiKey,
        model,
        baseURL,
        enabled
      };

      await aiService.saveConfig(config, true);

      setLiveProviderId(activeTab); // Update live indicator

      setStatus('success');
      setStatusMsg(lang === 'cn' ? '保存并启用成功！' : 'Saved and Activated!');

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setStatusMsg(lang === 'cn' ? '保存失败' : 'Failed to save');
    }
  };

  if (!isOpen) return null;

  const usage = stats || { daily: 0, monthly: 0, lastReset: Date.now(), totalCalls: 0 };

  // Available providers that are NOT already in visibleTabs
  const availableToAdd = AI_PROVIDERS.filter(p => !visibleTabs.includes(p.id));

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

        {/* Tab Bar */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-900/50 overflow-x-auto no-scrollbar">
          {visibleTabs.map(tabId => {
            const provider = AI_PROVIDERS.find(p => p.id === tabId);
            const isActive = tabId === activeTab;
            const isLive = tabId === liveProviderId;

            return (
              <button
                key={tabId}
                onClick={() => handleTabChange(tabId)}
                className={`
                  relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                  ${isActive
                    ? 'text-blue-400 border-blue-400 bg-blue-400/5'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
                  }
                `}
              >
                {provider?.name || tabId}
                {isLive && (
                  <span className="flex h-2 w-2 relative ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </button>
            );
          })}

          {/* Add Tab Button */}
          {availableToAdd.length > 0 && (
            <div className="relative ml-2" ref={addTabRef}>
              <button
                onClick={() => setShowAddTab(!showAddTab)}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-colors"
                title={lang === 'cn' ? '添加服务商' : 'Add Provider'}
              >
                <Plus className="w-5 h-5" />
              </button>

              {showAddTab && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in">
                  {availableToAdd.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleAddTab(p.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Active Tab Config Form */}
          <div className="grid grid-cols-1 gap-6">

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
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={activeTab === 'custom' ? 'sk-...' : `Enter ${AI_PROVIDERS.find(p => p.id === activeTab)?.name} Key`}
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

            {/* Base URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-400" />
                Base URL
              </label>
              <input
                type="text"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-mono ${!isCustomBaseURL ? 'opacity-60 cursor-default bg-slate-900' : ''}`}
              />
            </div>

            {/* Model Selection Row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-400" />
                  {lang === 'cn' ? '模型' : 'Model'}
                </label>
                {/* Fetch Button moved here for better alignment */}
                <button
                  onClick={fetchModels}
                  disabled={status === 'fetching' || !apiKey}
                  className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  {status === 'fetching' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  {lang === 'cn' ? "刷新列表" : "Refresh List"}
                </button>
              </div>

              <div className="relative">
                {availableModels.length > 0 ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                  >
                    {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. gpt-4o"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                )}
                {availableModels.length > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <List className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {statusMsg && (
              <div className={`p-3 rounded-xl flex items-center gap-2 text-sm animate-fade-in ${status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                {status === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate">{statusMsg}</span>
              </div>
            )}

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
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {status === 'validating' && <RefreshCw className="w-3 h-3 animate-spin" />}
            <span>
              {liveProviderId === activeTab
                ? (lang === 'cn' ? '当前已激活' : 'Currently Active')
                : (lang === 'cn' ? '未激活' : 'Not Active')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={status === 'validating' || !apiKey}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'validating'
                ? (lang === 'cn' ? '测试中...' : 'Testing...')
                : (lang === 'cn' ? '测试连接' : 'Test Connection')}
            </button>

            <button
              onClick={handleSave}
              disabled={(!apiKey && !aiService.getConfig()?.apiKey) && activeTab === 'custom'} // Basic check
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {lang === 'cn' ? '保存' : 'Save'}
            </button>
            <button
              onClick={handleSaveAndUse}
              disabled={(!apiKey && !aiService.getConfig()?.apiKey) && activeTab === 'custom'} // Basic check
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lang === 'cn' ? '保存并使用' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
AISettingsModal.displayName = 'AISettingsModal';
