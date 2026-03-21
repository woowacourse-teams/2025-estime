import { getRoomInfo } from '@/pages/CreateEvent/store/createRoomStore';
import { getKoreanParticle } from '@/shared/utils/common/hangul';
import {
  hasDateSlots,
  isValidDeadline,
  isValidTimeRange,
  isValidTitle,
} from '@/shared/utils/roomValidator';

export const checkTitleReady = () => isValidTitle(getRoomInfo().title);

export const checkTimeRangeValid = () => {
  const { startTime, endTime } = getRoomInfo().time;
  return isValidTimeRange(startTime, endTime);
};

export const checkTimeReady = () => checkTimeRangeValid();

export const checkDeadlineValid = () => isValidDeadline(getRoomInfo().deadline);

export const checkCalendarReady = () => hasDateSlots(getRoomInfo().availableDateSlots);

export const checkBasicReady = () => {
  return checkTitleReady() && checkTimeReady() && checkDeadlineValid();
};

const VALIDATION_RULES = [
  { check: checkTitleReady, reason: '제목' },
  { check: checkTimeRangeValid, reason: '선택하신 시간 범위' },
  { check: checkDeadlineValid, reason: '마감일' },
  { check: checkCalendarReady, reason: '날짜 선택' },
] as const;

export const getInvalidReason = () => {
  const invalidReasons = VALIDATION_RULES.filter((rule) => !rule.check()).map(
    (rule) => rule.reason
  );
  if (invalidReasons.length === 0) return '';
  const particle = getKoreanParticle(invalidReasons.join(', '), '이/가');
  return `${invalidReasons.join(', ')}${particle} 올바르지 않습니다. 다시 입력해주세요!`;
};
