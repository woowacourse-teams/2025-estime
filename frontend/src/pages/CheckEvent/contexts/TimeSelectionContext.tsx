import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface TimeSelectionContextType {
  commitSelectedTimes: (selectedTimes: Set<string>) => void;
}

const TimeSelectionContext = createContext<TimeSelectionContextType | null>(null);

interface TimeSelectionProviderProps {
  children: ReactNode;
  onCommit: (selectedTimes: Set<string>) => void;
}

export const TimeSelectionProvider = ({ children, onCommit }: TimeSelectionProviderProps) => {
  const commitSelectedTimes = useCallback(
    (selectedTimes: Set<string>) => {
      onCommit(selectedTimes);
    },
    [onCommit]
  );

  const contextValue = useRef<TimeSelectionContextType>({
    commitSelectedTimes,
  });

  // onCommit이 변경될 때만 contextValue 업데이트
  if (contextValue.current.commitSelectedTimes !== commitSelectedTimes) {
    contextValue.current = { commitSelectedTimes };
  }

  return (
    <TimeSelectionContext.Provider value={contextValue.current}>
      {children}
    </TimeSelectionContext.Provider>
  );
};

export const useTimeSelectionContext = () => {
  const context = useContext(TimeSelectionContext);
  if (!context) {
    throw new Error('useTimeSelectionContext must be used within TimeSelectionProvider');
  }
  return context;
};
