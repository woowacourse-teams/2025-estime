import { createChannelRoom, createRoom } from '@/apis/room/room';
import { toCreateRoomInfo } from '@/apis/transform/toCreateRoomInfo';
import { initialCreateRoomInfo } from '@/constants/initialRoomInfo';
import { RoomInfo } from '@/types/roomInfo';
import { useRef, useState } from 'react';
import { useExtractQueryParams } from './common/useExtractQueryParams';
import { TimeManager } from '@/utils/common/TimeManager';
import * as Sentry from '@sentry/react';
import { useToastContext } from '@/contexts/ToastContext';

interface checkedNotification {
  created: boolean;
  remind: boolean;
  deadline: boolean;
}

export const useCreateRoom = () => {
  const { addToast } = useToastContext();
  const submittingRef = useRef(false);

  const [roomInfo, setRoomInfo] = useState<
    RoomInfo & { time: { startTime: string; endTime: string } }
  >(initialCreateRoomInfo);

  //디스코드 관련 상태
  const { platformType, channelId } = useExtractQueryParams(['platformType', 'channelId'] as const);
  const [checkedNotification, setCheckedNotification] = useState<checkedNotification>({
    created: true,
    remind: true,
    deadline: true,
  });

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

  const notification = {
    value: checkedNotification,
    set: (id: keyof checkedNotification) =>
      setCheckedNotification((prev) => ({ ...prev, [id]: !prev[id] })),
  };

  const isCalendarReady = roomInfo.availableDateSlots.size > 0;

  const isBasicReady =
    roomInfo.title.trim() !== '' &&
    roomInfo.time.startTime.trim() !== '' &&
    isTimeRangeValid &&
    roomInfo.time.endTime.trim() !== '' &&
    roomInfo.deadline.date.trim() !== '' &&
    roomInfo.deadline.time.trim() !== '';

  // 추후 어떤 조건이 빠졌는지도 반환하는 함수 만들어도 좋을듯

  const roomInfoSubmit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const payload = toCreateRoomInfo(roomInfo);
      if (platformType && channelId) {
        const response = await createChannelRoom({
          ...payload,
          platformType: platformType as 'DISCORD' | 'SLACK',
          channelId,
          notification: checkedNotification,
        });
        return response.session;
      }
      const response = await createRoom(payload);
      return response.session;
    } catch (err) {
      const e = err as Error;
      addToast({
        type: 'error',
        message: e.message,
      });
      Sentry.captureException(err, {
        level: 'error',
      });
    } finally {
      submittingRef.current = false;
    }
  };

  return {
    platformType,
    title,
    availableDateSlots,
    time,
    deadline,
    notification,
    isCalendarReady,
    isBasicReady,
    roomInfoSubmit,
  };
};

export default useCreateRoom;
