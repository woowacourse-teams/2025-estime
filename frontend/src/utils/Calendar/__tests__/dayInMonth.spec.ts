import { DateManager } from '@/utils/DateManager';

describe('dayInMonth는', () => {
  describe('성공 케이스', () => {
    it('1월 1일을 입력하면 31을 반환한다', () => {
      expect(DateManager.daysInMonth(2023, 0)).toBe(31);
    });
    it('3월 1일을 입력하면 31을 반환한다', () => {
      expect(DateManager.daysInMonth(2023, 2)).toBe(31);
    });
    it('2023년 2월 1일을 입력하면 28을 반환한다', () => {
      expect(DateManager.daysInMonth(2023, 1)).toBe(28);
    });
    it('2024년 2월 1일을 입력하면 29을 반환한다 (윤년)', () => {
      expect(DateManager.daysInMonth(2024, 1)).toBe(29);
    });
  });
  describe('실패 케이스', () => {
    it('월이 0 미만이면 에러를 던진다', () => {
      expect(() => DateManager.daysInMonth(2023, -1)).toThrow(
        '월은 0부터 11 사이의 값이어야 합니다.'
      );
    });
    it('월이 11 초과이면 에러를 던진다', () => {
      expect(() => DateManager.daysInMonth(2023, 12)).toThrow(
        '월은 0부터 11 사이의 값이어야 합니다.'
      );
    });
    it('연도가 0 미만이면 에러를 던진다', () => {
      expect(() => DateManager.daysInMonth(-1, 0)).toThrow('연도는 0 이상의 값이어야 합니다.');
    });
  });
});
