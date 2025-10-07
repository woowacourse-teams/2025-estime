import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';
import { HeatmapDateCellInfo } from '../hooks/useHeatmapStatistics';


type RoomStatistics = Map<string, HeatmapDateCellInfo>;

const createRoomStatisticsStore = () => {
  const store = createStore<RoomStatistics>(new Map());

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
  };
};

export const roomStatisticsStore = createRoomStatisticsStore();

export const useRoomStatistics = () => {
  return useSyncExternalStore(roomStatisticsStore.subscribe, roomStatisticsStore.getSnapshot);
};
