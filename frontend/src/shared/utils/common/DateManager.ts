import { FormatManager } from './FormatManager';

const DAY_LENGTH = 7;

/**
 * 날짜 관련 유틸 함수 모음
 */
export const DateManager = {
  // 월

  /**
   * 특정 연도와 월의 마지막 날짜(일 수)를 반환합니다.
   * @param year - 연도 (예: 2025)
   * @param month - 월 (0부터 시작, 0 = 1월)
   * @returns 해당 월의 총 일 수
   */
  daysInMonth(year: number, month: number): number {
    if (month < 0 || month > 11) throw new Error('월은 0부터 11 사이의 값이어야 합니다.');
    if (year < 0) throw new Error('연도는 0 이상의 값이어야 합니다.');

    return new Date(year, month + 1, 0).getDate();
  },

  /**
   * 두 날짜가 같은 월에 속하는지 확인합니다.
   * @param day - 비교할 날짜
   * @param today - 기준 날짜
   * @returns 같은 월이면 true
   */
  isCurrentMonth(day: Date | null, today: Date): boolean {
    return (
      !!day && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()
    );
  },

  // 일
  /**
   * 두 날짜가 같은 날인지 확인합니다.
   * @param a - 첫 번째 날짜
   * @param b - 두 번째 날짜
   * @returns 연, 월, 일이 모두 같으면 true
   */
  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  },

  /**
   * 주어진 날짜가 오늘인지 확인합니다.
   * @param day - 확인할 날짜
   * @param today - 오늘 날짜
   * @returns 오늘이면 true
   */
  isToday(day: Date | null, today: Date): boolean {
    return !!day && DateManager.isSameDay(day, today);
  },

  /**
   * 주어진 날짜가 오늘 이전인지 확인합니다.
   * @param day - 비교할 날짜
   * @param today - 오늘 날짜
   * @returns 과거이면 true
   */
  isPast(day: Date | null, today: Date): boolean {
    return !!day && !DateManager.isToday(day, today) && day < today;
  },

  //요일

  /**
   * 문자열 날짜의 요일을 반환합니다.
   * @param dateStr - 'YYYY-MM-DD' 형식의 날짜 문자열
   * @returns '일', '월', '화', '수', '목', '금', '토' 중 하나
   */
  getDayOfWeek(dateStr: string): string {
    return ['일', '월', '화', '수', '목', '금', '토'][new Date(dateStr).getDay()];
  },

  //기타

  /**
   * 기본 마감 기한으로 사용할 내일 날짜와 시각을 반환합니다.
   * @returns 'YYYY-MM-DD'와 'HH:00' 형식의 문자열 객체
   */
  getDefaultDeadline(): { defaultDate: string; defaultTime: string } {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultDate = FormatManager.formatDate(tomorrow);
    const defaultTime = FormatManager.formatHourMinute(tomorrow.getHours(), 0);

    return { defaultDate, defaultTime };
  },

  /**
   * 선택된 날짜 수가 최대치(7개)에 도달했는지 확인합니다.
   * @param selectedDates - 선택된 날짜 Set
   * @returns 7개 이상이면 true
   */
  hasReachedMaxSelection(selectedDates: Set<string>): boolean {
    return selectedDates.size === DAY_LENGTH;
  },

  /**
   * 선택된 날짜가 7개에 도달했고, 현재 날짜가 아직 선택되지 않은 경우 제한 여부를 반환합니다.
   * @param date - 확인할 날짜
   * @param selectedDates - 선택된 날짜 Set
   * @returns 선택 제한 상태이면 true
   */
  isDateBlockedByLimit(date: Date | null, selectedDates: Set<string>): boolean {
    if (!date) return false;
    const dateStr = FormatManager.formatDate(date);
    return DateManager.hasReachedMaxSelection(selectedDates) && !selectedDates.has(dateStr);
  },
  /**
   * 시간, 날짜 문자열을 ISO 형식으로 변환후 Date 객체로 변환합니다.
   * @param date - 확인할 날짜
   * @param time - 확인할 시간 (HH:mm 형식)
   * @returns Date 객체
   */
  ISOTimeStringToDate(date: string, time: string): Date {
    return new Date(date + 'T' + time);
  },

  IsPastDeadline(deadline: { date: string; time: string }, now: Date = new Date()): boolean {
    const deadlineDate = DateManager.ISOTimeStringToDate(deadline.date, deadline.time);
    return now >= deadlineDate;
  },
};
