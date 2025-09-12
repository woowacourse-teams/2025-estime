import { createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface TimeSelectionContextType {
  commitSelectedTimes: (selectedTimes: Set<string>) => void;
  getCurrentSelectedTimes: () => Set<string>;
  commitCurrentSelectedTimes: () => void;
  updateCurrentSelectedTimes: (selectedTimes: Set<string>) => void;
}

const TimeSelectionContext = createContext<TimeSelectionContextType | null>(null);

interface TimeSelectionProviderProps {
  children: ReactNode;
  onCommit: (selectedTimes: Set<string>) => void;
}

export const TimeSelectionProvider = ({ children, onCommit }: TimeSelectionProviderProps) => {
  // 현재 선택된 시간들을 ref로 관리 (리렌더링 없이)
  const currentSelectedTimesRef = useRef<Set<string>>(new Set());

  const commitSelectedTimes = useCallback(
    (selectedTimes: Set<string>) => {
      // ref 업데이트
      currentSelectedTimesRef.current = new Set(selectedTimes);
      // 외부로 commit
      onCommit(selectedTimes);
    },
    [onCommit]
  );

  const getCurrentSelectedTimes = useCallback(() => {
    return currentSelectedTimesRef.current;
  }, []);

  const commitCurrentSelectedTimes = useCallback(() => {
    onCommit(currentSelectedTimesRef.current);
  }, [onCommit]);

  const updateCurrentSelectedTimes = useCallback((selectedTimes: Set<string>) => {
    currentSelectedTimesRef.current = new Set(selectedTimes);
  }, []);

  const contextValue = useRef<TimeSelectionContextType>({
    commitSelectedTimes,
    getCurrentSelectedTimes,
    commitCurrentSelectedTimes,
    updateCurrentSelectedTimes,
  });

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
