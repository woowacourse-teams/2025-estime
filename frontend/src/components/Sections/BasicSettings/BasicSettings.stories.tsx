import type { Meta, StoryFn } from '@storybook/react-webpack5';
import BasicSettings from '.';
import { useState } from 'react';
import type { Field } from '@/types/field';
import { TimeManager } from '@/utils/common/TimeManager';

export default {
  title: 'Components/BasicSettings',
  component: BasicSettings,
  tags: ['autodocs'],
} as Meta<typeof BasicSettings>;

const Template: StoryFn = () => {
  const [title, setTitle] = useState('');
  const titleField: Field<string> = {
    value: title,
    set: setTitle,
  };

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

  return <BasicSettings title={titleField} time={timeField} deadline={deadlineField} />;
};

export const Default = Template.bind({});
