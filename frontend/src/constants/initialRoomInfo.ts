import { CheckRoomInfo } from '@/apis/transform/fromParseRoomInfo';
import type { CreateRoomInfoType } from '@/pages/CreateEvent/types/roomInfo';
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

export const initialCheckRoomInfo: CheckRoomInfo = {
  title: '',
  availableSlots: [],
  availableDateSlots: new Set<string>(),
  availableTimeSlots: [],
  deadline: {
    date: defaultDate,
    time: defaultTime,
  },
  roomSession: '',
};
