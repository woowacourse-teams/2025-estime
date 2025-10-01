import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType, StatisticItem } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import useFetch from '@/shared/hooks/common/useFetch';
import { useEffect, useCallback } from 'react';
import { useRoomStatisticsContext } from '../provider/RoomStatisticsProvider';

export interface DateCellInfo {
  weight: number;
  participantNames: string[];
}
export interface HeatmapDateCellInfo extends DateCellInfo {
  isRecommended: boolean;
}

const useHeatmapStatistics = ({
  session,
  weightCalculateStrategy,
  isRoomSessionExist,
}: {
  session: string;
  weightCalculateStrategy: WeightCalculateStrategy;
  isRoomSessionExist: boolean;
}) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: () => getRoomStatistics(session),
  });
  const { roomStatistics, setRoomStatistics } = useRoomStatisticsContext();

  const getWeightStatistics = useCallback(
    (statistic: StatisticItem[], participantCount: number) => {
      const dummyMinValue = 0;
      const weightStatistics = new Map<string, DateCellInfo>();
      let maxWeight = -Infinity;
      if (statistic.length === 0 || !participantCount) {
        return { maxWeight: 0, weightStatistics };
      }
      for (const stat of statistic) {
        const { participantNames } = stat;
        const weight = weightCalculateStrategy(
          participantNames.length,
          dummyMinValue,
          participantCount
        );
        maxWeight = Math.max(maxWeight, weight);
        weightStatistics.set(stat.dateTimeSlot, {
          participantNames,
          weight,
        });
      }
      return { maxWeight, weightStatistics };
    },
    [weightCalculateStrategy]
  );
  const formatRoomStatistics = useCallback(
    (statistics: GetRoomStatisticsResponseType): Map<string, HeatmapDateCellInfo> => {
      const { statistic, participantCount } = statistics;

      const formattedRoomStatistics = new Map<string, HeatmapDateCellInfo>();
      if (statistic.length === 0 || !participantCount) {
        return formattedRoomStatistics;
      }

      const { maxWeight, weightStatistics } = getWeightStatistics(statistic, participantCount);

      for (const [key, value] of weightStatistics) {
        const dateTimeSlot = key;
        const { weight, participantNames } = value;

        formattedRoomStatistics.set(dateTimeSlot, {
          weight,
          participantNames,
          isRecommended: weight === maxWeight,
        });
      }
      return formattedRoomStatistics;
    },
    [getWeightStatistics]
  );

  const fetchRoomStatistics = useCallback(
    async (sessionId: string) => {
      if (!sessionId || !isRoomSessionExist) return;

      const response = await getStatistics();

      if (response === undefined) return;
      const result = formatRoomStatistics(response);
      setRoomStatistics(result);
    },
    [isRoomSessionExist, formatRoomStatistics]
  );

  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [session, fetchRoomStatistics]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
