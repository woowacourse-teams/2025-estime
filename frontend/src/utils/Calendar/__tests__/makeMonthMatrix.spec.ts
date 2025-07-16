import { makeMonthMatrix } from '../makeMonthMatrix';

describe('makeMonthMatrix는', () => {
  it('2025년 7월의 달력 행렬을 올바르게 생성한다.', () => {
    const expected = [
      [
        null,
        null,
        new Date('2025-06-30T15:00:00.000Z'),
        new Date('2025-07-01T15:00:00.000Z'),
        new Date('2025-07-02T15:00:00.000Z'),
        new Date('2025-07-03T15:00:00.000Z'),
        new Date('2025-07-04T15:00:00.000Z'),
      ],
      [
        new Date('2025-07-05T15:00:00.000Z'),
        new Date('2025-07-06T15:00:00.000Z'),
        new Date('2025-07-07T15:00:00.000Z'),
        new Date('2025-07-08T15:00:00.000Z'),
        new Date('2025-07-09T15:00:00.000Z'),
        new Date('2025-07-10T15:00:00.000Z'),
        new Date('2025-07-11T15:00:00.000Z'),
      ],
      [
        new Date('2025-07-12T15:00:00.000Z'),
        new Date('2025-07-13T15:00:00.000Z'),
        new Date('2025-07-14T15:00:00.000Z'),
        new Date('2025-07-15T15:00:00.000Z'),
        new Date('2025-07-16T15:00:00.000Z'),
        new Date('2025-07-17T15:00:00.000Z'),
        new Date('2025-07-18T15:00:00.000Z'),
      ],
      [
        new Date('2025-07-19T15:00:00.000Z'),
        new Date('2025-07-20T15:00:00.000Z'),
        new Date('2025-07-21T15:00:00.000Z'),
        new Date('2025-07-22T15:00:00.000Z'),
        new Date('2025-07-23T15:00:00.000Z'),
        new Date('2025-07-24T15:00:00.000Z'),
        new Date('2025-07-25T15:00:00.000Z'),
      ],
      [
        new Date('2025-07-26T15:00:00.000Z'),
        new Date('2025-07-27T15:00:00.000Z'),
        new Date('2025-07-28T15:00:00.000Z'),
        new Date('2025-07-29T15:00:00.000Z'),
        new Date('2025-07-30T15:00:00.000Z'),
        null,
        null,
      ],
      [null, null, null, null, null, null, null],
    ];

    const base = new Date(2025, 6, 1);
    expect(makeMonthMatrix(base)).toEqual(expected);
  });
  it('올바른 Date를 넣지 않았을때, ', () => {
    expect(() => makeMonthMatrix(new Date('invalid'))).toThrow(
      '유효한 날짜 객체를 제공해야 합니다.'
    );
  });
});
