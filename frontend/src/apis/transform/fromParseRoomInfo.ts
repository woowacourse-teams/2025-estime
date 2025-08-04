import type { RoomInfo } from '@/types/roomInfo';
import type { GetRoomInfoResponseType } from '../room/type';
import { add30Minutes } from '@/utils/Time/add30Minutes';

/**
 * 서버에서 받은 방 정보를 클라이언트 상태(RoomInfo) 형식으로 변환합니다.
 *
 * @param data - 서버 응답으로 받은 CreateRoomRequestType 데이터
 * @returns 클라이언트에서 사용할 RoomInfo 상태 객체
 */
export const fromParseRoomInfo = (
  data: GetRoomInfoResponseType
): RoomInfo & { roomSession: string } => {
  const { title, availableDates, startTime, endTime, deadLine, isPublic, roomSession } = data;

  const [date, time] = deadLine.split('T');
  const calculatedEndTime = add30Minutes(endTime);

  return {
    title,
    availableDates: new Set(availableDates),
    time: {
      startTime,
      endTime: calculatedEndTime,
    },
    deadLine: {
      date,
      time,
    },
    isPublic: isPublic ? 'public' : 'private',
    roomSession,
  };
};
