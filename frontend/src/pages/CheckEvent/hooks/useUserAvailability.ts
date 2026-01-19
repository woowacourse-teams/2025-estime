import { useCallback } from 'react';
import { getUserAvailableTime2, updateUserAvailableTime2 } from '@/apis/time/time';
import useFetch from '@/shared/hooks/common/useFetch';
import { userNameStore } from '../stores/userNameStore';
import { userAvailabilityStore } from '../stores/userAvailabilityStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';

export const useUserAvailability = ({ session }: { session: string }) => {
  const { triggerFetch: getUserTime } = useFetch({
    context: 'fetchUserAvailableTime',
    requestFn: () => getUserAvailableTime2(session, userNameStore.getSnapshot().name),
  });

  const { isLoading: isSavingUserTime, triggerFetch: handleUserAvailabilitySubmit } = useFetch({
    context: 'handleUserAvailabilitySubmit',
    requestFn: () => {
      const userAvailability = userAvailabilityStore.getSnapshot();

      // 🔥 dateTimeSlots → slotCodes 변환
      const slotCodes = Array.from(userAvailability.selectedTimes).map((dateTime) =>
        FormatManager.encodeSlotCode(dateTime)
      );

      return updateUserAvailableTime2(session, {
        participantName: userAvailability.userName,
        slotCodes,
      });
    },
  });

  const fetchUserAvailableTime = useCallback(async () => {
    const userAvailableTimeInfo = await getUserTime();
    if (userAvailableTimeInfo === undefined) return;

    // 🔥 slotCodes → dateTimeSlots 변환
    const selectedTimesResponse = new Set(
      userAvailableTimeInfo.slotCodes.map((slotCode) => FormatManager.decodeSlotCode(slotCode))
    );

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
