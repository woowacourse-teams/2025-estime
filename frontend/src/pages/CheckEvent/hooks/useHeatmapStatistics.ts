import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { useEffect, useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { showToast } from '@/shared/store/toastStore';

export interface DateCellInfo {
  weight: number;
  participantNames: string[];
}

const useHeatmapStatistics = ({
  session,
  weightCalculateStrategy,
}: {
  session: string;
  weightCalculateStrategy: WeightCalculateStrategy;
}) => {
  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());
  const dummyMinValue = 0;

  const formatRoomStatistics = useCallback(
    (statistics: GetRoomStatisticsResponseType): Map<string, DateCellInfo> => {
      const { statistic, participantCount } = statistics;
      const result = new Map<string, DateCellInfo>();
      if (statistic.length === 0 || !participantCount) return result;

      for (const stat of statistic) {
        result.set(stat.dateTimeSlot, {
          weight: weightCalculateStrategy(
            stat.participantNames.length,
            dummyMinValue,
            participantCount
          ),
          participantNames: stat.participantNames,
        });
      }
      return result;
    },
    [dummyMinValue, weightCalculateStrategy]
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
        addToast({
          type: 'error',
          message: e.message,
        });
        Sentry.captureException(err, {
          level: 'error',
        });
      }
    },
    [addToast, formatRoomStatistics]
  );

  


  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [fetchRoomStatistics, session]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
