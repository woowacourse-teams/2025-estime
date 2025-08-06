import ToastZone from '@/components/Layout/ToastZone';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastStateType } from '@/types/toastType';
import { useCallback, useState } from 'react';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastStateType[]>([]);

  const addToast = (toast: Omit<ToastStateType, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastZone toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
