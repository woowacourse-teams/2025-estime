import { createContext, useContext } from 'react';

export interface MobileContextType {
  isMobile: boolean;
}

export const MobileContext = createContext<MobileContextType | null>(null);
export const useMobile = () => useContext(MobileContext);

export const useMobileContext = () => {
  const context = useContext(MobileContext)!;

  if (!context) throw new Error('useMobileContext must be used within a MobileProvider');

  return context;
};
