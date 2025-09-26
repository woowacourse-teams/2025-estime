import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import Wrapper from '@/shared/layout/Wrapper';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
}

const TimeTableColumn = ({ date, dateTimeSlots }: TimeTableColumnProps) => {
  return (
    <Wrapper center={false} maxWidth="100%">
      <TimeTableDay date={date} />
      {dateTimeSlots.map((dateTimeSlot) => (
        <TimeTableCell key={`${date}T${dateTimeSlot}`} date={date} timeText={dateTimeSlot} />
      ))}
    </Wrapper>
  );
};

export default TimeTableColumn;
