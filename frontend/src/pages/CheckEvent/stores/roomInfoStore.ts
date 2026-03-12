import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

interface RoomInfoStore {
  minSlotCode: number;
}

const roomInfoStore = createStore<RoomInfoStore>({
  minSlotCode: Infinity,
});

export { roomInfoStore };

export const useRoomInfo = () => {
  return useSyncExternalStore(roomInfoStore.subscribe, roomInfoStore.getSnapshot);
};
