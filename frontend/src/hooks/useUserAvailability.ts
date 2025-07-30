import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
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
      const response = await updateUserAvailableTime(session, payload);
      alert(response.message);
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
    userName.set(name);

    if (userAvailableTimeInfo.dateTimeSlots.length > 0) {
      const selectedTimesResponse = new Set(
        userAvailableTimeInfo.dateTimeSlots.map((item) => item.dateTime)
      );
      selectedTimes.set(selectedTimesResponse);
    }
  };

  return { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime };
};

export default useUserAvailability;
