import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

const createCellHoverStore = () => {
  const store = createStore<boolean | undefined>(false);

  const initialStore = () => store.setState(false);

  const handleCellHoverLock = () => store.setState(true);
  const handleCellHoverUnLock = () => store.setState(false);

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
    initialStore,
    handleCellHoverLock,
    handleCellHoverUnLock,
  };
};

export const cellHoverStore = createCellHoverStore();

export const useCellHoverState = () => {
  return useSyncExternalStore(cellHoverStore.subscribe, cellHoverStore.getSnapshot);
};
