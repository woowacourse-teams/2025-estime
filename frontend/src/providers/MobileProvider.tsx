import { MobileContext } from '@/contexts/MobileContext';
import { useIsMobile } from '@/hooks/Mobile/useIsMobile';

const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return <MobileContext.Provider value={{ isMobile }}>{children}</MobileContext.Provider>;
};

export default MobileProvider;
