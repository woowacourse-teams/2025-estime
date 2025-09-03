import { useCallback, useState } from 'react';

type modalTypeKey = 'Login' | 'EntryConfirm' | 'CopyLink';
type Modals = Record<modalTypeKey, boolean>;
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
    modals,
    modalHelpers,
  };
};

export default useModalControl;
