import type { CreateRoomInfoType, RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { DateManager } from '@/shared/utils/common/DateManager';

const { defaultTime, defaultDate } = DateManager.getDefaultDeadline();

export const initialCreateRoomInfo: CreateRoomInfoType = {
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
  roomSession: '',
};
