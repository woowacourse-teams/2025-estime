import { getRoomStatistics2 } from '@/apis/room/room';
import useFetch from '@/shared/hooks/common/useFetch';
import { useEffect, useCallback } from 'react';
import { roomStatisticsStore, type StatisticItem } from '../stores/roomStatisticsStore';
import type { GetRoomStatistics2ResponseType } from '@/apis/room/type';
import { useAnnounceContext } from '@/shared/contexts/AnnounceContext';
import { FormatManager } from '@/shared/utils/common/FormatManager';

const useHeatmapStatistics = ({ session }: { session: string }) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: useCallback(() => getRoomStatistics2(session), [session]),
  });

  const { statisticsAnnounce } = useAnnounceContext();

  const announceNewStatistics = useCallback(
    (recommendedTime: string[]) => {
      const recommendedTimeString = recommendedTime
        .map((date) =>
          new Date(date).toLocaleString('ko-kr', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        )
        .slice(0, 6)
        .join(', ');

      statisticsAnnounce.announce(`추천 시간대는 다음과 같습니다. ${recommendedTimeString}`);
    },
    [statisticsAnnounce]
  );

  const storeRoomResponse = useCallback(
    (response: GetRoomStatistics2ResponseType) => {
      const statisticsMap = new Map<string, StatisticItem>();
      const recommendedTime = [];
      const { participantCount, participants, maxVoteCount, statistics } = response;

      for (const item of statistics) {
        // 🔥 slotCode → dateTimeSlot 변환
        const dateTimeSlot = FormatManager.decodeSlotCode(item.slotCode);

        if (item.participantNames.length === maxVoteCount) {
          recommendedTime.push(dateTimeSlot);
        }
        statisticsMap.set(dateTimeSlot, {
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
