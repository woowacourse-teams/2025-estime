import Flex from '@/shared/layout/Flex';
import TimeTableHeader from '../components/TimeTableHeader';
import Button from '@/shared/components/Button';
import Text from '@/shared/components/Text';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Heatmap from '../components/Heatmap';
import * as S from './Section.styled';
import { userNameStore } from '../stores/userNameStore';
import { useTheme } from '@emotion/react';
import { showToast } from '@/shared/store/toastStore';
import { TimeTablePaginationReturns } from '../hooks/useTimeTablePagination';
import { DateManager } from '@/shared/utils/common/DateManager';
import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';

interface HeatmapSectionProps {
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  pagination: TimeTablePaginationReturns;
  buttonName: string;
  handleButtonClick: () => Promise<void>;
}

const HeatmapSection = ({
  roomInfo,
  pagination,
  buttonName,
  handleButtonClick,
}: HeatmapSectionProps) => {
  const theme = useTheme();

  const isExpired = DateManager.IsPastDeadline(roomInfo.deadline);

  // 로그인 안했을 때, 토스트 띄우기
  const handleBeforeEdit = (e: React.PointerEvent<HTMLDivElement>) => {
    const isLoggedIn = userNameStore.getSnapshot().length > 0;
    if (isLoggedIn) return;
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-cell-id]');
    if (!cell) return;

    showToast({
      type: 'warning',
      message: '시간을 등록하려면 "편집하기"를 눌러주세요',
    });
  };

  return (
    <S.FrontFace ref={pagination.timeTableContainerRef}>
      <Flex direction="column" gap="var(--gap-8)">
        <TimeTableHeader name={roomInfo.title} mode="edit" isExpired={isExpired}>
          <Button color="primary" onClick={handleButtonClick} disabled={isExpired} size="small">
            <Text variant="button" color={isExpired ? 'gray50' : 'text'}>
              {buttonName}
            </Text>
          </Button>
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
          <Heatmap
            timeColumnRef={pagination.timeColumnRef}
            dateTimeSlots={roomInfo.availableTimeSlots}
            availableDates={pagination.currentPageDates}
            handleBeforeEdit={handleBeforeEdit}
          />
        </Flex>
      </Flex>
    </S.FrontFace>
  );
};

export default HeatmapSection;
