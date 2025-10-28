import { getRoomInfo } from '@/pages/CreateEvent/store/createRoomStore';
import { DateManager } from '@/shared/utils/common/DateManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';

export const checkTimeRangeValid = () =>
  TimeManager.isValidRange(getRoomInfo().time.startTime, getRoomInfo().time.endTime);

export const checkDeadlineValid = () =>
  getRoomInfo().deadline.date.trim() !== '' &&
  getRoomInfo().deadline.time.trim() !== '' &&
  !DateManager.IsPastDeadline(getRoomInfo().deadline);

export const checkCalendarReady = () => getRoomInfo().availableDateSlots.size > 0;

export const checkTitleReady = () => getRoomInfo().title.trim() !== '';

export const checkTimeReady = () =>
  getRoomInfo().time.startTime.trim() !== '' &&
  getRoomInfo().time.endTime.trim() !== '' &&
  checkTimeRangeValid();

export const checkBasicReady = () => {
  return checkTitleReady() && checkTimeReady() && checkDeadlineValid();
};

const VALIDATION_RULES = [
  { check: checkTitleReady, reason: '제목' },
  { check: checkTimeRangeValid, reason: '선택하신 시간 범위' },
  { check: checkDeadlineValid, reason: '마감일' },
  { check: checkCalendarReady, reason: '날짜 선택' },
] as const;

const getKoreanParticle = (word: string, withJongseong = '이', withoutJongseong = '가') => {
  const lastChar = word.charCodeAt(word.length - 1);
  const jongseongIndex = (lastChar - 0xac00) % 28;

  return jongseongIndex !== 0 ? withJongseong : withoutJongseong;
};

export const getInvalidReason = () => {
  const invalidReasons = VALIDATION_RULES.filter((rule) => !rule.check()).map(
    (rule) => rule.reason
  );
  if (invalidReasons.length === 0) return '';
  const particle = getKoreanParticle(invalidReasons.join(', '), '이', '가');
  return `${invalidReasons.join(', ')}${particle} 올바르지 않습니다. 다시 입력해주세요!`;
};
