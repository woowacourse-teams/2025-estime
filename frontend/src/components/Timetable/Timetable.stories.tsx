import { Meta, StoryObj } from '@storybook/react-webpack5';
import Timetable from '.';

const meta: Meta<typeof Timetable> = {
  title: 'Components/Timetable',
  component: Timetable,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Timetable>;

const response = {
  title: 'Bether 스터디',
  availableDates: [
    '2026-07-15',
    '2026-07-16',
    '2026-07-17',
    '2026-07-18',
    '2026-07-19',
    '2026-07-20',
    '2026-07-21',
    '2026-07-22',
    '2026-07-23',
    '2026-07-24',
    '2026-07-25',
  ],
  startTime: '09:00',
  endTime: '23:00',
  deadLine: '2026-07-15T10:00',
  isPublic: true,
  roomSession: '4d1f3a7e-6b8c-4d9a-9e0b-2f7c1a5b9d8e',
};

const fewDates = ['2026-07-15', '2026-07-16', '2026-07-17'];
const manyDates = response.availableDates;
const shortTimeRange = { startTime: '09:00', endTime: '14:00' };
const longTimeRange = { startTime: '09:00', endTime: '23:00' };

export const Default: Story = {
  args: {
    availableDates: fewDates,
    startTime: shortTimeRange.startTime,
    endTime: shortTimeRange.endTime,
  },
  render: (args) => <Timetable {...args} />,
};

export const ManyDates: Story = {
  args: {
    availableDates: manyDates,
    startTime: shortTimeRange.startTime,
    endTime: shortTimeRange.endTime,
  },
  render: (args) => <Timetable {...args} />,
};

export const LongTimeRange: Story = {
  args: {
    availableDates: fewDates,
    startTime: longTimeRange.startTime,
    endTime: longTimeRange.endTime,
  },
  render: (args) => <Timetable {...args} />,
};
