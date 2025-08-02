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
// 정책:
// - 값이 모두 동일하고 그 값이 0이면 0 (완전 투명)
// - 값이 모두 동일하고 그 값이 >0이면 minVisible (최소 가시치)
// - 일반 구간은 [min, max]를 0~1로 선형 정규화하고, 0이면 0, 그 외는 minVisible~1로 매핑
// - 표본이 적어 range가 작을 때 극단값 방지를 위해 최소 범위 적용
export function getWeight(value: number, min: number, max: number, minVisible = 0.2): number {
  // 0~1로 클램프
  minVisible = Math.min(1, Math.max(0, minVisible));

  // 모두 0
  if (max === 0) return 0;

  // 모두 동일(>0) — 상대적으로 모두 최대
  if (max === min) return 1;

  const minRange = 3; // 최소 단계
  const actualRange = max - min;

  // 범위가 너무 작으면 '최댓값 고정' 상태에서 하한만 끌어내리기
  // => 최댓값은 항상 n=1이 됨
  let adjustedMin = min;
  let anchoredMax = max;

  if (actualRange < minRange) {
    adjustedMin = Math.min(min, max - minRange); // 하한만 확장
  }

  // anchoredMax를 분모에 써서 최댓값이 1.0이 되도록 앵커링
  let n = (value - adjustedMin) / (anchoredMax - adjustedMin);

  if (n <= 0) return 0; // 0표는 완전 투명
  if (n >= 1) n = 1;

  return minVisible + (1 - minVisible) * n;
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
