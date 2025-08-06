import { createContext, useContext, useEffect, useState } from 'react';
import StatusButton from '../StatusButton';
import * as S from './Toast.styled';
import Text from '../Text';

export type StatusType = 'success' | 'error' | 'warning';

interface ToastProps {
  id: string;
  type: StatusType;
  message: string;
  onClose: (id: string) => void;
}

export const ToastThemeContext = createContext<StatusType>('warning');
export const useToastTheme = () => useContext(ToastThemeContext);

const Toast = ({ id, type, message, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 30);
    const fadeOutTimer = setTimeout(() => setVisible(false), 2500);
    const removeTimer = setTimeout(() => onClose(id), 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onClose]);

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
