import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useCreateRoom from './useCreateRoom';
import { checkBasicReady, checkCalendarReady } from '../utils/CreateRoomValidator';
import { showToast } from '@/shared/store/toastStore';
import useFunnelWithHistory from '@/shared/hooks/Funnel/useFunnelWithHistory';

type FieldType = 'calendar' | 'basic';

interface showCreateRoomValidationErrorType {
  type?: 'warning';
  field: FieldType;
}

const validationFailureMessages: Record<FieldType, string> = {
  calendar: '날짜를 선택해주세요!',
  basic: '제목과 시간을 선택해주세요!',
};
const STEP = ['메인 화면', '캘린더 선택 화면', '제목 및 시간 선택 화면'] as const;

const useMobileCreateRoomController = () => {
  const [isRoomCreateLoading, setIsRoomCreateLoading] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const navigate = useNavigate();
  const { platformType, roomInfoSubmit, isRoomSubmitLoading, notification } = useCreateRoom();
  const { shouldShake, handleShouldShake } = useShakeAnimation();
  const { Funnel, step, stepNext, stepPrev } = useFunnelWithHistory(STEP);

  const isCalendarValid = !showValidationBorder.current.calendar || checkCalendarReady();
  const isBasicValid = !showValidationBorder.current.basic || checkBasicReady();

  const isRoomCreateLoading = isRoomSubmitLoading || isRoutingRef.current;

  const showCreateRoomValidationError = ({
    type = 'warning',
    field,
  }: showCreateRoomValidationErrorType) => {
    showToast({ type: 'warning', message: validationFailureMessages[field] });
    showValidationBorder.current[field] = true;
    handleShouldShake();
    return;
  };

  const onSubmit = async () => {
    setIsRoomCreateLoading(true);
    const session = await roomInfoSubmit();
    if (session) {
      showToast({ type: 'success', message: '방 생성이 완료되었습니다.' });
      navigate(`/check?id=${session}`, { replace: true });
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
