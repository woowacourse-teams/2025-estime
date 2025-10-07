import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';
import { UserAvailability } from '../types/userAvailability';

const createUserAvailabilityStore = () => {
  const store = createStore<UserAvailability>({
    userName: '',
    selectedTimes: new Set<string>(),
  });

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
  };
};

export const userAvailabilityStore = createUserAvailabilityStore();

// input o
export const useUserAvailability = () => {
  return useSyncExternalStore(userAvailabilityStore.subscribe, userAvailabilityStore.getSnapshot);
};
