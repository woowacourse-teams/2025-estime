import { getRoomStatistics } from '@/apis/room/room';
import type { StatisticItem } from '@/apis/room/type';
import { useEffect, useState } from 'react';

export default function useRoomStatistics({ session }: { session: string }) {
  const [roomStatistics, setRoomStatistics] = useState<StatisticItem[] | []>([]);

  const fetchRoomStatistics = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const res = await getRoomStatistics(sessionId);
      setRoomStatistics(res.statistic);
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
