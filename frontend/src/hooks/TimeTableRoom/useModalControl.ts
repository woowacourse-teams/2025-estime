import { useState } from 'react';

type modalTypeKey = 'Login' | 'EntryConfirm';
type Modals = Record<modalTypeKey, boolean>;
export function useModalControl() {
  const [modals, setModals] = useState<Modals>({
    Login: false,
    EntryConfirm: false,
  });

  const handleOpenModal = (key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: true }));
  };
  const handleCloseModal = (key: modalTypeKey) => {
    setModals((prev) => ({ ...prev, [key]: false }));
  };

  return {
    modals,
    handleOpenModal,
    handleCloseModal,
  };
}
