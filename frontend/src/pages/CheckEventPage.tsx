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
import { EntryConfirmModal } from '@/components/EntryConfirmModal';
import * as Sentry from '@sentry/react';
import { useToastContext } from '@/contexts/ToastContext';
import { useTheme } from '@emotion/react';
import MobileTimeTablePageButtons from '@/components/MobileTimeTablePageButtons';
import { useTimeTablePagination } from '@/hooks/Pagination/useTimeTablePagination';

const CheckEventPage = () => {
  const { addToast } = useToastContext();
  const theme = useTheme();

  const { roomInfo, session } = useCheckRoomSession();

  const { modals, handleCloseModal, handleOpenModal } = useModalControl();

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

  //TODO: view와 edit, 모드별로 훅을 분리하는 것....으로 하면 좋을것 같아서.

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
      if (isLoggedIn) {
        setMode('edit');
        pageReset();
      } else handleOpenModal('Login');
    } else {
      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      setMode('view');
      pageReset();
    }
  };

  const loginAndLoadSchedulingData = async () => {
    try {
      const isDuplicated = await handleLogin();
      if (isDuplicated) {
        handleOpenModal('EntryConfirm');
        return;
      }
      await fetchUserAvailableTime();
      handleCloseModal('Login');
      setMode('edit');
      pageReset();
    } catch (err) {
      const e = err as Error;
      addToast({
        type: 'error',
        message: e.message,
      });
      Sentry.captureException(err, {
        level: 'error',
      });
    }
  };

  const handleContinueWithDuplicated = async () => {
    try {
      handleCloseModal('EntryConfirm');
      handleCloseModal('Login');
      await fetchUserAvailableTime();
      setMode('edit');
      pageReset();
    } catch (err) {
      const e = err as Error;
      addToast({
        type: 'error',
        message: e.message,
      });
      Sentry.captureException(err, {
        level: 'error',
      });
    }
  };

  const handleCancelContinueWithDuplicated = () => {
    handleCloseModal('EntryConfirm');
  };

  const {
    totalPages,
    page,
    timeTableContainerRef,
    timeColumnRef,
    currentPageDates,
    canPagePrev,
    canPageNext,
    handlePagePrev,
    handlePageNext,
    pageReset,
  } = useTimeTablePagination({
    availableDates: roomInfo.availableDateSlots,
  });

  return (
    <>
      <Wrapper
        maxWidth={1280}
        paddingTop="var(--padding-11)"
        paddingBottom="var(--padding-11)"
        paddingLeft="var(--padding-7)"
        paddingRight="var(--padding-7)"
      >
        <Flex direction="column" gap="var(--gap-6)">
          <CheckEventPageHeader
            deadline={roomInfo.deadline}
            title={roomInfo.title}
            roomSession={roomInfo.roomSession}
          />
          <S.FlipCard isFlipped={mode !== 'view'}>
            {/* view 모드 */}
            <S.FrontFace isFlipped={mode !== 'view'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode="view"
                    onToggleEditMode={handleToggleEditMode}
                  />
                  <Flex direction="column" gap="var(--gap-4)">
                    {theme.isMobile && (
                      <MobileTimeTablePageButtons
                        totalPage={totalPages}
                        currentPage={page}
                        handlePrev={handlePagePrev}
                        handleNext={handlePageNext}
                        canPrev={canPagePrev}
                        canNext={canPageNext}
                      />
                    )}
                    <Heatmap
                      timeColumnRef={timeColumnRef}
                      dateTimeSlots={roomInfo.availableTimeSlots}
                      availableDates={currentPageDates}
                      roomStatistics={roomStatistics}
                    />
                  </Flex>
                </Flex>
              </S.TimeTableContainer>
            </S.FrontFace>

            {/* edit 모드 */}
            <S.BackFace isFlipped={mode !== 'view'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={userName.value}
                    mode="edit"
                    onToggleEditMode={handleToggleEditMode}
                  />
                  <Flex direction="column" gap="var(--gap-4)">
                    {theme.isMobile && (
                      <MobileTimeTablePageButtons
                        totalPage={totalPages}
                        currentPage={page}
                        handlePrev={handlePagePrev}
                        handleNext={handlePageNext}
                        canPrev={canPagePrev}
                        canNext={canPageNext}
                      />
                    )}
                    <Timetable
                      timeColumnRef={timeColumnRef}
                      dateTimeSlots={roomInfo.availableTimeSlots}
                      availableDates={currentPageDates}
                      selectedTimes={selectedTimes}
                    />
                  </Flex>
                </Flex>
              </S.TimeTableContainer>
            </S.BackFace>
          </S.FlipCard>
        </Flex>
      </Wrapper>
      <LoginModal
        isLoginModalOpen={modals['Login']}
        handleCloseLoginModal={() => handleCloseModal('Login')}
        handleModalLogin={loginAndLoadSchedulingData}
        userData={userData}
        handleUserData={handleUserData}
      />
      <EntryConfirmModal
        isEntryConfirmModalOpen={modals['EntryConfirm']}
        onConfirm={handleContinueWithDuplicated}
        onCancel={handleCancelContinueWithDuplicated}
      />
    </>
  );
};

export default CheckEventPage;
