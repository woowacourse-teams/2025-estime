import Text from '@/shared/components/Text';
import * as S from './Header.styled';
import ThemeButton from '@/shared/components/Button/ThemeButton';
import PlatformLogo from '@/shared/components/PlatformLogo';
import { useExtractQueryParams } from '@/shared/hooks/common/useExtractQueryParams';
import IEstimeLogo from '@/assets/icons/IEstimeLogo';

const Header = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => {
  const platformType = useExtractQueryParams('platformType') as 'DISCORD' | 'SLACK';

  const handleClick = () => {
    window.open(process.env.DOMAIN_URL, '_blank');
  };

  return (
    <S.Container>
      <S.Content>
        <S.Wrapper>
          <Text variant="h2" color="primary">
            <S.LogoWrapper onClick={handleClick}>
              <IEstimeLogo />
            </S.LogoWrapper>
          </Text>
        </S.Wrapper>
        <S.Wrapper>
          {platformType && <PlatformLogo platformType={platformType} />}
          <ThemeButton isDark={isDark} onToggle={toggleTheme} />
        </S.Wrapper>
      </S.Content>
    </S.Container>
  );
};

export default Header;
