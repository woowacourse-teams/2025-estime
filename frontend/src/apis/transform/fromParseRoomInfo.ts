import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { GetRoomInfoResponseType } from '../room/type';

/**
 * 서버에서 받은 방 정보를 클라이언트 상태(RoomInfo) 형식으로 변환합니다.
 *
 * @param data - 서버 응답으로 받은 CreateRoomRequestType 데이터
 * @returns 클라이언트에서 사용할 RoomInfo 상태 객체
 */
export const fromParseRoomInfo = (
  data: GetRoomInfoResponseType
): RoomInfo & { roomSession: string; availableTimeSlots: string[] } => {
  const { title, availableDateSlots, availableTimeSlots, deadline, roomSession } = data;

  const [date, time] = deadline.split('T');

  return {
    title,
    availableDateSlots: new Set(availableDateSlots),
    availableTimeSlots,
    deadline: {
      date,
      time,
    },
    roomSession,
  };
};
