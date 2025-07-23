import { useState } from 'react';

const useTimePicker = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return { toggleOpen, isOpen };
};

export default useTimePicker;
