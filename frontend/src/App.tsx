import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router';
import DesktopRoutes from './routes/DesktopRoutes';
import MobileRoutes from './routes/MobileRoutes';
import { useMobileContext } from './contexts/MobileContext';
import MobileProvider from './providers/MobileProvider';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDark ? DARK_THEME : LIGHT_THEME}>
      <MobileProvider>
        <BrowserRouter>
          <RoutesWrapper isDark={isDark} toggleTheme={toggleTheme} />
        </BrowserRouter>
      </MobileProvider>
    </ThemeProvider>
  );
};

const RoutesWrapper = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const { isMobile } = useMobileContext();

  return isMobile ? (
    <MobileRoutes isDark={isDark} toggleTheme={toggleTheme} />
  ) : (
    <DesktopRoutes isDark={isDark} toggleTheme={toggleTheme} />
  );
};

export default App;
