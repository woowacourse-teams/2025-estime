import { useState } from 'react';

const useSelectTime = () => {
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
        setStartTime(TIME.DAY_START);
        setEndTime(TIME.NIGHT_END);
      } else if (updatedButtons.includes('day')) {
        setStartTime(TIME.DAY_START);
        setEndTime(TIME.DAY_END);
      } else if (updatedButtons.includes('night')) {
        setStartTime(TIME.NIGHT_START);
        setEndTime(TIME.NIGHT_END);
      } else {
        setStartTime('');
        setEndTime('');
      }
    } else {
      const updatedButtons = [...filteredButtons, type];
      setSelectedButtons(updatedButtons);

      if (updatedButtons.includes('day') && updatedButtons.includes('night')) {
        setStartTime(TIME.DAY_START);
        setEndTime(TIME.NIGHT_END);
      } else if (updatedButtons.includes('day')) {
        setStartTime(TIME.DAY_START);
        setEndTime(TIME.DAY_END);
      } else if (updatedButtons.includes('night')) {
        setStartTime(TIME.NIGHT_START);
        setEndTime(TIME.NIGHT_END);
      }
    }
  };

  const handleCustomButtonClick = () => {
    setSelectedButtons(['custom']);
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
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  };
};

export default useSelectTime;
