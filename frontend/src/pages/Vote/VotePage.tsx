import LoginModal from '@/pages/Vote/components/LoginModal';
import useUserAvailability from '@/pages/Vote/hooks/useUserAvailability';
import VotePageHeader from '@/pages/Vote/components/VotePageHeader';
import { useCallback } from 'react';
import { EntryConfirmModal } from '@/pages/Vote/components/EntryConfirmModal';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/Vote/components/CopyLinkModal';
import useSSE from '@/pages/Vote/hooks/useSSE';
import useHeatmapStatistics from '@/pages/Vote/hooks/useHeatmapStatistics';
import useUserLogin from './hooks/useUserLogin';
import useTimeTablePagination from './hooks/useTimeTablePagination';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import * as S from './VotePage.styled';
import useVoteRoomSession from '@/pages/Vote/hooks/useVoteRoomSession';
import useVotePageHandlers from './hooks/useVotePageHandlers';
import TimetableSection from './sections/TimeTableSection';
import HeatmapSection from './sections/HeatmapSection';
import GlassTooltip from './components/GlassTooltip';
import Announce from './components/Announce/Announce';
import { useTheme } from '@emotion/react';
import useModalControl from '@/shared/hooks/Modal/useModalControl';

const VotePage = () => {
  const { isMobile } = useTheme();

  const { roomInfo, session } = useVoteRoomSession();

  const { performLogin, isLoginLoading } = useUserLogin({
    session,
  });

  const { performUserSubmit, loadUserAvailability, isSavingUserTime } = useUserAvailability({
    session,
  });

  const { fetchRoomStatistics } = useHeatmapStatistics({
    session,
  });

  const pagination = useTimeTablePagination({
    availableDates: roomInfo.availableDateSlots,
  });

  const modalHelpers = useModalControl();

  const { buttonMode, buttonName, handleButtonClick, handleLogin, handleConfirm } =
    useVotePageHandlers({
      loadUserAvailability,
      performLogin,
      performUserSubmit,
      pageReset: pagination.pageReset,
      modalHelpers,
    });

  const isEntering = isLoginLoading || isSavingUserTime;

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
        paddingBottom="var(--padding-25)"
        paddingLeft="var(--padding-7)"
        paddingRight="var(--padding-7)"
      >
        <Flex direction="column" gap="var(--gap-6)">
          <VotePageHeader
            deadline={roomInfo.deadline}
            title={roomInfo.title}
            roomSession={roomInfo.roomSession}
            handleCopyLinkButtonClick={modalHelpers.copyLink.open}
          />
          <S.FlipCard>
            <S.FlipInner isFlipped={buttonMode === 'save'}>
              <TimetableSection
                roomInfo={roomInfo}
                pagination={pagination}
                buttonName={buttonName}
                handleButtonClick={handleButtonClick}
                isSavingUserTime={isSavingUserTime}
                isVisible={buttonMode === 'save'}
              />
              <HeatmapSection
                roomInfo={roomInfo}
                pagination={pagination}
                buttonName={buttonName}
                buttonMode={buttonMode}
                handleButtonClick={handleButtonClick}
              />
              {isMobile ? <GlassTooltip.Mobile /> : <GlassTooltip.Desktop />}
            </S.FlipInner>
          </S.FlipCard>
        </Flex>
      </Wrapper>

      <Modal
        isOpen={modalHelpers.login.isOpen}
        position="center"
        onClose={modalHelpers.login.close}
      >
        <LoginModal onSubmit={handleLogin} isPending={isEntering} />
      </Modal>

      <Modal
        isOpen={modalHelpers.confirm.isOpen}
        position="center"
        onClose={modalHelpers.confirm.close}
      >
        <EntryConfirmModal onConfirm={handleConfirm} />
      </Modal>

      <Modal
        isOpen={modalHelpers.copyLink.isOpen}
        position="center"
        onClose={modalHelpers.copyLink.close}
      >
        <CopyLinkModal sessionId={session} />
      </Modal>
      <Announce />
    </>
  );
};

export default VotePage;
