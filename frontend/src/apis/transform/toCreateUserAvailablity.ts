import { UserAvailability } from '@/types/userAvailability';

export const toCreateUserAvailability = (userAvailability: UserAvailability) => {
  const { userName, selectedTimes } = userAvailability;

  return {
    userName,
    dateTimes: Array.from(selectedTimes),
  };
};
