import Text from '@/components/Text';
import * as S from './styles/PeoplePage.styled';
import { credits } from '@/constants/credits';
import Wrapper from '@/components/Layout/Wrapper';
import Flex from '@/components/Layout/Flex';
import { useNavigate } from 'react-router';
import Button from '@/components/Button';

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
        {credits.map((person, index) => (
          <S.Person key={`${person.name}-${index}`}>
            <S.Image src={person.imageUrl} alt={person.name} />
            <Text color="gray80" variant="h2">
              <S.Link>{person.name}</S.Link>
            </Text>
          </S.Person>
        ))}
      </S.Container>
    </Wrapper>
  );
};

export default PeoplePage;
