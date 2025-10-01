import * as S from './Calendar.styled';
import { weekdays } from '@/constants/calender';
import { useCalender } from '@/pages/CreateEvent/hooks/Calendar/useCalender';

import PageArrowButton from '../../../../shared/components/Button/PageArrowButton';
import DayCell from './DayCell';
import Text from '@/shared/components/Text';
import IChevronLeft from '@/assets/icons/IChevronLeft';
import IChevronRight from '@/assets/icons/IChevronRight';
import Flex from '../../../../shared/layout/Flex';
import { DateManager } from '@/shared/utils/common/DateManager';
import { onChangeAvailableDateSlots, useRoomSelector } from '@/shared/store/createRoomStore';
import { useDateSelection } from '../../hooks/Calendar/useDateSelection';

const Calender = () => {
  const today = new Date();
  const { current, prevMonth, nextMonth, monthMatrix } = useCalender(today);
  const selectedDates = useRoomSelector('availableDateSlots');
  const dateSelection = useDateSelection({
    selectedDates,
    setSelectedDates: onChangeAvailableDateSlots,
    today,
  });
  const mouseHandlers = {
    onMouseDown: dateSelection.onMouseDown,
    onMouseEnter: dateSelection.onMouseEnter,
    onMouseUp: dateSelection.onMouseUp,
    onMouseLeave: dateSelection.onMouseLeave,
  };
  const { onMouseDown, onMouseEnter, onMouseUp, onMouseLeave } = mouseHandlers;

  return (
    <S.Container>
      <Flex direction="column" gap="var(--gap-5)">
        <Flex direction="column" gap="var(--gap-4)">
          <S.Header>
            <Text variant="h2">
              {current.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' })}
            </Text>
            <S.ButtonContainer>
              <PageArrowButton
                onClick={prevMonth}
                disabled={DateManager.isCurrentMonth(current, today)}
              >
                <IChevronLeft width={20} height={20} />
              </PageArrowButton>
              <PageArrowButton onClick={nextMonth}>
                <IChevronRight width={20} height={20} />
              </PageArrowButton>
            </S.ButtonContainer>
          </S.Header>
          <Text variant="h4">날짜는 최대 7개까지 선택 가능합니다.</Text>
        </Flex>
        <S.CalendarContainer>
          <S.Grid onMouseLeave={onMouseLeave}>
            {weekdays.map((w) => (
              <S.Weekday key={w} isSunday={w === '일'} isSaturday={w === '토'}>
                {w}
              </S.Weekday>
            ))}

            {monthMatrix.flat().map((day, i) => (
              <DayCell
                key={i}
                day={day}
                today={today}
                selectedDates={selectedDates}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            ))}
          </S.Grid>
        </S.CalendarContainer>
      </Flex>
    </S.Container>
  );
};

export default Calender;
