import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeProvider } from '@emotion/react';

import Heatmap from '@/pages/CheckEvent/components/Heatmap';
import { LIGHT_THEME } from '@/styles/theme';
import type { HeatmapDateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import ToastProvider from '@/providers/ToastProvider';

const meta: Meta<typeof Heatmap> = {
  title: 'Components/TableTooltip',
  component: Heatmap,
  tags: ['autodocs'],
  argTypes: {
    dateTimeSlots: { control: { type: 'object' }, description: '시간 슬롯들' },
    availableDates: { control: { type: 'object' }, description: '가능한 날짜들' },
    roomStatistics: { control: { type: 'object' }, description: '방 통계 데이터' },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Heatmap>;

const sampleStatistics = new Map<string, HeatmapDateCellInfo>([
  [
    '2024-01-15T10:00',
    { weight: 0.5, participantNames: ['마빈', '메이토', '강산', '해삐'], isRecommended: false },
  ],
  [
    '2024-01-15T10:30',
    {
      weight: 0.75,
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
      isRecommended: false,
    },
  ],
  [
    '2024-01-15T14:00',
    {
      weight: 1.0,
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
      isRecommended: true,
    },
  ],
  [
    '2024-01-16T11:00',
    {
      weight: 0.625,
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리'],
      isRecommended: false,
    },
  ],
  [
    '2024-01-16T14:30',
    {
      weight: 0.875,
      participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트'],
      isRecommended: false,
    },
  ],
  [
    '2024-01-17T15:00',
    { weight: 0.5, participantNames: ['마빈', '메이토', '강산', '해삐'], isRecommended: false },
  ],
]);

const commonArgs = {
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
  ],
  availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17']),
  roomStatistics: sampleStatistics,
};

function DesktopThemeDecorator(Story: any, context: any) {
  return (
    <ThemeProvider theme={{ ...LIGHT_THEME, isMobile: false }}>
      <div style={{ width: 920 }}>
        <Story args={context.args} />
      </div>
    </ThemeProvider>
  );
}

function MobileThemeDecorator(Story: any, context: any) {
  return (
    <ThemeProvider theme={{ ...LIGHT_THEME, isMobile: true }}>
      <div style={{ width: 360 }}>
        <Story args={context.args} />
      </div>
    </ThemeProvider>
  );
}

export const Desktop: Story = {
  args: commonArgs,
  decorators: [DesktopThemeDecorator],
  parameters: { docs: { description: { story: '데스크톱 환경에서 히트맵 위 툴팁 동작' } } },
};

export const Mobile: Story = {
  args: commonArgs,
  decorators: [MobileThemeDecorator],
  parameters: { docs: { description: { story: '모바일 환경에서 히트맵 위 툴팁 동작' } } },
};
