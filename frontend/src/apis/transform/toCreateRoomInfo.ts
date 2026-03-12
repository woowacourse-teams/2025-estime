import { CreateRoomRequestType, CreateRoomRequestTypeV3 } from '@/apis/room/type';

export type CreateRoomPayloadV3 = {
  payload: CreateRoomRequestTypeV3;
  isPastSelected: boolean;
};
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { FormatManager } from '@/shared/utils/common/FormatManager';
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

/**
 * 클라이언트 상태(RoomInfo)를 v3 서버 요청 형식(CreateRoomRequestTypeV3)으로 변환합니다.
 * availableDateSlots + availableTimeSlots를 슬롯 코드 배열로 통합합니다.
 *
 * @param roomInfo - 클라이언트에서 관리하는 방 생성 정보
 * @returns v3 서버에 전송할 API 요청 페이로드 형식
 */
export const toCreateRoomInfoV3 = (
  roomInfo: CreateRoomInfoType,
  now = Date.now()
): CreateRoomPayloadV3 => {
  const { title, availableDateSlots, time, deadline } = roomInfo;

  const timeList = TimeManager.generateTimeList({
    startTime: time.startTime,
    endTime: time.endTime,
    interval: 30,
  });

  const availableSlots: number[] = [];
  let isPastSelected = false;

  for (const date of availableDateSlots) {
    for (const t of timeList) {
      const dateTimeStr = `${date}T${t}`;
      if (new Date(dateTimeStr + 'Z').getTime() > now) {
        availableSlots.push(FormatManager.encodeSlotCode(dateTimeStr));
      } else {
        isPastSelected = true;
      }
    }
  }

  return {
    payload: {
      title,
      availableSlots,
      deadline: `${deadline.date}T${deadline.time}:00Z`,
    },
    isPastSelected,
  };
};
