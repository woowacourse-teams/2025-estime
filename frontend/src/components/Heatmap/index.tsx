import Wrapper from '@/components/Layout/Wrapper';
import Text from '@/components/Text';
import * as S from './Heatmap.styled';

import HeatMapDataCell from './HeatMapDataCell';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TimeTableDay from '@/components/Timetable/TimeTableDay';
import { RefObject } from 'react';
import TableTooltip from '../TableTooltip';
import MobileTooltipCloseBoundary from '@/components/Tooltip/MobileTooltipCloseBoundary';
import { useTheme } from '@emotion/react';
import useTooltipBehavior from '@/hooks/Tooltip/useTooltipBehavior';
import { useToastContext } from '@/contexts/ToastContext';

interface HeatmapProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
}
const Heatmap = ({
  timeColumnRef,
  dateTimeSlots,
  availableDates,
  roomStatistics,
}: HeatmapProps) => {
  const {
    tooltipInfo,
    position,
    handleDesktopHover,
    handleMobileTap,
    isTooltipVisible,
    handleContainerPointerLeave,
    closeTooltip,
  } = useTooltipBehavior();
  const theme = useTheme();
  const { addToast } = useToastContext();

  const handleBeforeEdit = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-heatmap-cell]');
    if (!cell) return;

    addToast({
      type: 'warning',
      message: '시간을 등록하려면 "편집하기"를 눌러주세요',
    });
  };

  return (
    <>
      <MobileTooltipCloseBoundary isMobile={theme.isMobile} closeTooltip={closeTooltip}>
        <S.HeatMapContent
          onPointerLeave={handleContainerPointerLeave}
          onPointerDown={handleBeforeEdit}
        >
          <S.TimeSlotColumn ref={timeColumnRef}>
            {dateTimeSlots.map((timeText) => (
              <S.GridContainer key={timeText}>
                {timeText.endsWith(':00') && (
                  <S.TimeLabel>
                    <Text variant="body" color="text">
                      {timeText}
                    </Text>
                  </S.TimeLabel>
                )}
              </S.GridContainer>
            ))}
          </S.TimeSlotColumn>
          {[...availableDates].map((date) => (
            <Wrapper key={date} center={false} maxWidth="100%">
              <TimeTableDay date={date} key={`${date}-day`} />
              {dateTimeSlots.map((timeText) => (
                <HeatMapDataCell
                  key={`${date}T${timeText}`}
                  date={date}
                  timeText={timeText}
                  roomStatistics={roomStatistics}
                  onDesktopHover={handleDesktopHover}
                  onMobileTap={handleMobileTap}
                />
              ))}
            </Wrapper>
          ))}
        </S.HeatMapContent>
      </MobileTooltipCloseBoundary>
      {tooltipInfo && isTooltipVisible && (
        <TableTooltip
          position={position}
          participantList={tooltipInfo.participantList}
          date={tooltipInfo.date}
          timeText={tooltipInfo.timeText}
        />
      )}
    </>
  );
};
export default Heatmap;
