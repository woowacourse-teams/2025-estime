import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import OptionSettings from '.';

const meta: Meta<typeof OptionSettings> = {
  title: 'Components/OptionSettings',
  component: OptionSettings,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof OptionSettings>;

export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState('2025-07-19');

    return <OptionSettings date={date} onDateChange={(e) => setDate(e.target.value)} />;
  },
};
