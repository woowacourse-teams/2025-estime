
import { useState, useRef, useEffect } from 'react';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import LoginModal from '@/components/LoginModal';
import * as S from './styles/CheckEventPage.styled';
import LoginSuggestModal from '@/components/LoginSuggestModal';
import { joinPerson } from '@/apis/room/room';
import { useExtractQueryParam } from '@/hooks/common/useExtractQueryParam';
// import useCheckRoomSession from '@/hooks/useCheckRoomSession';


export type LoginData = {
  userid: string;
  password: string;
};
const CheckEventPage = () => {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [userData, setUserData] = useState<LoginData>({ userid: '', password: '' });
  const modalTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalTargetRef.current) {
      setIsSuggestModalOpen(true);
    }
  }, []);

  const sessionId = useExtractQueryParam('id');

  const handleModalLogin = async () => {
    if (!sessionId) {
      return;
    }
    try {
      const response = await joinPerson(sessionId, {
        name: userData.userid,
        password: userData.password,
      });
      setIsSuggestModalOpen(false);
      setIsLoginModalOpen(false);
    } catch (e) {
      console.error('Error closing suggest modal:', e);
      alert(`${e}로그인 실패!  꺄약!`);
    }
  };

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex direction="column" gap="var(--gap-6)">
        <Flex justify="center" align="center" gap="var(--gap-9)">
          <Flex.Item flex={2}>
            <S.Container ref={modalTargetRef}>
              <Text variant="h2">이벤트 확인 페이지</Text>
            </S.Container>
          </Flex.Item>
          <Flex.Item flex={1}>
            <S.Container>
              <Text variant="h2">이벤트 확인 페이지</Text>
            </S.Container>
          </Flex.Item>
        </Flex>
  // const roomInfo = useCheckRoomSession();
  // ex) 사용시, roomInfo.title, room.availableDates
        <LoginSuggestModal
          target={modalTargetRef.current}
          isOpen={isSuggestModalOpen}
          onLoginClick={() => {
            setIsLoginModalOpen(true);
          }}
        />
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
          handleModalLogin={handleModalLogin}
          userData={userData}
          setUserData={setUserData}
        />
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
