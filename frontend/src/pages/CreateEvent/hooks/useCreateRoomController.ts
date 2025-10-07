import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useCreateRoom from './useCreateRoom';
import { showToast } from '@/shared/store/toastStore';
import useEnterKeySubmit from '@/shared/hooks/common/useEnterKeySubmit';
import useCreateRoomValidation from './useCreateRoomValidation';

const useCreateRoomController = () => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const [isRoomCreateLoading, setIsRoomCreateLoading] = useState(false);

  const navigate = useNavigate();

  const { platformType, roomInfoSubmit, notification } = useCreateRoom();

  const { shouldShake, isCalendarValid, isBasicValid, validateCreateRoom } =
    useCreateRoomValidation();

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
