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
  /**
   * 슬롯 코드를 ISO 8601 형식의 날짜/시간 문자열로 디코딩합니다.
   *
   * 슬롯 코드는 16비트 정수로 인코딩된 값으로:
   * - 상위 8비트: EPOCH(2025-10-24)로부터 경과한 일수
   * - 하위 8비트: 30분 단위 시간 슬롯 인덱스 (0 = 00:00, 1 = 00:30, ...)
   *
   * @param slotCode - 인코딩된 슬롯 코드 (예: 17426 = 2025-12-31 09:00)
   * @returns 'YYYY-MM-DDTHH:mm' 형식의 ISO 8601 문자열
   *
   * @example
   * FormatManager.decodeSlotCode(17426) // "2025-12-31T09:00"
   */
  decodeSlotCode(slotCode: number): string {
    const EPOCH = new Date('2025-10-24T00:00:00Z');
    const SLOT_INTERVAL_MINUTES = 30;

    const days = slotCode >> 8;
    const timeSlotIndex = slotCode & 0xff;

    const targetDate = new Date(EPOCH);
    targetDate.setUTCDate(targetDate.getUTCDate() + days);

    const totalMinutes = timeSlotIndex * SLOT_INTERVAL_MINUTES;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    targetDate.setUTCHours(hours, minutes, 0, 0);

    return targetDate.toISOString().slice(0, 16);
  },

  /**
   * ISO 8601 형식의 날짜/시간 문자열을 슬롯 코드로 인코딩합니다.
   *
   * @param dateTimeSlot - 'YYYY-MM-DDTHH:mm' 형식의 ISO 8601 문자열
   * @returns 인코딩된 슬롯 코드 (16비트 정수)
   *
   * @example
   * FormatManager.encodeSlotCode("2025-12-31T09:00") // 17426
   */
  encodeSlotCode(dateTimeSlot: string): number {
    const EPOCH = new Date('2025-10-24T00:00:00Z');
    const SLOT_INTERVAL_MINUTES = 30;

    // 🔥 UTC로 파싱 (끝에 'Z' 추가)
    const targetDate = new Date(dateTimeSlot + 'Z');

    // EPOCH로부터 경과한 일수 계산
    const diffMs = targetDate.getTime() - EPOCH.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // 🔥 UTC 시간 사용
    const hours = targetDate.getUTCHours();
    const minutes = targetDate.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;
    const timeSlotIndex = Math.floor(totalMinutes / SLOT_INTERVAL_MINUTES);

    return (days << 8) | timeSlotIndex;
  },
};
