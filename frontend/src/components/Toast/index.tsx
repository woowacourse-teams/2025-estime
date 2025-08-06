import { createContext, useContext, useEffect, useState } from 'react';
import StatusButton from '../StatusButton';
import * as S from './Toast.styled';
import Text from '../Text';

export type StatusType = 'success' | 'error' | 'warning';

interface ToastProps {
  type: StatusType;
  message: string;
}

export const ToastThemeContext = createContext<StatusType>('warning');
export const useToastTheme = () => useContext(ToastThemeContext);

const Toast = ({ type, message }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <ToastThemeContext.Provider value={type}>
      <S.Container visible={visible}>
        <S.Header>
          <StatusButton type={type} />
          <Text color={`${type}Text`}>{type}</Text>
        </S.Header>
        <S.Body>
          <Text color={`${type}Text`}>{message}</Text>
        </S.Body>
      </S.Container>
    </ToastThemeContext.Provider>
  );
};

export default Toast;
