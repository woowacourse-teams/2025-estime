import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import useCreateRoom from './useCreateRoom';
import { checkBasicReady, checkCalendarReady } from '../utils/CreateRoomValidator';
import { showToast } from '@/shared/store/toastStore';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';

type FieldType = 'all' | 'calendar' | 'basic';

interface showCreateRoomValidationErrorType {
  type?: 'warning';
  field: FieldType;
}

const validationFailureMessages: Record<FieldType, string> = {
  all: '날짜와 기본 설정을 선택해주세요!',
  calendar: '날짜를 선택해주세요!',
  basic: '제목과 시간을 선택해주세요!',
};

const useCreateRoomController = () => {
  const isRoutingRef = useRef(false);
  const showValidationBorder = useRef<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const navigate = useNavigate();
  const { platformType, roomInfoSubmit, isRoomSubmitLoading, notification } = useCreateRoom();
  const { shouldShake, handleShouldShake } = useShakeAnimation();

  const isCalendarValid = !showValidationBorder.current || checkCalendarReady();
  const isBasicValid = !showValidationBorder.current || checkBasicReady();

  const isRoomCreateLoading = isRoomSubmitLoading || isRoutingRef.current;

  const showCreateRoomValidationError = ({
    type = 'warning',
    field,
  }: showCreateRoomValidationErrorType) => {
    showToast({
      type,
      message: validationFailureMessages[field],
    });
    showValidationBorder.current = true;
    handleShouldShake();
  };

  const validateCreateRoom = () => {
    if (!checkCalendarReady() && !checkBasicReady()) {
      showCreateRoomValidationError({ field: 'all' });
      return false;
    }
    if (!checkCalendarReady()) {
      showCreateRoomValidationError({ field: 'calendar' });
      return false;
    }
    if (!checkBasicReady()) {
      showCreateRoomValidationError({ field: 'basic' });
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    const session = await roomInfoSubmit();
    isRoutingRef.current = true;
    if (session) {
      showToast({ type: 'success', message: '방 생성이 완료되었습니다.' });
      navigate(`/check?id=${session}`, { replace: true });
    }
  };

  const handleCreateRoom = async () => {
    if (!validateCreateRoom()) return;
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

  const { buttonRef } = useEnterKeySubmit({ callback: handleCreateRoom });

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
      submitButtonRef: buttonRef,

      isRoomCreateLoading,
      handler: {
        createRoom: handleCreateRoom,
        platformCreateRoom: handlePlatformCreateRoom,
      },
    }),
    [
      isNotificationModalOpen,
      isCalendarValid,
      isBasicValid,
      notification,
      shouldShake,
      buttonRef,
      isRoomCreateLoading,
      handleCreateRoom,
      handlePlatformCreateRoom,
    ]
  );

  return CreateRoomInterface;
};

export default useCreateRoomController;
