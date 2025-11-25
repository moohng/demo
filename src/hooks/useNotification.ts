import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification
  };
};
