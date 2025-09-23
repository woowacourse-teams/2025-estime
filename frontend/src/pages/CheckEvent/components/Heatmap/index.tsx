import Wrapper from '@/shared/layout/Wrapper';
import Text from '@/shared/components/Text';
import * as S from './Heatmap.styled';
import HeatMapDataCell from './HeatMapDataCell';
import TimeTableDay from '@/pages/CheckEvent/components/Timetable/TimeTableDay';
import { RefObject, useMemo } from 'react';
import useEventDelegation from '../../hooks/useEventDelegation';
import Tooltip from '../Tooltip';

interface HeatmapProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  handleBeforeEdit?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

const Heatmap = ({
  timeColumnRef,
  dateTimeSlots,
  availableDates,
  handleBeforeEdit,
}: HeatmapProps) => {
  const { currentCellId, position, isVisible, containerRef } = useEventDelegation();

  // 시간 라벨 불필요한 리렌더링 방지를 위해 분리
  const timeSlotNodes = useMemo(
    () =>
      dateTimeSlots.map((timeText) => (
        <S.GridContainer key={timeText}>
          {timeText.endsWith(':00') && (
            <S.TimeLabel>
              <Text variant="body" color="text">
                {timeText}
              </Text>
            </S.TimeLabel>
          )}
        </S.GridContainer>
      )),
    [dateTimeSlots]
  );

  return (
    <>
      <S.HeatMapContent ref={containerRef} onPointerDown={handleBeforeEdit}>
        <S.TimeSlotColumn ref={timeColumnRef}>{timeSlotNodes}</S.TimeSlotColumn>
        {[...availableDates].map((date) => (
          <Wrapper key={date} center={false} maxWidth="100%">
            <TimeTableDay date={date} />
            {dateTimeSlots.map((timeText) => (
              <HeatMapDataCell key={`${date}T${timeText}`} date={date} timeText={timeText} />
            ))}
          </Wrapper>
        ))}
      </S.HeatMapContent>

      {currentCellId && (
        <Tooltip currentCellId={currentCellId} position={position} visible={isVisible} />
      )}
    </>
  );
};

export default Heatmap;
