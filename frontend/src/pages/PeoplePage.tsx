import Text from '@/components/Text';
import * as S from './styles/PeoplePage.styled';
import { credits } from '@/constants/credits';
import Wrapper from '@/components/Layout/Wrapper';
import Flex from '@/components/Layout/Flex';
import { useNavigate } from 'react-router';
import Button from '@/components/Button';
import GithubLogo from '@/icons/GithubLogo';

const PeoplePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };
  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-10)">
      <Flex justify="space-between" align="center">
        <Text variant="h3" color="primary">
          아인슈타임을 만든 사람들
        </Text>
        <Button size="small" color="primary" onClick={handleClick}>
          돌아가기
        </Button>
      </Flex>
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

export default PeoplePage;
