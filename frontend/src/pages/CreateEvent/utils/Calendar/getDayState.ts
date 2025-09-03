import { DateManager } from '@/shared/utils/common/DateManager';
import { FormatManager } from '@/shared/utils/common/FormatManager';

interface GetDayStateProps {
  day: Date | null;
  today: Date;
  selectedDates: Set<string>;
}

const getDayState = ({ day, today, selectedDates }: GetDayStateProps) => {
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

export default getDayState;
