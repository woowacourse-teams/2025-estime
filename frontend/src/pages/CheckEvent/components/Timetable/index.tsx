import * as S from './Timetable.styled';
import TimeSlotColumn from './TimeSlotColumn';
import useLocalTimeSelection from '@/pages/CheckEvent/hooks/useLocalTimeSelection';
import { RefObject } from 'react';
import HeatmapPreview from '../HeatMapPreview';
import Wrapper from '@/shared/layout/Wrapper';
import TimeTableColumn from './TimeTableColumn';
import TimetableHoverProvider from '../../providers/TimetableProvider';

interface TimetableProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
  availableDates: Set<string>;
}

const TimetableContent = ({ timeColumnRef, dateTimeSlots, availableDates }: TimetableProps) => {
  const { containerRef, pointerHandlers } = useLocalTimeSelection();

  return (
    <S.TimetableContent ref={containerRef} {...pointerHandlers}>
      <TimeSlotColumn timeColumnRef={timeColumnRef} dateTimeSlots={dateTimeSlots} />
      {[...availableDates].map((date) => (
        <Wrapper key={date} maxWidth="100%">
          <HeatmapPreview date={date} dateTimeSlots={dateTimeSlots} />
          <TimeTableColumn date={date} dateTimeSlots={dateTimeSlots} />
        </Wrapper>
      ))}
    </S.TimetableContent>
  );
};

const Timetable = ({ timeColumnRef, dateTimeSlots, availableDates }: TimetableProps) => {
  return (
    <TimetableHoverProvider dateTimeSlots={dateTimeSlots}>
      <TimetableContent
        timeColumnRef={timeColumnRef}
        dateTimeSlots={dateTimeSlots}
        availableDates={availableDates}
      />
    </TimetableHoverProvider>
  );
};

export default Timetable;
