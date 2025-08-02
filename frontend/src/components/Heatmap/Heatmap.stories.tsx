import { Meta, StoryObj } from '@storybook/react-webpack5';
import Heatmap from '.';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import {
  marvinWeightStrategy,
  flintWeightStrategy,
  type WeightCalculateStrategy,
} from '@/utils/getWeight';

const meta: Meta<typeof Heatmap> = {
  title: 'Components/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
  argTypes: {
    roomName: {
      control: { type: 'text' },
      description: '방 이름',
    },
    time: {
      control: { type: 'object' },
      description: '시작 시간과 종료 시간',
    },
    availableDates: {
      control: { type: 'object' },
      description: '가능한 날짜들',
    },
    roomStatistics: {
      control: { type: 'object' },
      description: '방 통계 데이터',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Heatmap>;

// 기본 5일 스케줄 - 현실적인 패턴
const defaultRoomStatistics = new Map<string, DateCellInfo>([
  // 월요일 - 느긋한 시작
  ['2024-01-15T09:00', { howMany: 3, weight: 0.375, userNames: ['마빈', '메이토', '강산'] }],
  [
    '2024-01-15T10:00',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:30',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-15T14:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-15T14:30',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-15T15:00',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  ['2024-01-15T16:00', { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] }],

  // 화요일 - 가장 활발
  [
    '2024-01-16T09:00',
    { howMany: 5, weight: 0.625, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  [
    '2024-01-16T09:30',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T10:30',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T11:00',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-16T14:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T14:30',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T15:00',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-16T16:00',
    { howMany: 5, weight: 0.625, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  ['2024-01-16T17:00', { howMany: 3, weight: 0.375, userNames: ['마빈', '메이토', '강산'] }],

  // 수요일 - 중간 밀도
  ['2024-01-17T09:30', { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] }],
  [
    '2024-01-17T10:00',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-17T10:30',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-17T14:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-17T14:30',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-17T15:00',
    { howMany: 5, weight: 0.625, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],

  // 목요일 - 고밀도
  [
    '2024-01-18T09:00',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-18T09:30',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-18T10:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T10:30',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T11:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T14:00',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T14:30',
    {
      howMany: 8,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T15:00',
    {
      howMany: 7,
      weight: 0.875,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-18T16:00',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  ['2024-01-18T17:00', { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] }],

  // 금요일 - 여유로운 마무리
  ['2024-01-19T09:30', { howMany: 3, weight: 0.375, userNames: ['마빈', '메이토', '강산'] }],
  [
    '2024-01-19T10:00',
    { howMany: 5, weight: 0.625, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  [
    '2024-01-19T10:30',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-19T14:00',
    {
      howMany: 6,
      weight: 0.75,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-19T14:30',
    { howMany: 5, weight: 0.625, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  ['2024-01-19T15:00', { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] }],
  ['2024-01-19T16:00', { howMany: 2, weight: 0.25, userNames: ['마빈', '메이토'] }],
]);

// 모닝 미팅 패턴
const morningMeetingStatistics = new Map<string, DateCellInfo>([
  ['2024-01-15T09:00', { howMany: 4, weight: 0.67, userNames: ['마빈', '메이토', '강산', '해삐'] }],
  [
    '2024-01-15T09:30',
    {
      howMany: 6,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:00',
    {
      howMany: 6,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:30',
    { howMany: 5, weight: 0.83, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  ['2024-01-15T11:00', { howMany: 3, weight: 0.5, userNames: ['마빈', '메이토', '강산'] }],
  ['2024-01-15T11:30', { howMany: 2, weight: 0.33, userNames: ['마빈', '메이토'] }],

  [
    '2024-01-16T09:00',
    { howMany: 5, weight: 0.83, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  [
    '2024-01-16T09:30',
    {
      howMany: 6,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:00',
    {
      howMany: 6,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:30',
    {
      howMany: 6,
      weight: 1.0,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  ['2024-01-16T11:00', { howMany: 4, weight: 0.67, userNames: ['마빈', '메이토', '강산', '해삐'] }],
  ['2024-01-16T11:30', { howMany: 3, weight: 0.5, userNames: ['마빈', '메이토', '강산'] }],

  ['2024-01-17T09:00', { howMany: 3, weight: 0.5, userNames: ['마빈', '메이토', '강산'] }],
  [
    '2024-01-17T09:30',
    { howMany: 5, weight: 0.83, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  [
    '2024-01-17T10:00',
    { howMany: 5, weight: 0.83, userNames: ['마빈', '메이토', '강산', '해삐', '제프리'] },
  ],
  ['2024-01-17T10:30', { howMany: 4, weight: 0.67, userNames: ['마빈', '메이토', '강산', '해삐'] }],
  ['2024-01-17T11:00', { howMany: 2, weight: 0.33, userNames: ['마빈', '메이토'] }],
]);

export const Default: Story = {
  args: {
    roomName: '아인슈타임 정기 산악회',
    time: {
      startTime: '09:00',
      endTime: '18:00',
    },
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: defaultRoomStatistics,
  },
};

export const MorningMeeting: Story = {
  args: {
    roomName: '살구 파괴자 자조 모임',
    time: {
      startTime: '09:00',
      endTime: '12:00',
    },
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17']),
    roomStatistics: morningMeetingStatistics,
  },
};

export const WeeklySchedule: Story = {
  args: {
    roomName: '지하철 10호선 연장근로 산악 비대회',
    time: {
      startTime: '10:00',
      endTime: '16:00',
    },
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: new Map([
      [
        '2024-01-15T10:00',
        { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
      [
        '2024-01-15T10:30',
        {
          howMany: 6,
          weight: 0.75,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],
      [
        '2024-01-15T14:00',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-15T14:30',
        {
          howMany: 7,
          weight: 0.875,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-15T15:00',
        {
          howMany: 6,
          weight: 0.75,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-16T10:00',
        {
          howMany: 7,
          weight: 0.875,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-16T10:30',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-16T14:00',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-16T14:30',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-16T15:00',
        {
          howMany: 7,
          weight: 0.875,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],

      [
        '2024-01-17T10:30',
        {
          howMany: 5,
          weight: 0.625,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-17T14:00',
        {
          howMany: 7,
          weight: 0.875,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-17T14:30',
        {
          howMany: 6,
          weight: 0.75,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-18T10:00',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-18T10:30',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-18T14:00',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-18T14:30',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-18T15:00',
        {
          howMany: 6,
          weight: 0.75,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-19T10:30',
        { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
      [
        '2024-01-19T14:00',
        {
          howMany: 5,
          weight: 0.625,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-19T14:30',
        { howMany: 4, weight: 0.5, userNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
    ]),
  },
};

export const EmptySchedule: Story = {
  args: {
    roomName: '빈 일정',
    time: {
      startTime: '14:00',
      endTime: '17:00',
    },
    availableDates: new Set(['2024-01-15', '2024-01-16']),
    roomStatistics: new Map(),
  },
};

export const SingleDay: Story = {
  args: {
    roomName: '당일 회의',
    time: {
      startTime: '13:00',
      endTime: '15:00',
    },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: new Map([
      [
        '2024-01-15T13:00',
        {
          howMany: 5,
          weight: 0.625,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-15T13:30',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-15T14:00',
        {
          howMany: 8,
          weight: 1.0,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
        },
      ],
      [
        '2024-01-15T14:30',
        {
          howMany: 6,
          weight: 0.75,
          userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],
    ]),
  },
};

// 가중치 전략 비교용 데이터 생성 함수
const createSampleData = () => {
  const rawData = [
    { dateTime: '2024-01-15T09:00', howMany: 2, userNames: ['마빈', '메이토'] },
    {
      dateTime: '2024-01-15T09:30',
      howMany: 5,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
    {
      dateTime: '2024-01-15T10:00',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    { dateTime: '2024-01-15T10:30', howMany: 3, userNames: ['마빈', '메이토', '강산'] },
    {
      dateTime: '2024-01-15T11:00',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
    { dateTime: '2024-01-15T11:30', howMany: 1, userNames: ['마빈'] },
    {
      dateTime: '2024-01-15T12:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ];

  const howManyValues = rawData.map((d) => d.howMany);
  const min = Math.min(...howManyValues);
  const max = Math.max(...howManyValues);

  return { rawData, min, max };
};

const applyWeightStrategy = (strategy: WeightCalculateStrategy) => {
  const { rawData, min, max } = createSampleData();
  const resultMap = new Map<string, DateCellInfo>();

  rawData.forEach((data) => {
    resultMap.set(data.dateTime, {
      howMany: data.howMany,
      weight: strategy(data.howMany, min, max),
      userNames: data.userNames,
    });
  });

  return resultMap;
};

export const WeightStrategy_Marvin: Story = {
  args: {
    roomName: '🔥 Marvin 전략 (기본 minVisible: 0.2)',
    time: { startTime: '09:00', endTime: '13:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategy(marvinWeightStrategy),
  },
};

export const WeightStrategy_Flint: Story = {
  args: {
    roomName: '⚡ Flint 전략 (기본 minOpacity: 0.2)',
    time: { startTime: '09:00', endTime: '13:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategy(flintWeightStrategy),
  },
};

// 소규모 투표 시나리오 (5명 이하) - Flint 전략에서 단순 분할 로직 사용
const createSmallGroupData = () => {
  const rawData = [
    { dateTime: '2024-01-15T14:00', howMany: 1, userNames: ['마빈'] },
    { dateTime: '2024-01-15T14:30', howMany: 2, userNames: ['마빈', '메이토'] },
    { dateTime: '2024-01-15T15:00', howMany: 3, userNames: ['마빈', '메이토', '강산'] },
    { dateTime: '2024-01-15T15:30', howMany: 4, userNames: ['마빈', '메이토', '강산', '해삐'] },
    {
      dateTime: '2024-01-15T16:00',
      howMany: 5,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ];

  const howManyValues = rawData.map((d) => d.howMany);
  const min = Math.min(...howManyValues);
  const max = Math.max(...howManyValues);

  return { rawData, min, max };
};

const applyWeightStrategySmallGroup = (strategy: WeightCalculateStrategy) => {
  const { rawData, min, max } = createSmallGroupData();
  const resultMap = new Map<string, DateCellInfo>();

  rawData.forEach((data) => {
    resultMap.set(data.dateTime, {
      howMany: data.howMany,
      weight: strategy(data.howMany, min, max),
      userNames: data.userNames,
    });
  });

  return resultMap;
};

export const SmallGroup_Marvin: Story = {
  args: {
    roomName: '🔥 Marvin 전략 - 소규모 그룹 (1~5명)',
    time: { startTime: '14:00', endTime: '17:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategySmallGroup(marvinWeightStrategy),
  },
};

export const SmallGroup_Flint: Story = {
  args: {
    roomName: '⚡ Flint 전략 - 소규모 그룹 (1~5명)',
    time: { startTime: '14:00', endTime: '17:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategySmallGroup(flintWeightStrategy),
  },
};

// 극단적인 차이 시나리오 - 최소값과 최대값의 차이가 큰 경우
const createExtremeData = () => {
  const rawData = [
    { dateTime: '2024-01-15T09:00', howMany: 1, userNames: ['마빈'] },
    { dateTime: '2024-01-15T09:30', howMany: 2, userNames: ['마빈', '메이토'] },
    {
      dateTime: '2024-01-15T10:00',
      howMany: 15,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
        '윈터',
      ],
    },
    { dateTime: '2024-01-15T10:30', howMany: 3, userNames: ['마빈', '메이토', '강산'] },
    {
      dateTime: '2024-01-15T11:00',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
  ];

  const howManyValues = rawData.map((d) => d.howMany);
  const min = Math.min(...howManyValues);
  const max = Math.max(...howManyValues);

  return { rawData, min, max };
};

const applyWeightStrategyExtreme = (strategy: WeightCalculateStrategy) => {
  const { rawData, min, max } = createExtremeData();
  const resultMap = new Map<string, DateCellInfo>();

  rawData.forEach((data) => {
    resultMap.set(data.dateTime, {
      howMany: data.howMany,
      weight: strategy(data.howMany, min, max),
      userNames: data.userNames,
    });
  });

  return resultMap;
};

export const ExtremeRange_Marvin: Story = {
  args: {
    roomName: '🔥 Marvin 전략 - 극단적 차이 (1~15명)',
    time: { startTime: '09:00', endTime: '12:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategyExtreme(marvinWeightStrategy),
  },
};

export const ExtremeRange_Flint: Story = {
  args: {
    roomName: '⚡ Flint 전략 - 극단적 차이 (1~15명)',
    time: { startTime: '09:00', endTime: '12:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategyExtreme(flintWeightStrategy),
  },
};

// 비슷한 수치 시나리오 - 모든 값이 비슷한 경우
const createSimilarData = () => {
  const rawData = [
    {
      dateTime: '2024-01-15T13:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    {
      dateTime: '2024-01-15T13:30',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
    {
      dateTime: '2024-01-15T14:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    {
      dateTime: '2024-01-15T14:30',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    {
      dateTime: '2024-01-15T15:00',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ];

  const howManyValues = rawData.map((d) => d.howMany);
  const min = Math.min(...howManyValues);
  const max = Math.max(...howManyValues);

  return { rawData, min, max };
};

const applyWeightStrategySimilar = (strategy: WeightCalculateStrategy) => {
  const { rawData, min, max } = createSimilarData();
  const resultMap = new Map<string, DateCellInfo>();

  rawData.forEach((data) => {
    resultMap.set(data.dateTime, {
      howMany: data.howMany,
      weight: strategy(data.howMany, min, max),
      userNames: data.userNames,
    });
  });

  return resultMap;
};

export const SimilarRange_Marvin: Story = {
  args: {
    roomName: '🔥 Marvin 전략 - 비슷한 수치 (6~8명)',
    time: { startTime: '13:00', endTime: '16:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategySimilar(marvinWeightStrategy),
  },
};

export const SimilarRange_Flint: Story = {
  args: {
    roomName: '⚡ Flint 전략 - 비슷한 수치 (6~8명)',
    time: { startTime: '13:00', endTime: '16:00' },
    availableDates: new Set(['2024-01-15']),
    roomStatistics: applyWeightStrategySimilar(flintWeightStrategy),
  },
};

// 주간 규모의 가중치 전략 비교용 데이터 - 현실적인 블록 패턴
const createWeeklyComparisonData = () => {
  const rawData = [
    // 월요일 - 오전 블록(10:00-12:30) + 오후 블록(14:00-15:30)
    {
      dateTime: '2024-01-15T10:00',
      howMany: 5,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
    {
      dateTime: '2024-01-15T10:30',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    {
      dateTime: '2024-01-15T11:00',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
    {
      dateTime: '2024-01-15T11:30',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    {
      dateTime: '2024-01-15T12:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    { dateTime: '2024-01-15T12:30', howMany: 4, userNames: ['마빈', '메이토', '강산', '해삐'] },
    {
      dateTime: '2024-01-15T14:00',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    {
      dateTime: '2024-01-15T14:30',
      howMany: 9,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버', '호이초이'],
    },
    {
      dateTime: '2024-01-15T15:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    { dateTime: '2024-01-15T15:30', howMany: 4, userNames: ['마빈', '메이토', '강산', '해삐'] },

    // 화요일 - 오전 블록(9:00-12:30) + 오후 블록(13:00-16:30) - 가장 활발
    {
      dateTime: '2024-01-16T09:00',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    {
      dateTime: '2024-01-16T09:30',
      howMany: 10,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
      ],
    },
    {
      dateTime: '2024-01-16T10:00',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
    {
      dateTime: '2024-01-16T10:30',
      howMany: 14,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
      ],
    },
    {
      dateTime: '2024-01-16T11:00',
      howMany: 15,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
        '윈터',
      ],
    },
    {
      dateTime: '2024-01-16T11:30',
      howMany: 14,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
      ],
    },
    {
      dateTime: '2024-01-16T12:00',
      howMany: 13,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
      ],
    },
    {
      dateTime: '2024-01-16T12:30',
      howMany: 11,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
      ],
    },
    {
      dateTime: '2024-01-16T13:00',
      howMany: 14,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
      ],
    },
    {
      dateTime: '2024-01-16T13:30',
      howMany: 15,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
        '윈터',
      ],
    },
    {
      dateTime: '2024-01-16T14:00',
      howMany: 15,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
        '네오',
        '윈터',
      ],
    },
    {
      dateTime: '2024-01-16T14:30',
      howMany: 13,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
      ],
    },
    {
      dateTime: '2024-01-16T15:00',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
    {
      dateTime: '2024-01-16T15:30',
      howMany: 10,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
      ],
    },
    {
      dateTime: '2024-01-16T16:00',
      howMany: 9,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버', '호이초이'],
    },
    {
      dateTime: '2024-01-16T16:30',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },

    // 수요일 - 오후만 블록(14:00-16:30)
    {
      dateTime: '2024-01-17T14:00',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
    {
      dateTime: '2024-01-17T14:30',
      howMany: 8,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버'],
    },
    {
      dateTime: '2024-01-17T15:00',
      howMany: 9,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버', '호이초이'],
    },
    {
      dateTime: '2024-01-17T15:30',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
    {
      dateTime: '2024-01-17T16:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    { dateTime: '2024-01-17T16:30', howMany: 4, userNames: ['마빈', '메이토', '강산', '해삐'] },

    // 목요일 - 오전 블록(10:00-11:30) + 오후 블록(13:00-15:30)
    {
      dateTime: '2024-01-18T10:00',
      howMany: 10,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
      ],
    },
    {
      dateTime: '2024-01-18T10:30',
      howMany: 11,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
      ],
    },
    {
      dateTime: '2024-01-18T11:00',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
    {
      dateTime: '2024-01-18T11:30',
      howMany: 11,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
      ],
    },
    {
      dateTime: '2024-01-18T13:00',
      howMany: 11,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
      ],
    },
    {
      dateTime: '2024-01-18T13:30',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
    {
      dateTime: '2024-01-18T14:00',
      howMany: 13,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
        '매튜',
      ],
    },
    {
      dateTime: '2024-01-18T14:30',
      howMany: 12,
      userNames: [
        '마빈',
        '메이토',
        '강산',
        '해삐',
        '제프리',
        '리버',
        '플린트',
        '애버',
        '호이초이',
        '루카스',
        '페도',
        '조시',
      ],
    },
    {
      dateTime: '2024-01-18T15:00',
      howMany: 9,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '애버', '호이초이'],
    },
    {
      dateTime: '2024-01-18T15:30',
      howMany: 7,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },

    // 금요일 - 오전만 블록(10:00-12:30)
    { dateTime: '2024-01-19T10:00', howMany: 4, userNames: ['마빈', '메이토', '강산', '해삐'] },
    {
      dateTime: '2024-01-19T10:30',
      howMany: 5,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
    {
      dateTime: '2024-01-19T11:00',
      howMany: 6,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
    {
      dateTime: '2024-01-19T11:30',
      howMany: 5,
      userNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
    { dateTime: '2024-01-19T12:00', howMany: 3, userNames: ['마빈', '메이토', '강산'] },
    { dateTime: '2024-01-19T12:30', howMany: 2, userNames: ['마빈', '메이토'] },
  ];

  const howManyValues = rawData.map((d) => d.howMany);
  const min = Math.min(...howManyValues);
  const max = Math.max(...howManyValues);

  return { rawData, min, max };
};

const applyWeightStrategyWeekly = (strategy: WeightCalculateStrategy) => {
  const { rawData, min, max } = createWeeklyComparisonData();
  const resultMap = new Map<string, DateCellInfo>();

  rawData.forEach((data) => {
    resultMap.set(data.dateTime, {
      howMany: data.howMany,
      weight: strategy(data.howMany, min, max),
      userNames: data.userNames,
    });
  });

  return resultMap;
};

export const WeeklyComparison_Marvin: Story = {
  args: {
    roomName: '🔥 Marvin 전략 - 주간 일정 (1~15명)',
    time: { startTime: '09:00', endTime: '16:30' },
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: applyWeightStrategyWeekly(marvinWeightStrategy),
  },
};

export const WeeklyComparison_Flint: Story = {
  args: {
    roomName: '⚡ Flint 전략 - 주간 일정 (1~15명)',
    time: { startTime: '09:00', endTime: '16:30' },
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: applyWeightStrategyWeekly(flintWeightStrategy),
  },
};
