import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <ThemeProvider theme={isDark ? DARK_THEME : LIGHT_THEME}>
      <button onClick={toggleTheme} />
      <div>hello</div>
    </ThemeProvider>
  );
};

export default App;
