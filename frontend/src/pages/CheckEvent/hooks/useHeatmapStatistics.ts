import { getRoomStatistics } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { useEffect, useCallback } from 'react';
import { roomStatisticsStore, type StatisticItem } from '../stores/roomStatisticsStore';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';
import { useAnnounceContext } from '@/shared/contexts/AnnounceContext';
import { FormatManager } from '@/shared/utils/common/FormatManager';

const useHeatmapStatistics = ({ session }: { session: string }) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: useCallback(() => getRoomStatistics(session), [session]),
  });

  const { statisticsAnnounce } = useAnnounceContext();

  const announceNewStatistics = useCallback(
    (recommendedTime: number[]) => {
      const recommendedTimeString = recommendedTime
        .map((slotCode) => {
          const dateTimeSlot = FormatManager.decodeSlotCode(slotCode);
          return new Date(dateTimeSlot).toLocaleString('ko-kr', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        })
        .slice(0, 6)
        .join(', ');

      statisticsAnnounce.announce(`추천 시간대는 다음과 같습니다. ${recommendedTimeString}`);
    },
    [statisticsAnnounce]
  );

  const storeRoomResponse = useCallback(
    (response: GetRoomStatisticsResponseType) => {
      const statisticsMap = new Map<number, StatisticItem>();
      const recommendedTime = [];
      const { participantCount, participants, maxVoteCount, statistics } = response;

      for (const item of statistics) {
        if (item.participantNames.length === maxVoteCount) {
          recommendedTime.push(item.slotCode);
        }
        statisticsMap.set(item.slotCode, {
          voteCount: item.voteCount,
          weight: item.weight,
          participantNames: item.participantNames,
        });
      }

      roomStatisticsStore.setState({
        recommendedTime,
        participantCount,
        participants,
        maxVoteCount,
        statistics: statisticsMap,
      });

      announceNewStatistics(recommendedTime);
    },
    [announceNewStatistics]
  );
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
  }, [fetchRoomStatistics, session]);

  return { fetchRoomStatistics };
};

export default useHeatmapStatistics;
