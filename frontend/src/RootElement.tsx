import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import Layout from './shared/layout';
import { ErrorBoundary } from '@sentry/react';
import ErrorPage from './pages/common/ErrorPage';
import ToastZone from './shared/layout/ToastZone';

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
      <ErrorBoundary fallback={<ErrorPage />}>
        {/* layout 내부에 outlet이 있으므로, routing될 페이지들(routes/index.tsx)이 들어간다. */}
        <Layout isDark={isDark} toggleTheme={toggleTheme} />
        <ToastZone />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default RootElement;
