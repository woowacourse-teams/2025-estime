import * as S from '../Timetable.styled';
import Text from '@/shared/components/Text';
import { RefObject, memo } from 'react';

interface TimeSlotColumnProps {
  timeColumnRef: RefObject<HTMLDivElement | null>;
  dateTimeSlots: string[];
}

const TimeSlotColumn = ({ timeColumnRef, dateTimeSlots }: TimeSlotColumnProps) => {
  return (
    <S.TimeSlotColumn ref={timeColumnRef}>
      {dateTimeSlots.map((dateTimeSlot) => (
        <S.GridContainer key={dateTimeSlot}>
          {dateTimeSlot.endsWith(':00') && (
            <S.TimeLabel>
              <Text variant="body" color="text">
                {dateTimeSlot}
              </Text>
            </S.TimeLabel>
          )}
        </S.GridContainer>
      ))}
    </S.TimeSlotColumn>
  );
};

export default memo(TimeSlotColumn);
