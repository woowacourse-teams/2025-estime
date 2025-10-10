import { useSyncExternalStore } from 'react';
import createStore from '@/shared/store/createStore';

interface PaginationState {
  currentPage: number;
}

const paginationStore = createStore<PaginationState>({
  currentPage: 1,
});

export const usePaginationStore = () =>
  useSyncExternalStore(paginationStore.subscribe, paginationStore.getSnapshot);

export { paginationStore };
