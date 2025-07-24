export function getDayOfWeek(dateStr: string): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateStr);
  const dayIndex = date.getDay();
  return dayNames[dayIndex];
}
