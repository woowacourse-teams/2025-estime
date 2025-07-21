import { useState } from 'react';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import LoginModal from '@/components/LoginModal';
import * as S from './styles/CheckEventPage.styled';
import Button from '@/components/Button';

const CheckEventPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex justify="center" align="center">
        <Flex.Item flex={1}>
          <S.Container>
            <Text variant="h2">이벤트 확인 페이지</Text>
            <Button onClick={() => setIsOpen(true)} color="plum40">
              모달 열기
            </Button>
            <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </S.Container>
        </Flex.Item>
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
