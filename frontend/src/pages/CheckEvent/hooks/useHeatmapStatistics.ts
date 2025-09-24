import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType, StatisticItem } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { useEffect, useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { showToast } from '@/shared/store/toastStore';

interface DateCellInfo {
  weight: number;
  participantNames: string[];
}
export interface HeatmapDateCellInfo extends DateCellInfo {
  isRecommended: boolean;
}

const useHeatmapStatistics = ({
  session,
  weightCalculateStrategy,
}: {
  session: string;
  weightCalculateStrategy: WeightCalculateStrategy;
}) => {

  const [roomStatistics, setRoomStatistics] = useState<Map<string, HeatmapDateCellInfo>>(new Map());

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
      if (!sessionId) return;
      try {
        const res = await getRoomStatistics(sessionId);
        const result = formatRoomStatistics(res);
        setRoomStatistics(result);
      } catch (err) {
        const e = err as Error;
        console.error(e);
        showToast({
          type: 'error',
          message: e.message,
        });
        Sentry.captureException(err, {
          level: 'error',
        });
      }
    },
    [formatRoomStatistics]
  );

  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [fetchRoomStatistics, session]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
