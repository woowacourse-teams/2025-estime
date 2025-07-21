import * as S from './ArrowButton.styled';
import { useTheme } from '@emotion/react';
import IArrow from '@/icons/IArrow';

interface ArrowButtonProps {
  isOpen: boolean;
}

const ArrowButton = ({ isOpen }: ArrowButtonProps) => {
  const { colors } = useTheme();

  return (
    <S.Container isOpen={isOpen}>
      <IArrow color={colors.text} />
    </S.Container>
  );
};

export default ArrowButton;
