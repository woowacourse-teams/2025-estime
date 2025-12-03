import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';
import { StatisticItem } from './roomStatisticsStore';

interface TooltipCellData extends StatisticItem {
  date: string;
  isRecommended: boolean;
  startTime: string;
  endTime: string;
}

const initialCellData = {
  voteCount: 0,
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
