import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import OptionSettings from '.';

const meta: Meta<typeof OptionSettings> = {
  title: 'Components/OptionSettings',
  component: OptionSettings,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof OptionSettings>;

export const Interactive: Story = {
  render: () => {
    const [isOpenAccordion, setIsOpenAccordion] = useState(false);
    const [isOnDeadline, setIsOnDeadline] = useState(false);
    const [date, setDate] = useState('2025-07-19');

    return (
      <OptionSettings
        isOpenAccordion={isOpenAccordion}
        onToggleAccordion={() => setIsOpenAccordion((prev) => !prev)}
        isOnDeadline={isOnDeadline}
        onToggleDeadline={() => setIsOnDeadline((prev) => !prev)}
        date={date}
        onDateChange={(e) => setDate(e.target.value)}
      />
    );
  },
};
