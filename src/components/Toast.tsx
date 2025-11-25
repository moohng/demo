import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { NotificationType } from '../hooks/useNotification';

interface ToastProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = React.memo(({ message, type, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[110] animate-fade-in-down">
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border ${type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' :
          type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' :
            'bg-blue-500/20 border-blue-500/50 text-blue-200'
        }`}>
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <AlertTriangle size={20} />}
        {type === 'info' && <Info size={20} />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';
