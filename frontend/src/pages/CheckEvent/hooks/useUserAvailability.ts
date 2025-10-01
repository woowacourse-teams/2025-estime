import { useState, useCallback, useRef } from 'react';
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
  if (!session) {
    throw new Error('세션이 없습니다. 다시 시도해주세요');
  }
  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);
  const userAvailabilityRef = useRef<UserAvailability>({
    userName: '',
    selectedTimes: new Set(),
  });

  const { isLoading: isSavingUserTime, triggerFetch: updateUserTime } = useFetch({
    context: 'userAvailabilitySubmit',
    requestFn: () =>
      updateUserAvailableTime(session, toCreateUserAvailability(userAvailabilityRef.current)),
  });

  const { triggerFetch: getUserTime } = useFetch({
    context: 'fetchUserAvailableTime',
    requestFn: () => getUserAvailableTime(session, name),
  });

  const userAvailabilitySubmit = useCallback(async () => {
    await updateUserTime();
    showToast({
      type: 'success',
      message: '시간표 저장이 완료되었습니다!',
    });
  }, [updateUserTime]);

  const fetchUserAvailableTime = useCallback(async () => {
    const userAvailableTimeInfo = await getUserTime();
    if (userAvailableTimeInfo === undefined) return;
    if (userAvailableTimeInfo.dateTimeSlots.length < 0) return;
    const selectedTimesResponse = new Set(userAvailableTimeInfo.dateTimeSlots);
    setUserAvailability({ userName: name, selectedTimes: selectedTimesResponse });
  }, [name, session, getUserTime]);

  return {
    userAvailabilitySubmit,
    fetchUserAvailableTime,
    isSavingUserTime,
    userAvailability,
    userAvailabilityRef,
  };
};

export default useUserAvailability;
