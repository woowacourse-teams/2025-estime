import { useState } from 'react';

const useSelectTime = () => {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<('day' | 'night' | 'custom')[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleDayNightButtonClick = (type: 'day' | 'night') => {
    const filteredButtons = selectedButtons.filter((button) => button !== 'custom');

    if (selectedButtons.includes(type)) {
      //이미 선택된 상태라면 선택 해제
      const updatedButtons = filteredButtons.filter((button) => button !== type);
      setSelectedButtons(updatedButtons);

      if (updatedButtons.includes('day') && updatedButtons.includes('night')) {
        setStartTime('09:00');
        setEndTime('24:00');
      } else if (updatedButtons.includes('day')) {
        setStartTime('09:00');
        setEndTime('18:00');
      } else if (updatedButtons.includes('night')) {
        setStartTime('18:00');
        setEndTime('24:00');
      } else {
        setStartTime('');
        setEndTime('');
      }
    } else {
      const updatedButtons = [...filteredButtons, type];
      setSelectedButtons(updatedButtons);

      if (updatedButtons.includes('day') && updatedButtons.includes('night')) {
        setStartTime('09:00');
        setEndTime('24:00');
      } else if (updatedButtons.includes('day')) {
        setStartTime('09:00');
        setEndTime('18:00');
      } else if (updatedButtons.includes('night')) {
        setStartTime('18:00');
        setEndTime('24:00');
      }
    }
    setShowCustomTime(false);
  };

  const handleCustomButtonClick = () => {
    setSelectedButtons(['custom']);
    setShowCustomTime(true);
    setStartTime('');
    setEndTime('');
  };

  const handleCustomStartClick = (time: string) => {
    setStartTime(time);
  };

  const handleCustomEndClick = (time: string) => {
    setEndTime(time);
  };

  return {
    startTime,
    endTime,
    selectedButtons,
    showCustomTime,
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  };
};

export default useSelectTime;
