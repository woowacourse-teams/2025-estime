import React, { useState } from 'react';

const useTimePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string>('');

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const selectHour = (hour: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHour(hour);
    setIsOpen(false);
  };

  return { selectedHour, selectHour, toggleOpen, isOpen };
};

export default useTimePicker;
