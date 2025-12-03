import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useCreateRoom from './useCreateRoom';
import { checkBasicReady, checkCalendarReady } from '../utils/CreateRoomValidator';
import { showToast } from '@/shared/store/toastStore';
import useFunnelWithHistory from '@/shared/hooks/Funnel/useFunnelWithHistory';
import useMobileCreateRoomValidation from './useMobileCreateRoomValidation';

const STEP = ['메인 화면', '캘린더 선택 화면', '제목 및 시간 선택 화면'] as const;

const useMobileCreateRoomController = () => {
  const [isRoomCreateLoading, setIsRoomCreateLoading] = useState(false);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const navigate = useNavigate();

  const { platformType, roomInfoSubmit, notification } = useCreateRoom();

  const { Funnel, step, stepNext, stepPrev } = useFunnelWithHistory(STEP);

  const { shouldShake, isCalendarValid, isBasicValid, showCreateRoomValidationError } =
    useMobileCreateRoomValidation();

  const onSubmit = async () => {
    setIsRoomCreateLoading(true);
    const session = await roomInfoSubmit();
    if (session) {
      showToast({ type: 'success', message: '방 생성이 완료되었습니다.' });
      navigate(`/vote?id=${session}`, { replace: true });
    } else {
      setIsRoomCreateLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (platformType) {
      setIsNotificationModalOpen(true);
      return;
    }
    await onSubmit();
  };

  const handlePlatformCreateRoom = async () => {
    setIsNotificationModalOpen(false);
    await onSubmit();
  };

  const handleNextStep = async (type: 'calendar' | 'basic') => {
    if (type === 'calendar') {
      if (!checkCalendarReady()) {
        showCreateRoomValidationError({ field: 'calendar' });
        return; // 유효하지 않으면 종료
      }
      stepNext();
      return;
    }

    if (type === 'basic') {
      if (!checkBasicReady()) {
        showCreateRoomValidationError({ field: 'basic' });
        return;
      }
      await handleCreateRoom(); // 최종 단계는 생성으로 종료
      return;
    }
  };
  const CreateRoomInterface = useMemo(
    () => ({
      notificationModal: {
        isOpen: isNotificationModalOpen,
        setIsOpen: setIsNotificationModalOpen,
      },
      isValid: {
        calendar: isCalendarValid,
        basic: isBasicValid,
      },

      checkNotification: notification,

      animation: { shake: shouldShake },

      isRoomCreateLoading,

      handler: {
        createRoom: handleCreateRoom,
        platformCreateRoom: handlePlatformCreateRoom,
        nextStep: handleNextStep,
      },
      funnel: {
        Funnel,
        step,
        stepNext,
        stepPrev,
      },
    }),
    [
      Funnel,
      step,
      stepNext,
      stepPrev,
      handleNextStep,
      isNotificationModalOpen,
      isCalendarValid,
      isBasicValid,
      notification,
      shouldShake,
      isRoomCreateLoading,
      handleCreateRoom,
      handlePlatformCreateRoom,
    ]
  );

  return CreateRoomInterface;
};

export default useMobileCreateRoomController;
