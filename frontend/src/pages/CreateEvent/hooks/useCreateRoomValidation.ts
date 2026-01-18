import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import {
  checkBasicReady,
  checkCalendarReady,
  getInvalidReason,
} from '../utils/CreateRoomValidator';
import { useRef } from 'react';
import { showToast } from '@/shared/store/toastStore';

interface showCreateRoomValidationErrorType {
  type?: 'warning';
  field: FieldType;
}

type FieldType = 'all' | 'calendar' | 'basic';

const useCreateRoomValidation = () => {
  const { shouldShake, handleShouldShake } = useShakeAnimation();
  const showValidationBorder = useRef<boolean>(false);
  const isCalendarValid = !showValidationBorder.current || checkCalendarReady();
  const isBasicValid = !showValidationBorder.current || checkBasicReady();

  const showCreateRoomValidationError = ({
    type = 'warning',
  }: showCreateRoomValidationErrorType) => {
    showToast({
      type,
      message: getInvalidReason(),
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
