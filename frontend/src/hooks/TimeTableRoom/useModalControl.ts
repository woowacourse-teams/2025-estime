import { useState } from 'react';

type modalTypeKey = 'Login' | 'EntryConfirm' | 'CopyLink';
type Modals = Record<modalTypeKey, boolean>;
export function useModalControl() {
  const [modals, setModals] = useState<Modals>({
    Login: false,
    EntryConfirm: false,
    CopyLink: false,
  });

  const handleOpenModal = (key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  };
  const handleCloseModal = (key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  };

  const modalHelpers = {
    login: {
      open: () => handleOpenModal('Login'),
      close: () => handleCloseModal('Login'),
      isOpen: modals.Login,
    },
    entryConfirm: {
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

  return {
    modalHelpers,
  };
}
