import * as S from './styles/CheckEventPage.styled';
import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import LoginModal from '@/components/LoginModal';
import LoginSuggestModal from '@/components/LoginSuggestModal';
import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import { useModalControl } from '@/hooks/TimeTableRoom/useModalControl';
import { useUserLogin } from '@/hooks/Login/useUserLogin';
import useUserAvailability from '@/hooks/useUserAvailability';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const {
    modalTargetRef,
    handleOpenLoginModal,
    handleCloseAllModal,
    isSuggestModalOpen,
    isLoginModalOpen,
    handleCloseLoginModal,
  } = useModalControl();

  const { handleModalLogin, userData, handleUserData, responseUserName } = useUserLogin(
    session,
    handleCloseAllModal
  );

  const userAvailability = useUserAvailability({ name: responseUserName ?? '앙구일구', session });

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
          handleUserData={handleUserData}
        />
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
