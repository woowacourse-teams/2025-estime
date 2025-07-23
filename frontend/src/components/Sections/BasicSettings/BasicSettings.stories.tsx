import type { Meta, StoryFn } from '@storybook/react-webpack5';
import BasicSettings from '.';
import { useState } from 'react';
import type { Field } from '@/types/field';
import { checkTimeRangeValid } from '@/utils/Time/checkTimeRangeValid';

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
    valid: checkTimeRangeValid({
      startTime: time.startTime,
      endTime: time.endTime,
    }),
  };

  return <BasicSettings title={titleField} time={timeField} />;
};

export const Default = Template.bind({});
