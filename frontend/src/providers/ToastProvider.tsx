import ToastZone from '@/components/Layout/ToastZone';
import { ToastContext } from '@/contexts/ToastContext';
import { ToastStateType } from '@/types/toastType';
import { useCallback, useRef, useState } from 'react';

const MAX_SAME_TOAST_REPEAT = 3;

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastStateType[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = (toast: Omit<ToastStateType, 'id'>) => {
    // 마지막 3개 잘라서 현재 들어온 메시지와 모두 동일한지 체크하기 (동일하면 limit 걸기)
    const isOverLimit =
      toasts.length >= MAX_SAME_TOAST_REPEAT &&
      toasts
        .slice(-MAX_SAME_TOAST_REPEAT)
        .every((t) => t.message === toast.message && t.type === toast.type);

    if (isOverLimit) return;

    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToasts([]);
    }, 1600);
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
