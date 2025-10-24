import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

interface UserNameType {
  name: string;
  isLoggedIn: boolean;
}

const createUserNameStore = () => {
  const store = createStore<UserNameType>({
    name: '',
    isLoggedIn: false,
  });

  const onChangeName = (name: string) => store.setState((prev) => ({ ...prev, name }));
  const loginComplete = () => store.setState((prev) => ({ ...prev, isLoggedIn: true }));

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
    onChangeName,
    loginComplete,
  };
};

export const userNameStore = createUserNameStore();

// input o
export const useUserName = () => {
  return useSyncExternalStore(userNameStore.subscribe, userNameStore.getSnapshot);
};
