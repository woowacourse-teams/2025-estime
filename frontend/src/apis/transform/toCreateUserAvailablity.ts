import { UserAvailability } from '@/types/userAvailability';

export const toCreateUserAvailability = (userAvailability: UserAvailability) => {
  const { userName, selectedTimes } = userAvailability;

  return {
    participantName: userName,
    dateTimeSlots: Array.from(selectedTimes),
  };
};
