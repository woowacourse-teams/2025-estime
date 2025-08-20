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
import useHandleError from '@/hooks/Error/useCreateError';
import Modal from '@/components/Modal';
import CopyLinkModal from '@/components/CopyLinkModal';
import useSSE from '@/hooks/SSE/useSSE';

const CheckEventPage = () => {
  const { roomInfo, session } = useCheckRoomSession();

  const { modalHelpers } = useModalControl();

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

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleError = useHandleError();

  const switchToViewMode = async () => {
    try {
      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      setMode('view');
    } catch (error) {
      handleError(error, 'switchToViewMode');
    }
  };

  const switchToEditMode = async () => {
    if (isLoggedIn) {
      await fetchUserAvailableTime();
      setMode('edit');
    } else {
      modalHelpers.login.open();
    }
  };

  const handleToggleMode = async () => {
    if (mode === 'edit') {
      await switchToViewMode();
    } else {
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
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleLoginSuccess');
    }
  };

  const handleContinueWithDuplicated = async () => {
    try {
      modalHelpers.entryConfirm.close();
      modalHelpers.login.close();
      await fetchUserAvailableTime();
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleContinueWithDuplicated');
    }
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
      <Wrapper maxWidth={1280} paddingTop="var(--padding-10)">
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
              <S.TimeTableContainer>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode="view"
                    onToggleEditMode={handleToggleMode}
                  />
                  <Heatmap
                    dateTimeSlots={roomInfo.availableTimeSlots}
                    availableDates={roomInfo.availableDateSlots}
                    roomStatistics={roomStatistics}
                  />
                </Flex>
              </S.TimeTableContainer>
            </S.FrontFace>

            {/* edit 모드 */}
            <S.BackFace isFlipped={mode !== 'view'}>
              <S.TimeTableContainer>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={userName.value}
                    mode="edit"
                    onToggleEditMode={handleToggleMode}
                  />

                  <Timetable
                    dateTimeSlots={roomInfo.availableTimeSlots}
                    availableDates={roomInfo.availableDateSlots}
                    selectedTimes={selectedTimes}
                  />
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
        onCancel={modalHelpers.entryConfirm.close}
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
