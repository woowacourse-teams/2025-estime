import { useEffect, useRef, useState } from 'react';

export function useModalControl() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const modalTargetRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (modalTargetRef.current) {
      setIsSuggestModalOpen(true);
    }
  }, []);

  return {
    isLoginModalOpen,
    isSuggestModalOpen,
    handleCloseAllModal,
    handleOpenLoginModal,
    handleCloseLoginModal,
    modalTargetRef,
  };
}
