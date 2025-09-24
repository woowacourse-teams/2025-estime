import LoginModal from '@/pages/CheckEvent/components/LoginModal';
import Timetable from '@/pages/CheckEvent/components/Timetable';
import useCheckRoomSession from '@/pages/CheckEvent/hooks/useCheckRoomSession';
import useUserAvailability from '@/pages/CheckEvent/hooks/useUserAvailability';
import CheckEventPageHeader from '@/pages/CheckEvent/components/CheckEventPageHeader';
import { useState } from 'react';
import TimeTableHeader from '@/pages/CheckEvent/components/TimeTableHeader';
import Heatmap from '@/pages/CheckEvent/components/Heatmap';
import { weightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { EntryConfirmModal } from '@/pages/CheckEvent/components/EntryConfirmModal';
import useHandleError from '@/shared/hooks/common/useCreateError';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/CheckEvent/components/CopyLinkModal';
import { useTheme } from '@emotion/react';
import useSSE from '@/pages/CheckEvent/hooks/useSSE';
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
import * as S from './CheckEventPage.styled';
import { showToast } from '@/shared/store/toastStore';

const CheckEventPage = () => {
  const theme = useTheme();

  const { roomInfo, session, isExpired } = useCheckRoomSession();

  const { modalHelpers } = useModalControl();

  const { handleLogin, userData, handleUserData, name, isLoggedIn, handleLoggedIn } = useUserLogin({
    session,
  });

  const { userName, selectedTimes, userAvailabilitySubmit, fetchUserAvailableTime } =
    useUserAvailability({
      name,
      session,
    });

  const { roomStatistics, fetchRoomStatistics } = useHeatmapStatistics({
    session,
    weightCalculateStrategy,
  });

  const [mode, setMode] = useState<'register' | 'edit' | 'save'>('register');

  const handleError = useHandleError();

  const switchToViewMode = async () => {
    try {
      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      // save 모드에서 저장하기를 누르면 edit 모드로 전환
      setMode('edit');
      pageReset();
    } catch (error) {
      handleError(error, 'switchToViewMode');
    }
  };

  const switchToEditMode = async () => {
    if (isLoggedIn) {
      await fetchUserAvailableTime();
      // register에서 등록하기를 누르거나, edit에서 수정하기를 누르면 save 모드로 전환
      setMode('save');
      pageReset();
    } else {
      modalHelpers.login.open();
    }
  };

  const handleToggleMode = async () => {
    if (mode === 'save') {
      // save 모드에서 "저장하기" 버튼을 누르면 view 모드(edit)로 전환
      await switchToViewMode();
    } else {
      // register 모드에서 "등록하기" 또는 edit 모드에서 "수정하기"를 누르면 edit 모드(save)로 전환
      switchToEditMode();
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const isDuplicated = await handleLogin();
      if (isDuplicated) {
        modalHelpers.entryConfirm.open();
        return;
      }
      await fetchUserAvailableTime();
      modalHelpers.login.close();
      handleLoggedIn.setTrue();
      setMode('save');
      pageReset();
    } catch (error) {
      handleError(error, 'handleLoginSuccess');
    }
  };

  const handleContinueWithDuplicated = async () => {
    try {
      modalHelpers.entryConfirm.close();
      modalHelpers.login.close();
      await fetchUserAvailableTime();
      handleLoggedIn.setTrue();
      setMode('save');
      pageReset();
    } catch (error) {
      handleError(error, 'handleContinueWithDuplicated');
    }
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

  const handleDuplicatedCancel = () => {
    modalHelpers.entryConfirm.close();
    handleLoggedIn.setFalse();
  };

  // 로그인 안했을 때, 토스트 띄우기
  const handleBeforeEdit = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoggedIn) return;

    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-heatmap-cell]');
    if (!cell) return;

    if (isExpired) return;

    showToast({
      type: 'warning',
      message: '시간을 등록하려면 "편집하기"를 눌러주세요',
    });
  };

  useSSE(session, handleError, {
    onVoteChange: async () => {
      console.log('🔄 SSE vote-changed event 확인... fetch중...');
      await fetchRoomStatistics(session);
      console.log('✅ fetch 완료!');
    },
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
            openCopyModal={modalHelpers.copyLink.open}
          />
          <S.FlipCard isFlipped={mode === 'save'}>
            {/* view 모드 */}
            <S.FrontFace isFlipped={mode === 'save'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode={mode}
                    onToggleEditMode={handleToggleMode}
                    isExpired={isExpired}
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
            <S.BackFace isFlipped={mode === 'save'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={userName.value}
                    mode={mode}
                    onToggleEditMode={handleToggleMode}
                    isExpired={isExpired}
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
