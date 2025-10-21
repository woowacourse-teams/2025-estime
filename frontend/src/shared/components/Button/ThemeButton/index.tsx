import * as S from './ThemeButton.styled';
import IMoon from '@/assets/icons/IMoon';
import ISun from '@/assets/icons/ISun';
import { useTheme } from '@emotion/react';

interface ThemeButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeButton = ({ isDark, onToggle }: ThemeButtonProps) => {
  const { colors } = useTheme();
  const Icon = isDark ? ISun : IMoon;

  return (
    <S.Container
      onClick={onToggle}
      aria-label={
        isDark
          ? '라이트와 다크 모드 전환하기 (현재 다크 모드)'
          : '라이트와 다크 모드 전환하기 (현재 라이트 모드)'
      }
    >
      <Icon color={colors.text} />
    </S.Container>
  );
};

export default ThemeButton;
