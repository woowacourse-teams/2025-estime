import { useCallback, useState } from 'react';

const useToggleState = (defaultState = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { toggleOpen, isOpen };
};

export default useToggleState;
