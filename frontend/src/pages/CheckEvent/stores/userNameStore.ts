import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

const createUserNameStore = () => {
  const store = createStore<string>('');

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
  };
};

export const userNameStore = createUserNameStore();

// input o
export const useUserName = () => {
  return useSyncExternalStore(userNameStore.subscribe, userNameStore.getSnapshot);
};
