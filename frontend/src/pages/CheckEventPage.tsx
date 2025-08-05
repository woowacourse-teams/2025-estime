import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import LoginModal from '@/components/LoginModal';
import LoginSuggestModal from '@/components/LoginSuggestModal';
import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import { useModalControl } from '@/hooks/TimeTableRoom/useModalControl';
import { useUserLogin } from '@/hooks/Login/useUserLogin';
import useUserAvailability from '@/hooks/useUserAvailability';
import CheckEventPageHeader from '@/components/CheckEventPageHeader';

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

  const { handleLogin, userData, handleUserData, name } = useUserLogin({
    session,
  });

  const { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime } =
    useUserAvailability({
      name,
      session,
    });

  const handleInitAfterLogin = async () => {
    try {
      await handleLogin();
      handleCloseAllModal();
      await fetchUserAvailableTime();
    } catch (err) {
      const e = err as Error;
      console.log(e);
      alert(e.message);
      console.error(err);
    }
  };

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-10)">
      <Flex direction="column" gap="var(--gap-6)">
        <CheckEventPageHeader
          deadline={roomInfo.deadline}
          isPublic={roomInfo.isPublic}
          title={roomInfo.title}
          roomSession={roomInfo.roomSession}
        />
        <Flex direction="column" gap="var(--gap-6)">
          <Flex justify="center" align="flex-start" gap="var(--gap-9)">
            <Flex.Item flex={2}>
              <Timetable
                name={userName.value}
                availableTimeSlots={roomInfo.availableTimeSlots}
                availableDateSlots={roomInfo.availableDateSlots}
                selectedTimes={selectedTimes}
                userAvailabilitySubmit={async () => {
                  await userAvailabilitySubmit();
                }}
                ref={modalTargetRef}
              />
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
            handleModalLogin={handleInitAfterLogin}
            userData={userData}
            handleUserData={handleUserData}
          />
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
