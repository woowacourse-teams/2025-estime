import { column, row } from '@/constants/calender';
import { DateManager } from '../common/DateManager';

type Day = Date | null;

export function makeMonthMatrix(base: Date): Day[][] {
  const y = base.getFullYear();
  const m = base.getMonth();

  const total = DateManager.daysInMonth(y, m);
  const firstWeekDay = new Date(y, m, 1).getDay();

  const cells = Array(row * column).fill(null);
  for (let i = 0; i < total; i++) {
    cells[firstWeekDay + i] = new Date(y, m, i + 1);
  }

  return Array.from<unknown, Day[]>({ length: row }, (_, rowIndex) =>
    cells.slice(rowIndex * column, rowIndex * column + column)
  );
}
