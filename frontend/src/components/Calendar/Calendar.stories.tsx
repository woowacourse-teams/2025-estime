// Calender.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeProvider } from '@emotion/react';
import { useState } from 'react';

import Calender from '.';
import { LIGHT_THEME } from '@/styles/theme';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';

const meta = {
  title: 'Components/Calendar',
  component: Calender,
  tags: ['autodocs'],
  argTypes: {
    selectedDates: { control: false },
    today: { control: false },
    mouseHandlers: { control: false },
  },
  decorators: [
    (Story, context) => {
      const today = new Date();
      const [selectedDates, setSelectedDates] = useState<Set<string>>(
        context.args.selectedDates || new Set()
      );
      const dateSelection = useDateSelection({ selectedDates, setSelectedDates, today });

      const mouseHandlers = {
        onMouseDown: dateSelection.onMouseDown,
        onMouseEnter: dateSelection.onMouseEnter,
        onMouseUp: dateSelection.onMouseUp,
        onMouseLeave: dateSelection.onMouseLeave,
      };

      return (
        <ThemeProvider theme={LIGHT_THEME}>
          <div style={{ width: 800 }}>
            <Story args={{ ...context.args, today, selectedDates, mouseHandlers }} />
          </div>
        </ThemeProvider>
      );
    },
  ],
} satisfies Meta<typeof Calender>;

export default meta;
type Story = StoryObj<typeof Calender>;

export const Basic: Story = {
  args: {},
};

export const PreSelected: Story = {
  args: {
    selectedDates: new Set(['2025-07-17', '2025-07-18']),
  },
};
