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
import { useEffect, useState } from 'react';
import TimeTableHeader from '@/components/TimeTableHeader';
import Heatmap from '@/components/Heatmap';
import * as S from './styles/CheckEventPage.styled';
import { getRoomStatistics } from '@/apis/room/room';
import type { StatisticItem } from '@/apis/room/type';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const { handleCloseAllModal, isLoginModalOpen, handleCloseLoginModal, handleOpenLoginModal } =
    useModalControl();

  const { handleLogin, userData, handleUserData, name } = useUserLogin({
    session,
  });

  const { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime } =
    useUserAvailability({
      name,
      session,
    });

  const { recommendTimeData, fetchRecommendTimes } = useRecommendTime(session);

  const fetchRoomStatistics = async (sessionId: string) => {
    if (!sessionId) return;
    try {
      const res = await getRoomStatistics(sessionId);
      setRoomStatistics(res.statistic);
    } catch (err) {
      const e = err as Error;
      console.error(e);
      alert(e.message);
    }
  };

  const [roomStatistics, setRoomStatistics] = useState<StatisticItem[] | []>([]);
  const handleInitAfterLogin = async () => {
    try {
      await handleLogin();
      await fetchUserAvailableTime();
      await fetchRecommendTimes();
      await fetchRoomStatistics(session);
      handleCloseAllModal();
      setMode('edit');
    } catch (err) {
      const e = err as Error;
      console.log(e);
      alert(e.message);
      console.error(err);
    }
  };
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleToggleEditMode = async () => {
    if (mode === 'view') {
      handleOpenLoginModal();
    } else {
      await userAvailabilitySubmit();
      setMode('view');
    }
  };
  useEffect(() => {
    if (session) {
      fetchRoomStatistics(session);
    }
  }, [session]);

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
                      selectedTimes={selectedTimes}
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
