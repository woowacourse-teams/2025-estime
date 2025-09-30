import { useState, useCallback } from 'react';
import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { UserAvailability } from '@/pages/CheckEvent/types/userAvailability';
import useFetch from '@/shared/hooks/common/useFetch';
import { showToast } from '@/shared/store/toastStore';

const initialUserAvailability = {
  userName: '앙부일구',
  selectedTimes: new Set<string>(),
};

export const useUserAvailability = ({
  name,
  session,
}: {
  name: string;
  session: string | null;
}) => {
  const { isLoading, runFetch } = useFetch();

  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);

  const userAvailabilitySubmit = async () => {
    const payload = toCreateUserAvailability(userAvailability);
    await runFetch({
      context: 'userAvailabilitySubmit',
      requestFn: () => updateUserAvailableTime(session, payload),
    });
    showToast({
      type: 'success',
      message: '시간표 저장이 완료되었습니다!',
    });
  };

  const fetchUserAvailableTime = useCallback(async () => {
    if (!session) {
      alert('세션이 없습니다. 다시 시도해주세요.');
      return;
    }

    const userAvailableTimeInfo = await runFetch({
      context: 'fetchUserAvailableTime',
      requestFn: () => getUserAvailableTime(session, name),
    });
    if (userAvailableTimeInfo === undefined) return;
    if (userAvailableTimeInfo.dateTimeSlots.length > 0) {
      const selectedTimesResponse = new Set(userAvailableTimeInfo.dateTimeSlots);
      setUserAvailability({ userName: name, selectedTimes: selectedTimesResponse });
    }
  }, [name, session, runFetch]);

  return {
    userAvailabilitySubmit,
    fetchUserAvailableTime,
    isUserAvailabilityLoading: isLoading,
    userAvailability,
  };
};

export default useUserAvailability;
