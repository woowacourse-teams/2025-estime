import Flex from '@/components/Layout/Flex';
import Wrapper from '@/components/Layout/Wrapper';
import LoginModal from '@/components/LoginModal';
import Timetable from '@/components/Timetable';
import useCheckRoomSession from '@/hooks/useCheckRoomSession';
import { useModalControl } from '@/hooks/TimeTableRoom/useModalControl';
import { useUserLogin } from '@/hooks/Login/useUserLogin';
import useUserAvailability from '@/hooks/useUserAvailability';
import CheckEventPageHeader from '@/components/CheckEventPageHeader';
import RecommendTime from '@/components/RecommendTime';
import useRecommendTime from '@/hooks/RecommendTime/useRecommendTime';
import { useState } from 'react';
import TimeTableHeader from '@/components/TimeTableHeader';
import Heatmap from '@/components/Heatmap';
import * as S from './styles/CheckEventPage.styled';
import useRoomStatistics from '@/hooks/useRoomStatistics';
import { simpleWeightStrategy } from '@/utils/getWeight';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const { isLoginModalOpen, handleOpenLoginModal, handleCloseLoginModal } = useModalControl();

  const { handleLogin, userData, handleUserData, name } = useUserLogin({
    session,
  });

  const { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime } =
    useUserAvailability({
      name,
      session,
    });

  const { recommendTimeData, fetchRecommendTimes } = useRecommendTime(session);

  const { roomStatistics, fetchRoomStatistics } = useRoomStatistics({
    session,
    weightCalculateStrat: simpleWeightStrategy,
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
      handleOpenLoginModal();
    } else {
      await userAvailabilitySubmit();
      await fetchRecommendTimes();
      await fetchRoomStatistics(session);
      // 해당 코드가 없으면 기존 value가 남아 있음. 초기화 해줘야 함.
      selectedTimes.value.clear();
      setMode('view');
    }
  };

  const loginAndLoadSchedulingData = async () => {
    try {
      await handleLogin();
      await fetchUserAvailableTime();
      await fetchRecommendTimes();
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
              <S.TimeTableContainer>
                <Flex gap="var(--gap-6)" direction="column">
                  <TimeTableHeader
                    name={mode === 'view' ? roomInfo.title : userName.value}
                    mode={mode}
                    onToggleEditMode={handleToggleEditMode}
                  />
                  {mode === 'view' ? (
                    <Heatmap
                      roomName={roomInfo.title}
                      time={roomInfo.time}
                      availableDates={roomInfo.availableDates}
                      roomStatistics={roomStatistics}
                    />
                  ) : (
                    <Timetable
                      name={userName.value}
                      time={roomInfo.time}
                      availableDates={roomInfo.availableDates}
                      selectedTimes={selectedTimes}
                    />
                  )}
                </Flex>
              </S.TimeTableContainer>
            </Flex.Item>
            <Flex.Item flex={1}>
              <RecommendTime
                dateTimes={recommendTimeData.map((item) => item.dateTime)}
                isPublic={roomInfo.isPublic === 'public'}
              />
            </Flex.Item>
          </Flex>
          <LoginModal
            isLoginModalOpen={isLoginModalOpen}
            handleCloseLoginModal={handleCloseLoginModal}
            handleModalLogin={loginAndLoadSchedulingData}
            userData={userData}
            handleUserData={handleUserData}
          />
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CheckEventPage;
