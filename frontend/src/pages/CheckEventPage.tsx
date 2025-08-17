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

const CheckEventPage = () => {
  const { addToast } = useToastContext();

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

  // TODO: view와 edit, 모드별로 훅을 분리하는 것....으로 하면 좋을것 같아서.
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // 공통 에러 핸들링 유틸리티
  const handleError = (error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addToast({
      type: 'error',
      message: errorMessage,
    });
    Sentry.captureException(error, {
      level: 'error',
      tags: { context },
    });
  };

  // 편집 모드에서 뷰 모드로 전환 (데이터 저장)
  const switchToViewMode = async () => {
    try {
      await userAvailabilitySubmit();
      await fetchRoomStatistics(session);
      setMode('view');
    } catch (error) {
      handleError(error, 'switchToViewMode');
    }
  };

  // 뷰 모드에서 편집 모드로 전환 (로그인 체크)
  const switchToEditMode = () => {
    if (isLoggedIn) {
      setMode('edit');
    } else {
      handleOpenModal('Login');
    }
  };

  // 모드 토글 핸들러
  const handleToggleEditMode = async () => {
    if (mode === 'edit') {
      await switchToViewMode();
    } else {
      switchToEditMode();
    }
  };

  // 로그인 후 편집 모드로 전환
  const handleLoginSuccess = async () => {
    try {
      const isDuplicated = await handleLogin();
      if (isDuplicated) {
        handleOpenModal('EntryConfirm');
        return;
      }
      await fetchUserAvailableTime();
      handleCloseModal('Login');
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleLoginSuccess');
    }
  };

  // 중복 사용자 확인 후 진행
  const handleContinueWithDuplicated = async () => {
    try {
      handleCloseModal('EntryConfirm');
      handleCloseModal('Login');
      await fetchUserAvailableTime();
      setMode('edit');
    } catch (error) {
      handleError(error, 'handleContinueWithDuplicated');
    }
  };

  const handleCancelContinueWithDuplicated = () => {
    handleCloseModal('EntryConfirm');
  };
  return (
    <>
      <Wrapper maxWidth={1280} paddingTop="var(--padding-11)" paddingBottom="var(--padding-11)">
        <Flex direction="column" gap="var(--gap-6)">
          <CheckEventPageHeader
            deadline={roomInfo.deadline}
            title={roomInfo.title}
            roomSession={roomInfo.roomSession}
          />
          <S.FlipCard isFlipped={mode !== 'view'}>
            {/* view 모드 */}
            <S.FrontFace isFlipped={mode !== 'view'}>
              <S.TimeTableContainer>
                <Flex direction="column" gap="var(--gap-8)">
                  <TimeTableHeader
                    name={roomInfo.title}
                    mode="view"
                    onToggleEditMode={handleToggleEditMode}
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
                    onToggleEditMode={handleToggleEditMode}
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
        isLoginModalOpen={modals['Login']}
        handleCloseLoginModal={() => handleCloseModal('Login')}
        handleModalLogin={handleLoginSuccess}
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
