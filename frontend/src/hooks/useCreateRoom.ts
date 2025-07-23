import { createRoom } from '@/apis/room/room';
import { getCreateRoomPayload } from '@/apis/transform/getCreateRoomPayload';
import { initialRoomInfo } from '@/constants/initialRoomInfo';
import { RoomInfo } from '@/types/roomInfo';
import { useState } from 'react';

export const useCreateRoom = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(initialRoomInfo);

  const isTimeRangeValid = checkTimeRangeValid({
    startTime: roomInfo.time.startTime,
    endTime: roomInfo.time.endTime,
  });

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
    valid: isTimeRangeValid,
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
    isTimeRangeValid &&
    roomInfo.time.endTime.trim() !== '' &&
    roomInfo.deadLine.date.trim() !== '' &&
    roomInfo.deadLine.time.trim() !== '';

  // 추후 어떤 조건이 빠졌는지도 반환하는 함수 만들어도 좋을듯

  const roomInfoSubmit = async () => {
    try {
      const payload = getCreateRoomPayload(roomInfo);
      const response = await createRoom(payload);
      return response.session;
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
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
