import { getRoomInfo } from '@/shared/store/createRoomStore';
import { TimeManager } from '@/shared/utils/common/TimeManager';

export const checkTimeRangeValid = () =>
  TimeManager.isValidRange(getRoomInfo().time.startTime, getRoomInfo().time.endTime);

export const checkCalendarReady = () => getRoomInfo().availableDateSlots.size > 0;

export const checkBasicReady = () => {
  return (
    getRoomInfo().title.trim() !== '' &&
    getRoomInfo().time.startTime.trim() !== '' &&
    getRoomInfo().time.endTime.trim() !== '' &&
    checkTimeRangeValid() &&
    getRoomInfo().deadline.date.trim() !== '' &&
    getRoomInfo().deadline.time.trim() !== ''
  );
};
