import { createContext, useContext, useEffect, useState } from 'react';
import StatusIcon from '../StatusIcon';
import * as S from './Toast.styled';
import Text from '../Text';
import { type ToastType } from '@/types/toastType';

const TOAST_TITLE = {
  success: '성공',
  error: '오류',
  warning: '위험',
};

export type ToastPhase = 'idle' | 'visible' | 'hidden';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

export const ToastThemeContext = createContext<ToastType>('warning');
export const useToastTheme = () => useContext(ToastThemeContext);

const Toast = ({ id, type, message, onClose }: ToastProps) => {
  const [phase, setPhase] = useState<ToastPhase>('idle');
  console.log(id, onClose);
  useEffect(() => {
    const showTimer = setTimeout(() => setPhase('visible'), 30);
    const fadeOutTimer = setTimeout(() => setPhase('hidden'), 2500);

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
        <S.Body>
          <Text color={`${type}Text`}>{message}</Text>
        </S.Body>
      </S.Container>
    </ToastThemeContext.Provider>
  );
};

export default Toast;
