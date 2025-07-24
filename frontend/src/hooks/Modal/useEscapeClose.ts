import { useEffect } from 'react';

interface useEscapeCloseProps {
  isOpen: boolean;
  onClose?: () => void;
  shouldClose?: boolean;
}

export function useEscapeClose({ isOpen, onClose, shouldClose }: useEscapeCloseProps) {
  useEffect(() => {
    if (!isOpen || !shouldClose || !onClose) return;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [isOpen, onClose, shouldClose]);
}
