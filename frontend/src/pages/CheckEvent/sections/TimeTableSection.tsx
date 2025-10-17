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
import { useGlassPreview } from '../stores/glassPreviewStore';
import { useRoomStatistics } from '../stores/roomStatisticsStore';

interface TimetableSectionProps {
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  pagination: TimeTablePaginationReturns;
  buttonName: string;
  handleButtonClick: () => Promise<void>;
  isSavingUserTime: boolean;
}

const TimetableSection = ({
  roomInfo,
  pagination,
  buttonName,
  handleButtonClick,
  isSavingUserTime,
}: TimetableSectionProps) => {
  const theme = useTheme();

  const glassPreview = useGlassPreview();

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);

  const { participantCount } = useRoomStatistics();

  return (
    <S.BackFace ref={pagination.timeTableContainerRef}>
      <Flex direction="column" gap="var(--gap-8)">
        <TimeTableHeader name={userNameStore.getSnapshot()} mode="save" isExpired={isExpired}>
          <Flex gap="var(--gap-8)" align="center" justify="flex-end">
            {participantCount > 0 && (
              <Flex gap="var(--gap-3)" align="center" justify="center" direction="column">
                <Text variant="h4" color="text">
                  전체 시간표
                </Text>
                <Toggle isOn={glassPreview.isOn} onToggle={glassPreview.toggle} />
              </Flex>
            )}
            <Button
              color="primary"
              onClick={handleButtonClick}
              disabled={isExpired || isSavingUserTime}
              size="small"
            >
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
          />
        </Flex>
      </Flex>
    </S.BackFace>
  );
};

export default TimetableSection;
