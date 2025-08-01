import { getRoomStatistics } from '@/apis/room/room';
import type { StatisticItem } from '@/apis/room/type';
import { useEffect, useState } from 'react';

export interface DateCellInfo {
  howMany: number;
  weight: number;
  userNames: string[];
}

/// 날짜별로 방에 참여한 인원 수와 가중치, 참여자 이름을 담는 인터페이스
/// 가중치는 0에서 1 사이의 값으로, 최소 인원 수를 0, 최대 인원 수를 1로 매핑합니다.
// https://stackoverflow.com/a/39776893
// 추후에 가중치 계산할때, min과 max에 고정 가중치 같은것을 부여해도 좋을지도?
// function minimalGetWeight(value: number, min: number, max: number): number {
//   // 0 으로 나누기 방지.
//   if (max <= min) return value > min ? 1 : 0;
//   return (value - min) / (max - min);
// }

// 가중치 함수 + // 최소 가시치(minVisible) 적용
// 조금 작은 수는 안보이더라구요. (예 0.02-> 0.2)
function getWeight(value: number, min: number, max: number, minVisible = 0.2): number {
  // 0 으로 나누기 방지.
  if (max <= min) {
    if (value <= min) return 0;
    return minVisible;
  }
  let n = (value - min) / (max - min); // 0~1 정규화

  if (n <= 0) return 0; // 완전 투명

  // 1 넘아가면 1 이상 못가게! (클램프)
  if (n >= 1) n = 1;

  return minVisible + (1 - minVisible) * n; // 최소 가시치부터 선형 증가
}

export default function useRoomStatistics({ session }: { session: string }) {
  const [roomStatistics, setRoomStatistics] = useState<Map<string, DateCellInfo>>(new Map());

  const formatRoomStatistics = (statistics: StatisticItem[]): Map<string, DateCellInfo> => {
    const roomStatistics = new Map<string, DateCellInfo>();
    if (statistics.length === 0) {
      return roomStatistics;
    }

    const howMany = statistics.map((stat) => stat.userNames.length);
    const min = Math.min(...howMany);
    // MAX 값은 나중에 API에서 제공으로 대체.
    const max = Math.max(...howMany);

    statistics.map((stat) =>
      roomStatistics.set(stat.dateTime, {
        howMany: stat.userNames.length,
        weight: getWeight(stat.userNames.length, min, max),
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
