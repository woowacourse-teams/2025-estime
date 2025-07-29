import { Meta, StoryObj } from '@storybook/react-webpack5';
import Timetable from '.';
import { useMemo, useRef, useState } from 'react';

const meta: Meta<typeof Timetable> = {
  title: 'Components/Timetable',
  component: Timetable,
  tags: ['autodocs'],
  args: {
    name: 'John Doe',
    time: {
      startTime: '09:00',
      endTime: '18:00',
    },
    availableDates: new Set(['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04']),
  },
  argTypes: {
    selectedTimes: { control: false, table: { disable: true } },
    ref: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '780px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Timetable>;

export const Default: Story = {
  render: (args) => {
    const [selectedTimes, setSelectedTimes] = useState<Set<string>>(() => new Set());
    const ref = useRef<HTMLDivElement>(null);

    // 배열 → Set 변환은 memoize
    const availableDates = useMemo(() => new Set(args.availableDates), [args.availableDates]);
    return (
      <Timetable
        {...args}
        selectedTimes={{ value: selectedTimes, set: setSelectedTimes }}
        ref={ref}
        availableDates={availableDates}
        userAvailabilitySubmit={() => {}}
      />
    );
  },
};
