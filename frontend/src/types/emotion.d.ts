import '@emotion/react';
import theme from '@/styles/theme';

type colors = keyof typeof theme.colors.light;
type typography = keyof typeof theme.typography;

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      light: { [key in colors]: string };
      dark: { [key in colors]: string };
    };
    typography: {
      [key in typography]: {
        fontSize: string;
        fontWeight: string;
      };
    };
  }
}
