import { useCallback, useState } from 'react';

const useToggleState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { toggleOpen, isOpen };
};

export default useToggleState;
