import { DateManager } from '@/utils/common/DateManager';
import { FormatManager } from '@/utils/common/FormatManager';

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
    isPast: DateManager.isPast(day, today),
    isSunday: day.getDay() === 0,
    isSaturday: day.getDay() === 6,
    isToday: DateManager.isToday(day, today),
    isSelected: selectedDates.has(FormatManager.formatDate(day)),
    isEmpty: false,
    dateString: day.getDate().toString(),
    isDateBlockedByLimit: DateManager.isDateBlockedByLimit(day, selectedDates),
  };
};
