import { formatDateToString } from './format';

const isToday = (day: Date | null, today: Date) => {
  if (!day) return false;
  return (
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear()
  );
};

const isItPast = (day: Date | null, today: Date) => {
  if (isToday(day, today)) return false;
  if (!day) return false;
  return day < today;
};
const isItCurrentMonth = (day: Date | null, today: Date) => {
  if (!day) return false;
  if (!today) return false;
  return day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
};
const isValidDate = (day: Date | null) => {
  return day instanceof Date && !isNaN(day.getTime());
};

const hasReachedMaxSelection = (selectedDates: Set<string>) => {
  return selectedDates.size === 7;
};

const isDateBlockedByLimit = (day: Date | null, selectedDates: Set<string>) => {
  if (!day) return false;
  if (hasReachedMaxSelection(selectedDates)) {
    return !selectedDates.has(formatDateToString(day));
  }
  return false;
};

export { isItCurrentMonth, isItPast, isToday, isValidDate, isDateBlockedByLimit };
