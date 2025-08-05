import { DEFAULT_HOUR_OPTIONS } from '@/constants/defaultHourOptions';
import { FormatManager } from './FormatManager';

const MINUTES_PER_HOUR = 60;

/**
 * 시간 관련 유틸 함수 모음
 */
export const TimeManager = {
  /**
   * 분 단위 값을 [시, 분] 배열로 변환합니다.
   * @param totalMinutes - 총 분 수
   * @returns [시, 분] 형태의 튜플
   */
  toHourMinute(totalMinutes: number): [number, number] {
    const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    const minutes = totalMinutes % MINUTES_PER_HOUR;
    return [hours, minutes];
  },

  /**
   * 'HH:mm' 형식의 시간 문자열에 분 단위 값을 더한 결과를 반환합니다.
   * @param timeStr - 기준 시간 (예: '13:30')
   * @param delta - 더하거나 뺄 분 단위 숫자 (음수 가능)
   * @returns 변경된 'HH:mm' 형식의 시간 문자열
   */
  addMinutes(timeStr: string, delta: number): string {
    const [hours, minutes] = FormatManager.parseHourMinute(timeStr);
    let totalMinutes = hours * MINUTES_PER_HOUR + minutes + delta;

    totalMinutes = (totalMinutes + 1440) % 1440;

    const [newHours, newMinutes] = TimeManager.toHourMinute(totalMinutes);

    return FormatManager.formatHourMinute(newHours, newMinutes);
  },

  /**
   * 'HH:mm' 형식의 시간 문자열에서 분 단위 값을 뺀 결과를 반환합니다.
   * @param timeStr - 기준 시간 (예: '13:30')
   * @param delta - 뺄 분 단위 숫자 (양수만 전달됨)
   * @returns 변경된 'HH:mm' 형식의 시간 문자열
   */
  subtractMinutes(timeStr: string, delta: number): string {
    return TimeManager.addMinutes(timeStr, -delta);
  },

  /**
   * 주어진 시작~종료 시간 범위 내에서 일정 간격마다 시간 리스트를 생성합니다.
   * @param params - 시간 생성 조건
   * @param params.startTimeInMinutes - 시작 시간 (분 단위)
   * @param params.endTimeInMinutes - 종료 시간 (분 단위)
   * @param params.interval - 간격 (분 단위)
   * @returns 시간 텍스트와 정시 여부를 포함한 리스트
   */
  generateTimeList({
    startTimeInMinutes,
    endTimeInMinutes,
    interval,
  }: {
    startTimeInMinutes: number;
    endTimeInMinutes: number;
    interval: number;
  }): { timeText: string; isHour: boolean }[] {
    const timeList = [];

    for (let i = startTimeInMinutes; i < endTimeInMinutes; i += interval) {
      const [hour, minute] = TimeManager.toHourMinute(i);
      const timeText = FormatManager.formatHourMinute(hour, minute);
      timeList.push({ timeText, isHour: minute === 0 });
    }

    return timeList;
  },

  /**
   * 주어진 시작 시간과 종료 시간 문자열을 비교하여 유효한 시간 범위인지 확인합니다.
   * (종료 시간이 시작 시간보다 나중이어야 유효)
   * @param startTime - 시작 시간 ('HH:mm')
   * @param endTime - 종료 시간 ('HH:mm')
   * @returns 유효한 범위면 true, 그렇지 않으면 false
   */
  isValidRange(startTime: string, endTime: string): boolean {
    const [sh, sm] = FormatManager.parseHourMinute(startTime);
    const [eh, em] = FormatManager.parseHourMinute(endTime);
    return eh * MINUTES_PER_HOUR + em > sh * MINUTES_PER_HOUR + sm;
  },

  /**
   * 기준 시간보다 이후 시각만 필터링합니다.
   */
  filterLaterHoursFrom(timeStr: string): string[] {
    const [startHour] = FormatManager.parseHourMinute(timeStr);

    return DEFAULT_HOUR_OPTIONS.filter((option) => {
      const [optionHour] = FormatManager.parseHourMinute(option);
      return optionHour > startHour;
    });
  },

  /**
   * 기준 시간보다 이전 시각만 필터링합니다.
   */
  filterEarlierHoursUntil(timeStr: string): string[] {
    const [endHour] = FormatManager.parseHourMinute(timeStr);

    return DEFAULT_HOUR_OPTIONS.filter((option) => {
      const [optionHour] = FormatManager.parseHourMinute(option);
      return optionHour < endHour;
    });
  },

  /**
   * 주어진 마감일이 오늘인 경우, 해당 시간 이후의 옵션만 반환합니다.
   * 오늘이 아니면 전체 옵션을 반환합니다.
   */
  filterHourOptions(deadline: { date: string; time: string }): string[] {
    const { date, time } = deadline;

    const today = FormatManager.formatDate(new Date());

    if (date !== today) return DEFAULT_HOUR_OPTIONS;

    const [targetHour] = FormatManager.parseHourMinute(time);

    return DEFAULT_HOUR_OPTIONS.filter((option) => {
      const [optionHour] = FormatManager.parseHourMinute(option);
      return targetHour < optionHour;
    });
  },
};
