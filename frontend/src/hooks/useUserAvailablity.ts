import { createUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { UserAvailability } from '@/types/userAvailability';
import { useState } from 'react';

export const useUserAvailability = () => {
  const initialUserAvailability = {
    userName: '메이토',
    selectedTimes: new Set<string>(),
  };
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

  const userAvailabilitySubmit = async (session: string) => {
    try {
      const payload = toCreateUserAvailability(userAvailability);
      const response = await createUserAvailableTime(session, payload);
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
