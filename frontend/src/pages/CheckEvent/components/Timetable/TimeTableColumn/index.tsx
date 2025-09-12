import Wrapper from '@/shared/layout/Wrapper';
import TimeTableDay from '../TimeTableDay';
import TimeTableCell from '../TimeTableCell';
import { memo } from 'react';

interface TimeTableColumnProps {
  date: string;
  dateTimeSlots: string[];
  selectedTimes: Set<string>;
}

const TimeTableColumn = memo(
  ({ date, dateTimeSlots, selectedTimes }: TimeTableColumnProps) => {
    return (
      <Wrapper center={false} maxWidth="100%">
        <TimeTableDay date={date} />
        {dateTimeSlots.map((dateTimeSlot) => (
          <TimeTableCell
            key={`${date} ${dateTimeSlot}`}
            date={date}
            timeText={dateTimeSlot}
            selectedTimes={selectedTimes}
          />
        ))}
      </Wrapper>
    );
  },
  (prevProps, nextProps) => {
    // date와 dateTimeSlots가 같고, 해당 날짜의 선택 상태가 같으면 리렌더링 방지
    if (prevProps.date !== nextProps.date) return false;
    if (prevProps.dateTimeSlots.length !== nextProps.dateTimeSlots.length) return false;

    // 해당 날짜의 모든 시간슬롯에 대해 선택 상태 비교
    for (const timeSlot of prevProps.dateTimeSlots) {
      const key = `${prevProps.date}T${timeSlot}`;
      const prevSelected = prevProps.selectedTimes.has(key);
      const nextSelected = nextProps.selectedTimes.has(key);
      if (prevSelected !== nextSelected) return false;
    }

    return true;
  }
);

TimeTableColumn.displayName = 'TimeTableColumn';

export default TimeTableColumn;
