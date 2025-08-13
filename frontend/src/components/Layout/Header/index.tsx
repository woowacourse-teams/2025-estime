import Text from '@/components/Text';
import * as S from './Header.styled';
import ThemeButton from '@/components/ThemeButton';
import PlatformLogo from '@/components/PlatformLogo';
import { useExtractQueryParams } from '@/hooks/common/useExtractQueryParams';
import IEstimeLogo from '@/icons/IEstimeLogo';

const Header = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const platform = useExtractQueryParams('platform') as 'DISCORD' | 'SLACK';
  return (
    <S.Container>
      <S.Content>
        <S.Wrapper>
          <Text variant="h2" color="primary">
            <S.LogoWrapper>
              <IEstimeLogo />
            </S.LogoWrapper>
          </Text>
        </S.Wrapper>
        <S.Wrapper>
          {platform && <PlatformLogo platform={platform} />}
          <ThemeButton isDark={isDark} onToggle={toggleTheme} />
        </S.Wrapper>
      </S.Content>
    </S.Container>
  );
};

export default Header;
