import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import LoginModal from '@/components/LoginModal';
import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import { useModalControl } from '@/hooks/TimeTableRoom/useModalControl';
import { useUserLogin } from '@/hooks/Login/useUserLogin';
import useUserAvailability from '@/hooks/useUserAvailability';
import CheckEventPageHeader from '@/components/CheckEventPageHeader';
import { useState } from 'react';
import TimeTableHeader from '@/components/TimeTableHeader';
import Heatmap from '@/components/Heatmap';
import * as S from './styles/CheckEventPage.styled';
import useRoomStatistics from '@/hooks/useRoomStatistics';
import { weightCalculateStrategy } from '@/utils/getWeight';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const { isLoginModalOpen, handleOpenLoginModal, handleCloseLoginModal } = useModalControl();

  const { handleLogin, userData, handleUserData, name, isLoggedIn } = useUserLogin({
    session,
  });

  const { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime } =
    useUserAvailability({
      name,
      session,
    });

  const { roomStatistics, fetchRoomStatistics } = useRoomStatistics({
    session,
    weightCalculateStrategy,
  });

  // 훅분리... 애매하긴 해..

  // view와 edit, 모드별로 훅을 분리하는 것....
  // 나쁘지 않을지도.

  // const checkEventPage = useCheckEventPage(session);
  // const switchToEditMode = async () => {
  //   await editModeData.initializeEditMode();
  //   setMode('edit');
  // };

  // const switchToViewMode = async () => {
  //   await editModeData.submitAndRefresh();
  //   await viewModeData.refreshData();
  //   setMode('view');
  // };

  // 이런식으로 선언적인 핸들러를 만들면 좋을것 같다!

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleToggleEditMode = async () => {
    if (mode === 'view') {
      if (isLoggedIn) setMode('edit');
      else handleOpenLoginModal();
    } else {
      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      setMode('view');
    }
  };

  const loginAndLoadSchedulingData = async () => {
    try {
      await handleLogin();
      await fetchUserAvailableTime();
      handleCloseLoginModal();
      setMode('edit');
    } catch (err) {
      const e = err as Error;
      console.log(e);
      alert(e.message);
      console.error(err);
    }
  };

  return (
    <>
      <Wrapper maxWidth={1280} paddingTop="var(--padding-10)">
        <Flex direction="column" gap="var(--gap-6)">
          <CheckEventPageHeader
            deadline={roomInfo.deadline}
            title={roomInfo.title}
            roomSession={roomInfo.roomSession}
          />
          <Wrapper>
            <S.TimeTableContainer>
              <Flex gap="var(--gap-8)" direction="column" align="center">
                <TimeTableHeader
                  name={mode === 'view' ? roomInfo.title : userName.value}
                  mode={mode}
                  onToggleEditMode={handleToggleEditMode}
                />
                {mode === 'view' ? (
                  <Heatmap
                    dateTimeSlots={roomInfo.availableTimeSlots}
                    availableDates={roomInfo.availableDateSlots}
                    roomStatistics={roomStatistics}
                  />
                ) : (
                  <Timetable
                    dateTimeSlots={roomInfo.availableTimeSlots}
                    availableDates={roomInfo.availableDateSlots}
                    selectedTimes={selectedTimes}
                  />
                )}
              </Flex>
            </S.TimeTableContainer>
          </Wrapper>
        </Flex>
      </Wrapper>
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        handleCloseLoginModal={handleCloseLoginModal}
        handleModalLogin={loginAndLoadSchedulingData}
        userData={userData}
        handleUserData={handleUserData}
      />
    </>
  );
};

export default CheckEventPage;
