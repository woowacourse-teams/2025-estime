import { useState } from 'react';

const useSelectTime = () => {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [selectedButton, setSelectedButton] = useState<'day' | 'night' | 'custom' | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleDayNightButtonClick = (type: 'day' | 'night') => {
    if (type === 'day') {
      setSelectedButton('day');
      setStartTime('09:00');
      setEndTime('18:00');
    } else if (type === 'night') {
      setSelectedButton('night');
      setStartTime('18:00');
      setEndTime('24:00');
    }
  };

  const handleCustomButtonClick = () => {
    setSelectedButton('custom');
    setShowCustomTime(true);
    setStartTime('');
    setEndTime('');
  };

  const handleCustomStartClick = (time: string) => {
    setSelectedButton('custom');
    setShowCustomTime(true);
    setStartTime(time);
  };

  const handleCustomEndClick = (time: string) => {
    setSelectedButton('custom');
    setShowCustomTime(true);
    setEndTime(time);
  };

  return {
    startTime,
    endTime,
    selectedButton,
    showCustomTime,
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  };
};

export default useSelectTime;
