import {
  createUserAvailableTime,
  getUserAvailableTime,
  updateUserAvailableTime,
} from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { UserAvailability } from '@/types/userAvailability';
import { useEffect, useState } from 'react';

export const useUserAvailability = ({
  name,
  session,
}: {
  name: string;
  session: string | null;
}) => {
  useEffect(() => {
    const fetchUserAvailableTime = async () => {
      if (!session) {
        alert('세션이 없습니다. 다시 시도해주세요.');
        return;
      }

      const userAvailableTimeInfo = await getUserAvailableTime(session, name);
      if (userAvailableTimeInfo.timeSlots.length > 0) {
        initialUserAvailability.selectedTimes = new Set(userAvailableTimeInfo.timeSlots);
      }
    };

    fetchUserAvailableTime();
  }, []);

  const initialUserAvailability = {
    userName: '메이토',
    selectedTimes: new Set<string>(),
  };
  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);

  const userName = {
    value: name,
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
      return response;
    } catch (err) {
      const e = err as Error;
      alert(e.message);
      console.error(err);
    }
  };

  return {
    userName,
    selectedTimes,
    userAvailabilitySubmit,
  };
};

export default useUserAvailability;
