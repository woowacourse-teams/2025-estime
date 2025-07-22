import { TIME } from '@/constants/time';
import { useCallback, useState } from 'react';

interface TimeRangeField {
  timeRange: { startTime: string; endTime: string };
  setTimeRange: ({ startTime, endTime }: { startTime: string; endTime: string }) => void;
}

const useSelectTime = ({ timeRange, setTimeRange }: TimeRangeField) => {
  const [selectedButtons, setSelectedButtons] = useState<('day' | 'night' | 'custom')[]>([]);

  const handleDayNightButtonClick = useCallback(
    (type: 'day' | 'night') => {
      const filteredButtons = selectedButtons.filter((button) => button !== 'custom');

      const updatedButtons = selectedButtons.includes(type)
        ? filteredButtons.filter((button) => button !== type)
        : [...filteredButtons, type];

      setSelectedButtons(updatedButtons);

      if (updatedButtons.includes('day') && updatedButtons.includes('night')) {
        setTimeRange({ startTime: TIME.DAY_START, endTime: TIME.NIGHT_END });
      } else if (updatedButtons.includes('day')) {
        setTimeRange({ startTime: TIME.DAY_START, endTime: TIME.DAY_END });
      } else if (updatedButtons.includes('night')) {
        setTimeRange({ startTime: TIME.NIGHT_START, endTime: TIME.NIGHT_END });
      } else {
        setTimeRange({ startTime: '', endTime: '' });
      }
    },
    [selectedButtons]
  );

  const handleCustomButtonClick = () => {
    setSelectedButtons(['custom']);
    setTimeRange({ startTime: '', endTime: '' });
  };

  const handleCustomStartClick = (time: string) => {
    setTimeRange({ startTime: time, endTime: timeRange.endTime });
  };

  const handleCustomEndClick = (time: string) => {
    setTimeRange({ startTime: timeRange.startTime, endTime: time });
  };

  return {
    timeRange,
    selectedButtons,
    handleDayNightButtonClick,
    handleCustomButtonClick,
    handleCustomStartClick,
    handleCustomEndClick,
  };
};

export default useSelectTime;
