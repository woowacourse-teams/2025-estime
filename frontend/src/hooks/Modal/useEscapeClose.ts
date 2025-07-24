import { useEffect } from 'react';

export function useEscapeClose(isOpen: boolean, onClose: () => void, shouldClose: boolean = true) {
  useEffect(() => {
    if (!isOpen || !shouldClose) return;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [isOpen, onClose, shouldClose]);
}
