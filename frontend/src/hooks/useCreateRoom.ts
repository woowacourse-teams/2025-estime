import { useState } from 'react';

interface RoomInfo {
  title: string;
  availableDates: Set<string>;
  time: { startTime: string; endTime: string };
  deadLine: string;
  isPublic: boolean;
  roomSession?: string;
}

const initialRoomInfo: RoomInfo = {
  title: '',
  availableDates: new Set(),
  time: {
    startTime: '',
    endTime: '',
  },
  deadLine: '',
  isPublic: true,
  roomSession: '',
};

export const useCreateRoom = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(initialRoomInfo);

  const title = {
    value: roomInfo.title,
    set: (title: string) => setRoomInfo((prev) => ({ ...prev, title })),
  };

  const availableDates = {
    value: roomInfo.availableDates,
    set: (availableDates: Set<string>) => setRoomInfo((prev) => ({ ...prev, availableDates })),
  };

  const time = {
    value: roomInfo.time,
    set: ({ startTime, endTime }: { startTime: string; endTime: string }) =>
      setRoomInfo((prev) => ({ ...prev, time: { startTime, endTime } })),
  };

  const deadline = {
    value: roomInfo.deadLine,
    set: (deadLine: string) => setRoomInfo((prev) => ({ ...prev, deadLine })),
  };

  const isPublic = {
    value: roomInfo.isPublic,
    set: (isPublic: boolean) => setRoomInfo((prev) => ({ ...prev, isPublic })),
  };

  return {
    title,
    availableDates,
    time,
    deadline,
    isPublic,
  };
};

export default useCreateRoom;
