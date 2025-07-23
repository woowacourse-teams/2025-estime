export const checkTimeRangeValid = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return eh * 60 + em > sh * 60 + sm;
};
