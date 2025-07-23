import { UserAvailability } from '@/types/userAvailability';

export const toCreateUserAvailability = (userAvailability: UserAvailability) => {
  const { userName, selectedTimes } = userAvailability;

  const formattedAvailableTimes = (selectedTimes: Set<string>) => {
    return Array.from(selectedTimes).map((time) => {
      const [date, timeText] = time.split(' ');
      return `${date}T${timeText}`;
    });
  };

  return {
    userName,
    dateTimes: formattedAvailableTimes(selectedTimes),
  };
};
