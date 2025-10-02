import LoginModal from '@/pages/CheckEvent/components/LoginModal';
import Timetable from '@/pages/CheckEvent/components/Timetable';
import useUserAvailability from '@/pages/CheckEvent/hooks/useUserAvailability';
import CheckEventPageHeader from '@/pages/CheckEvent/components/CheckEventPageHeader';
import { useCallback } from 'react';
import TimeTableHeader from '@/pages/CheckEvent/components/TimeTableHeader';
import Heatmap from '@/pages/CheckEvent/components/Heatmap';
import { weightCalculateStrategy } from '@/pages/CheckEvent/utils/getWeight';
import { EntryConfirmModal } from '@/pages/CheckEvent/components/EntryConfirmModal';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/CheckEvent/components/CopyLinkModal';
import { useTheme } from '@emotion/react';
import useSSE from '@/pages/CheckEvent/hooks/useSSE';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Text from '@/shared/components/Text';
import useHeatmapStatistics from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import useUserLogin from './hooks/useUserLogin';
import useTimeTablePagination from './hooks/useTimeTablePagination';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import { TimeSelectionProvider } from '@/pages/CheckEvent/contexts/TimeSelectionContext';
import * as S from './CheckEventPage.styled';
import { RoomStatisticsProvider } from './provider/RoomStatisticsProvider';
import useCheckRoomSession from '@/pages/CheckEvent/hooks/useCheckRoomSession';
import { showToast } from '@/shared/store/toastStore';
import Button from '@/shared/components/Button';
import useCheckEventHandlers from './hooks/useCheckEventHandlers';
import { userNameStore } from './stores/userNameStore';
import { userAvailabilityStore } from './stores/userAvailabilityStore';

interface CheckEventContentProps {
  roomInfo: ReturnType<typeof useCheckRoomSession>['roomInfo'];
  session: string;
  isExpired: boolean;
}

const CheckEventContent = ({ roomInfo, session, isExpired }: CheckEventContentProps) => {
  const theme = useTheme();

  const { handleLogin, isLoginLoading } = useUserLogin({
    session,
  });

  const { handleUserAvailabilitySubmit, fetchUserAvailableTime, isSavingUserTime } =
    useUserAvailability({
      session,
    });

  const { fetchRoomStatistics } = useHeatmapStatistics({
    session,
    weightCalculateStrategy,
  });

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

  const {
    buttonMode,
    buttonName,
    modal,
    handleButtonClick,
    handleLoginModalButtonClick,
    handleConfirmModalButtonClick,
    handleCopyLinkButtonClick,
  } = useCheckEventHandlers({
    handleLogin,
    fetchUserAvailableTime,
    handleUserAvailabilitySubmit,
    pageReset,
  });

  // 로그인 안했을 때, 토스트 띄우기
  const handleBeforeEdit = (e: React.PointerEvent<HTMLDivElement>) => {
    // if (isLoggedIn) return;
    // 전역 store userName으로 체크해야 함
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-cell-id]');

    if (!cell) return;

    if (isExpired) return;

    showToast({
      type: 'warning',
      message: '시간을 등록하려면 "편집하기"를 눌러주세요',
    });
  };

  const onVoteChange = useCallback(async () => {
    console.log('🔄 SSE vote-changed event 확인... fetch중...');
    await fetchRoomStatistics();
    console.log('✅ fetch 완료!');
  }, [fetchRoomStatistics]);

  useSSE(session, onVoteChange);

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
            handleCopyLinkButtonClick={handleCopyLinkButtonClick}
          />
          <S.FlipCard isFlipped={buttonMode === 'save'}>
            {/* view 모드 */}
            <S.FrontFace isFlipped={buttonMode === 'save'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode={userNameStore.getSnapshot() !== '' ? 'edit' : 'register'}
                    isExpired={isExpired}
                  >
                    <Button
                      color="primary"
                      onClick={handleButtonClick}
                      disabled={isExpired}
                      size="small"
                    >
                      <Text variant="button" color={isExpired ? 'gray50' : 'text'}>
                        {buttonName}
                      </Text>
                    </Button>
                  </TimeTableHeader>
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
                      handleBeforeEdit={handleBeforeEdit}
                    />
                  </Flex>
                </Flex>
              </S.TimeTableContainer>
            </S.FrontFace>

            {/* edit 모드 */}
            <S.BackFace isFlipped={buttonMode === 'save'}>
              <S.TimeTableContainer ref={timeTableContainerRef}>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={userNameStore.getSnapshot()}
                    mode="save"
                    isLoading={isSavingUserTime}
                    isExpired={isExpired}
                  >
                    <Button
                      color="primary"
                      onClick={handleButtonClick}
                      disabled={isExpired}
                      size="small"
                    >
                      <Text variant="button" color={isExpired ? 'gray50' : 'text'}>
                        {buttonName}
                      </Text>
                    </Button>
                  </TimeTableHeader>

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
                      initialSelectedTimes={userAvailabilityStore.getSnapshot().selectedTimes}
                    />
                  </Flex>
                </Flex>
              </S.TimeTableContainer>
            </S.BackFace>
          </S.FlipCard>
        </Flex>
      </Wrapper>

      <LoginModal
        isLoginModalOpen={modal.login}
        handleModalLogin={handleLoginModalButtonClick}
        isLoginLoading={isLoginLoading || isSavingUserTime}
      />
      <EntryConfirmModal
        isEntryConfirmModalOpen={modal.entryConfirm}
        onConfirm={() => handleConfirmModalButtonClick('Y')}
        onCancel={() => handleConfirmModalButtonClick('N')}
      />
      <Modal isOpen={modal.copyLink} position="center">
        <CopyLinkModal sessionId={session} />
      </Modal>
    </>
  );
};

const CheckEventPage = () => {
  const { roomInfo, session, isExpired } = useCheckRoomSession();

  return (
    <TimeSelectionProvider>
      <RoomStatisticsProvider>
        <CheckEventContent roomInfo={roomInfo} session={session} isExpired={isExpired} />
      </RoomStatisticsProvider>
    </TimeSelectionProvider>
  );
};

export default CheckEventPage;
