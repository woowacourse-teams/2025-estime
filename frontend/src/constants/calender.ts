const row = 6;
const column = 7;
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const ERROR_MESSAGE = {
  INVALID_DATE: '유효한 날짜 객체를 제공해야 합니다.',
  INVALID_MONTH: '월은 0부터 11 사이의 값이어야 합니다.',
  INVALID_YEAR: '연도는 0 이상의 값이어야 합니다.',
} as const;
export { row, column, ERROR_MESSAGE, weekdays };
