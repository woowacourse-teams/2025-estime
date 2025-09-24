import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import Wrapper from '@/shared/layout/Wrapper';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
}

const TimeTableColumn = ({ date, dateTimeSlots }: TimeTableColumnProps) => {
  return (
    //TODO: 메모이제이션 추가 할수 있으면 고민 해볼것.
    <Wrapper center={false} maxWidth="100%">
      <TimeTableDay date={date} />
      {dateTimeSlots.map((dateTimeSlot) => (
        <TimeTableCell key={`${date}T${dateTimeSlot}`} date={date} timeText={dateTimeSlot} />
      ))}
    </Wrapper>
  );
};

export default TimeTableColumn;
