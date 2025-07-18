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

export { isItCurrentMonth, isItPast, isToday, isValidDate };
