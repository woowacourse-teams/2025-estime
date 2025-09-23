import * as S from './ToastZone.styled';
import Toast from '@/shared/components/Toast';
import { toastStore } from '@/shared/store/toastStore';
import { useSyncExternalStore } from 'react';

const ToastZone = () => {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot);

  return (
    <S.Container>
      {toasts.map(({ id, type, message }, index) => (
        <S.Wrapper index={index} key={id}>
          <Toast type={type} message={message} />
        </S.Wrapper>
      ))}
    </S.Container>
  );
};

export default ToastZone;
