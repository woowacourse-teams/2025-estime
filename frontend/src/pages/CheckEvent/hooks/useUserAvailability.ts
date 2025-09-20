import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { useToastContext } from '@/shared/contexts/ToastContext';
import { UserAvailability } from '@/pages/CheckEvent/types/userAvailability';
import { useState } from 'react';
import useFetch from '@/shared/hooks/common/useFetch';

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
  const { addToast } = useToastContext();
  const { isLoading, runFetch } = useFetch();

  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);

  const userName = {
    value: userAvailability.userName,
    set: (userName: string) => setUserAvailability((prev) => ({ ...prev, userName })),
  };

  const selectedTimes = {
    value: userAvailability.selectedTimes,
    set: (selectedTimes: Set<string>) =>
      setUserAvailability((prev) => ({ ...prev, selectedTimes })),
  };

  const userAvailabilitySubmit = async () => {
    const payload = toCreateUserAvailability(userAvailability);
    await runFetch({
      context: 'userAvailabilitySubmit',
      requestFn: () => updateUserAvailableTime(session, payload),
    });
    addToast({
      type: 'success',
      message: '시간표 저장이 완료되었습니다!',
    });
  };

  const fetchUserAvailableTime = async () => {
    if (!session) {
      alert('세션이 없습니다. 다시 시도해주세요.');
      return;
    }

    const userAvailableTimeInfo = await runFetch({
      context: 'fetchUserAvailableTime',
      requestFn: () => getUserAvailableTime(session, name),
    });
    if (userAvailableTimeInfo === undefined) return;
    const dateTimeSlotsResponse = userAvailableTimeInfo.dateTimeSlots;
    userName.set(name);
    if (userAvailableTimeInfo.dateTimeSlots.length > 0) {
      const selectedTimesResponse = new Set(dateTimeSlotsResponse);
      selectedTimes.set(selectedTimesResponse);
    }
  };

  return {
    userName,
    selectedTimes,
    userAvailabilitySubmit,
    fetchUserAvailableTime,
    isUserAvailabilityLoading: isLoading,
  };
};

export default useUserAvailability;
