import { createChannelRoom, createRoom } from '@/apis/room/room';
import { toCreateRoomInfo } from '@/apis/transform/toCreateRoomInfo';
import { initialCreateRoomInfo } from '@/constants/initialRoomInfo';
import { RoomInfo } from '@/types/roomInfo';
import { useState } from 'react';
import { useExtractQueryParams } from './common/useExtractQueryParams';
import { TimeManager } from '@/utils/common/TimeManager';

export const useCreateRoom = () => {
  const { platform, channelId } = useExtractQueryParams(['platform', 'channelId'] as const);
  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { time: { startTime: string; endTime: string } }
  >(initialCreateRoomInfo);

  const isTimeRangeValid = TimeManager.isValidRange(roomInfo.time.startTime, roomInfo.time.endTime);

  const title = {
    value: roomInfo.title,
    set: (title: string) => setRoomInfo((prev) => ({ ...prev, title })),
  };

  const availableDateSlots = {
    value: roomInfo.availableDateSlots,
    set: (availableDateSlots: Set<string>) =>
      setRoomInfo((prev) => ({ ...prev, availableDateSlots })),
  };

  const time = {
    value: roomInfo.time,
    valid: isTimeRangeValid,
    set: ({ startTime, endTime }: { startTime: string; endTime: string }) =>
      setRoomInfo((prev) => ({ ...prev, time: { startTime, endTime } })),
  };

  const deadline = {
    value: roomInfo.deadline,
    set: ({ date, time }: { date: string; time: string }) =>
      setRoomInfo((prev) => ({ ...prev, deadline: { date, time } })),
  };

  const isPublic = {
    value: roomInfo.isPublic,
    set: (isPublic: 'public' | 'private') => setRoomInfo((prev) => ({ ...prev, isPublic })),
  };

  const isReadyToCreateRoom =
    roomInfo.title.trim() !== '' &&
    roomInfo.availableDateSlots.size > 0 &&
    roomInfo.time.startTime.trim() !== '' &&
    isTimeRangeValid &&
    roomInfo.time.endTime.trim() !== '' &&
    roomInfo.deadline.date.trim() !== '' &&
    roomInfo.deadline.time.trim() !== '';

  // 추후 어떤 조건이 빠졌는지도 반환하는 함수 만들어도 좋을듯

  const roomInfoSubmit = async () => {
    try {
      const payload = toCreateRoomInfo(roomInfo);
      if (platform && channelId) {
        const response = await createChannelRoom({
          ...payload,
          platform: platform as 'DISCORD' | 'SLACK',
          channelId,
        });
        return response.session;
      }
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
    availableDateSlots,
    time,
    deadline,
    isPublic,
    isReadyToCreateRoom,
    roomInfoSubmit,
  };
};

export default useCreateRoom;
