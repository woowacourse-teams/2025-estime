import { UserAvailability } from '@/pages/CheckEvent/types/userAvailability';

export const toCreateUserAvailability = (userAvailability: UserAvailability) => {
  const { userName, selectedTimes } = userAvailability;

  return {
    participantName: userName,
    dateTimeSlots: Array.from(selectedTimes),
  };
};
