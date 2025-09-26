import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface TimeSelectionContextType {
  getCurrentSelectedTimes: () => Set<string>;
  updateCurrentSelectedTimes: (selectedTimes: Set<string>) => void;
}

const TimeSelectionContext = createContext<TimeSelectionContextType | null>(null);

interface TimeSelectionProviderProps {
  children: ReactNode;
}

export const TimeSelectionProvider = ({ children }: TimeSelectionProviderProps) => {
  const currentSelectedTimesRef = useRef<Set<string>>(new Set());

  const getCurrentSelectedTimes = useCallback(() => {
    return currentSelectedTimesRef.current;
  }, []);

  const updateCurrentSelectedTimes = useCallback((selectedTimes: Set<string>) => {
    currentSelectedTimesRef.current = new Set(selectedTimes);
  }, []);

  return (
    <TimeSelectionContext.Provider
      value={{
        getCurrentSelectedTimes,
        updateCurrentSelectedTimes,
      }}
    >
      {children}
    </TimeSelectionContext.Provider>
  );
};

export const useTimeSelectionContext = () => {
  const context = useContext(TimeSelectionContext);
  if (!context) {
    throw new Error('useTimeSelectionContext는 TimeSelectionProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
