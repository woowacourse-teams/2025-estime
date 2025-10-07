import { getRoomStatistics } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { useEffect, useCallback } from 'react';
import { roomStatisticsStore } from '../stores/roomStatisticsStore';

const useHeatmapStatistics = ({ session }: { session: string }) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: useCallback(() => getRoomStatistics(session), [session]),
  });

  const fetchRoomStatistics = useCallback(async () => {
    const response = await getStatistics();

    if (response === undefined) return;
    const { participantCount, participants, maxVoteCount, statistic } = response;
    const statisticsMap = new Map();

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
  }, [getStatistics]);

  useEffect(() => {
    if (session) {
      fetchRoomStatistics();
    }
  }, [session, fetchRoomStatistics]);

  return { fetchRoomStatistics };
};

export default useHeatmapStatistics;
