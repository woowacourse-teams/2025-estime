import Flex from '@/shared/layout/Flex';
import TimeTableHeader from '../components/TimeTableHeader';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Heatmap from '../components/Heatmap';
import * as S from './Section.styled';
import { useTheme } from '@emotion/react';
import { TimeTablePaginationReturns } from '../hooks/useTimeTablePagination';
import { DateManager } from '@/shared/utils/common/DateManager';
import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import type { FlowMode } from '../hooks/useCheckEventHandlers';

interface HeatmapSectionProps {
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  pagination: TimeTablePaginationReturns;
  buttonName: string;
  handleButtonClick: () => Promise<void> | void;
  buttonMode: FlowMode;
}

const HeatmapSection = ({
  roomInfo,
  pagination,
  buttonName,
  handleButtonClick,
  buttonMode,
}: HeatmapSectionProps) => {
  const { isMobile } = useTheme();

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);

  const isVisible = buttonMode !== 'save';
  const ariaLabel = buttonMode === 'register' ? '등록' : '편집';
  return (
    <S.FrontFace ref={pagination.timeTableContainerRef} aria-hidden={!isVisible} inert={!isVisible}>
      <Flex direction="column" gap="var(--gap-8)">
        <TimeTableHeader name={roomInfo.title} mode="edit" isExpired={isExpired}>
          <Button
            color="primary"
            onClick={handleButtonClick}
            disabled={isExpired}
            size="small"
            aria-label={ariaLabel}
          >
            <Text variant="button" color={isExpired ? 'gray50' : 'text'}>
              {buttonName}
            </Text>
          </Button>
        </TimeTableHeader>
        <Flex direction="column" gap="var(--gap-4)">
          {isMobile && (
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
          <Heatmap
            timeColumnRef={pagination.timeColumnRef}
            dateTimeSlots={roomInfo.availableTimeSlots}
            availableDates={pagination.currentPageDates}
          />
        </Flex>
      </Flex>
    </S.FrontFace>
  );
};

export default HeatmapSection;
