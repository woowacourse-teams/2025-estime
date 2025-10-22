import { createContext, useContext, useMemo } from 'react';

import useAriaPolite from '@/shared/hooks/common/useAriaPolite';

interface AnnounceContextType {
  roomInfoAnnounce: ReturnType<typeof useAriaPolite>;
  statisticsAnnounce: ReturnType<typeof useAriaPolite>;
}
const AnnounceContext = createContext<AnnounceContextType | null>(null);

const AnnounceProvider = ({ children }: { children: React.ReactNode }) => {
  const roomInfoAnnounce = useAriaPolite();
  const statisticsAnnounce = useAriaPolite();

  const memoValue = useMemo(
    () => ({ roomInfoAnnounce, statisticsAnnounce }),
    [roomInfoAnnounce, statisticsAnnounce]
  );

  return <AnnounceContext.Provider value={memoValue}>{children}</AnnounceContext.Provider>;
};

export const useAnnounceContext = () => {
  const context = useContext(AnnounceContext);
  if (!context) throw new Error('AnnounceProvider 내부에서만 사용할 수 있습니다.');
  return context;
};

export default AnnounceProvider;
