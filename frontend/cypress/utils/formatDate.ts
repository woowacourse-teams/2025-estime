export const parseYearMonth = (dateStr: string) => {
  const date = dateStr.match(/(\d+)\s*년\s*(\d+)\s*월/);
  if (!date) throw new Error('Invalid date string');
  return { year: Number(date[1]), month: Number(date[2]) };
};

export const addMonth = (year: number, month: number, offset: number) => {
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + offset);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
};
