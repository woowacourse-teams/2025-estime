import { TimeManager } from '@/utils/common/TimeManager';
import { useMemo } from 'react';
interface TimeRangeField {
  timeRange: { startTime: string; endTime: string };
  setTimeRange: ({ startTime, endTime }: { startTime: string; endTime: string }) => void;
}

const useSelectTime = ({ timeRange, setTimeRange }: TimeRangeField) => {
  const endHourOptions = useMemo(() => {
    return TimeManager.filterLaterHoursFrom(timeRange.startTime);
  }, [timeRange.startTime]);

  const handleCustomStartClick = (time: string) => {
    setTimeRange({ startTime: time, endTime: timeRange.endTime });
  };

  const handleCustomEndClick = (time: string) => {
    setTimeRange({ startTime: timeRange.startTime, endTime: time });
  };

  return {
    timeRange,
    endHourOptions,
    handleCustomStartClick,
    handleCustomEndClick,
  };
};

export default useSelectTime;
