import { RoomInfo } from '@/types/roomInfo';
import { CreateRoomRequestType } from '../room/type';
import { subtract30Minutes } from '@/utils/Time/subtract30Minutes';

/**
 * 클라이언트 상태(RoomInfo)를 서버 요청 형식(CreateRoomRequestType)으로 변환합니다.
 *
 * @param roomInfo - 클라이언트에서 관리하는 방 생성 정보
 * @returns 서버에 전송할 API 요청 페이로드 형식
 */
export const toCreateRoomInfo = (roomInfo: RoomInfo): CreateRoomRequestType => {
  const { title, availableDates, time, deadLine, isPublic } = roomInfo;

  const sortedAvailableDates = Array.from(availableDates).sort();

  return {
    title,
    availableDates: sortedAvailableDates,
    startTime: time.startTime,
    endTime: subtract30Minutes(time.endTime),
    deadLine: `${deadLine.date}T${subtract30Minutes(deadLine.time)}`,
    isPublic: isPublic === 'public',
  };
};
