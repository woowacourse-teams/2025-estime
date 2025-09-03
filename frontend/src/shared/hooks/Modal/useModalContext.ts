import { ModalContext } from '@/shared/contexts/ModalContext';
import { useContext } from 'react';

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext는 ModalContext 안에서만 사용할 수 있습니다.');
  }
  return context;
};

export default useModalContext;
