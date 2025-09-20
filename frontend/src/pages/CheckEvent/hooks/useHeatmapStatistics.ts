import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { useEffect, useState } from 'react';
import useFetch from '@/shared/hooks/common/useFetch';

export interface DateCellInfo {
  weight: number;
  participantNames: string[];
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
  const { runFetch } = useFetch();

  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());
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
    if (!sessionId || !isRoomSessionExist) return;

    const response = await runFetch({
      context: 'fetchRoomStatistics',
      requestFn: () => getRoomStatistics(sessionId),
    });

    if (response === undefined) return;
    const result = formatRoomStatistics(response);
    setRoomStatistics(result);
  };

  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [session, isRoomSessionExist]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
