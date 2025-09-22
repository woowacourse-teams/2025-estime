import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import { useTheme } from '@emotion/react';
import TimeTableHeader from '../TimeTableHeader';
import * as S from './AvailabilityDisplay.styled';
import Timetable from '../Timetable';
import useTimeTablePagination from '../../hooks/useTimeTablePagination';
import useUserAvailability from '../../hooks/useUserAvailability';
import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { useTimeSelectionContext } from '../../contexts/TimeSelectionContext';
import { useEffect } from 'react';

interface AvailabilityDisplayProps {
  name: string;
  mode: 'view' | 'edit';
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  handleToggleMode: () => void;
  session: string | null;
}

const AvailabilityDisplay = ({
  name,
  mode,
  roomInfo,
  handleToggleMode,
  session,
}: AvailabilityDisplayProps) => {
  const theme = useTheme();

  const { refs, pagination, currentPageDates } = useTimeTablePagination({
    availableDates: roomInfo.availableDateSlots,
  });
  const { userAvailability, userAvailabilitySubmit, fetchUserAvailableTime } = useUserAvailability({
    name,
    session,
  });

  const { getCurrentSelectedTimes, setFetchUserAvailableTime } = useTimeSelectionContext();

  useEffect(() => {
    setFetchUserAvailableTime(fetchUserAvailableTime);
  }, [fetchUserAvailableTime, setFetchUserAvailableTime]);

  const handleBeforeToggle = async () => {
    const currentSelectedTimes = getCurrentSelectedTimes();
    if (currentSelectedTimes.size < 0) return;
    await userAvailabilitySubmit({ userName: name, selectedTimes: currentSelectedTimes });
    await fetchUserAvailableTime();
    pagination.pageReset();
    handleToggleMode();
  };

  return (
    <S.BackFace isFlipped={mode !== 'view'}>
      <S.TimeTableContainer ref={refs.timeTableContainerRef}>
        <Flex direction="column" gap="var(--gap-8)">
          <TimeTableHeader
            name={name}
            mode="edit"
            onToggleEditMode={handleToggleMode}
            handleBeforeToggle={handleBeforeToggle}
          />
          <Flex direction="column" gap="var(--gap-4)">
            {theme.isMobile && (
              <Flex gap="var(--gap-3)" justify="flex-end" align="center">
                <PageArrowButton
                  onClick={pagination.handlePagePrev}
                  disabled={!pagination.canPagePrev}
                >
                  <IChevronLeft width={20} height={20} />
                </PageArrowButton>
                <Text variant="h4">
                  {pagination.page} / {pagination.totalPages}
                </Text>
                <PageArrowButton
                  onClick={pagination.handlePageNext}
                  disabled={!pagination.canPageNext}
                >
                  <IChevronRight width={20} height={20} />
                </PageArrowButton>
              </Flex>
            )}
            <Timetable
              timeColumnRef={refs.timeColumnRef}
              dateTimeSlots={roomInfo.availableTimeSlots}
              availableDates={currentPageDates}
              initialSelectedTimes={userAvailability.selectedTimes}
            />
          </Flex>
        </Flex>
      </S.TimeTableContainer>
    </S.BackFace>
  );
};

export default AvailabilityDisplay;
