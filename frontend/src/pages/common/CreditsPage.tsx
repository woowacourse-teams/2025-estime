import Text from '@/shared/components/Text';
import * as S from '@/pages/common/CreditsPage.styled';
import { credits } from '@/constants/credits';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import Button from '@/shared/components/Button';
import GithubLogo from '@/assets/icons/GithubLogo';

const CreditsPage = () => {
  const handleClick = () => {
    window.history.back();
  };
  return (
    <Wrapper
      maxWidth={1280}
      paddingTop="var(--padding-10)"
      paddingLeft="var(--padding-6)"
      paddingRight="var(--padding-6)"
      paddingBottom="var(--padding-10)"
    >
      <Wrapper
        maxWidth="100%"
        paddingLeft="var(--padding-4)"
        paddingRight="var(--padding-4)"
        paddingBottom="var(--padding-4)"
      >
        <Flex justify="space-between" align="center" gap="var(--gap-4)">
          <Text variant="h3" color="primary">
            아인슈타임을 만든 사람들
          </Text>
          <Button size="small" color="primary" onClick={handleClick}>
            <Text variant="button">돌아가기</Text>
          </Button>
        </Flex>
      </Wrapper>
      <S.Container>
        {credits.map(({ name, imageUrl, role, github }) => (
          <S.Person key={name}>
            <S.Avatar>
              <S.Image src={imageUrl} alt={name} />
            </S.Avatar>
            <Text color="gray90" variant="h3">
              {name}
            </Text>
            <Flex align="center" gap="var(--gap-3)" justify="center">
              <Text color="gray60" variant="body">
                {role}
              </Text>

              <S.Link href={github} target="_blank" rel="noopener noreferrer">
                <S.Icon>
                  <GithubLogo />
                </S.Icon>
              </S.Link>
            </Flex>
          </S.Person>
        ))}
      </S.Container>
    </Wrapper>
  );
};

export default CreditsPage;
