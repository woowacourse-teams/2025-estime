import { useCallback } from 'react';
import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import useFetch from '@/shared/hooks/common/useFetch';
import { userNameStore } from '../stores/userNameStore';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';


export const useUserAvailability = ({ session }: { session: string }) => {
  const { triggerFetch: getUserTime } = useFetch({
    context: 'fetchUserAvailableTime',
    requestFn: () => getUserAvailableTime(session, userNameStore.getSnapshot().name),
  });

  const { isLoading: isSavingUserTime, triggerFetch: handleUserAvailabilitySubmit } = useFetch({
    context: 'handleUserAvailabilitySubmit',
    requestFn: () => {
      const userAvailability = userAvailabilityStore.getSnapshot();

      const slotCodes = Array.from(userAvailability.selectedTimes);

      return updateUserAvailableTime(session, {
        participantName: userAvailability.userName,
        slotCodes,
      });
    },
  });

  const fetchUserAvailableTime = useCallback(async () => {
    const userAvailableTimeInfo = await getUserTime();
    if (userAvailableTimeInfo === undefined) return;

    const selectedTimesResponse = new Set(userAvailableTimeInfo.slotCodes);

    userAvailabilityStore.setState((prev) => ({
      ...prev,
      userName: userNameStore.getSnapshot().name,
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
