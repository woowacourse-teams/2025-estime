import { getRecommendedTime } from '@/apis/time/time';
import { RecommendedTimeSlotType } from '@/apis/time/type';
import { useEffect, useState } from 'react';

const useRecommendTime = (session: string | null) => {
  useEffect(() => {
    fetchRecommendTimes();
  }, []);

  const [recommendTimeData, setRecommendTimeData] = useState<RecommendedTimeSlotType[]>([]);

  const fetchRecommendTimes = async () => {
    if (!session) return;
    const recommendTimeData = await getRecommendedTime(session);
    setRecommendTimeData(recommendTimeData.recommendations);
  };

  return {
    recommendTimeData,
    fetchRecommendTimes,
  };
};

export default useRecommendTime;
