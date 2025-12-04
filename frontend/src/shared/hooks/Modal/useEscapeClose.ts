import { useEffect } from 'react';
import type { ModalTypeKey } from './useModalControl';

interface useEscapeCloseProps {
  modalStack: ModalTypeKey[];
  closeModal: (key: ModalTypeKey) => void;
}

const useEscapeClose = ({ modalStack, closeModal }: useEscapeCloseProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack.length > 0) {
        const topModal = modalStack[modalStack.length - 1];
        closeModal(topModal);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalStack, closeModal]);
};

export default useEscapeClose;
