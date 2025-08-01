import Text from '@/components/Text';
import Button from '@/components/Button';
import * as S from './styles/ErrorPage.styled';
import Flex from '@/components/Layout/Flex';

const ErrorPage = () => {
  return (
    <S.Container>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Text>예상 못한 오류가 발생했어요 🥲</Text>
        <Button onClick={() => window.location.reload()} color="plum50" size="small">
          새로 고침
        </Button>
      </Flex>
    </S.Container>
  );
};

export default ErrorPage;
