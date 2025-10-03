import useShakeAnimation from '@/shared/hooks/common/useShakeAnimation';
import { useRef } from 'react';
import { checkBasicReady, checkCalendarReady } from '../utils/CreateRoomValidator';
import { showToast } from '@/shared/store/toastStore';

type FieldType = 'calendar' | 'basic';
interface showCreateRoomValidationErrorType {
  type?: 'warning';
  field: FieldType;
}

const validationFailureMessages: Record<FieldType, string> = {
  calendar: '날짜를 선택해주세요!',
  basic: '제목과 시간을 선택해주세요!',
};

const useMobileCreateRoomValidation = () => {
  const showValidationBorder = useRef({
    calendar: false,
    basic: false,
  });
  const { shouldShake, handleShouldShake } = useShakeAnimation();
  const isCalendarValid = !showValidationBorder.current.calendar || checkCalendarReady();
  const isBasicValid = !showValidationBorder.current.basic || checkBasicReady();

  const showCreateRoomValidationError = ({
    type = 'warning',
    field,
  }: showCreateRoomValidationErrorType) => {
    showToast({ type, message: validationFailureMessages[field] });
    showValidationBorder.current[field] = true;
    handleShouldShake();
    return;
  };

  return {
    shouldShake,
    isCalendarValid,
    isBasicValid,
    showCreateRoomValidationError,
  };
};

export default useMobileCreateRoomValidation;
