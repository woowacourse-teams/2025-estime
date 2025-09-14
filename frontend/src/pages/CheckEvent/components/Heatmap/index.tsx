import Wrapper from '@/shared/layout/Wrapper';
import Text from '@/shared/components/Text';
import * as S from './Heatmap.styled';

import HeatMapDataCell from './HeatMapDataCell';
import type { DateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import TimeTableDay from '@/pages/CheckEvent/components/Timetable/TimeTableDay';
import { RefObject } from 'react';

interface HeatmapProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
  roomStatistics: Map<string, DateCellInfo>;
  handleBeforeEdit?: (e: React.PointerEvent<HTMLDivElement>) => void;
}
const Heatmap = ({
  timeColumnRef,
  dateTimeSlots,
  availableDates,
  roomStatistics,
  handleBeforeEdit,
}: HeatmapProps) => {
  return (
    <S.HeatMapContent onPointerDown={handleBeforeEdit}>
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
            />
          ))}
        </Wrapper>
      ))}
    </S.HeatMapContent>
  );
};
export default Heatmap;
