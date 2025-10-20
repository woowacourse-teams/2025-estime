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
    green30: '#27874D',

    kakao: '#FEE500',
    kakaoLabel: '#191919',

    successBackground: '#D6F0E0',
    successBorder: '#C0E7D0',
    successText: '#0D6832',

    errorBackground: '#F9E1E5',
    errorBorder: '#F4C8CF',
    errorText: '#AF233A',

    warningBackground: '#FBF0DA',
    warningBorder: '#F9E4BE',
    warningText: '#73510D',

    gray05: '#F9F9F9',
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
      fontWeight: 'bold',
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
    mobileGlass: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
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
    green30: '#27874D',

    kakao: '#FEE500',
    kakaoLabel: '#191919',

    successBackground: '#D6F0E0',
    successBorder: '#C0E7D0',
    successText: '#0D6832',

    errorBackground: '#F9E1E5',
    errorBorder: '#F4C8CF',
    errorText: '#AF233A',

    warningBackground: '#FBF0DA',
    warningBorder: '#F9E4BE',
    warningText: '#73510D',

    gray05: '#1C1C1E',
    gray10: '#2C2C2E',
    gray20: '#363639',
    gray30: '#48484A',
    gray40: '#636366',
    gray50: '#8E8E93',
    gray60: '#AEAEB2',
    gray70: '#C6C6C6',
    gray80: '#F4F4F4',
    gray90: '#F9F9F9',
  },
  typography: {
    h1: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
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
    mobileGlass: {
      fontSize: '1rem',
      fontWeight: 'bold',
    },
  },
};
