import * as S from './StatusButton.styled';
import ISuccess from '@/icons/ISuccess';
import IError from '@/icons/IError';
import IWarning from '@/icons/IWarning';

const STATUS_BUTTON = {
  success: ISuccess,
  error: IError,
  warning: IWarning,
};

interface StatusButtonProps {
  type: keyof typeof STATUS_BUTTON;
}

const StatusButton = ({ type }: StatusButtonProps) => {
  const IconComponent = STATUS_BUTTON[type];

  return (
    <S.Container>
      <IconComponent />
    </S.Container>
  );
};

export default StatusButton;
