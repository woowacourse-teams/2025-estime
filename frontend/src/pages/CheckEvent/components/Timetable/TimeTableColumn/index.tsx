import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import Wrapper from '@/shared/layout/Wrapper';
import { RefObject } from 'react';
import { HoveredTimeRef } from '@/pages/CheckEvent/types/hoveredTimeRef';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
  hoveredTimeRef: RefObject<HoveredTimeRef>;
}

const TimeTableColumn = ({ date, dateTimeSlots, hoveredTimeRef }: TimeTableColumnProps) => {
  return (
    <Wrapper center={false} maxWidth="100%">
      <TimeTableDay date={date} />
      {dateTimeSlots.map((dateTimeSlot) => (
        <TimeTableCell
          key={`${date}T${dateTimeSlot}`}
          date={date}
          timeText={dateTimeSlot}
          hoveredTimeRef={hoveredTimeRef}
        />
      ))}
    </Wrapper>
  );
};

export default TimeTableColumn;
