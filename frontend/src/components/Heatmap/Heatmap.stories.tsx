import { Meta, StoryObj } from '@storybook/react-webpack5';
import Heatmap from '.';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';

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
