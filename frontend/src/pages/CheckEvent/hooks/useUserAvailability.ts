import { getUserAvailableTime, updateUserAvailableTime } from '@/apis/time/time';
import { toCreateUserAvailability } from '@/apis/transform/toCreateUserAvailablity';
import { useToastContext } from '@/shared/contexts/ToastContext';
import { UserAvailability } from '@/pages/CheckEvent/types/userAvailability';
import { useRef, useState } from 'react';

import * as Sentry from '@sentry/react';

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
  const isUserSubmitLoading = useRef(false);
  const isFetchUserAvailableTimeLoading = useRef(false);

  const [userAvailability, setUserAvailability] =
    useState<UserAvailability>(initialUserAvailability);

  const userAvailabilitySubmit = async () => {
    if (isUserSubmitLoading.current) {
      addToast({
        type: 'warning',
        message: '시간표를 불러오는 중입니다. 잠시만 기다려주세요.',
      });
      return;
    }

    isUserSubmitLoading.current = true;
    try {
      const payload = toCreateUserAvailability(userAvailability);
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
  };

  const fetchUserAvailableTime = async () => {
    if (!session) {
      alert('세션이 없습니다. 다시 시도해주세요.');
      return;
    }
    if (isFetchUserAvailableTimeLoading.current) {
      addToast({
        type: 'warning',
        message: '시간표를 불러오는 중입니다. 잠시만 기다려주세요.',
      });
      return;
    }

    isFetchUserAvailableTimeLoading.current = true;
    try {
      const userAvailableTimeInfo = await getUserAvailableTime(session, name);
      const dateTimeSlotsResponse = userAvailableTimeInfo.dateTimeSlots;
      setUserAvailability((prev) => ({
        ...prev,
        userName: name,
      }));
      if (userAvailableTimeInfo.dateTimeSlots.length > 0) {
        const selectedTimesResponse = new Set(dateTimeSlotsResponse);
        setUserAvailability((prev) => ({
          ...prev,
          selectedTimes: selectedTimesResponse,
        }));
      }
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
      isFetchUserAvailableTimeLoading.current = false;
    }
  };

  return {
    userAvailability,
    userAvailabilitySubmit,
    fetchUserAvailableTime,
  };
};

export default useUserAvailability;
