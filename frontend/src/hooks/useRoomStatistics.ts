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
  weightCalculateStrategy,
}: {
  session: string;
  weightCalculateStrategy: WeightCalculateStrategy;
}) {
  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());
  const dummyMinValue = 0;
  const formatRoomStatistics = (statistics: StatisticItem[]): Map<string, DateCellInfo> => {
    const roomStatistics = new Map<string, DateCellInfo>();
    if (statistics.length === 0) {
      return roomStatistics;
    }
    // 이건 API 넘어오기 전까지만 유지.
    const userCounts = Math.max(...statistics.map((stat) => stat.userNames.length));

    statistics.map((stat) =>
      roomStatistics.set(stat.dateTime, {
        // 인터페이스 유지를 위해 중간 min 값은 0으로 두면 될듯.
        weight: weightCalculateStrategy(stat.userNames.length, dummyMinValue, userCounts),
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
