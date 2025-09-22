import LoginModal from '@/pages/CheckEvent/components/LoginModal';
import useCheckRoomSession from '@/pages/CheckEvent/hooks/useCheckRoomSession';
import CheckEventPageHeader from '@/pages/CheckEvent/components/CheckEventPageHeader';
import { useState } from 'react';
import { EntryConfirmModal } from '@/pages/CheckEvent/components/EntryConfirmModal';

import useHandleError from '@/shared/hooks/common/useCreateError';
import Modal from '@/shared/components/Modal';
import CopyLinkModal from '@/pages/CheckEvent/components/CopyLinkModal';

import useModalControl from '@/shared/hooks/Modal/useModalControl';
import useUserLogin from './hooks/useUserLogin';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import * as S from './CheckEventPage.styled';
import AvailabilityDisplay from './components/AvailabilityDisplay/AvailabilityDisplay';
import HeatmapDisplay from './components/HeatmapDisplay/HeatmapDisplay';
import { useToastContext } from '@/shared/contexts/ToastContext';
import { useTimeSelectionContext } from './contexts/TimeSelectionContext';

const CheckEventPage = () => {
  const { addToast } = useToastContext();

  const { modalHelpers } = useModalControl();

  const { roomInfo, session } = useCheckRoomSession();

  const { handleLogin, userData, handleUserData, name, isLoggedIn, handleLoggedIn } = useUserLogin({
    session,
  });
  const { getFetchUserAvailableTime } = useTimeSelectionContext();

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const handleError = useHandleError();

  const switchToViewMode = async () => {
    try {
      await getFetchUserAvailableTime();
      setMode('view');
    } catch (error) {
      handleError(error, 'switchToViewMode');
    }
  };

  const switchToEditMode = async () => {
    if (isLoggedIn) {
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
      modalHelpers.login.close();
      handleLoggedIn.setTrue();
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleLoginSuccess');
    }
  };

  const handleContinueWithDuplicated = async () => {
    try {
      await getFetchUserAvailableTime();
      modalHelpers.entryConfirm.close();
      modalHelpers.login.close();
      handleLoggedIn.setTrue();
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleContinueWithDuplicated');
    }
  };

  const handleDuplicatedCancel = () => {
    modalHelpers.entryConfirm.close();
    handleLoggedIn.setFalse();
  };

  // 로그인 안했을 때, 토스트 띄우기
  const handleBeforeEdit = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoggedIn) return;

    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-heatmap-cell]');
    if (!cell) return;

    addToast({
      type: 'warning',
      message: '시간을 등록하려면 "편집하기"를 눌러주세요',
    });
  };

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
            <HeatmapDisplay
              mode={mode}
              roomInfo={roomInfo}
              handleToggleMode={handleToggleMode}
              handleBeforeEdit={handleBeforeEdit}
              session={session}
            />
            <AvailabilityDisplay
              name={name}
              mode={mode}
              roomInfo={roomInfo}
              handleToggleMode={handleToggleMode}
              session={session}
            />
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
