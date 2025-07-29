import { useState } from 'react';
import { DARK_THEME, LIGHT_THEME } from './styles/theme';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes } from 'react-router';
import CreateEventPage from './pages/CreateEventPage';
import CheckEventPage from './pages/CheckEventPage';
import Layout from './components/Layout';
import ErrorBoundary from './ErrorBoundary';
import ErrorPage from './pages/ErrorPage';

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
            <Route
              index
              element={
                <ErrorBoundary fallback={<ErrorPage />}>
                  <CreateEventPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="check"
              element={
                <ErrorBoundary fallback={<ErrorPage />}>
                  <CheckEventPage />
                </ErrorBoundary>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
