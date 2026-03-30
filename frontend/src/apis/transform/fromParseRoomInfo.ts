import { GetRoomInfoResponseTypeV3 } from '../room/type';
import { FormatManager } from '@/shared/utils/common/FormatManager';

export type CheckRoomInfo = {
  title: string;
  availableSlots: number[];
  availableDateSlots: Set<string>;
  availableTimeSlots: string[];
  deadline: { date: string; time: string };
  roomSession: string;
};

export const fromParseRoomInfo = (data: GetRoomInfoResponseTypeV3): CheckRoomInfo => {
  const { title, availableSlots, deadline, roomSession } = data;

  const { availableDateSlots, availableTimeSlots } = FormatManager.populateGridAxes(availableSlots);

  const { date, time } = FormatManager.parseDeadline(deadline);

  return {
    title,
    availableSlots,
    availableDateSlots,
    availableTimeSlots,
    deadline: { date, time },
    roomSession,
  };
};
