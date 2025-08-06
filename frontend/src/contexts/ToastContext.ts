import { type ToastContextType } from '@/types/toastType';
import { createContext, useContext } from 'react';

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext)!;

  if (!context) throw new Error('useToastContext must be used within a ToastProvider');

  return context;
};
