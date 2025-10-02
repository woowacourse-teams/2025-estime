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
}: {
  session: string;
  // 서버에서 weight 내려준 이후에 제거 예정
  weightCalculateStrategy: WeightCalculateStrategy;
}) => {
  const { triggerFetch: getStatistics } = useFetch({
    context: 'fetchRoomStatistics',
    requestFn: () => getRoomStatistics(session),
  });

  // roomStatistics도 전역 store로 관리 예정
  const { roomStatistics, setRoomStatistics } = useRoomStatisticsContext();

  // 서버에서 데이터 보내줄 예정
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

  // 서버에서 데이터 보내줄 예정
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

  // 사라질 예정
  const fetchRoomStatistics = useCallback(async () => {
    const response = await getStatistics();

    if (response === undefined) return;
    const result = formatRoomStatistics(response);
    setRoomStatistics(result);
  }, [formatRoomStatistics]);

  useEffect(() => {
    if (session) {
      // await getStatistics();
      fetchRoomStatistics();
    }
  }, [session, fetchRoomStatistics]);

  return { roomStatistics, fetchRoomStatistics };
};

export default useHeatmapStatistics;
