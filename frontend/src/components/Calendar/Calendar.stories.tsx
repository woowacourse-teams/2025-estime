// Calender.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeProvider } from '@emotion/react';
import { useState } from 'react';

import Calendar from '.';
import { LIGHT_THEME } from '@/styles/theme';
import { useDateSelection } from '@/hooks/Calendar/useDateSelection';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    selectedDates: { control: false },
  },
  decorators: [
    (Story, context) => {
      const today = new Date();
      const [selectedDates, setSelectedDates] = useState<Set<string>>(
        context.args.selectedDates || new Set()
      );
      const drag = useDateSelection({ selectedDates, setSelectedDates, today });

      return (
        <ThemeProvider theme={LIGHT_THEME}>
          <div style={{ width: 800 }}>
            <Story args={{ ...context.args, today, selectedDates, ...drag }} />
          </div>
        </ThemeProvider>
      );
    },
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
