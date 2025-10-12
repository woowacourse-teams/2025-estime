/**
 * 날짜 및 시간 포맷팅 관련 유틸 함수 모음
 */
export const FormatManager = {
  /**
   * Date 객체를 'YYYY-MM-DD' 포맷의 문자열로 변환합니다.
   * @param date - 변환할 날짜 객체
   * @returns 'YYYY-MM-DD' 형식의 문자열
   */
  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = FormatManager.zeroFill2(date.getMonth() + 1);
    const dd = FormatManager.zeroFill2(date.getDate());
    return `${yyyy}-${mm}-${dd}`;
  },

  /**
   * Date 객체를 'YYYY년 MM월 DD일' 포맷의 문자열로 변환합니다.
   * @param date - 변환할 날짜 객체
   * @returns 'YYYY년 MM월 DD일' 형식의 문자열
   */
  formatKoreanDate(date: string): string {
    const newDate = new Date(date);
    const yyyy = newDate.getFullYear();
    const mm = newDate.getMonth() + 1;
    const dd = newDate.getDate();
    return `${yyyy}년 ${mm}월 ${dd}일`;
  },

  /**
   * 'HH:mm' 형식의 문자열을 [HH, mm] 형태로 파싱합니다.
   * @param timeStr - 'HH:mm' 형식의 문자열
   * @returns [HH, mm] 숫자 배열
   */
  parseHourMinute(timeStr: string): [number, number] {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return [hours, minutes];
  },

  /**
   * 시와 분 숫자를 'HH:mm' 문자열로 포맷합니다.
   * @param hours - 시 (0~23)
   * @param minutes - 분 (0~59)
   * @returns 'HH:mm' 형식의 문자열
   */
  formatHourMinute(hours: number, minutes: number): string {
    return `${FormatManager.zeroFill2(hours)}:${FormatManager.zeroFill2(minutes)}`;
  },

  /**
   * 숫자 또는 문자열을 항상 두 자릿수 문자열로 변환합니다.
   * @param value - 변환할 값 (숫자 또는 문자열)
   * @returns 앞에 0이 채워진 두 자리 문자열
   */
  zeroFill2(value: number | string): string {
    return value.toString().padStart(2, '0');
  },
  formatAvailableTimeRange(date: string, timeText: string) {
    const currentTime = new Date(`${date}T${timeText}`);
    const nextTime = new Date(currentTime);
    nextTime.setMinutes(nextTime.getMinutes() + 30);

    const timeFormat = {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    } as const;

    const currentTimeString = currentTime.toLocaleString('ko-KR', timeFormat);
    const nextTimeString = nextTime.toLocaleString('ko-KR', timeFormat);

    return {
      currentTime: currentTimeString,
      nextTime: nextTimeString,
    };
  },
};
