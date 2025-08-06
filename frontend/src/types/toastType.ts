export type ToastType = 'success' | 'error' | 'warning';

export interface ToastStateType {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastStateType, 'id'>) => void;
}
