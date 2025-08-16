import { TimeManager } from '@/utils/common/TimeManager';

// toHourMinute
describe('toHourMinute 함수는', () => {
  it('130분을 입력하면 [2, 10]을 반환한다', () => {
    expect(TimeManager.toHourMinute(130)).toEqual([2, 10]);
  });

  it('0분을 입력하면 [0, 0]을 반환한다', () => {
    expect(TimeManager.toHourMinute(0)).toEqual([0, 0]);
  });
});

// addMinutes
describe('addMinutes 함수는', () => {
  it('"10:00"에 30분을 더하면 "10:30"을 반환한다', () => {
    expect(TimeManager.addMinutes('10:00', 30)).toBe('10:30');
  });

  it('"23:50"에 20분을 더하면 "00:10"을 반환한다', () => {
    expect(TimeManager.addMinutes('23:50', 20)).toBe('00:10');
  });
});

// subtractMinutes
describe('subtractMinutes 함수는', () => {
  it('"10:30"에서 30분을 빼면 "10:00"을 반환한다', () => {
    expect(TimeManager.subtractMinutes('10:30', 30)).toBe('10:00');
  });

  it('"00:10"에서 20분을 빼면 "23:50"을 반환한다', () => {
    expect(TimeManager.subtractMinutes('00:10', 20)).toBe('23:50');
  });
});

// generateTimeList
describe('generateTimeList 함수는', () => {
  it('"10:00" ~ "11:00", 간격 30분이면 ["10:00", "10:30"]을 반환한다', () => {
    const result = TimeManager.generateTimeList({
      startTime: '10:00',
      endTime: '11:00',
      interval: 30,
    });
    expect(result).toEqual(['10:00', '10:30']);
  });

  it('"09:00" ~ "12:00", 간격 60분이면 ["09:00", "10:00", "11:00"]을 반환한다', () => {
    const result = TimeManager.generateTimeList({
      startTime: '09:00',
      endTime: '12:00',
      interval: 60,
    });
    expect(result).toEqual(['09:00', '10:00', '11:00']);
  });
});

// isValidRange
describe('isValidRange 함수는', () => {
  it('"10:00" ~ "11:00"은 true를 반환한다', () => {
    expect(TimeManager.isValidRange('10:00', '11:00')).toBe(true);
  });

  it('"11:00" ~ "10:00"은 false를 반환한다', () => {
    expect(TimeManager.isValidRange('11:00', '10:00')).toBe(false);
  });

  it('"10:00" ~ "10:00"은 false를 반환한다', () => {
    expect(TimeManager.isValidRange('10:00', '10:00')).toBe(false);
  });
});

// filterLaterHoursFrom
describe('filterLaterHoursFrom 함수는', () => {
  it('"13:00" 이후의 시간만 필터링한다', () => {
    expect(TimeManager.filterLaterHoursFrom('13:00')).toEqual([
      '14 : 00',
      '15 : 00',
      '16 : 00',
      '17 : 00',
      '18 : 00',
      '19 : 00',
      '20 : 00',
      '21 : 00',
      '22 : 00',
      '23 : 00',
      '24 : 00',
    ]);
  });
});

// filterEarlierHoursUntil
describe('filterEarlierHoursUntil 함수는', () => {
  it('"13:00" 이전의 시간만 필터링한다', () => {
    expect(TimeManager.filterEarlierHoursUntil('13:00')).toEqual([
      '00 : 00',
      '01 : 00',
      '02 : 00',
      '03 : 00',
      '04 : 00',
      '05 : 00',
      '06 : 00',
      '07 : 00',
      '08 : 00',
      '09 : 00',
      '10 : 00',
      '11 : 00',
      '12 : 00',
    ]);
  });
});

// filterHourOptions
describe('filterHourOptions 함수는', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-08-05T12:00:00'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('성공 케이스', () => {
    it('마감일이 오늘이 아니면 전체 옵션을 반환한다', () => {
      const result = TimeManager.filterHourOptions({
        date: '2025-08-06',
        time: '12:00',
      });

      expect(result).toEqual([
        '00 : 00',
        '01 : 00',
        '02 : 00',
        '03 : 00',
        '04 : 00',
        '05 : 00',
        '06 : 00',
        '07 : 00',
        '08 : 00',
        '09 : 00',
        '10 : 00',
        '11 : 00',
        '12 : 00',
        '13 : 00',
        '14 : 00',
        '15 : 00',
        '16 : 00',
        '17 : 00',
        '18 : 00',
        '19 : 00',
        '20 : 00',
        '21 : 00',
        '22 : 00',
        '23 : 00',
        '24 : 00',
      ]);
    });

    it('마감일이 오늘이면 해당 시간 이후의 시간만 반환한다', () => {
      const result = TimeManager.filterHourOptions({
        date: '2025-08-05',
        time: '13:00',
      });

      expect(result).toEqual([
        '13 : 00',
        '14 : 00',
        '15 : 00',
        '16 : 00',
        '17 : 00',
        '18 : 00',
        '19 : 00',
        '20 : 00',
        '21 : 00',
        '22 : 00',
        '23 : 00',
        '24 : 00',
      ]);
    });
  });
});
