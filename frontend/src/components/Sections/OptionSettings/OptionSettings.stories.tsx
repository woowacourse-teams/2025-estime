import { Meta, StoryFn } from '@storybook/react-webpack5';
import OptionSettings from '.';
import { useState } from 'react';
import type { Field } from '@/types/field';

export default {
  title: 'Components/OptionSettings',
  component: OptionSettings,
  tags: ['autodocs'],
} as Meta<typeof OptionSettings>;

const Template: StoryFn = () => {
  const [deadLine, setDeadLine] = useState<{ date: string; time: string }>({
    date: '2025-07-23',
    time: '16:00',
  });

  const deadLineField: Field<{ date: string; time: string }> = {
    value: deadLine,
    set: setDeadLine,
  };

  const [isPublic, setIsPublic] = useState<boolean>(true);

  const isPublicField: Field<boolean> = {
    value: isPublic,
    set: setIsPublic,
  };

  return <OptionSettings deadLine={deadLineField} isPublic={isPublicField} />;
};

export const Default = Template.bind({});
