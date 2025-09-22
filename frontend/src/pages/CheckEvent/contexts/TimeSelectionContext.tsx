import { createContext, useContext, ReactNode, useCallback, useRef, useMemo } from 'react';

interface TimeSelectionContextType {
  getCurrentSelectedTimes: () => Set<string>;
  updateCurrentSelectedTimes: (selectedTimes: Set<string>) => void;
  getFetchUserAvailableTime: () => Promise<void>;
  setFetchUserAvailableTime: (fn: () => Promise<void>) => void;
}

const TimeSelectionContext = createContext<TimeSelectionContextType | null>(null);

interface TimeSelectionProviderProps {
  children: ReactNode;
}

export const TimeSelectionProvider = ({ children }: TimeSelectionProviderProps) => {
  const currentSelectedTimesRef = useRef<Set<string>>(new Set());
  const fetchUserAvailableTimeRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const getCurrentSelectedTimes = useCallback(() => {
    return currentSelectedTimesRef.current;
  }, []);

  const updateCurrentSelectedTimes = useCallback((selectedTimes: Set<string>) => {
    currentSelectedTimesRef.current = new Set(selectedTimes);
  }, []);

  const setFetchUserAvailableTime = useCallback((fn: () => Promise<void>) => {
    fetchUserAvailableTimeRef.current = fn;
  }, []);

  const getFetchUserAvailableTime = useCallback(() => {
    return fetchUserAvailableTimeRef.current();
  }, []);

  const value = useMemo(
    () => ({
      getCurrentSelectedTimes,
      updateCurrentSelectedTimes,
      getFetchUserAvailableTime,
      setFetchUserAvailableTime,
    }),
    [
      getCurrentSelectedTimes,
      updateCurrentSelectedTimes,
      getFetchUserAvailableTime,
      setFetchUserAvailableTime,
    ]
  );
  return <TimeSelectionContext.Provider value={value}>{children}</TimeSelectionContext.Provider>;
};

export const useTimeSelectionContext = () => {
  const context = useContext(TimeSelectionContext);
  if (!context) {
    throw new Error('useTimeSelectionContext는 TimeSelectionProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
