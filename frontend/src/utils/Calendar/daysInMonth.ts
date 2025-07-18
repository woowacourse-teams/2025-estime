export function daysInMonth(year: number, month: number): number {
  if (month < 0 || month > 11) {
    throw new Error('월은 0부터 11 사이의 값이어야 합니다.');
  }
  if (year < 0) {
    throw new Error('연도는 0 이상의 값이어야 합니다.');
  }
  return new Date(year, month + 1, 0).getDate();
}
