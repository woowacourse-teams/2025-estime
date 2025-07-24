import { RoomInfo } from '@/types/roomInfo';
import { getDefaultDeadLine } from '@/utils/getDefaultDeadLine';

const { defaultTime, defaultDate } = getDefaultDeadLine();

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
  roomSession: '',
};
