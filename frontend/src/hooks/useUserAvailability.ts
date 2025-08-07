import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { useToastContext } from '@/contexts/ToastContext';
import { UserAvailability } from '@/types/userAvailability';
import { useState } from 'react';

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
    try {
      const payload = toCreateUserAvailability(userAvailability);
      await updateUserAvailableTime(session, payload);
      addToast({
        type: 'success',
        message: '시간표 저장이 완료되었습니다!',
      });
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
  };

  const fetchUserAvailableTime = async () => {
    if (!session) {
      alert('세션이 없습니다. 다시 시도해주세요.');
      return;
    }
    const userAvailableTimeInfo = await getUserAvailableTime(session, name);
    const dateTimeSlotsResponse = userAvailableTimeInfo.dateTimeSlots;
    userName.set(name);
    if (userAvailableTimeInfo.dateTimeSlots.length > 0) {
      const selectedTimesResponse = new Set(dateTimeSlotsResponse);
      selectedTimes.set(selectedTimesResponse);
    }
  };

  return { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime };
};

export default useUserAvailability;
