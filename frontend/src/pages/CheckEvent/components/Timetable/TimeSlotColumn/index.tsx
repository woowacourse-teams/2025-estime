import * as S from '../Timetable.styled';
import { RefObject, useEffect, useRef } from 'react';
import { HoveredTimeRef } from '../TimeTableColumn';

interface TimeSlotColumnProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  hoveredTimeRef: RefObject<HoveredTimeRef>;
}

const TimeSlotColumn = ({ timeColumnRef, dateTimeSlots, hoveredTimeRef }: TimeSlotColumnProps) => {
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hoverLabelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    hoveredTimeRef.current.update = (hoveredTime: string | null) => {
      Object.values(labelRefs.current).forEach((el) => el?.classList.remove('active'));

      const hoverLabel = hoverLabelRef.current;
      if (!hoverLabel) return;

      if (!hoveredTime) {
        hoverLabel.classList.remove('visible');
        return;
      }

      const index = dateTimeSlots.indexOf(hoveredTime);
      if (index === -1) return;

      const isHalf = index % 2 !== 0;

      const nextLabelTime = dateTimeSlots[!isHalf ? index + 1 : index];
      const top = `calc(24px + ${(dateTimeSlots.indexOf(nextLabelTime) / 2) * 3}rem)`;

      const endTime = dateTimeSlots[index + 1];

      hoverLabel.textContent = nextLabelTime;
      hoverLabel.style.top = top;
      hoverLabel.classList.add('visible');

      const startLabel = labelRefs.current[hoveredTime];
      startLabel?.classList.add('active');
      const endLabel = labelRefs.current[endTime];
      endLabel?.classList.add('active');

      hoverLabel.classList.add('active');
    };
  }, [dateTimeSlots, hoveredTimeRef]);

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
