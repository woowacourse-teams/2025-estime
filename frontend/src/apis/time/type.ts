export interface UserAvailableTimeRequestType {
  userName: string;
  dateTimes: string[];
}

export type UserAvailableTimeResponseType = {
  userName: string;
  timeSlots: string[];
};

export interface CombinedAvailableTimesResponseType {
  timeSlots: TimeSlotStatType[];
}

export interface RecommendationTimeResponseType {
  recommendations: RecommendedTimeSlotType[];
}

interface TimeSlotStatType {
  startTime: string;
  availableMembers: number;
}

interface RecommendedTimeSlotType {
  dateTime: string;
  userNames: string[];
}
