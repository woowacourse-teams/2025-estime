type Listener = () => void;

type Store<T> = {
  getSnapshot: () => T;
  subscribe: (listener: Listener) => () => void;
  publish: () => void;
  addToast: (toast: Omit<ToastStateType, 'id'>) => void;
};

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastStateType {
  id: string;
  type: ToastType;
  message: string;
}

let toasts: ToastStateType[] = [];
let listen: Listener[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const MAX_SAME_TOAST_REPEAT = 3;

const toastStore: Store<ToastStateType[]> = {
  getSnapshot: () => toasts,

  subscribe: (listener: Listener) => {
    listen.push(listener);
    return () => {
      listen = listen.filter((li) => li !== listener);
    };
  },

  publish: () => {
    listen.forEach((listener) => {
      listener();
    });
  },

  addToast: (toast: Omit<ToastStateType, 'id'>) => {
    // 마지막 3개 잘라서 현재 들어온 메시지와 모두 동일한지 체크하기 (동일하면 limit 걸기)
    const isOverLimit =
      toasts.length >= MAX_SAME_TOAST_REPEAT &&
      toasts
        .slice(-MAX_SAME_TOAST_REPEAT)
        .every((t) => t.message === toast.message && t.type === toast.type);

    if (isOverLimit) return;

    const id = `${Date.now()}-${Math.random()}`;
    toasts = [...toasts, { ...toast, id }];

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      toasts = [];
    }, 1600);

    //리렌더링
    toastStore.publish();
  },
};

export default toastStore;
