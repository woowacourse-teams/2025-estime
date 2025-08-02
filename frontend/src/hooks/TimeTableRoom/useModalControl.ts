import { useState } from 'react';

export function useModalControl() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return {
    isLoginModalOpen,
    handleOpenLoginModal,
    handleCloseLoginModal,
  };
}
