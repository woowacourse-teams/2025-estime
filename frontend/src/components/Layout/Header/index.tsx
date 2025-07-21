import Text from '@/components/Text';
import * as S from './Header.styled';
import ThemeButton from '@/components/ThemeButton';

const Header = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  return (
    <S.Container>
      <Text variant="h2" color="primary">
        아인슈타인
      </Text>
      <ThemeButton isDark={isDark} onToggle={toggleTheme} />
    </S.Container>
  );
};

export default Header;
