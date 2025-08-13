// Calender.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeProvider } from '@emotion/react';
import { useState } from 'react';

import Calendar from '.';
import { LIGHT_THEME } from '@/styles/theme';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';
import ToastProvider from '@/providers/ToastProvider';

function CalendarStoryBridge({ Story, args }: { Story: any; args: any }) {
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState<Set<string>>(args.selectedDates ?? new Set());

  const dateSelection = useDateSelection({ selectedDates, setSelectedDates, today });

  const mouseHandlers = {
    onMouseDown: dateSelection.onMouseDown,
    onMouseEnter: dateSelection.onMouseEnter,
    onMouseUp: dateSelection.onMouseUp,
    onMouseLeave: dateSelection.onMouseLeave,
  };

  return (
    <div style={{ width: 800 }}>
      <Story args={{ ...args, today, selectedDates, mouseHandlers }} />
    </div>
  );
}

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    selectedDates: { control: false },
    today: { control: false },
    mouseHandlers: { control: false },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={LIGHT_THEME}>
        <ToastProvider>
          <CalendarStoryBridge Story={Story} args={context.args} />
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Basic: Story = {
  args: {},
};

export const PreSelected: Story = {
  args: {
    selectedDates: new Set(['2025-07-17', '2025-07-18']),
  },
};
