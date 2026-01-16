import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import Wrapper from '@/shared/layout/Wrapper';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
  dayIndex: number;
}

const TimeTableColumn = ({ date, dateTimeSlots, dayIndex }: TimeTableColumnProps) => {
  return (
    <Wrapper center={false} maxWidth="100%">
      <TimeTableDay date={date} />
      {dateTimeSlots.map((dateTimeSlot, timeIndex) => {
        return (
          <TimeTableCell
            key={`${date}T${dateTimeSlot}`}
            date={date}
            timeText={dateTimeSlot}
            dayIndex={dayIndex}
            timeIndex={timeIndex}
          />
        );
      })}
    </Wrapper>
  );
};

export default TimeTableColumn;
