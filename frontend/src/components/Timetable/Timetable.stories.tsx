import { Meta, StoryObj } from '@storybook/react-webpack5';
import Timetable from '.';
import { Field } from '@/types/field';

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

const createUserAvailability = (
  defaultName: string
): {
  userName: Field<string>;
  selectedTimes: Field<Set<string>>;
  userAvailabilitySubmit: (session: string) => Promise<unknown>;
} => {
  const selected = new Set<string>();
  return {
    userName: {
      value: defaultName,
      set: (name: string) => console.log('setUsername:', name),
    },
    selectedTimes: {
      value: selected,
      set: (times: Set<string>) => console.log('setSelectedTimes:', times),
    },
    userAvailabilitySubmit: async (session: string) => {
      console.log('submit availability for session', session);
      return Promise.resolve();
    },
  };
};

export const Default: Story = {
  args: {
    availableDates: new Set(response.availableDates.slice(0, 3)),
    startTime: '09:00',
    endTime: '14:00',
    session: response.roomSession,
    userAvailability: createUserAvailability('토마토'),
  },
};

export const ManyDates: Story = {
  args: {
    availableDates: new Set(response.availableDates),
    startTime: '09:00',
    endTime: '14:00',
    session: response.roomSession,
    userAvailability: createUserAvailability('양파'),
  },
};

export const LongTimeRange: Story = {
  args: {
    availableDates: new Set(response.availableDates.slice(0, 3)),
    startTime: '09:00',
    endTime: '23:00',
    session: response.roomSession,
    userAvailability: createUserAvailability('가지'),
  },
};
