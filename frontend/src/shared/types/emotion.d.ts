import '@emotion/react';
import { DARK_THEME } from '@/styles/theme';

type AppTheme = typeof DARK_THEME & { isMobile: boolean };
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends AppTheme {}
}
