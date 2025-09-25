import { useEffect } from 'react';

interface useEscapeCloseProps {
  isOpen: boolean;
  onClose?: () => void;
  shouldCloseOnOverlayAction?: boolean;
}

const useEscapeClose = ({ isOpen, onClose, shouldCloseOnOverlayAction }: useEscapeCloseProps) => {
  useEffect(() => {
    if (!isOpen || !shouldCloseOnOverlayAction || !onClose) return;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [isOpen, onClose, shouldCloseOnOverlayAction]);
};

export default useEscapeClose;
