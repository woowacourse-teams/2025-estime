import { createContext, useContext, ReactNode, useCallback, useRef, useMemo } from 'react';
import { LoginData } from '../hooks/useUserLogin';

interface CheckPageContextType {
  getCurrentSelectedTimes: () => Set<string>;
  updateCurrentSelectedTimes: (selectedTimes: Set<string>) => void;
  updateUserData: (userData: LoginData) => void;
  getUserData: () => LoginData;
}

const CheckPageContext = createContext<CheckPageContextType | null>(null);

interface CheckPageProviderProps {
  children: ReactNode;
}

export const CheckPageProvider = ({ children }: CheckPageProviderProps) => {
  const currentSelectedTimesRef = useRef<Set<string>>(new Set());
  const userDataRef = useRef<LoginData>({ name: '' });

  const getCurrentSelectedTimes = useCallback(() => {
    return currentSelectedTimesRef.current;
  }, []);

  const updateCurrentSelectedTimes = useCallback((selectedTimes: Set<string>) => {
    currentSelectedTimesRef.current = new Set(selectedTimes);
  }, []);

  const updateUserData = useCallback((userData: LoginData) => {
    userDataRef.current = userData;
  }, []);

  const getUserData = useCallback(() => {
    return userDataRef.current;
  }, []);

  const value = useMemo(
    () => ({
      getCurrentSelectedTimes,
      updateCurrentSelectedTimes,
      getUserData,
      updateUserData,
    }),
    [getCurrentSelectedTimes, updateCurrentSelectedTimes, getUserData, updateUserData]
  );
  return <CheckPageContext.Provider value={value}>{children}</CheckPageContext.Provider>;
};

export const useCheckPageContext = () => {
  const context = useContext(CheckPageContext);
  if (!context) {
    throw new Error('useCheckPageContext는 CheckPageProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
