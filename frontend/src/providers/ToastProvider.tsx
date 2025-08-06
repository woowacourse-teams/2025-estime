import ToastZone from '@/components/Layout/ToastZone';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastStateType } from '@/types/toastType';
import { useCallback, useRef, useState } from 'react';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastStateType[]>([]);
  const lastToastTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = (toast: Omit<ToastStateType, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    lastToastTimeRef.current = Date.now();

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (Date.now() - lastToastTimeRef.current >= 3000) setToasts([]);
    }, 3000);
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
