import * as S from './StatusIcon.styled';
import ISuccess from '@/icons/ISuccess';
import IError from '@/icons/IError';
import IWarning from '@/icons/IWarning';

const STATUS_ICON = {
  success: ISuccess,
  error: IError,
  warning: IWarning,
};

interface StatusIconProps {
  type: keyof typeof STATUS_ICON;
}

const StatusIcon = ({ type }: StatusIconProps) => {
  const IconComponent = STATUS_ICON[type];

  return (
    <S.Container>
      <IconComponent />
    </S.Container>
  );
};

export default StatusIcon;
