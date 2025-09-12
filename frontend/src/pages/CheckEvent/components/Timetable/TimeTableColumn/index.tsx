import Wrapper from '@/shared/layout/Wrapper';
import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import { memo } from 'react';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
  selectedTimes: Set<string>;
}

const TimeTableColumn = ({ date, dateTimeSlots, selectedTimes }: TimeTableColumnProps) => {
  return (
    <Wrapper center={false} maxWidth="100%">
      <TimeTableDay date={date} />
      {dateTimeSlots.map((dateTimeSlot) => (
        <TimeTableCell
          key={`${date}T${dateTimeSlot}`}
          date={date}
          timeText={dateTimeSlot}
          selectedTimes={selectedTimes}
        />
      ))}
    </Wrapper>
  );
};

export default memo(TimeTableColumn);
