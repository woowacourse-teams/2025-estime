import { lazy, useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import Layout from './shared/layout';
import ToastProvider from './providers/ToastProvider';
import { ErrorBoundary } from '@sentry/react';
const ErrorPage = lazy(() => import('@/pages/common/Error404Page'));

const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(navigator.userAgent);

const RootElement = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const themeWithMobile = {
    ...(isDark ? DARK_THEME : LIGHT_THEME),
    isMobile,
  };

  return (
    <ThemeProvider theme={themeWithMobile}>
      <ToastProvider>
        <ErrorBoundary fallback={<ErrorPage />}>
          <Layout isDark={isDark} toggleTheme={toggleTheme} />
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default RootElement;
