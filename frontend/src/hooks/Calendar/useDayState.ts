import { isDateBlockedByLimit, isItPast, isToday } from '@/utils/Calendar/dateUtils';
import { formatDateToString } from '@/utils/Calendar/format';

interface UseDayStateProps {
  day: Date | null;
  today: Date;
  selectedDates: Set<string>;
}

export const useDayState = ({ day, today, selectedDates }: UseDayStateProps) => {
  if (!day) {
    return {
      isPast: false,
      isSunday: false,
      isSaturday: false,
      isToday: false,
      isSelected: false,
      isEmpty: true,
      dateString: '',
      isDateBlockedByLimit: false,
    };
  }

  return {
    isPast: isItPast(day, today),
    isSunday: day.getDay() === 0,
    isSaturday: day.getDay() === 6,
    isToday: isToday(day, today),
    isSelected: selectedDates.has(formatDateToString(day)),
    isEmpty: false,
    dateString: day.getDate().toString(),
    isDateBlockedByLimit: isDateBlockedByLimit(day, selectedDates),
  };
};
