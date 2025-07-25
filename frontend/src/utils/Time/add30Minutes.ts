export function add30Minutes(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);

  let totalMinutes = hours * 60 + minutes + 30;

  if (totalMinutes < 0) totalMinutes += 24 * 60;

  const newHours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const newMinutes = String(totalMinutes % 60).padStart(2, '0');

  return `${newHours}:${newMinutes}`;
}
