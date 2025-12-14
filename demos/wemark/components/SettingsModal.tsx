import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ImageConfig } from '../utils/image';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ImageConfig;
  onSave: (config: ImageConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [localConfig, setLocalConfig] = useState<ImageConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(config);
    }
  }, [isOpen, config]);

  const handleChange = (key: keyof ImageConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-96 bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="h-14 px-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold text-gray-800">设置</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Image Hosting Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              图床设置
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图床提供商
                </label>
                <select
                  value={localConfig.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="sm.ms">SM.MS</option>
                  <option value="github">GitHub</option>
                </select>
              </div>

              {localConfig.type === 'sm.ms' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Token (可选，但推荐)
                  </label>
                  <input
                    type="password"
                    value={localConfig.token || ''}
                    onChange={(e) => handleChange('token', e.target.value)}
                    placeholder="请输入 SM.MS Secret Token"
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    免费版每分钟限制上传 5 张。建议注册 SM.MS 账号获取 Token 以获得更稳定的服务。
                  </p>
                </div>
              )}

              {localConfig.type === 'github' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Repo (用户名/仓库名)
                    </label>
                    <input
                      type="text"
                      value={localConfig.repo || ''}
                      onChange={(e) => handleChange('repo', e.target.value)}
                      placeholder="例如: username/image-repo"
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch (分支，默认 main)
                    </label>
                    <input
                      type="text"
                      value={localConfig.branch || ''}
                      onChange={(e) => handleChange('branch', e.target.value)}
                      placeholder="main"
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Directory (存储目录，默认 images)
                    </label>
                    <input
                      type="text"
                      value={localConfig.dir || ''}
                      onChange={(e) => handleChange('dir', e.target.value)}
                      placeholder="例如: assets/img"
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Personal Access Token
                    </label>
                    <input
                      type="password"
                      value={localConfig.token || ''}
                      onChange={(e) => handleChange('token', e.target.value)}
                      placeholder="请输入 GitHub Token"
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Token 需要勾选 <code>repo</code> 权限。图片将自动上传并使用 jsDelivr CDN 加速。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium shadow-sm hover:shadow"
          >
            <Save size={18} />
            <span>保存设置</span>
          </button>
        </div>

      </div>
    </div>
  );
};
