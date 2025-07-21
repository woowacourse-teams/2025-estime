import * as S from './ThemeButton.styled';
import IMoon from '@/icons/IMoon';
import ISun from '@/icons/ISun';
import { useTheme } from '@emotion/react';

interface ThemeButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeButton = ({ isDark, onToggle }: ThemeButtonProps) => {
  const { colors } = useTheme();
  const Icon = isDark ? ISun : IMoon;

  return (
    <S.Container onClick={onToggle}>
      <Icon color={colors.text} />
    </S.Container>
  );
};

export default ThemeButton;
