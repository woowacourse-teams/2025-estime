import { useState } from 'react';

type modalTypeKey = 'login' | 'entryConfirm';

export function useModalControl() {
  const [modals, setModals] = useState<Record<modalTypeKey, boolean>>({
    login: false,
    entryConfirm: false,
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
