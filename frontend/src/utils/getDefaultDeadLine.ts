export const getDefaultDeadLine = () => {
  const today = new Date();

  const formattedMonth = formatTime(today.getMonth() + 1);
  const formattedHour = formatTime(today.getHours());
  const formattedDate = formatTime(today.getDate() + 1);

  const defaultDate = `${today.getFullYear()}-${formattedMonth}-${formattedDate}`;
  const defaultTime = `${formattedHour}:00`;
  return { defaultDate: defaultDate, defaultTime: defaultTime };
};

const formatTime = (value: number) => {
  return value.toString().padStart(2, '0');
};
