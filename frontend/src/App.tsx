import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router';
import DesktopRoutes from './routes/DesktopRoutes';
import MobileRoutes from './routes/MobileRoutes';

const isMobile = /android|iphone|ipad|ipod|blackberry|opera mini/i.test(navigator.userAgent);

const App = () => {
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
      <BrowserRouter>
        <RoutesWrapper isDark={isDark} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const RoutesWrapper = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return isMobile ? (
    <MobileRoutes isDark={isDark} toggleTheme={toggleTheme} />
  ) : (
    <DesktopRoutes isDark={isDark} toggleTheme={toggleTheme} />
  );
};

export default App;
