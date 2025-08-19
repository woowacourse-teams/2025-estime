import { Meta, StoryObj } from '@storybook/react-webpack5';
import Heatmap from '.';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import { getSimpleWeight } from '@/utils/getWeight';

const meta: Meta<typeof Heatmap> = {
  title: 'Components/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
  argTypes: {
    dateTimeSlots: {
      control: { type: 'object' },
      description: '시간 슬롯들',
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
  [
    '2024-01-15T09:00',
    { weight: getSimpleWeight(3, 8), participantNames: ['마빈', '메이토', '강산'] },
  ],
  [
    '2024-01-15T10:00',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:30',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-15T14:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-15T14:30',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-15T15:00',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T16:00',
    { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],

  // 화요일 - 가장 활발
  [
    '2024-01-16T09:00',
    {
      weight: getSimpleWeight(5, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-16T09:30',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T10:30',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T11:00',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-16T14:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T14:30',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-16T15:00',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-16T16:00',
    {
      weight: getSimpleWeight(5, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-16T17:00',
    { weight: getSimpleWeight(3, 8), participantNames: ['마빈', '메이토', '강산'] },
  ],

  // 수요일 - 중간 밀도
  [
    '2024-01-17T09:30',
    { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],
  [
    '2024-01-17T10:00',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-17T10:30',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-17T14:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-17T14:30',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-17T15:00',
    {
      weight: getSimpleWeight(5, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],

  // 목요일 - 고밀도
  [
    '2024-01-18T09:00',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-18T09:30',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-18T10:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T10:30',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T11:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T14:00',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T14:30',
    {
      weight: getSimpleWeight(8, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
    },
  ],
  [
    '2024-01-18T15:00',
    {
      weight: getSimpleWeight(7, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
    },
  ],
  [
    '2024-01-18T16:00',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-18T17:00',
    { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],

  // 금요일 - 여유로운 마무리
  [
    '2024-01-19T09:30',
    { weight: getSimpleWeight(3, 8), participantNames: ['마빈', '메이토', '강산'] },
  ],
  [
    '2024-01-19T10:00',
    {
      weight: getSimpleWeight(5, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-19T10:30',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-19T14:00',
    {
      weight: getSimpleWeight(6, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-19T14:30',
    {
      weight: getSimpleWeight(5, 8),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-19T15:00',
    { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],
  ['2024-01-19T16:00', { weight: getSimpleWeight(2, 8), participantNames: ['마빈', '메이토'] }],
]);

// 모닝 미팅 패턴
const morningMeetingStatistics = new Map<string, DateCellInfo>([
  [
    '2024-01-15T09:00',
    { weight: getSimpleWeight(4, 6), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],
  [
    '2024-01-15T09:30',
    {
      weight: getSimpleWeight(6, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:00',
    {
      weight: getSimpleWeight(6, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-15T10:30',
    {
      weight: getSimpleWeight(5, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-15T11:00',
    { weight: getSimpleWeight(3, 6), participantNames: ['마빈', '메이토', '강산'] },
  ],
  ['2024-01-15T11:30', { weight: getSimpleWeight(2, 6), participantNames: ['마빈', '메이토'] }],

  [
    '2024-01-16T09:00',
    {
      weight: getSimpleWeight(5, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-16T09:30',
    {
      weight: getSimpleWeight(6, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:00',
    {
      weight: getSimpleWeight(6, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T10:30',
    {
      weight: getSimpleWeight(6, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
    },
  ],
  [
    '2024-01-16T11:00',
    { weight: getSimpleWeight(4, 6), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],
  [
    '2024-01-16T11:30',
    { weight: getSimpleWeight(3, 6), participantNames: ['마빈', '메이토', '강산'] },
  ],

  [
    '2024-01-17T09:00',
    { weight: getSimpleWeight(3, 6), participantNames: ['마빈', '메이토', '강산'] },
  ],
  [
    '2024-01-17T09:30',
    {
      weight: getSimpleWeight(5, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-17T10:00',
    {
      weight: getSimpleWeight(5, 6),
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
    },
  ],
  [
    '2024-01-17T10:30',
    { weight: getSimpleWeight(4, 6), participantNames: ['마빈', '메이토', '강산', '해삐'] },
  ],
  ['2024-01-17T11:00', { weight: getSimpleWeight(2, 6), participantNames: ['마빈', '메이토'] }],
]);

export const Default: Story = {
  args: {
    dateTimeSlots: [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
    ],
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: defaultRoomStatistics,
  },
};

export const MorningMeeting: Story = {
  args: {
    dateTimeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'],
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17']),
    roomStatistics: morningMeetingStatistics,
  },
};

export const WeeklySchedule: Story = {
  args: {
    dateTimeSlots: [
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
    ],
    availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
    roomStatistics: new Map([
      [
        '2024-01-15T10:00',
        { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
      [
        '2024-01-15T10:30',
        {
          weight: getSimpleWeight(6, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],
      [
        '2024-01-15T14:00',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-15T14:30',
        {
          weight: getSimpleWeight(7, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-15T15:00',
        {
          weight: getSimpleWeight(6, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-16T10:00',
        {
          weight: getSimpleWeight(7, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-16T10:30',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-16T14:00',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-16T14:30',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-16T15:00',
        {
          weight: getSimpleWeight(7, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],

      [
        '2024-01-17T10:30',
        {
          weight: getSimpleWeight(5, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-17T14:00',
        {
          weight: getSimpleWeight(7, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
        },
      ],
      [
        '2024-01-17T14:30',
        {
          weight: getSimpleWeight(6, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-18T10:00',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-18T10:30',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-18T14:00',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-18T14:30',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-18T15:00',
        {
          weight: getSimpleWeight(6, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],

      [
        '2024-01-19T10:30',
        { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
      [
        '2024-01-19T14:00',
        {
          weight: getSimpleWeight(5, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-19T14:30',
        { weight: getSimpleWeight(4, 8), participantNames: ['마빈', '메이토', '강산', '해삐'] },
      ],
    ]),
  },
};

export const EmptySchedule: Story = {
  args: {
    dateTimeSlots: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
    availableDates: new Set(['2024-01-15', '2024-01-16']),
    roomStatistics: new Map(),
  },
};

export const SingleDay: Story = {
  args: {
    dateTimeSlots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
    availableDates: new Set(['2024-01-15']),
    roomStatistics: new Map([
      [
        '2024-01-15T13:00',
        {
          weight: getSimpleWeight(5, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
        },
      ],
      [
        '2024-01-15T16:00',
        {
          weight: getSimpleWeight(1, 8),
          participantNames: ['마빈'],
        },
      ],
      [
        '2024-01-15T13:30',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-15T14:00',
        {
          weight: getSimpleWeight(8, 8),
          participantNames: [
            '마빈',
            '메이토',
            '강산',
            '해삐',
            '제프리',
            '리버',
            '플린트',
            '호이초이',
          ],
        },
      ],
      [
        '2024-01-15T14:30',
        {
          weight: getSimpleWeight(6, 8),
          participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
        },
      ],
    ]),
  },
};
