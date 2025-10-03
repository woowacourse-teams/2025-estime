// import { Meta, StoryObj } from '@storybook/react-webpack5';
// import Heatmap from '.';
// import type { HeatmapDateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
// import { getSimpleWeight } from '@/pages/CheckEvent/utils/getWeight';
// import { useRef, useEffect } from 'react';
// import {
//   RoomStatisticsProvider,
//   useRoomStatisticsContext,
// } from '../../provider/RoomStatisticsProvider';

// const meta: Meta<typeof Heatmap> = {
//   title: 'Components/Heatmap',
//   component: Heatmap,
//   tags: ['autodocs'],
//   argTypes: {
//     dateTimeSlots: {
//       control: { type: 'object' },
//       description: '시간 슬롯 배열',
//     },
//     availableDates: {
//       control: { type: 'object' },
//       description: '가능한 날짜 Set',
//     },
//     handleBeforeEdit: {
//       action: 'handleBeforeEdit',
//       description: '편집 전 이벤트 핸들러',
//     },
//   },
//   decorators: [
//     (Story) => (
//       <RoomStatisticsProvider>
//         <Story />
//       </RoomStatisticsProvider>
//     ),
//   ],
// };

// export default meta;
// type Story = StoryObj<typeof Heatmap>;

// const HeatmapWrapper = ({
//   mockRoomStatistics,
//   ...props
// }: Omit<React.ComponentProps<typeof Heatmap>, 'timeColumnRef'> & {
//   mockRoomStatistics?: Map<string, HeatmapDateCellInfo>;
// }) => {
//   const timeColumnRef = useRef<HTMLDivElement | null>(null);
//   const { setRoomStatistics } = useRoomStatisticsContext();

//   useEffect(() => {
//     if (mockRoomStatistics) {
//       setRoomStatistics(mockRoomStatistics);
//     }
//   }, [mockRoomStatistics, setRoomStatistics]);

//   return <Heatmap {...props} timeColumnRef={timeColumnRef} />;
// };

// const defaultRoomStatistics = new Map<string, HeatmapDateCellInfo>([
//   [
//     '2024-01-15T09:00',
//     {
//       weight: getSimpleWeight(3, 8),
//       participantNames: ['마빈', '메이토', '강산'],
//       isRecommended: false,
//     },
//   ],
//   [
//     '2024-01-15T10:00',
//     {
//       weight: getSimpleWeight(6, 8),
//       participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
//       isRecommended: false,
//     },
//   ],
//   [
//     '2024-01-15T14:00',
//     {
//       weight: getSimpleWeight(8, 8),
//       participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버', '플린트', '호이초이'],
//       isRecommended: true,
//     },
//   ],
// ]);

// const morningMeetingStatistics = new Map<string, HeatmapDateCellInfo>([
//   [
//     '2024-01-15T09:00',
//     {
//       weight: getSimpleWeight(4, 6),
//       participantNames: ['마빈', '메이토', '강산', '해삐'],
//       isRecommended: false,
//     },
//   ],
//   [
//     '2024-01-15T09:30',
//     {
//       weight: getSimpleWeight(6, 6),
//       participantNames: ['마빈', '메이토', '강산', '해삐', '제프리', '리버'],
//       isRecommended: true,
//     },
//   ],
// ]);

// // --- Stories ---

// export const Default: Story = {
//   render: (args) => <HeatmapWrapper {...args} mockRoomStatistics={defaultRoomStatistics} />,
//   args: {
//     dateTimeSlots: [
//       '09:00',
//       '09:30',
//       '10:00',
//       '10:30',
//       '11:00',
//       '11:30',
//       '12:00',
//       '12:30',
//       '13:00',
//       '13:30',
//       '14:00',
//       '14:30',
//       '15:00',
//       '15:30',
//       '16:00',
//       '16:30',
//       '17:00',
//       '17:30',
//       '18:00',
//     ],
//     availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
//   },
// };

// export const MorningMeeting: Story = {
//   render: (args) => <HeatmapWrapper {...args} mockRoomStatistics={morningMeetingStatistics} />,
//   args: {
//     dateTimeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
//     availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17']),
//   },
// };

// export const WeeklySchedule: Story = {
//   render: (args) => <HeatmapWrapper {...args} mockRoomStatistics={defaultRoomStatistics} />,
//   args: {
//     dateTimeSlots: [
//       '10:00',
//       '10:30',
//       '11:00',
//       '11:30',
//       '12:00',
//       '12:30',
//       '13:00',
//       '13:30',
//       '14:00',
//       '14:30',
//       '15:00',
//       '15:30',
//       '16:00',
//       '16:30',
//       '17:00',
//       '17:30',
//       '18:00',
//     ],
//     availableDates: new Set(['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19']),
//   },
// };

// export const EmptySchedule: Story = {
//   render: (args) => <HeatmapWrapper {...args} mockRoomStatistics={new Map()} />,
//   args: {
//     dateTimeSlots: ['14:00', '14:30', '15:00'],
//     availableDates: new Set(['2024-01-15', '2024-01-16']),
//   },
// };

// export const SingleDay: Story = {
//   render: (args) => <HeatmapWrapper {...args} mockRoomStatistics={defaultRoomStatistics} />,
//   args: {
//     dateTimeSlots: ['13:00', '13:30', '14:00', '14:30', '15:00'],
//     availableDates: new Set(['2024-01-15']),
//   },
// };
