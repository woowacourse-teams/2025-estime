import { RoomInfo } from '@/types/roomInfo';
import { CreateRoomRequestType } from '../room/type';

/**
 * 클라이언트 상태(RoomInfo)를 서버 요청 형식(CreateRoomRequestType)으로 변환합니다.
 *
 * @param roomInfo - 클라이언트에서 관리하는 방 생성 정보
 * @returns 서버에 전송할 API 요청 페이로드 형식
 */
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
