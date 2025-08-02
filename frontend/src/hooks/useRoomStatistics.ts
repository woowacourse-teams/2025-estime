import { getRoomStatistics } from '@/apis/room/room';
import type { StatisticItem } from '@/apis/room/type';
import type { WeightCalculateStrategy } from '@/utils/getWeight';
import { useEffect, useState } from 'react';

export interface DateCellInfo {
  weight: number;
  userNames: string[];
}

export default function useRoomStatistics({
  session,
  weightCalculateStrat,
}: {
  session: string;
  weightCalculateStrat: WeightCalculateStrategy;
}) {
  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());

  const formatRoomStatistics = (statistics: StatisticItem[]): Map<string, DateCellInfo> => {
    const roomStatistics = new Map<string, DateCellInfo>();
    if (statistics.length === 0) {
      return roomStatistics;
    }

    const userCounts = statistics.map((stat) => stat.userNames.length);
    const min = Math.min(...userCounts);
    // MAX 값은 나중에 API에서 제공으로 대체.
    const max = Math.max(...userCounts);

    statistics.map((stat) =>
      roomStatistics.set(stat.dateTime, {
        weight: weightCalculateStrat(stat.userNames.length, min, max),
        // userNames는 후에 툴팁 제작에 사용될 예정이라 미리 파두었음.
        userNames: stat.userNames,
      })
    );
    return roomStatistics;
  };

  const fetchRoomStatistics = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const res = await getRoomStatistics(sessionId);
      const result = formatRoomStatistics(res.statistic);
      setRoomStatistics(result);
    } catch (err) {
      const e = err as Error;
      console.error(e);
      alert(e.message);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [session]);

  return { roomStatistics, fetchRoomStatistics };
}
