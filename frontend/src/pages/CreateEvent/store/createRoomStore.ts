import { useSyncExternalStore } from 'react';
import type { CreateRoomInfoType } from '@/pages/CreateEvent/types/roomInfo';
import { initialCreateRoomInfo } from '@/constants/initialRoomInfo';
import createStore from '@/shared/store/createStore';

const createRoomStore = () => {
  const store = createStore<CreateRoomInfoType>(initialCreateRoomInfo);

  const onChangeTitle = (title: string) => {
    store.setState((prev) => ({ ...prev, title }));
  };

  const onChangeAvailableDateSlots = (availableDateSlots: Set<string>) => {
    store.setState((prev) => ({ ...prev, availableDateSlots }));
  };

  const onChangeTime = (time: { startTime: string; endTime: string }) => {
    store.setState((prev) => ({ ...prev, time }));
  };

  const onChangeDeadline = (deadline: { date: string; time: string }) => {
    store.setState((prev) => ({ ...prev, deadline }));
  };

  return {
    ...store,
    onChangeTitle,
    onChangeAvailableDateSlots,
    onChangeTime,
    onChangeDeadline,
  };
};

const roomStore = createRoomStore();

export const getRoomInfo = roomStore.getSnapshot;

export const onChangeTitle = roomStore.onChangeTitle;
export const onChangeTime = roomStore.onChangeTime;
export const onChangeAvailableDateSlots = roomStore.onChangeAvailableDateSlots;
export const onChangeDeadline = roomStore.onChangeDeadline;

export const useRoomSelector = <T extends keyof CreateRoomInfoType>(selector: T) => {
  return useSyncExternalStore(roomStore.subscribe, () => getRoomInfo()[selector]);
};
