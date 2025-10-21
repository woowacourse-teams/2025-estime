import { createContext, useContext, useEffect, useState } from 'react';
import * as S from './Toast.styled';
import { type ToastType } from '@/shared/types/toastType';
import StatusIcon from '../StatusIcon';
import Text from '../Text';

const TOAST_TITLE = {
  success: '성공',
  error: '오류',
  warning: '경고',
};

export type ToastPhase = 'idle' | 'visible' | 'hidden';

interface ToastProps {
  type: ToastType;
  message: string;
}

export const ToastThemeContext = createContext<ToastType>('warning');
export const useToastTheme = () => useContext(ToastThemeContext);

const Toast = ({ type, message }: ToastProps) => {
  const [phase, setPhase] = useState<ToastPhase>('idle');
  useEffect(() => {
    const showTimer = setTimeout(() => setPhase('visible'), 30);
    const fadeOutTimer = setTimeout(() => setPhase('hidden'), 1500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <ToastThemeContext.Provider value={type}>
      <S.Container phase={phase}>
        <S.Header>
          <StatusIcon type={type} />
          <Text color={`${type}Text`}>{TOAST_TITLE[type]}</Text>
        </S.Header>
        <S.Body role="alert" aria-live="assertive">
          <Text color={`${type}Text`}>{message}</Text>
        </S.Body>
      </S.Container>
    </ToastThemeContext.Provider>
  );
};

export default Toast;
