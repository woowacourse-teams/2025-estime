import { RoomInfo } from '@/types/roomInfo';
import { DateManager } from '@/utils/common/DateManager';

const { defaultTime, defaultDate } = DateManager.getDefaultDeadLine();

export const initialRoomInfo: RoomInfo = {
  title: '',
  availableDates: new Set(),
  time: {
    startTime: '00:00',
    endTime: '24:00',
  },
  deadLine: {
    date: defaultDate,
    time: defaultTime,
  },
  isPublic: 'public',
};
