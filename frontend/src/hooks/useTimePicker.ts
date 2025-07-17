import React, { useState } from 'react';

const useTimePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const selectHour = (hour: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHour(hour);
    setIsOpen(false);
  };

  const selectMinute = (minute: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMinute(minute);
    setIsOpen(false);
  };

  return { selectedHour, selectedMinute, selectHour, selectMinute, toggleOpen, isOpen };
};

export default useTimePicker;
