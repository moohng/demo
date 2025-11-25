import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Language } from '../../types';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  lang: Language;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = React.memo(({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  lang
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium"
          >
            {cancelText || (lang === 'cn' ? '取消' : 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors"
          >
            {confirmText || (lang === 'cn' ? '确认' : 'Confirm')}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';
