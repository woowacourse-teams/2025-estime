import type { Meta, StoryFn } from '@storybook/react-webpack5';
import BasicSettings from '.';
import { useRef, useState } from 'react';
import type { Field } from '@/types/field';
import { TimeManager } from '@/utils/common/TimeManager';

export default {
  title: 'Components/BasicSettings',
  component: BasicSettings,
  tags: ['autodocs'],
  argTypes: {
    title: { control: false },
    time: { control: false },
    BasicSettingsRef: { control: false },
    isValid: {
      control: 'boolean',
    },
  },
} as Meta<typeof BasicSettings>;

const Template: StoryFn<{ isValid: boolean }> = (args) => {
  const [title, setTitle] = useState('');
  const titleField: Field<string> = {
    value: title,
    set: setTitle,
  };
  const BasicSettingsRef = useRef<HTMLDivElement | null>(null);

  const [time, setTime] = useState({ startTime: '', endTime: '' });

  const timeField: Field<{ startTime: string; endTime: string }> & { valid: boolean } = {
    value: time,
    set: setTime,
    valid: TimeManager.isValidRange(time.startTime, time.endTime),
  };

  const [deadline, setdeadline] = useState<{ date: string; time: string }>({
    date: '2025-07-23',
    time: '16:00',
  });

  const deadlineField: Field<{ date: string; time: string }> = {
    value: deadline,
    set: setdeadline,
  };

  return (
    <BasicSettings
      title={titleField}
      time={timeField}
      deadline={deadlineField}
      BasicSettingsRef={BasicSettingsRef}
      isValid={args.isValid}
    />
  );
};

export const Default = Template.bind({});
