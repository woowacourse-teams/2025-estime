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
import RecommendTime from '@/components/RecommendTime';
import useRecommendTime from '@/hooks/RecommendTime/useRecommendTime';

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

  const { recommendTimeData } = useRecommendTime(session);

  return (
    <Wrapper maxWidth={1280} paddingTop="var(--padding-10)">
      <Flex direction="column" gap="var(--gap-6)">
        <CheckEventPageHeader
          deadLine={roomInfo.deadLine}
          isPublic={roomInfo.isPublic}
          title={roomInfo.title}
          roomSession={roomInfo.roomSession}
        />
        <Flex direction="column" gap="var(--gap-6)">
          <Flex justify="center" align="flex-start" gap="var(--gap-9)">
            <Flex.Item flex={2}>
              <Timetable
                name={userName.value}
                time={roomInfo.time}
                availableDates={roomInfo.availableDates}
                selectedTimes={selectedTimes}
                userAvailabilitySubmit={userAvailabilitySubmit}
                ref={modalTargetRef}
              />
            </Flex.Item>
            <Flex.Item flex={1}>
              <RecommendTime
                dateTimes={recommendTimeData.map((item) => item.dateTime)}
                isPublic={roomInfo.isPublic === 'public'}
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
            handleModalLogin={() => {
              handleLogin();
              handleCloseAllModal();
              fetchUserAvailableTime();
            }}
            userData={userData}
            handleUserData={handleUserData}
          />
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
