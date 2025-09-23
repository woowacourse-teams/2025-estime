import { createContext, useContext, useState, ReactNode } from 'react';
import type { DateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';

interface RoomStatisticsContextProps {
  roomStatistics: Map<string, DateCellInfo>;
  setRoomStatistics: React.Dispatch<React.SetStateAction<Map<string, DateCellInfo>>>;
}

const RoomStatisticsContext = createContext<RoomStatisticsContextProps | undefined>(undefined);

export const RoomStatisticsProvider = ({ children }: { children: ReactNode }) => {
  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());

  return (
    <RoomStatisticsContext.Provider value={{ roomStatistics, setRoomStatistics }}>
      {children}
    </RoomStatisticsContext.Provider>
  );
};

export const useRoomStatisticsContext = () => {
  const context = useContext(RoomStatisticsContext);
  if (!context)
    throw new Error('useRoomStatisticsContext must be used within RoomStatisticsProvider');
  return context;
};
