import { DateManager } from '../DateManager';

// dayInMonth 함수
describe('dayInMonth 함수는', () => {
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

// isItCurrentMonth 함수
describe('isItCurrentMonth 함수는', () => {
  const today = new Date('2025-08-05');

  describe('성공 케이스', () => {
    it('연도와 월이 같으면 true를 반환한다', () => {
      const day = new Date('2025-08-06');
      expect(DateManager.isCurrentMonth(day, today)).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('월은 같지만 연도가 다르면 false를 반환한다', () => {
      const day = new Date('2024-08-06');
      expect(DateManager.isCurrentMonth(day, today)).toBe(false);
    });

    it('연도는 같지만 월이 다르면 false를 반환한다', () => {
      const day = new Date('2025-07-05');
      expect(DateManager.isCurrentMonth(day, today)).toBe(false);
    });

    it('day가 null이면 false를 반환한다', () => {
      expect(DateManager.isCurrentMonth(null, today)).toBe(false);
    });
  });
});

// isSameDay 함수
describe('isSameDay 함수는', () => {
  const today = new Date('2025-08-05');

  describe('성공 케이스', () => {
    it('연도와 월과 일이 모두 같으면 true를 반환한다', () => {
      const day = new Date('2025-08-05');
      expect(DateManager.isSameDay(day, today)).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('월과 일은 같지만 연도가 다르면 false를 반환한다', () => {
      const day = new Date('2024-08-05');
      expect(DateManager.isSameDay(day, today)).toBe(false);
    });

    it('연도와 일은 같지만 월이 다르면 false를 반환한다', () => {
      const day = new Date('2025-07-05');
      expect(DateManager.isSameDay(day, today)).toBe(false);
    });

    it('연도와 월은 같지만 일이 다르면 false를 반환한다', () => {
      const day = new Date('2025-08-06');
      expect(DateManager.isSameDay(day, today)).toBe(false);
    });
  });
});

// isToday 함수
describe('isToday 함수는', () => {
  const today = new Date('2025-08-05');

  describe('성공 케이스', () => {
    it('연도와 월과 일이 같으면 true를 반환한다', () => {
      const day = new Date('2025-08-05');
      expect(DateManager.isToday(day, today)).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('월과 일은 같지만 연도가 다르면 false를 반환한다', () => {
      const day = new Date('2024-08-05');
      expect(DateManager.isToday(day, today)).toBe(false);
    });

    it('연도와 일은 같지만 월이 다르면 false를 반환한다', () => {
      const day = new Date('2025-07-05');
      expect(DateManager.isToday(day, today)).toBe(false);
    });

    it('연도와 월은 같지만 일이 다르면 false를 반환한다', () => {
      const day = new Date('2025-08-06');
      expect(DateManager.isToday(day, today)).toBe(false);
    });

    it('day가 null이면 false를 반환한다', () => {
      expect(DateManager.isToday(null, today)).toBe(false);
    });
  });
});

// isPast 함수
describe('isPast 함수는', () => {
  const today = new Date('2025-08-05');

  describe('성공 케이스', () => {
    it('연도가 이전이면 true를 반환한다', () => {
      const day = new Date('2024-08-05');
      expect(DateManager.isPast(day, today)).toBe(true);
    });

    it('월이 이전이면 true를 반환한다', () => {
      const day = new Date('2025-07-05');
      expect(DateManager.isPast(day, today)).toBe(true);
    });

    it('일이 이전이면 true를 반환한다', () => {
      const day = new Date('2025-08-04');
      expect(DateManager.isPast(day, today)).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('연도가 이후이면 false를 반환한다', () => {
      const day = new Date('2026-08-05');
      expect(DateManager.isPast(day, today)).toBe(false);
    });

    it('월이 이후이면 true를 반환한다', () => {
      const day = new Date('2025-09-05');
      expect(DateManager.isPast(day, today)).toBe(false);
    });

    it('일이 이후이면 true를 반환한다', () => {
      const day = new Date('2025-08-06');
      expect(DateManager.isPast(day, today)).toBe(false);
    });

    it('day가 null이면 false를 반환한다', () => {
      expect(DateManager.isPast(null, today)).toBe(false);
    });
  });
});

// getDayOfWeek 함수
describe('getDayOfWeek 함수는', () => {
  describe('성공 케이스', () => {
    test.each([
      ['2025-08-03', '일'],
      ['2025-08-04', '월'],
      ['2025-08-05', '화'],
      ['2025-08-06', '수'],
      ['2025-08-07', '목'],
      ['2025-08-08', '금'],
      ['2025-08-09', '토'],
    ])('%s 날짜는 %s요일이어야 한다', (dateStr, dayOfWeek) => {
      expect(DateManager.getDayOfWeek(dateStr)).toBe(dayOfWeek);
    });
  });

  describe('실패 케이스', () => {
    it('day가 null이면 undefined를 반환한다', () => {
      expect(DateManager.getDayOfWeek('')).toBe(undefined);
    });
  });
});

// getDefaultdeadline 함수
describe('getDefaultDeadline 함수는', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-05T10:30'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('성공 케이스', () => {
    test(`new Date 객체에 대한 값이 "YYYY-MM-DD"와 "HH:00" 형식의 문자열 객체로 반환되어야 한다.`, () => {
      expect(DateManager.getDefaultDeadline()).toEqual({
        defaultDate: '2025-08-06',
        defaultTime: '10:00',
      });
    });
  });
});

// hasReachedMaxSelection 함수
describe('hasReachedMaxSelection 함수는', () => {
  describe('성공 케이스', () => {
    test(`선텍된 날짜 수가 7개면 true를 반환해야 한다.`, () => {
      expect(
        DateManager.hasReachedMaxSelection(
          new Set([
            '2025-08-05',
            '2025-08-06',
            '2025-08-07',
            '2025-08-08',
            '2025-08-09',
            '2025-08-10',
            '2025-08-11',
          ])
        )
      ).toBe(true);
    });

    test(`선텍된 날짜 수가 7개면 false를 반환해야 한다.`, () => {
      expect(DateManager.hasReachedMaxSelection(new Set(['2025-08-05', '2025-08-06']))).toBe(false);
    });
  });
});

// isDateBlockedByLimit 함수
describe('isDateBlockedByLimit 함수는', () => {
  describe('성공 케이스', () => {
    test(`최대 날짜 선택 개수에 도달했을 때, 현재 날짜가 선택 날짜에 포함되어 있으면 false를 반환한다.`, () => {
      const day = new Date('2025-08-05');
      expect(
        DateManager.isDateBlockedByLimit(
          day,
          new Set([
            '2025-08-05',
            '2025-08-06',
            '2025-08-07',
            '2025-08-08',
            '2025-08-09',
            '2025-08-10',
            '2025-08-11',
          ])
        )
      ).toBe(false);
    });

    test(`최대 날짜 선택 개수에 도달했을 때, 현재 날짜가 선택 날짜에 포함되어 있지 않으면 true를 반환한다.`, () => {
      const day = new Date('2025-08-04');
      expect(
        DateManager.isDateBlockedByLimit(
          day,
          new Set([
            '2025-08-05',
            '2025-08-06',
            '2025-08-07',
            '2025-08-08',
            '2025-08-09',
            '2025-08-10',
            '2025-08-11',
          ])
        )
      ).toBe(true);
    });
  });
});

// ISOTimeStringToDate 함수
describe('ISOTimeStringToDate 함수는', () => {
  describe('성공 케이스', () => {
    it('날짜와 시간 문자열을 Date 객체로 변환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2025-08-05', '14:30');
      const expected = new Date('2025-08-05T14:30');
      expect(result).toEqual(expected);
    });

    it('자정 시간을 올바르게 변환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2025-12-25', '00:00');
      const expected = new Date('2025-12-25T00:00');
      expect(result).toEqual(expected);
    });

    it('오후 11시 59분을 올바르게 변환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2025-01-01', '23:59');
      const expected = new Date('2025-01-01T23:59');
      expect(result).toEqual(expected);
    });

    it('윤년 2월 29일을 올바르게 변환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2024-02-29', '12:00');
      const expected = new Date('2024-02-29T12:00');
      expect(result).toEqual(expected);
    });

    it('월의 마지막 날을 올바르게 변환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2025-01-31', '09:15');
      const expected = new Date('2025-01-31T09:15');
      expect(result).toEqual(expected);
    });
  });

  describe('실패 케이스', () => {
    it('잘못된 날짜 형식이면 Invalid Date를 반환한다', () => {
      const result = DateManager.ISOTimeStringToDate('invalid-date', '12:00');
      expect(result.toString()).toBe('Invalid Date');
    });

    it('잘못된 시간 형식이면 Invalid Date를 반환한다', () => {
      const result = DateManager.ISOTimeStringToDate('2025-08-05', 'invalid-time');
      expect(result.toString()).toBe('Invalid Date');
    });
  });
});

describe('IsPastDeadline 함수는', () => {
  describe('성공 케이스', () => {
    it('현재 시간이 마감 시간 이후이면 true를 반환한다', () => {
      const deadline = { date: '2025-08-05', time: '14:00' };
      const now = new Date('2025-08-05T15:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(true);
    });
    // 버저비터 허용 안함!
    it('현재 시간이 마감 시간과 정확히 같으면 true를 반환한다', () => {
      const deadline = { date: '2025-08-05', time: '14:00' };
      const now = new Date('2025-08-05T14:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(true);
    });

    it('현재 시간이 마감 시간 이전이면 false를 반환한다', () => {
      const deadline = { date: '2025-08-05', time: '14:00' };
      const now = new Date('2025-08-05T13:59');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(false);
    });

    it('다른 날짜에서 현재 시간이 마감 시간 이후이면 true를 반환한다', () => {
      const deadline = { date: '2025-08-04', time: '23:59' };
      const now = new Date('2025-08-05T00:01');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(true);
    });

    it('다른 날짜에서 현재 시간이 마감 시간 이전이면 false를 반환한다', () => {
      const deadline = { date: '2025-08-06', time: '10:00' };
      const now = new Date('2025-08-05T15:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(false);
    });

    it('now 매개변수를 생략하면 실제 현재 시간과 비교한다', () => {
      const pastDeadline = { date: '2020-01-01', time: '00:00' };
      const futureDeadline = { date: '2030-12-31', time: '23:59' };

      expect(DateManager.IsPastDeadline(pastDeadline)).toBe(true);
      expect(DateManager.IsPastDeadline(futureDeadline)).toBe(false);
    });

    it('자정을 넘어가는 마감시간을 올바르게 처리한다', () => {
      const deadline = { date: '2025-08-04', time: '23:59' };
      const nowMidnight = new Date('2025-08-05T00:00');
      expect(DateManager.IsPastDeadline(deadline, nowMidnight)).toBe(true);
    });

    it('윤년 2월 29일 마감시간을 올바르게 처리한다', () => {
      const deadline = { date: '2024-02-29', time: '15:30' };
      const now = new Date('2024-03-01T10:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('잘못된 날짜 형식이면 Invalid Date로 인해 NaN 비교가 되어 false를 반환한다', () => {
      const deadline = { date: 'invalid-date', time: '12:00' };
      const now = new Date('2025-08-05T15:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(false);
    });

    it('잘못된 시간 형식이면 Invalid Date로 인해 NaN 비교가 되어 false를 반환한다', () => {
      const deadline = { date: '2025-08-05', time: 'invalid-time' };
      const now = new Date('2025-08-05T15:00');
      expect(DateManager.IsPastDeadline(deadline, now)).toBe(false);
    });
  });
});
