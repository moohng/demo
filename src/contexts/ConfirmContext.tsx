import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ConfirmModal } from '../components/modals/ConfirmModal';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => void;
  hideConfirm: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const showConfirm = useCallback((newOptions: ConfirmOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    setIsOpen(false);
  }, [options]);

  return (
    <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
      {children}
      {options && (
        <ConfirmModal
          isOpen={isOpen}
          onClose={hideConfirm}
          onConfirm={handleConfirm}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
