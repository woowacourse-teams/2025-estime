import createStore from '@/shared/store/createStore';
import { useSyncExternalStore } from 'react';

import { GetRoomStatisticsResponseType } from '@/apis/room/type';

export interface StatisticItem {
  voteCount: number;
  weight: number;
  participantNames: string[];
}
interface RoomStatisticsStore extends Omit<GetRoomStatisticsResponseType, 'statistic'> {
  statistics: Map<string, StatisticItem>;
}
const createRoomStatisticsStore = () => {
  const store = createStore<RoomStatisticsStore>({
    participantCount: 0,
    participants: [],
    maxVoteCount: 0,
    statistics: new Map(),
  });

  return {
    ...store, // getSnapshot, subscribe, setState 재사용
  };
};

export const roomStatisticsStore = createRoomStatisticsStore();

export const useRoomStatistics = () => {
  return useSyncExternalStore(roomStatisticsStore.subscribe, roomStatisticsStore.getSnapshot);
};
