import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';
import { HeatmapDateCellInfo } from '../hooks/useHeatmapStatistics';

interface TooltipCellData extends HeatmapDateCellInfo {
  date: string;
  startTime: string;
  endTime: string;
}

const initialCellData = {
  weight: 0,
  participantNames: [],
  isRecommended: false,
  date: '',
  startTime: '',
  endTime: '',
};

const createCellDataStore = () => {
  const store = createStore<TooltipCellData | undefined>(initialCellData);

  const initialStore = () => store.setState(initialCellData);

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
    initialStore,
  };
};

export const cellDataStore = createCellDataStore();

export const useCellData = () => {
  return useSyncExternalStore(cellDataStore.subscribe, cellDataStore.getSnapshot);
};
