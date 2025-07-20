import Text from '@/components/Text';
import * as S from './Header.styled';
import ThemeButton from '@/components/ThemeButton';
import Logo from '@/icons/Logo';

const Header = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <S.Container>
      <S.Content>
        <S.Wrapper>
          <Logo />
          <Text variant="h2" color="primary">
            아인슈타인
          </Text>
        </S.Wrapper>
        <ThemeButton isDark={isDark} onToggle={toggleTheme} />
      </S.Content>
    </S.Container>
  );
};

export default Header;
