import { useCallback } from 'react';
import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import useFetch from '@/shared/hooks/common/useFetch';
import { userNameStore } from '../stores/userNameStore';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';

export const useUserAvailability = ({ session }: { session: string }) => {
  const { triggerFetch: getUserTime } = useFetch({
    context: 'fetchUserAvailableTime',
    requestFn: () =>
      // const name = userNameStore.getSnapshot();
      getUserAvailableTime(session, userNameStore.getSnapshot()),
  });

  const { isLoading: isSavingUserTime, triggerFetch: handleUserAvailabilitySubmit } = useFetch({
    context: 'handleUserAvailabilitySubmit',
    requestFn: () =>
      updateUserAvailableTime(
        session,
        toCreateUserAvailability(userAvailabilityStore.getSnapshot())
      ),
  });

  const fetchUserAvailableTime = useCallback(async () => {
    const userAvailableTimeInfo = await getUserTime();
    if (userAvailableTimeInfo === undefined) return;

    const selectedTimesResponse = new Set(userAvailableTimeInfo.dateTimeSlots);
    userAvailabilityStore.setState((prev) => ({
      ...prev,
      userName: userNameStore.getSnapshot(),
      selectedTimes: selectedTimesResponse,
    }));
  }, [getUserTime]);

  return {
    handleUserAvailabilitySubmit,
    fetchUserAvailableTime,
    isSavingUserTime,
  };
};

export default useUserAvailability;
