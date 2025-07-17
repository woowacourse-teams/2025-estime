import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router';
import CreateEventPage from './pages/CreateEventPage';
import Layout from './components/Layout';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <ThemeProvider theme={isDark ? DARK_THEME : LIGHT_THEME}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout isDark={isDark} toggleTheme={toggleTheme} />}>
            <Route index element={<CreateEventPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
