import * as S from './AccordionToggleButton.styled';
import { useTheme } from '@emotion/react';
import IArrow from '@/icons/IArrow';

interface AccordionToggleButtonProps {
  isOpen: boolean;
}

const AccordionToggleButton = ({ isOpen }: AccordionToggleButtonProps) => {
  const { colors } = useTheme();

  return (
    <S.Container isOpen={isOpen}>
      <IArrow color={colors.text} />
    </S.Container>
  );
};

export default AccordionToggleButton;
