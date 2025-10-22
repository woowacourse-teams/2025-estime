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
    mobileCaption: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  },
};

export const DARK_THEME = {
  colors: {
    background: '#1A1E26',
    text: '#CCCCCC',

    primary: '#A88CFF',
    secondary: '#EABF85',

    plum30: '#A793BD',
    plum40: '#5D4E84',
    plum50: '#684BA5',

    orange30: '#F7C684',
    orange40: '#F3AF5D',

    red40: '#FF6B8B',
    green30: '#60EAD0',

    kakao: '#FEE500',
    kakaoLabel: '#191919',

    successBackground: '#202B25',
    successBorder: '#375C47',
    successText: '#A8F3D1',

    errorBackground: '#3B2228',
    errorBorder: '#6E3B44',
    errorText: '#FCA5A5',

    warningBackground: '#413520',
    warningBorder: '#7A6533',
    warningText: '#FFD58A',

    gray05: '#1E212B',
    gray10: '#252937',
    gray20: '#2E3240',
    gray30: '#383D4D',
    gray40: '#464B5C',
    gray50: '#636B84',
    gray60: '#8B92A8',
    gray70: '#B6BBD0',
    gray80: '#E1E3ED',
    gray90: '#F6F7FA',
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
    mobileCaption: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
    },
  },
};
