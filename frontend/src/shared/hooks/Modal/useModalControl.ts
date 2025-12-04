import { useCallback, useState } from 'react';
import useEscapeClose from './useEscapeClose';

export type ModalTypeKey = 'Login' | 'EntryConfirm' | 'CopyLink';

export interface ModalControls {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}
export interface ModalHelperType {
  login: ModalControls;
  confirm: ModalControls;
  copyLink: ModalControls;
}

const useModalControl = () => {
  const [modalStack, setModalStack] = useState<ModalTypeKey[]>([]);

  const openModal = useCallback((key: ModalTypeKey) => {
    setModalStack((prev) => {
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  }, []);

  const closeModal = useCallback((key: ModalTypeKey) => {
    setModalStack((prev) => prev.filter((k) => k !== key));
  }, []);

  useEscapeClose({ modalStack, closeModal });

  const modalHelpers: ModalHelperType = {
    login: {
      open: () => openModal('Login'),
      close: () => closeModal('Login'),
      isOpen: modalStack.includes('Login'),
    },
    confirm: {
      open: () => openModal('EntryConfirm'),
      close: () => closeModal('EntryConfirm'),
      isOpen: modalStack.includes('EntryConfirm'),
    },
    copyLink: {
      open: () => openModal('CopyLink'),
      close: () => closeModal('CopyLink'),
      isOpen: modalStack.includes('CopyLink'),
    },
  };

  return modalHelpers;
};

export default useModalControl;
