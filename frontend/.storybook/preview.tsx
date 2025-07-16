import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@emotion/react';
import { LIGHT_THEME } from '../src/styles/theme';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={LIGHT_THEME}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
