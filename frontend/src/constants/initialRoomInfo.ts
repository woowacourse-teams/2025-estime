import { RoomInfo } from '@/types/roomInfo';
import { DateManager } from '@/utils/common/DateManager';

const { defaultTime, defaultDate } = DateManager.getDefaultdeadline();

export const initialCreateRoomInfo: RoomInfo & { time: { startTime: string; endTime: string } } = {
  title: '',
  availableDateSlots: new Set(),
  time: {
    startTime: '00:00',
    endTime: '24:00',
  },
  deadline: {
    date: defaultDate,
    time: defaultTime,
  },
  isPublic: 'public',
};

export const initialCheckRoomInfo: RoomInfo & {
  roomSession: string;
  availableTimeSlots: string[];
} = {
  title: '',
  availableDateSlots: new Set(),
  availableTimeSlots: [],
  deadline: {
    date: defaultDate,
    time: defaultTime,
  },
  isPublic: 'public',
  roomSession: '',
};
