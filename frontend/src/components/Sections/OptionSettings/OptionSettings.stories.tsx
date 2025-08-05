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
  const [deadline, setdeadline] = useState<{ date: string; time: string }>({
    date: '2025-07-23',
    time: '16:00',
  });

  const deadlineField: Field<{ date: string; time: string }> = {
    value: deadline,
    set: setdeadline,
  };

  const [isPublic, setIsPublic] = useState<'public' | 'private'>('public');

  const isPublicField: Field<'public' | 'private'> = {
    value: isPublic,
    set: setIsPublic,
  };

  return <OptionSettings deadline={deadlineField} isPublic={isPublicField} />;
};

export const Default = Template.bind({});
