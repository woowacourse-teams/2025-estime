import * as S from './ThemeButton.styled';
import Moon from '@/icons/Moon';
import Sun from '@/icons/Sun';
import { useTheme } from '@emotion/react';

interface ThemeButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeButton = ({ isDark, onToggle }: ThemeButtonProps) => {
  const theme = useTheme();

  return (
    <S.Container onClick={onToggle}>
      {!isDark ? <Moon color={theme.colors.black} /> : <Sun color={theme.colors.white} />}
    </S.Container>
  );
};

export default ThemeButton;
