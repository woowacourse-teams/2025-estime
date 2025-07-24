import { getRecommendedTime } from '@/apis/time/time';
import { RecommendedTimeSlotType } from '@/apis/time/type';
import { useEffect, useState } from 'react';

const useRecommendTime = (session: string) => {
  useEffect(() => {
    fetchRecommendTimes();
  }, []);

  const [recommendTimeData, setRecommendTimeData] = useState<RecommendedTimeSlotType[]>([]);

  const fetchRecommendTimes = async () => {
    const recommendTimeData = await getRecommendedTime(session);
    setRecommendTimeData(recommendTimeData.recommendations);
  };

  return {
    recommendTimeData,
  };
};

export default useRecommendTime;
