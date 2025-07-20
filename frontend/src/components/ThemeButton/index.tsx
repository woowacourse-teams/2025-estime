import * as S from './ThemeButton.styled';
import Moon from '@/icons/Moon';
import Sun from '@/icons/Sun';
import { useTheme } from '@emotion/react';

interface ThemeButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeButton = ({ isDark, onToggle }: ThemeButtonProps) => {
  const { colors } = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <S.Container onClick={onToggle}>
      <Icon color={colors.text} />
    </S.Container>
  );
};

export default ThemeButton;
