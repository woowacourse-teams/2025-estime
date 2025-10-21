import { lazy } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import Layout from './shared/layout';
import { ErrorBoundary } from '@sentry/react';
const ErrorPage = lazy(() => import('@/pages/common/Error404Page'));
import ToastZone from './shared/layout/ToastZone';
import { useDarkMode } from './shared/hooks/common/useDarkMode';

const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(navigator.userAgent);

const RootElement = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const themeWithMobile = {
    ...(darkMode ? DARK_THEME : LIGHT_THEME),
    isMobile,
  };

  return (
    <ThemeProvider theme={themeWithMobile}>
      <ErrorBoundary fallback={<ErrorPage />}>
        {/* layout 내부에 outlet이 있으므로, routing될 페이지들(routes/index.tsx)이 들어간다. */}
        <Layout isDark={darkMode} toggleTheme={toggleDarkMode} />
        <ToastZone />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default RootElement;
