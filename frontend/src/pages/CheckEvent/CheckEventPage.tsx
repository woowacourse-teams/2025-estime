import LoginModal from '@/pages/CheckEvent/components/LoginModal';
import useUserAvailability from '@/pages/CheckEvent/hooks/useUserAvailability';
import CheckEventPageHeader from '@/pages/CheckEvent/components/CheckEventPageHeader';
import { useCallback } from 'react';
import { EntryConfirmModal } from '@/pages/CheckEvent/components/EntryConfirmModal';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/CheckEvent/components/CopyLinkModal';
import useSSE from '@/pages/CheckEvent/hooks/useSSE';
import useHeatmapStatistics from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import useUserLogin from './hooks/useUserLogin';
import useTimeTablePagination from './hooks/useTimeTablePagination';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import * as S from './CheckEventPage.styled';
import useCheckRoomSession from '@/pages/CheckEvent/hooks/useCheckRoomSession';
import useCheckEventHandlers from './hooks/useCheckEventHandlers';
import TimetableSection from './sections/TimeTableSection';
import HeatmapSection from './sections/HeatmapSection';
import GlassTooltip from './components/GlassTooltip';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const { handleLogin, isLoginLoading } = useUserLogin({
    session,
  });

  const { handleUserAvailabilitySubmit, fetchUserAvailableTime, isSavingUserTime } =
    useUserAvailability({
      session,
    });

  const { fetchRoomStatistics } = useHeatmapStatistics({
    session,
  });

  const pagination = useTimeTablePagination({
    availableDates: roomInfo.availableDateSlots,
  });

  const {
    buttonMode,
    buttonName,
    modal,
    handleButtonClick,
    handleLoginModalButtonClick,
    handleConfirmModalButtonClick,
    handleModalClick,
  } = useCheckEventHandlers({
    handleLogin,
    fetchUserAvailableTime,
    handleUserAvailabilitySubmit,
    pageReset: pagination.pageReset,
  });

  const onVoteChange = useCallback(async () => {
    console.log('🔄 SSE vote-changed event 확인... fetch중...');
    await fetchRoomStatistics();
    // 여기서 전역 store에 반영
    console.log('✅ fetch 완료!');
  }, [fetchRoomStatistics]);

  useSSE(session, onVoteChange);

  return (
    <>
      <Wrapper
        maxWidth={1280}
        paddingTop="var(--padding-11)"
        paddingBottom="var(--padding-25)"
        paddingLeft="var(--padding-7)"
        paddingRight="var(--padding-7)"
      >
        <Flex direction="column" gap="var(--gap-6)">
          <CheckEventPageHeader
            deadline={roomInfo.deadline}
            title={roomInfo.title}
            roomSession={roomInfo.roomSession}
            handleCopyLinkButtonClick={() => handleModalClick('open_copylink')}
          />
          <S.FlipCard>
            <S.FlipInner isFlipped={buttonMode === 'save'}>
              <TimetableSection
                roomInfo={roomInfo}
                pagination={pagination}
                buttonName={buttonName}
                handleButtonClick={handleButtonClick}
              />
              <HeatmapSection
                roomInfo={roomInfo}
                pagination={pagination}
                buttonName={buttonName}
                handleButtonClick={handleButtonClick}
              />
              <GlassTooltip />
            </S.FlipInner>
          </S.FlipCard>
        </Flex>
      </Wrapper>

      <Modal isOpen={modal.login} position="center" onClose={() => handleModalClick('close_login')}>
        <LoginModal
          handleModalLogin={handleLoginModalButtonClick}
          isLoginLoading={isLoginLoading || isSavingUserTime}
        />
      </Modal>

      <Modal
        isOpen={modal.entryConfirm}
        position="center"
        onClose={() => handleConfirmModalButtonClick('N')}
      >
        <EntryConfirmModal
          onConfirm={() => handleConfirmModalButtonClick('Y')}
          onCancel={() => handleConfirmModalButtonClick('N')}
        />
      </Modal>

      <Modal
        isOpen={modal.copyLink}
        position="center"
        onClose={() => handleModalClick('close_copylink')}
      >
        <CopyLinkModal sessionId={session} />
      </Modal>
    </>
  );
};

export default CheckEventPage;
