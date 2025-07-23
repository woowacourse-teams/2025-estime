import { useState } from 'react';

interface RoomInfo {
  title: string;
  availableDates: Set<string>;
  time: { startTime: string; endTime: string };
  deadLine: { date: string; time: string };
  isPublic: 'public' | 'private';
  roomSession?: string;
}

const initialRoomInfo: RoomInfo = {
  title: '',
  availableDates: new Set(),
  time: {
    startTime: '',
    endTime: '',
  },
  deadLine: {
    date: '2025-07-23',
    time: '16:00',
  },
  isPublic: 'public',
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

  const deadLine = {
    value: roomInfo.deadLine,
    set: ({ date, time }: { date: string; time: string }) =>
      setRoomInfo((prev) => ({ ...prev, deadLine: { date, time } })),
  };

  const isPublic = {
    value: roomInfo.isPublic,
    set: (isPublic: 'public' | 'private') => setRoomInfo((prev) => ({ ...prev, isPublic })),
  };

  const isReadyToCreateRoom =
    roomInfo.title.trim() !== '' &&
    roomInfo.availableDates.size > 0 &&
    roomInfo.time.startTime.trim() !== '' &&
    roomInfo.time.endTime.trim() !== '' &&
    roomInfo.deadLine.date.trim() !== '' &&
    roomInfo.deadLine.time.trim() !== '';

  // 추후 어떤 조건이 빠졌는지도 반환하는 함수 만들어도 좋을듯

  const roomInfoSubmit = () => {
    console.log(roomInfo);
  };

  return {
    title,
    availableDates,
    time,
    deadLine,
    isPublic,
    isReadyToCreateRoom,
    roomInfoSubmit,
  };
};

export default useCreateRoom;
