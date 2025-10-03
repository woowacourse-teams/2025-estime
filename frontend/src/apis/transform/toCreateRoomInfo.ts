import { CreateRoomRequestType } from '@/apis/room/type';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { CreateRoomInfoType } from '@/pages/CreateEvent/types/roomInfo';

/**
 * 클라이언트 상태(RoomInfo)를 서버 요청 형식(CreateRoomRequestType)으로 변환합니다.
 *
 * @param roomInfo - 클라이언트에서 관리하는 방 생성 정보
 * @returns 서버에 전송할 API 요청 페이로드 형식
 */
export const toCreateRoomInfo = (roomInfo: CreateRoomInfoType): CreateRoomRequestType => {
  const { title, availableDateSlots, time, deadline } = roomInfo;

  return {
    title,
    availableDateSlots: [...availableDateSlots],
    availableTimeSlots: TimeManager.generateTimeList({
      startTime: time.startTime,
      endTime: time.endTime,
      interval: 30,
    }),
    deadline: `${deadline.date}T${deadline.time}`,
  };
};
