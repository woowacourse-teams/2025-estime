import createStore from './createStore';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastStateType {
  id: string;
  type: ToastType;
  message: string;
}

const MAX_SAME_TOAST_REPEAT = 3;

const createToastStore = () => {
  const store = createStore<ToastStateType[]>([]);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const addToast = (toast: Omit<ToastStateType, 'id'>) => {
    store.setState((prev) => {
      const isOverLimit =
        prev.length >= MAX_SAME_TOAST_REPEAT &&
        prev
          .slice(-MAX_SAME_TOAST_REPEAT)
          .every((t) => t.message === toast.message && t.type === toast.type);

      if (isOverLimit) return prev;

      const id = `${Date.now()}-${Math.random()}`;
      const next = [...prev, { ...toast, id }];

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => store.setState([]), 1600);

      return next;
    });
  };

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
    addToast,
  };
};

export const toastStore = createToastStore();
export const showToast = toastStore.addToast;
