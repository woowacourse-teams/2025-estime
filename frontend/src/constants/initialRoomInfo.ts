import { RoomInfo } from '@/types/roomInfo';
import { DateManager } from '@/utils/common/DateManager';

const { defaultTime, defaultDate } = DateManager.getDefaultDeadLine();

export const initialRoomInfo: RoomInfo = {
  title: '',
  availableDates: new Set(),
  time: {
    startTime: '',
    endTime: '',
  },
  deadLine: {
    date: defaultDate,
    time: defaultTime,
  },
  isPublic: 'public',
};
