import { HoveredTimeRef } from '@/pages/CheckEvent/types/hoveredTimeRef';
import * as S from '../Timetable.styled';
import { RefObject, useRef } from 'react';
import { useTimeHoverEffect } from '@/pages/CheckEvent/hooks/useTimeHoverEffect';

interface TimeSlotColumnProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  hoveredTimeRef: RefObject<HoveredTimeRef>;
}

const TimeSlotColumn = ({ timeColumnRef, dateTimeSlots, hoveredTimeRef }: TimeSlotColumnProps) => {
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hoverLabelRef = useRef<HTMLDivElement | null>(null);

  useTimeHoverEffect(hoveredTimeRef, dateTimeSlots, labelRefs, hoverLabelRef);

  return (
    <S.TimeSlotColumn ref={timeColumnRef}>
      {dateTimeSlots.map(
        (time) =>
          time.endsWith(':00') && (
            <S.TimeLabel
              key={time}
              ref={(el) => {
                labelRefs.current[time] = el;
              }}
            >
              <span>{time}</span>
            </S.TimeLabel>
          )
      )}
      <S.HoverLabel ref={hoverLabelRef} />
    </S.TimeSlotColumn>
  );
};

export default TimeSlotColumn;
