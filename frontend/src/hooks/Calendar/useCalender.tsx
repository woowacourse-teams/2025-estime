import { makeMonthMatrix } from '@/utils/Calendar/makeMonthMatrix';
import { useState } from 'react';

const useCalender = (date: Date) => {
  const [current, setCurrent] = useState<Date>(date);

  const prevMonth = () => {
    setCurrent((prev: Date) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  const nextMonth = () => {
    setCurrent((prev: Date) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  const matrix = makeMonthMatrix(current);

  return { current, prevMonth, nextMonth, matrix };
};

export { useCalender };
