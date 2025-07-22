const generateTimeList = ({
  startTime,
  endTime,
  interval,
}: {
  startTime: number;
  endTime: number;
  interval: number;
}) => {
  const time = [];
  for (let i = startTime; i < endTime; i += interval) {
    const hour = Math.floor(i / 60)
      .toString()
      .padStart(2, '0');

    const minuteValue = i % 60;
    const minute = minuteValue.toString().padStart(2, '0');
    const timeText = `${hour}:${minute}`;
    time.push({ timeText, isHour: minuteValue === 0 });
  }
  return time;
};

export default generateTimeList;
