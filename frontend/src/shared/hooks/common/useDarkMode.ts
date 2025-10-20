import { useEffect, useState } from 'react';

interface UseDarkModeOptions {
  key?: string;
}

interface UseDarkModeReturn {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DEFAULT_KEY = 'darkMode';

export function useDarkMode(options: UseDarkModeOptions = {}): UseDarkModeReturn {
  const { key = DEFAULT_KEY } = options;

  const getInitialValue = () => {
    const stored = localStorage.getItem(key);
    if (stored !== null) return stored === 'true';

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem(key, prefersDark.toString());
    return prefersDark;
  };

  const [darkMode, setDarkModeState] = useState(getInitialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      const userPref = localStorage.getItem(key);
      if (userPref === null) {
        setDarkModeState(event.matches);
        localStorage.setItem(key, event.matches.toString());
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [key]);

  const toggleDarkMode = () => {
    setDarkModeState((prev) => {
      const next = !prev;
      localStorage.setItem(key, next.toString());
      return next;
    });
  };

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem(key, value.toString());
  };

  return { darkMode, toggleDarkMode, setDarkMode };
}
