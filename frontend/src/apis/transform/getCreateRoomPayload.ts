import { RoomInfo } from '@/hooks/useCreateRoom';
import { CreateRoomRequestType } from '../room/type';

export const getCreateRoomPayload = (roomInfo: RoomInfo): CreateRoomRequestType => {
  const { title, availableDates, time, deadLine, isPublic } = roomInfo;

  return {
    title,
    availableDates: Array.from(availableDates),
    startTime: time.startTime,
    endTime: time.endTime,
    deadLine: `${deadLine.date}T${deadLine.time}:00`,
    isPublic: isPublic === 'public',
  };
};
