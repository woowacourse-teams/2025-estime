import { useTimetableHoverContext } from '@/pages/CheckEvent/providers/TimetableProvider';
import * as S from '../Timetable.styled';
import { RefObject } from 'react';

interface TimeSlotColumnProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
}

const TimeSlotColumn = ({ timeColumnRef, dateTimeSlots }: TimeSlotColumnProps) => {
  const { hoverLabelRef, labelRefs } = useTimetableHoverContext();

  return (
    <S.TimeSlotColumn ref={timeColumnRef} aria-hidden={true}>
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
