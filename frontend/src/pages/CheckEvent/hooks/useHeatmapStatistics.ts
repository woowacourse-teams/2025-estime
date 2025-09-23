import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { showToast } from '@/shared/store/toastStore';
import { useRoomStatisticsContext } from '../provider/RoomStatisticsProvider';

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
  const { roomStatistics, setRoomStatistics } = useRoomStatisticsContext();

  const dummyMinValue = 0;
  const formatRoomStatistics = (
    statistics: GetRoomStatisticsResponseType
  ): Map<string, DateCellInfo> => {
    const { statistic, participantCount } = statistics;
    const roomStatistics = new Map<string, DateCellInfo>();
    if (statistic.length === 0 || !participantCount) {
      return roomStatistics;
    }

    statistic.map((stat) =>
      roomStatistics.set(stat.dateTimeSlot, {
        weight: weightCalculateStrategy(
          stat.participantNames.length,
          dummyMinValue,
          participantCount
        ),
        participantNames: stat.participantNames,
      })
    );
    return roomStatistics;
  };

  const fetchRoomStatistics = async (sessionId: string) => {
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
  };

  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [session]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
