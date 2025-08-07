import { getRoomStatistics } from '@/apis/room/room';
import type { GetRoomStatisticsResponseType } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/utils/getWeight';
import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { useToastContext } from '@/contexts/ToastContext';

export interface DateCellInfo {
  weight: number;
  participantNames: string[];
}

export default function useRoomStatistics({
  session,
  weightCalculateStrategy,
}: {
  session: string;
  weightCalculateStrategy: WeightCalculateStrategy;
}) {
  const { addToast } = useToastContext();

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
        // 인터페이스 유지를 위해 중간 min 값은 0으로 두면 될듯.
        weight: weightCalculateStrategy(
          stat.participantNames.length,
          dummyMinValue,
          participantCount
        ),
        // userNames는 후에 툴팁 제작에 사용될 예정이라 미리 파두었음.
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
      addToast({
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
}
