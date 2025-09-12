import LoginModal from '@/pages/CheckEvent/components/LoginModal';
import Timetable from '@/pages/CheckEvent/components/Timetable';
import useCheckRoomSession from '@/pages/CheckEvent/hooks/useCheckRoomSession';
import useUserAvailability from '@/pages/CheckEvent/hooks/useUserAvailability';
import CheckEventPageHeader from '@/pages/CheckEvent/components/CheckEventPageHeader';
import { useState, useCallback, useRef, RefObject } from 'react';
import TimeTableHeader from '@/pages/CheckEvent/components/TimeTableHeader';
import Heatmap from '@/pages/CheckEvent/components/Heatmap';
import { weightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { EntryConfirmModal } from '@/pages/CheckEvent/components/EntryConfirmModal';
import useHandleError from '@/shared/hooks/common/useCreateError';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/CheckEvent/components/CopyLinkModal';
import { useTheme } from '@emotion/react';
import useSSE from '@/pages/CheckEvent/hooks/useSSE';
import { useToastContext } from '@/shared/contexts/ToastContext';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Text from '@/shared/components/Text';
import useHeatmapStatistics from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import useModalControl from '@/shared/hooks/Modal/useModalControl';
import useUserLogin from './hooks/useUserLogin';
import useTimeTablePagination from './hooks/useTimeTablePagination';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import {
  TimeSelectionProvider,
  useTimeSelectionContext,
} from '@/pages/CheckEvent/contexts/TimeSelectionContext';
import * as S from './CheckEventPage.styled';

// 컨텍스트를 ref에 설정하는 헬퍼 컴포넌트
const TimeSelectionContextSetter = ({
  contextRef,
}: {
  contextRef: RefObject<ReturnType<typeof useTimeSelectionContext> | null>;
}) => {
  const context = useTimeSelectionContext();
  contextRef.current = context;
  return null;
};

const CheckEventPage = () => {
  const theme = useTheme();
  const { addToast } = useToastContext();

  const { roomInfo, session } = useCheckRoomSession();

  const { modalHelpers } = useModalControl();

  const { handleLogin, userData, handleUserData, name, isLoggedIn, handleLoggedIn } = useUserLogin({
    session,
  });

  const { userAvailability, userAvailabilitySubmit, fetchUserAvailableTime } = useUserAvailability({
    name,
    session,
  });

  const { roomStatistics, fetchRoomStatistics } = useHeatmapStatistics({
    session,
    weightCalculateStrategy,
  });

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleError = useHandleError();

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

  // 현재 선택된 시간에 접근하는 함수를 만들기 위한 ref
  const timeSelectionContextRef = useRef<ReturnType<typeof useTimeSelectionContext> | null>(null);

  const switchToViewMode = useCallback(async () => {
    try {
      // 버튼 클릭 시 현재 선택된 시간을 가져와서 commit
      if (timeSelectionContextRef.current) {
        const currentTimes = timeSelectionContextRef.current.getCurrentSelectedTimes();
        userAvailability.selectedTimes = currentTimes;
      }

      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      setMode('view');
      pageReset();
    } catch (error) {
      handleError(error, 'switchToViewMode');
    }
  }, [
    userAvailabilitySubmit,
    fetchRoomStatistics,
    session,
    pageReset,
    handleError,
    userAvailability,
  ]);

  const switchToEditMode = useCallback(async () => {
    if (isLoggedIn) {
      await fetchUserAvailableTime();
      setMode('edit');
      pageReset();
    } else {
      modalHelpers.login.open();
    }
  }, [isLoggedIn, fetchUserAvailableTime, pageReset, modalHelpers.login]);

  const handleToggleMode = useCallback(async () => {
    if (mode === 'edit') {
      await switchToViewMode();
    } else {
      switchToEditMode();
    }
  }, [mode, switchToViewMode, switchToEditMode]);

  const handleLoginSuccess = useCallback(async () => {
    try {
      const isDuplicated = await handleLogin();
      if (isDuplicated) {
        modalHelpers.entryConfirm.open();
        return;
      }
      await fetchUserAvailableTime();
      modalHelpers.login.close();
      handleLoggedIn.setTrue();
      setMode('edit');
      pageReset();
    } catch (error) {
      handleError(error, 'handleLoginSuccess');
    }
  }, [
    handleLogin,
    modalHelpers.entryConfirm,
    modalHelpers.login,
    fetchUserAvailableTime,
    handleLoggedIn,
    pageReset,
    handleError,
  ]);

  const handleContinueWithDuplicated = useCallback(async () => {
    try {
      modalHelpers.entryConfirm.close();
      modalHelpers.login.close();
      await fetchUserAvailableTime();
      handleLoggedIn.setTrue();
      setMode('edit');
      pageReset();
    } catch (error) {
      handleError(error, 'handleContinueWithDuplicated');
    }
  }, [
    modalHelpers.entryConfirm,
    modalHelpers.login,
    fetchUserAvailableTime,
    handleLoggedIn,
    pageReset,
    handleError,
  ]);

  const handleDuplicatedCancel = useCallback(() => {
    modalHelpers.entryConfirm.close();
    handleLoggedIn.setFalse();
  }, [modalHelpers.entryConfirm, handleLoggedIn]);

  // 로그인 안했을 때, 토스트 띄우기
  const handleBeforeEdit = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isLoggedIn) return;

      const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-heatmap-cell]');
      if (!cell) return;

      addToast({
        type: 'warning',
        message: '시간을 등록하려면 "편집하기"를 눌러주세요',
      });
    },
    [isLoggedIn, addToast]
  );

  useSSE(session, handleError, {
    onVoteChange: async () => {
      console.log('🔄 SSE vote-changed event 확인... fetch중...');
      await fetchRoomStatistics(session);
      console.log('✅ fetch 완료!');
    },
  });

  const handleTimeSelectionCommit = useCallback(
    (newSelectedTimes: Set<string>) => {
      userAvailability.selectedTimes = newSelectedTimes;
    },
    [userAvailability]
  );

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
            openCopyModal={modalHelpers.copyLink.open}
          />
          <S.FlipCard isFlipped={mode !== 'view'}>
            {/* view 모드 */}
            <S.FrontFace isFlipped={mode !== 'view'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode="view"
                    onToggleEditMode={handleToggleMode}
                  />
                  <Flex direction="column" gap="var(--gap-4)">
                    {theme.isMobile && (
                      <Flex gap="var(--gap-3)" justify="flex-end" align="center">
                        <PageArrowButton onClick={handlePagePrev} disabled={!canPagePrev}>
                          <IChevronLeft width={20} height={20} />
                        </PageArrowButton>
                        <Text variant="h4">
                          {page} / {totalPages}
                        </Text>
                        <PageArrowButton onClick={handlePageNext} disabled={!canPageNext}>
                          <IChevronRight width={20} height={20} />
                        </PageArrowButton>
                      </Flex>
                    )}
                    <Heatmap
                      timeColumnRef={timeColumnRef}
                      dateTimeSlots={roomInfo.availableTimeSlots}
                      availableDates={currentPageDates}
                      roomStatistics={roomStatistics}
                      handleBeforeEdit={handleBeforeEdit}
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
                    name={userAvailability.userName}
                    mode="edit"
                    onToggleEditMode={handleToggleMode}
                  />
                  <Flex direction="column" gap="var(--gap-4)">
                    {theme.isMobile && (
                      <Flex gap="var(--gap-3)" justify="flex-end" align="center">
                        <PageArrowButton onClick={handlePagePrev} disabled={!canPagePrev}>
                          <IChevronLeft width={20} height={20} />
                        </PageArrowButton>
                        <Text variant="h4">
                          {page} / {totalPages}
                        </Text>
                        <PageArrowButton onClick={handlePageNext} disabled={!canPageNext}>
                          <IChevronRight width={20} height={20} />
                        </PageArrowButton>
                      </Flex>
                    )}
                    <TimeSelectionProvider onCommit={handleTimeSelectionCommit}>
                      <TimeSelectionContextSetter contextRef={timeSelectionContextRef} />
                      <Timetable
                        timeColumnRef={timeColumnRef}
                        dateTimeSlots={roomInfo.availableTimeSlots}
                        availableDates={currentPageDates}
                        initialSelectedTimes={userAvailability.selectedTimes}
                      />
                    </TimeSelectionProvider>
                  </Flex>
                </Flex>
              </S.TimeTableContainer>
            </S.BackFace>
          </S.FlipCard>
        </Flex>
      </Wrapper>
      <LoginModal
        isLoginModalOpen={modalHelpers.login.isOpen}
        handleCloseLoginModal={modalHelpers.login.close}
        handleModalLogin={handleLoginSuccess}
        userData={userData}
        handleUserData={handleUserData}
      />
      <EntryConfirmModal
        isEntryConfirmModalOpen={modalHelpers.entryConfirm.isOpen}
        onConfirm={handleContinueWithDuplicated}
        onCancel={handleDuplicatedCancel}
      />
      <Modal
        isOpen={modalHelpers.copyLink.isOpen}
        onClose={modalHelpers.copyLink.close}
        position="center"
      >
        <CopyLinkModal sessionId={session} />
      </Modal>
    </>
  );
};

export default CheckEventPage;
