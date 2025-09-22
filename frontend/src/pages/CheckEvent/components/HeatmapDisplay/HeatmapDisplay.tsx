import Flex from '@/shared/layout/Flex';
import TimeTableHeader from '../TimeTableHeader';
import { useTheme } from '@emotion/react';
import * as S from './HeatmapDisplay.styled';
import Heatmap from '../Heatmap';
import PageArrowButton from '@/shared/components/Button/PageArrowButton';
import IChevronRight from '@/assets/icons/IChevronRight';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import Text from '@/shared/components/Text';
import useTimeTablePagination from '../../hooks/useTimeTablePagination';
import { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import useHeatmapStatistics from '../../hooks/useHeatmapStatistics';
import { weightCalculateStrategy } from '../../utils/getWeight';
import { useCallback, useMemo } from 'react';
import useSSE from '../../hooks/useSSE';
import useHandleError from '@/shared/hooks/common/useHandleError';

interface HeatmapDisplayProps {
  mode: 'view' | 'edit';
  roomInfo: RoomInfo & { roomSession: string; availableTimeSlots: string[] };
  handleToggleMode: () => void;
  handleBeforeEdit: (e: React.PointerEvent<HTMLDivElement>) => void;
  session: string;
}
const HeatmapDisplay = ({
  mode,
  roomInfo,
  handleToggleMode,
  handleBeforeEdit,
  session,
}: HeatmapDisplayProps) => {
  const theme = useTheme();
  const handleError = useHandleError();
  const { refs, pagination, currentPageDates } = useTimeTablePagination({
    availableDates: roomInfo.availableDateSlots,
  });
  const { roomStatistics, fetchRoomStatistics } = useHeatmapStatistics({
    session,
    weightCalculateStrategy,
  });
  const onVoteChange = useCallback(async () => {
    console.log('🔄 SSE vote-changed event 확인... fetch중...');
    await fetchRoomStatistics(session);
    console.log('✅ fetch 완료!');
  }, [fetchRoomStatistics, session]);

  const handlers = useMemo(() => ({ onVoteChange }), [onVoteChange]);

  useSSE(session, handleError, handlers);

  return (
    <S.FrontFace isFlipped={mode !== 'view'}>
      <S.TimeTableContainer ref={refs.timeTableContainerRef}>
        <Flex direction="column" gap="var(--gap-8)">
          <TimeTableHeader
            name={roomInfo.title}
            mode="view"
            onToggleEditMode={handleToggleMode}
            handleBeforeToggle={pagination.pageReset}
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
            <Heatmap
              timeColumnRef={refs.timeColumnRef}
              dateTimeSlots={roomInfo.availableTimeSlots}
              availableDates={currentPageDates}
              roomStatistics={roomStatistics}
              handleBeforeEdit={handleBeforeEdit}
            />
          </Flex>
        </Flex>
      </S.TimeTableContainer>
    </S.FrontFace>
  );
};

export default HeatmapDisplay;
