import { useState } from 'react';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import LoginModal from '@/components/LoginModal';
import * as S from './styles/CheckEventPage.styled';
import LoginSuggestModal from '@/components/LoginSuggestModal';
import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import useUserAvailability from '@/hooks/useUserAvailablity';
import { useModalControl } from '@/hooks/TimeTableRoom/useModalControl';
import { useUserLogin } from '@/hooks/Login /useUserLogin';

export type LoginData = {
  userid: string;
  password: string;
};
const CheckEventPage = () => {
  const [userData, setUserData] = useState<LoginData>({ userid: '', password: '' });

  const { roomInfo, session } = useCheckRoomSession();
  const name = '메이토';
  const userAvailability = useUserAvailability({ name, session });

  const {
    modalTargetRef,
    handleOpenLoginModal,
    handleCloseAllModal,
    isSuggestModalOpen,
    isLoginModalOpen,
    handleCloseLoginModal,
  } = useModalControl();

  const { handleModalLogin } = useUserLogin(session, handleCloseAllModal);

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
      <Flex direction="column" gap="var(--gap-6)">
        <Flex justify="center" align="center" gap="var(--gap-9)">
          <Flex.Item flex={2}>
            <Timetable
              time={roomInfo.time}
              availableDates={roomInfo.availableDates}
              userAvailability={userAvailability}
              ref={modalTargetRef}
            />
          </Flex.Item>
          <Flex.Item flex={1}>
            <S.Container>
              <Text variant="h2">이벤트 확인 페이지</Text>
            </S.Container>
          </Flex.Item>
        </Flex>
        <LoginSuggestModal
          target={modalTargetRef.current}
          isOpen={isSuggestModalOpen}
          onLoginClick={handleOpenLoginModal}
        />
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          handleCloseLoginModal={handleCloseLoginModal}
          handleModalLogin={handleModalLogin}
          userData={userData}
          setUserData={setUserData}
        />
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
