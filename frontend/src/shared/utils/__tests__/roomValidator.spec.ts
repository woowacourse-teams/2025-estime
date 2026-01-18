import {
  hasDateSlots,
  isValidDeadline,
  isValidTimeRange,
  isValidTitle,
} from '@/shared/utils/roomValidator';

describe('isValidTitle 함수는', () => {
  it('제목이 비어있으면 false를 반환한다', () => {
    expect(isValidTitle('')).toBe(false);
  });

  it('제목이 공백만 있으면 false를 반환한다', () => {
    expect(isValidTitle('   ')).toBe(false);
  });

  it('제목이 있으면 true를 반환한다', () => {
    expect(isValidTitle('아인슈타임 회식')).toBe(true);
  });

  it('제목 앞뒤에 공백이 있어도 내용이 있으면 true를 반환한다', () => {
    expect(isValidTitle('  회의  ')).toBe(true);
  });
});

describe('isValidTimeRange 함수는', () => {
  it('시작 시간이 비어있으면 false를 반환한다', () => {
    expect(isValidTimeRange('', '12:00')).toBe(false);
  });

  it('종료 시간이 비어있으면 false를 반환한다', () => {
    expect(isValidTimeRange('10:00', '')).toBe(false);
  });

  it('시작 시간이 공백만 있으면 false를 반환한다', () => {
    expect(isValidTimeRange('   ', '12:00')).toBe(false);
  });

  it('종료 시간이 공백만 있으면 false를 반환한다', () => {
    expect(isValidTimeRange('10:00', '   ')).toBe(false);
  });

  it('시작 시간이 종료 시간보다 늦으면 false를 반환한다', () => {
    expect(isValidTimeRange('12:00', '10:00')).toBe(false);
  });

  it('시작 시간과 종료 시간이 같으면 false를 반환한다', () => {
    expect(isValidTimeRange('10:00', '10:00')).toBe(false);
  });

  it('유효한 시간 범위이면 true를 반환한다', () => {
    expect(isValidTimeRange('10:00', '12:00')).toBe(true);
  });
});

describe('isValidDeadline 함수는', () => {
  it('마감일 날짜가 비어있으면 false를 반환한다', () => {
    expect(isValidDeadline({ date: '', time: '12:00' })).toBe(false);
  });

  it('마감일 시간이 비어있으면 false를 반환한다', () => {
    expect(isValidDeadline({ date: '2025-12-31', time: '' })).toBe(false);
  });

  it('마감일 날짜가 공백만 있으면 false를 반환한다', () => {
    expect(isValidDeadline({ date: '   ', time: '12:00' })).toBe(false);
  });

  it('마감일 시간이 공백만 있으면 false를 반환한다', () => {
    expect(isValidDeadline({ date: '2025-12-31', time: '   ' })).toBe(false);
  });

  it('마감일이 과거이면 false를 반환한다', () => {
    const pastDeadline = { date: '2020-01-01', time: '12:00' };
    expect(isValidDeadline(pastDeadline)).toBe(false);
  });

  it('마감일이 미래이면 true를 반환한다', () => {
    const futureDeadline = { date: '2099-12-31', time: '23:59' };
    expect(isValidDeadline(futureDeadline)).toBe(true);
  });
});

describe('hasDateSlots 함수는', () => {
  it('날짜 슬롯이 비어있으면 false를 반환한다', () => {
    const emptySlots = new Set();
    expect(hasDateSlots(emptySlots)).toBe(false);
  });

  it('날짜 슬롯이 1개 이상 있으면 true를 반환한다', () => {
    const slots = new Set(['2025-01-01']);
    expect(hasDateSlots(slots)).toBe(true);
  });

  it('날짜 슬롯이 여러 개 있으면 true를 반환한다', () => {
    const slots = new Set(['2025-01-01', '2025-01-02', '2025-01-03']);
    expect(hasDateSlots(slots)).toBe(true);
  });
});
