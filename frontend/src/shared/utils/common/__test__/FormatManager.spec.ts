import { FormatManager } from '../FormatManager';

// formatDate
describe('formatDate 함수는', () => {
  it('2025년 8월 5일 Date 객체를 "2025-08-05"으로 변환한다', () => {
    const date = new Date('2025-08-05');
    expect(FormatManager.formatDate(date)).toBe('2025-08-05');
  });
});

// parseHourMinute
describe('parseHourMinute 함수는', () => {
  it('"08:30"을 입력하면 [8, 30] 배열을 반환한다', () => {
    expect(FormatManager.parseHourMinute('08:30')).toEqual([8, 30]);
  });

  it('"00:00"을 입력하면 [0, 0] 배열을 반환한다', () => {
    expect(FormatManager.parseHourMinute('00:00')).toEqual([0, 0]);
  });

  it('"0830"처럼 잘못된 형식은 [NaN, NaN]을 반환한다', () => {
    expect(FormatManager.parseHourMinute('0830')).toEqual([830, undefined]);
  });
});

// formatHourMinute
describe('formatHourMinute 함수는', () => {
  it('8과 5를 입력하면 "08:05"를 반환한다', () => {
    expect(FormatManager.formatHourMinute(8, 5)).toBe('08:05');
  });

  it('13과 45를 입력하면 "13:45"를 반환한다', () => {
    expect(FormatManager.formatHourMinute(13, 45)).toBe('13:45');
  });

  it('0과 0을 입력하면 "00:00"을 반환한다', () => {
    expect(FormatManager.formatHourMinute(0, 0)).toBe('00:00');
  });
});

describe('zeroFill2 함수는', () => {
  it('1을 입력하면 "01"을 반환한다', () => {
    expect(FormatManager.zeroFill2(1)).toBe('01');
  });

  it('10을 입력하면 "10"을 반환한다', () => {
    expect(FormatManager.zeroFill2(10)).toBe('10');
  });

  it('0을 입력하면 "00"을 반환한다', () => {
    expect(FormatManager.zeroFill2(0)).toBe('00');
  });
});
