import { RoomInfo } from '@/types/roomInfo';

export const initialRoomInfo: RoomInfo = {
  title: '',
  availableDates: new Set(),
  time: {
    startTime: '',
    endTime: '',
  },
  deadLine: {
    date: '2025-07-25',
    time: '16:00',
  },
  isPublic: 'public',
  roomSession: '',
};
