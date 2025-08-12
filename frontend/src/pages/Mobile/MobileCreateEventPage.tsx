import IEstime from '@/icons/IEstime';
import Logo from '@/icons/Logo';
import Button from '@/components/Button';
import Text from '@/components/Text';
import Wrapper from '@/components/Layout/Wrapper';
import { ButtonWrapper, LogoWrapper } from '../styles/MobileCreateEventPage.styled';
import Flex from '@/components/Layout/Flex';
import { useTheme } from '@emotion/react';

const MobileCreatePage = () => {
  const theme = useTheme();

  return (
    <Wrapper
      paddingTop="var(--padding-11)"
      paddingLeft="var(--padding-7)"
      paddingRight="var(--padding-7)"
    >
      <Flex direction="column" align="center" justify="space-between" gap="var(--gap-11)">
        <IEstime color={theme.colors.primary} />
        <LogoWrapper>
          <Logo color={theme.colors.primary} />
        </LogoWrapper>
        <ButtonWrapper>
          <Button color="primary" selected={true}>
            <Text variant="button" color="background">
              방 만들기
            </Text>
          </Button>
          <Button color="primary" selected={true}>
            <Text variant="button" color="background">
              방 참가하기
            </Text>
          </Button>
        </ButtonWrapper>
      </Flex>
    </Wrapper>
  );
};

export default MobileCreatePage;
