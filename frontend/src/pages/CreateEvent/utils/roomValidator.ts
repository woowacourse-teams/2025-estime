import { DateManager } from '@/shared/utils/common/DateManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';

export const isValidTitle = (title: string) => title.trim() !== '';

export const isValidTimeRange = (startTime: string, endTime: string) =>
  startTime.trim() !== '' && endTime.trim() !== '' && TimeManager.isValidRange(startTime, endTime);

export const isValidDeadline = (deadline: { date: string; time: string }) =>
  deadline.date.trim() !== '' &&
  deadline.time.trim() !== '' &&
  !DateManager.IsPastDeadline(deadline);

export const hasDateSlots = (availableDateSlots: Set<any>) => availableDateSlots.size > 0;
