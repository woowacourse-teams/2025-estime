import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { checkBasicReady, checkCalendarReady } from '../utils/CreateRoomValidator';
import { useRef } from 'react';
import { showToast } from '@/shared/store/toastStore';

interface showCreateRoomValidationErrorType {
  type?: 'warning';
  field: FieldType;
}

type FieldType = 'all' | 'calendar' | 'basic';

const validationFailureMessages: Record<FieldType, string> = {
  all: '날짜와 기본 설정을 선택해주세요!',
  calendar: '날짜를 선택해주세요!',
  basic: '제목과 시간을 선택해주세요!',
};

const useCreateRoomValidation = () => {
  const { shouldShake, handleShouldShake } = useShakeAnimation();
  const showValidationBorder = useRef<boolean>(false);
  const isCalendarValid = !showValidationBorder.current || checkCalendarReady();
  const isBasicValid = !showValidationBorder.current || checkBasicReady();

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

  return {
    shouldShake,
    isCalendarValid,
    isBasicValid,
    validateCreateRoom,
  };
};

export default useCreateRoomValidation;
