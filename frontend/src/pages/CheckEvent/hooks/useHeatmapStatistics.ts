import { getRoomStatistics } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { useEffect, useCallback } from 'react';
import { roomStatisticsStore, type StatisticItem } from '../stores/roomStatisticsStore';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';

const useHeatmapStatistics = ({ session }: { session: string }) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: useCallback(() => getRoomStatistics(session), [session]),
  });

  const storeRoomResponse = useCallback((response: GetRoomStatisticsResponseType) => {
    const statisticsMap = new Map<string, StatisticItem>();

    const { participantCount, participants, maxVoteCount, statistic } = response;
    for (const item of statistic) {
      statisticsMap.set(item.dateTimeSlot, {
        voteCount: item.voteCount,
        weight: item.weight,
        participantNames: item.participantNames,
      });
    }

    roomStatisticsStore.setState({
      participantCount,
      participants,
      maxVoteCount,
      statistics: statisticsMap,
    });
  }, []);

  const fetchRoomStatistics = useCallback(async () => {
    const response = await getStatistics();
    if (response) {
      storeRoomResponse(response);
    }
  }, [storeRoomResponse, getStatistics]);

  useEffect(() => {
    if (session) {
      fetchRoomStatistics();
    }
  }, [session, fetchRoomStatistics]);

  return { fetchRoomStatistics };
};

export default useHeatmapStatistics;
