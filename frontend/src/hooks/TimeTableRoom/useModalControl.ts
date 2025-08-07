import { useState } from 'react';

type modalTypeKey = 'Login' | 'EntryConfirm';

export function useModalControl() {
  const [modals, setModals] = useState<Record<modalTypeKey, boolean>>({
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
