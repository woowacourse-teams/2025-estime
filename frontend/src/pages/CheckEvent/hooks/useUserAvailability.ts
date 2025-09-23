import { useRef, useState, useCallback } from 'react';
import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { useToastContext } from '@/shared/contexts/ToastContext';
import { UserAvailability } from '@/pages/CheckEvent/types/userAvailability';
import * as Sentry from '@sentry/react';
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
  const isUserSubmitLoading = useRef(false);
  const isFetchUserAvailableTimeLoading = useRef(false);

  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);


  const userAvailabilitySubmit = useCallback(
    async (updatedUserAvailability: UserAvailability) => {
      if (isUserSubmitLoading.current) {
        addToast({
          type: 'warning',
          message: '시간표를 불러오는 중입니다. 잠시만 기다려주세요.',
        });
        return;
      }

      isUserSubmitLoading.current = true;
      try {
        const payload = toCreateUserAvailability(updatedUserAvailability);
        await updateUserAvailableTime(session, payload);
        addToast({
          type: 'success',
          message: '시간표 저장이 완료되었습니다!',
        });
      } catch (err) {
        const e = err as Error;
        addToast({
          type: 'error',
          message: e.message,
        });
        Sentry.captureException(err, {
          level: 'error',
        });
      } finally {
        isUserSubmitLoading.current = false;
      }
    },
    [session, addToast]
  );


  const fetchUserAvailableTime = useCallback(async () => {
    if (!session) {
      alert('세션이 없습니다. 다시 시도해주세요.');
      return;
    }
    if (isFetchUserAvailableTimeLoading.current) {
      showToast({
        type: 'warning',
        message: '시간표를 불러오는 중입니다. 잠시만 기다려주세요.',
      });
      return;
    }

    isFetchUserAvailableTimeLoading.current = true;
    try {
      const userAvailableTimeInfo = await getUserAvailableTime(session, name);
      if (userAvailableTimeInfo.dateTimeSlots.length < 0) return;
      const selectedTimesResponse = new Set(userAvailableTimeInfo.dateTimeSlots);
      setUserAvailability({ userName: name, selectedTimes: selectedTimesResponse });
    } catch (err) {
      const e = err as Error;
      showToast({
        type: 'error',
        message: e.message,
      });
      Sentry.captureException(err, {
        level: 'error',
      });
    } finally {
      isFetchUserAvailableTimeLoading.current = false;
    }
  }, [addToast, name, session]);

  return {
    userAvailability,
    userAvailabilitySubmit,
    fetchUserAvailableTime,
  };
};

export default useUserAvailability;
