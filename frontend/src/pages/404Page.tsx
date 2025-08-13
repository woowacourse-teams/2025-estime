import Text from '@/components/Text';
import Button from '@/components/Button';
import * as S from './styles/ErrorPage.styled';
import Flex from '@/components/Layout/Flex';

const Error404Page = () => {
  return (
    <S.Container>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Text>존재하지 않는 방이에요🥲</Text>
        <Text>방 URL을 다시 확인하시고, 다시 시도해주세요!</Text>
        <Button onClick={() => (window.location.href = '/')} color="plum50" size="small">
          <Text variant="button">홈으로 돌아가기</Text>
        </Button>
      </Flex>
    </S.Container>
  );
};

export default Error404Page;
