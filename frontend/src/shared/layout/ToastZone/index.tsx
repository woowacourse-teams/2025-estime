import { type ToastStateType } from '@/shared/types/toastType';
import * as S from './ToastZone.styled';
import Toast from '@/shared/components/Toast';

interface ToastZoneProps {
  toasts: ToastStateType[];
  removeToast: (id: string) => void;
}

const ToastZone = ({ toasts, removeToast }: ToastZoneProps) => {
  return (
    <S.Container>
      {toasts.map(({ id, type, message }, index) => (
        <S.Wrapper index={index} key={id}>
          <Toast id={id} type={type} message={message} onClose={removeToast} />
        </S.Wrapper>
      ))}
    </S.Container>
  );
};

export default ToastZone;
