import Flex from '@/shared/layout/Flex';
import TimeTableHeader from '../components/TimeTableHeader';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Timetable from '../components/Timetable';
import * as S from './Section.styled';
import { useTheme } from '@emotion/react';
import { userNameStore } from '../stores/userNameStore';
import { TimeTablePaginationReturns } from '../hooks/useTimeTablePagination';
import { DateManager } from '@/shared/utils/common/DateManager';
import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';

import Toggle from '@/shared/components/Toggle';
import useToggleState from '@/shared/hooks/common/useToggleState';

interface TimetableSectionProps {
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  pagination: TimeTablePaginationReturns;
  buttonName: string;
  handleButtonClick: () => Promise<void>;
}

const TimetableSection = ({
  roomInfo,
  pagination,
  buttonName,
  handleButtonClick,
}: TimetableSectionProps) => {
  const theme = useTheme();

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);
  const toggleHeatmapPreview = useToggleState(true);
  return (
    <S.BackFace ref={pagination.timeTableContainerRef}>
      <Flex direction="column" gap="var(--gap-8)">
        <TimeTableHeader name={userNameStore.getSnapshot()} mode="save" isExpired={isExpired}>
          <Flex gap="var(--gap-8)" align="center" justify="flex-end">
            <Flex gap="var(--gap-3)" align="center" justify="center" direction="column">
              <Text variant="h4" color="text">
                미리보기
              </Text>
              <Toggle
                isOn={toggleHeatmapPreview.isOpen}
                onToggle={toggleHeatmapPreview.toggleOpen}
              />
            </Flex>
            <Button color="primary" onClick={handleButtonClick} disabled={isExpired} size="small">
              <Text variant="button" color={isExpired ? 'gray50' : 'text'}>
                {buttonName}
              </Text>
            </Button>
          </Flex>
        </TimeTableHeader>

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
            timeColumnRef={pagination.timeColumnRef}
            dateTimeSlots={roomInfo.availableTimeSlots}
            availableDates={pagination.currentPageDates}
            showHeatmapPreview={toggleHeatmapPreview.isOpen}
          />
        </Flex>
      </Flex>
    </S.BackFace>
  );
};

export default TimetableSection;
