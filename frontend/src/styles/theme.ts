export type Theme = typeof LIGHT_THEME;
export type ColorsKey = keyof typeof LIGHT_THEME.colors;
export type TypographyKey = keyof typeof LIGHT_THEME.typography;

export const LIGHT_THEME = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',

    primary: '#8052E1',
    secondary: '#E2A86A',
    plum30: '#E6DAF3',
    plum40: '#DBD1E6',
    plum50: '#A87EFF',
    orange30: '#FFC64C',
    orange40: '#FFAE00',
    red40: '#EF4444',

    gray10: '#F4F4F4',
    gray20: '#C6C6C6',
    gray30: '#AEAEB2',
    gray40: '#8E8E93',
    gray50: '#636366',
    gray60: '#48484A',
    gray70: '#363639',
    gray80: '#2C2C2E',
    gray90: '#1C1C1E',
  },
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 'medium',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 'regular',
    },
    body: {
      fontSize: '0.875rem',
      fontWeight: 'regular',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 'regular',
    },
  },
};
export const DARK_THEME = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',

    primary: '#9E75EF',
    secondary: '#F9C287',
    plum30: '#A793BD',
    plum40: '#5D4E84',
    plum50: '#684BA5',
    orange30: '#FFC64C',
    orange40: '#FFAE00',
    red40: '#7F1E1D',

    gray10: '#1C1C1E',
    gray20: '#2C2C2E',
    gray30: '#363639',
    gray40: '#48484A',
    gray50: '#636366',
    gray60: '#8E8E93',
    gray70: '#AEAEB2',
    gray80: '#C6C6C6',
    gray90: '#F4F4F4',
  },
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 'medium',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 'regular',
    },
    body: {
      fontSize: '0.875rem',
      fontWeight: 'regular',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 'regular',
    },
  },
};
