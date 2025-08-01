import { useState } from 'react';

export function useModalControl() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  const handleCloseAllModal = () => {
    setIsLoginModalOpen(false);
    setIsSuggestModalOpen(false);
  };
  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  return {
    isLoginModalOpen,
    isSuggestModalOpen,
    handleCloseAllModal,
    handleOpenLoginModal,
    handleCloseLoginModal,
  };
}
