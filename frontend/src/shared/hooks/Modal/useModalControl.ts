import { useCallback, useState } from 'react';

type modalTypeKey = 'Login' | 'EntryConfirm' | 'CopyLink';
type Modals = Record<modalTypeKey, boolean>;

interface ModalState {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}
export interface ModalHelperType {
  login: ModalState;
  confirm: ModalState;
  copyLink: ModalState;
}
const useModalControl = () => {
  const [modals, setModals] = useState<Modals>({
    Login: false,
    EntryConfirm: false,
    CopyLink: false,
  });
  const handleOpenModal = useCallback((key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  }, []);
  const handleCloseModal = useCallback((key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  }, []);

  const modalHelpers = {
    login: {
      open: () => handleOpenModal('Login'),
      close: () => handleCloseModal('Login'),
      isOpen: modals.Login,
    },
    confirm: {
      open: () => handleOpenModal('EntryConfirm'),
      close: () => handleCloseModal('EntryConfirm'),
      isOpen: modals.EntryConfirm,
    },
    copyLink: {
      open: () => handleOpenModal('CopyLink'),
      close: () => handleCloseModal('CopyLink'),
      isOpen: modals.CopyLink,
    },
  };
  return modalHelpers;
};

export default useModalControl;
